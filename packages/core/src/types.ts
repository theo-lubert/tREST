/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod'

// Utils

type FilteredKeys<T> = {
    [K in keyof T]: T[K] extends never ? never : K
}[keyof T]

export type RemoveNever<T> = {
    [K in FilteredKeys<T>]: T[K]
}

// export type Pretty<T> = {
//     [K in keyof T]: Pretty<T[K]>
// }

export type HttpMethod =
    | 'OPTIONS'
    | 'HEAD'
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'

// Input

export type InputSchema = z.ZodSchema
export type InputType<T> = T extends z.ZodSchema ? z.infer<T> : never
export type InputObject<TRouteParams, TSearchParams, TBody> = RemoveNever<{
    routeParams: TRouteParams
    searchParams: TSearchParams
    body: TBody
}>

export type InferRouteParams<THandler> = THandler extends (input: {
    routeParams: infer InferredType
}) => unknown
    ? Parameters<THandler>[0] extends undefined
        ? never
        : InferredType
    : never
export type InferSearchParams<THandler> = THandler extends (input: {
    searchParams: infer InferredType
}) => unknown
    ? Parameters<THandler>[0] extends undefined
        ? never
        : InferredType
    : never

export type InferBody<THandler> = THandler extends (input: {
    body: infer InferredType
}) => unknown
    ? Parameters<THandler>[0] extends undefined
        ? never
        : InferredType
    : never
export type InferResponse<THandler> = THandler extends (
    ...args: any[]
) => Promise<infer InferredType>
    ? InferredType
    : never

export type InferRouteType<T> = T extends { _type?: infer R } ? R : never
export type InferRouteFunc<T> = T extends { route: infer R } ? R : never
export type InferMethod<T, M extends keyof T> = T extends {
    [K in M]: infer R
}
    ? R extends { _type?: infer _1; route: infer _2 }
        ? R
        : never
    : never

export type RouteHandlerOptions<
    TRouteParamsSchema extends InputSchema | undefined,
    TSearchParamsSchema extends InputSchema | undefined,
    TBodySchema extends InputSchema | undefined,
    TRouteResponse,
    THandler extends GenericHandlerFunction<
        InputType<TRouteParamsSchema>,
        InputType<TSearchParamsSchema>,
        InputType<TBodySchema>,
        unknown
    >,
> = {
    _output?: TRouteResponse
    input: {
        routeParams?: TRouteParamsSchema
        searchParams?: TSearchParamsSchema
        body?: TBodySchema
    }
    func: THandler
}

export type GenericHandlerFunction<
    TRouteParamsType,
    TSearchParamsType,
    TBodyType,
    TRouteResponse,
> = TRouteParamsType | TSearchParamsType | TBodyType extends never
    ? (...args: any[]) => Promise<TRouteResponse>
    : (
          input: InputObject<TRouteParamsType, TSearchParamsType, TBodyType>,
          ...args: any[]
      ) => Promise<TRouteResponse>

export type HandlerFunction<
    TRouteParamsType,
    TSearchParamsType,
    TBodyType,
    TRouteResponse,
> = TRouteParamsType | TSearchParamsType | TBodyType extends never
    ? () => Promise<TRouteResponse>
    : (
          input: InputObject<TRouteParamsType, TSearchParamsType, TBodyType>
      ) => Promise<TRouteResponse>

export type TypedRouterFormat<T, R> = {
    _type?: T
    route: R
}
export type UnknownTypedRouterFormat = TypedRouterFormat<unknown, unknown>

export type TypedRouter<
    T,
    THandler extends (...args: any[]) => any = T extends {
        func: infer InferredType extends (...args: any[]) => any
    }
        ? InferredType
        : never,
    TRouteResponse = T extends {
        _output?: infer InferredType
    }
        ? InferredType
        : never,
    TRouteParamsSchema extends
        | InputSchema
        | undefined = T extends RouteHandlerOptions<
        infer InferredType,
        any,
        any,
        any,
        any
    >
        ? InferredType
        : never,
    TSearchParamsSchema extends
        | InputSchema
        | undefined = T extends RouteHandlerOptions<
        any,
        infer InferredType,
        any,
        any,
        any
    >
        ? InferredType
        : never,
    TBodySchema extends InputSchema | undefined = T extends RouteHandlerOptions<
        any,
        any,
        infer InferredType,
        any,
        any
    >
        ? InferredType
        : never,
> = TypedRouterFormat<
    HandlerFunction<
        InputType<TRouteParamsSchema>,
        InputType<TSearchParamsSchema>,
        InputType<TBodySchema>,
        TRouteResponse
    >,
    THandler
>

export type OptionalTypedRouter<T> = T extends undefined
    ? never
    : TypedRouter<T>
