type IfEquals<T, U, Y = unknown, N = never> = (<G>() => G extends T
    ? 1
    : 2) extends <G>() => G extends U ? 1 : 2
    ? Y
    : N

export function expectTypeOf<T>(_data: T) {
    return {
        // toMatchTypeOf<_R>() {},
        // toEqualTypeOf<_R extends T>() {},
        toEqualTypeOf<U extends IfEquals<T, U>>() {},
    }
}
