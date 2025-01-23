import type { LlamaChatSession } from 'node-llama-cpp'
import type { ConfigStore } from '../electron-env'
import path from 'node:path'
import process from 'node:process'
import {
  app,
  ipcMain,
} from 'electron'

const isDev = process.env.NODE_ENV !== 'production'

const modelsDirectory = isDev
  ? path.join(__dirname, '../resources/models')
  : path.join(app.getAppPath(), 'resources/models')

export async function initLlmIpc(
  {
    configStore,
  }: {
    configStore: ConfigStore;
  },
) {
  /**
   * node-llama-cpp 只支援 ESM
   *
   * 直接 import 會出現 Error [ERR_REQUIRE_ESM]: require() of ES Module 錯誤
   *
   * https://node-llama-cpp.withcat.ai/guide/troubleshooting#using-in-commonjs
   */
  const { getLlama, LlamaChatSession, resolveModelFile } = await import('node-llama-cpp')

  const modelPath = await resolveModelFile(
    'hf_bartowski_gemma-2-2b-it-Q6_K_L.gguf',
    modelsDirectory,
  )

  const llama = await getLlama()
  const model = await llama.loadModel({ modelPath })
  const context = await model.createContext()

  let session: LlamaChatSession | undefined
  ipcMain.handle('llm:prompt', async (event, message: string) => {
    if (session) {
      session.dispose({ disposeSequence: true })
    }

    session = new LlamaChatSession({
      contextSequence: context.getSequence(),
    })

    const answer = await session.prompt(message)
    session.dispose({ disposeSequence: true })
    session = undefined

    return answer
  })
}
