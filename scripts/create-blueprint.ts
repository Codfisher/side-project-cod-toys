import fs from 'node:fs/promises'
import path from 'node:path'
import fsExtra from 'fs-extra'
import { camelCase, kebabCase, upperFirst } from 'lodash-es'
import { flat, pipe, sort } from 'remeda'

interface Option {
  /** 資料夾名稱。會被替換為 __kebabCase_name__ */
  name: string;
  /** 被取代關鍵字。矩陣用於單複數不同情境。例如：category、categories */
  key: string | string[];
  /** 來源目錄 */
  sourcePath: string;
  /** 目標目錄，將 sourcePath 替換為 targetPath 字串 */
  targetPath: string;
  /** 可過濾檔案 */
  fileRegex?: RegExp;
}

const tasksOption: Option[] = []

function then<Fn, Result>(
  fn: (a: Fn extends Promise<infer S> ? S : Fn) => Result | Promise<Result>,
): (a: Fn) => Promise<Result> {
  return async (a: Fn) => {
    return (fn as any)(await a)
  }
}

async function main() {
  const tasks = tasksOption.map((option) => writeFile(option))
  await Promise.allSettled(tasks)
  console.log(`全部任務結束，共 ${tasks.length} 筆`)
}
main()

async function writeFile(option: Option) {
  return pipe(undefined,
    /** 取得所有檔案路徑 */
    async () => {
      return getFilesPath(
        path.resolve(__dirname, option.sourcePath),
        option,
      )
    }, then((paths) => paths.map((path) => path.replace(/\\/g, '/'))),
    /** 取得內容 */
    then(async (paths) => {
      const tasks = paths.map((path) => fs.readFile(path))
      const results = await Promise.allSettled(tasks)

      const contents = results.map((result, i) => {
        const path = paths[i]
        if (!path) {
          throw new Error('無法取得 path')
        }

        if (result.status === 'rejected') {
          return {
            path,
            content: undefined,
          }
        }

        return {
          path,
          content: result.value.toString(),
        }
      })

      return contents
    }),
    /** 填入模板文字 */
    then(async (data) => {
      const contents = data.map((datum) => {
        const path = datum.path
        if (!datum.content) {
          return {
            path,
          }
        }

        const content = pipe(
          flat([option.key]),
          // 長度較長的關鍵字優先取代
          sort((a, b) => b.length - a.length),
          (keys) => {
            let result = datum.content
            for (const key of keys) {
              const kebabCaseKey = kebabCase(key)
              const camelCaseKey = camelCase(key)
              const upperCamelCaseKey = upperFirst(camelCaseKey)

              result = result
                .replace(new RegExp(kebabCaseKey, 'gm'), '{{kebabCase name}}')
                .replace(new RegExp(camelCaseKey, 'gm'), '{{camelCase name}}')
                .replace(new RegExp(upperCamelCaseKey, 'gm'), '{{pascalCase name}}')
            }

            return result
          },
        )

        return {
          path,
          content,
        }
      })

      return contents
    }),
    /** 將路徑替換為目標路徑 */
    then(async (data) => {
      const results = data.map(({ path, content }) => {
        const sourcePath = option.sourcePath.replace('../', '')
        const targetPath = option.targetPath.replace('../', '')

        const newPath = path.replace(sourcePath, targetPath)
        return {
          path: newPath,
          content,
        }
      })

      return results
    }),
    /** 清空目標目錄，開始寫入檔案 */
    then(async (data) => {
      const targetPath = path.resolve(__dirname, option.targetPath)
      await fs.rm(targetPath, { recursive: true, force: true })

      const tasks = data.map(({ path, content }) => {
        if (!content)
          return undefined

        const name = option.name
        const kebabCaseName = kebabCase(name)
        const filePath = path.replace(kebabCaseName, '__kebabCase_name__')
        return fsExtra.outputFile(filePath, content)
      })

      return await Promise.allSettled(tasks)
    }), () => {
      console.log(`${option.name} 任務完成`)
    })
}

/** 取得目標目錄所有檔案，包含所有子目錄檔案 */
async function getFilesPath(targetPath: string, option: Option, files: string[] = []) {
  const absPath = path.resolve(__dirname, targetPath)
  const items = await fs.readdir(absPath, { withFileTypes: true })
  const { fileRegex } = option

  const folders: string[] = []
  items.forEach((item) => {
    if (item.isDirectory()) {
      folders.push(item.name)
    }
    else if (item.isFile()) {
      if (fileRegex && !fileRegex?.test(item.name)) {
        return
      }

      files.push(`${targetPath}/${item.name}`)
    }
  })

  if (folders.length === 0) {
    return files
  }

  for (const folder of folders) {
    await getFilesPath(`${targetPath}/${folder}`, option, files)
  }

  return files
}
