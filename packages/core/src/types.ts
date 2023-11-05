/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod'

type FilteredKeys<T> = {
    [K in keyof T]: T[K] extends never ? never : K
}[keyof T]
export type RemoveNever<T> = {
    [K in FilteredKeys<T>]: T[K]
}

// export type Cleanup<T> = T extends {}
//     ? {
//           [P in keyof T]: T[P]
//       }
//     : T

// export type Unpack<T> = {
//     [K in keyof T]: T[K] extends object ? Unpack<T[K]> : T[K]
// }
// export type UnpackAlt<T> = {
//     [K in keyof T]: UnpackAlt<T[K]>
// }

export type InputSchema = z.ZodSchema
// export type OptionalInputSchema = InputSchema | undefined
export type InputType<T> = T extends z.ZodSchema ? z.infer<T> : never

export type InputObject<TRouteParams, TSearchParams, TBody> = RemoveNever<{
    routeParams: TRouteParams
    searchParams: TSearchParams
    body: TBody
}>

export type InferRouteParams<TRouter> = TRouter extends ReturnFunction<
    infer InferredType,
    unknown,
    unknown,
    unknown
>
    ? InferredType
    : never
export type InferSearchParams<TRouter> = TRouter extends ReturnFunction<
    unknown,
    infer InferredType,
    unknown,
    unknown
>
    ? InferredType
    : never
export type InferBody<TRouter> = TRouter extends ReturnFunction<
    unknown,
    unknown,
    infer InferredType,
    unknown
>
    ? InferredType
    : never
export type InferResponse<TRouter, TRouteParams, TSearchParams, TBody> =
    TRouter extends ReturnFunction<
        TRouteParams,
        TSearchParams,
        TBody,
        infer InferredType
    >
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

export type HttpMethod =
    | 'OPTIONS'
    | 'HEAD'
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE'

export type RouteHandler<
    TRouteResponse,
    TRouteParamsSchema extends InputSchema | undefined,
    TSearchParamsSchema extends InputSchema | undefined,
    TBodySchema extends InputSchema | undefined,
> = {
    input: {
        routeParams?: TRouteParamsSchema
        searchParams?: TSearchParamsSchema
        body?: TBodySchema
    }
    func: ReturnFunction<
        InputType<TRouteParamsSchema>,
        InputType<TSearchParamsSchema>,
        InputType<TBodySchema>,
        TRouteResponse
    >
}

export type ReturnFunctionWithInput<
    TRouteParamsType,
    TSearchParamsType,
    TBodyType,
    TRouteResponse,
> = (
    input: InputObject<TRouteParamsType, TSearchParamsType, TBodyType>
) => Promise<TRouteResponse>
export type ReturnFunction<
    TRouteParamsType,
    TSearchParamsType,
    TBodyType,
    TRouteResponse,
> = TRouteParamsType | TSearchParamsType | TBodyType extends never
    ? () => Promise<TRouteResponse>
    : ReturnFunctionWithInput<
          TRouteParamsType,
          TSearchParamsType,
          TBodyType,
          TRouteResponse
      >

export type TypedRouterFormat<T = unknown, R = unknown> = {
    _type?: T
    route: R
}

export type TypedRouter<
    T,
    TRouteParamsSchema extends InputSchema | undefined = T extends RouteHandler<
        any,
        infer InferredType,
        any,
        any
    >
        ? InferredType
        : never,
    TSearchParamsSchema extends
        | InputSchema
        | undefined = T extends RouteHandler<any, any, infer InferredType, any>
        ? InferredType
        : never,
    TBodySchema extends InputSchema | undefined = T extends RouteHandler<
        any,
        any,
        any,
        infer InferredType
    >
        ? InferredType
        : never,
    TRouteResponse = T extends RouteHandler<
        infer InferredType,
        TRouteParamsSchema,
        TSearchParamsSchema,
        TBodySchema
    >
        ? InferredType
        : never,
> = TypedRouterFormat<
    ReturnFunction<
        InputType<TRouteParamsSchema>,
        InputType<TSearchParamsSchema>,
        InputType<TBodySchema>,
        TRouteResponse
    >,
    ReturnFunction<
        InputType<TRouteParamsSchema>,
        InputType<TSearchParamsSchema>,
        InputType<TBodySchema>,
        TRouteResponse
    >
>

export type OptionalTypedRouter<T> = T extends undefined
    ? never
    : TypedRouter<T>
