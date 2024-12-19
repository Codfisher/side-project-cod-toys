import { purry, identity, isNumber, isString } from "remeda";

type Pair<Value, Result> = [(value: Value) => boolean, (value: Value) => Result];

function _cond<Value, Result>(value: Value, pairs: Array<Pair<Value, Result>>) {
  for (const [predicate, func] of pairs) {
    if (predicate(value)) {
      return func(value);
    }
  }
  return undefined;
}

/** 功能與 ramda cond 相同，但是型別推導效果更好 */
export function cond<Value, Result>(value: Value, pairs: Array<Pair<Value, Result>>):
  Result | undefined;
export function cond<Value, Result>(pairs: Array<Pair<Value, Result>>):
  (value: Value) => Result | undefined;
export function cond() {
  // eslint-disable-next-line prefer-rest-params
  return purry(_cond, arguments);
}

/** 協助處理 remeda pipe 中的 promise
 *
 *
 * @example
 * // 原本每一個 async 後都要先 await 才能拿到 data
 * ```typescript
 * pipe(
 *   'data',
 *   async (data) => data,
 *   async (promise) => {
 *     const data = await promise;
 *   },
 * );
 *
 * // 用 then 包裝一下就不用了
 * pipe(
 *   'data',
 *   async (data) => data,
 *   then(async (data) => { }),
 * );
 * ```
 */
export function then<Fn, Result>(
  fn: (a: Fn extends Promise<infer S> ? S : Fn) => Result | Promise<Result>,
): (a: Fn) => Promise<Result> {
  return async (a: Fn) => {
    return (fn as any)(await a);
  };
}

