/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    InputObject,
    InputSchema,
    InputType,
    HandlerFunction,
} from './types'
import { coreRoute } from './route'

export function inputGeneric<
    TRouteParamsSchema extends InputSchema = never,
    TSearchParamsSchema extends InputSchema = never,
    TBodySchema extends InputSchema = never,
>(input: {
    routeParams?: TRouteParamsSchema
    searchParams?: TSearchParamsSchema
    body?: TBodySchema
}) {
    return {
        func: <TRouteResponse>(
            handler: HandlerFunction<
                InputType<TRouteParamsSchema>,
                InputType<TSearchParamsSchema>,
                InputType<TBodySchema>,
                TRouteResponse
            >
        ) =>
            coreRoute({
                input,
                func: handler,
            }),
    }
}

export function input<
    TRouteParamsSchema extends InputSchema = never,
    TSearchParamsSchema extends InputSchema = never,
    TBodySchema extends InputSchema = never,
>(input: {
    routeParams?: TRouteParamsSchema
    searchParams?: TSearchParamsSchema
    body?: TBodySchema
}) {
    return inputGeneric<TRouteParamsSchema, TSearchParamsSchema, TBodySchema>(
        input
    )
}

// export function input<
//     TRouteParamsSchema extends InputSchema = never,
//     TSearchParamsSchema extends InputSchema = never,
//     TBodySchema extends InputSchema = never,
// >(input: {
//     routeParams?: TRouteParamsSchema
//     searchParams?: TSearchParamsSchema
//     body?: TBodySchema
// }) {
//     return {
//         func: <TRouteResponse>(
//             handler: HandlerFunction<
//                 InputType<TRouteParamsSchema>,
//                 InputType<TSearchParamsSchema>,
//                 InputType<TBodySchema>,
//                 TRouteResponse
//             >
//         ) =>
//             createRoute({
//                 input,
//                 func: handler,
//             }),
//     }
// }

export async function inputValidation<
    TRouteParamsSchema extends InputSchema,
    TSearchParamsSchema extends InputSchema,
    TBodySchema extends InputSchema,
>(
    schemas?: {
        routeParams?: TRouteParamsSchema
        searchParams?: TSearchParamsSchema
        body?: TBodySchema
    },
    input?: {
        routeParams?: unknown
        searchParams?: unknown
        body?: unknown
    }
): Promise<
    InputObject<
        InputType<TRouteParamsSchema>,
        InputType<TSearchParamsSchema>,
        InputType<TBodySchema>
    >
> {
    const [routeParams, searchParams, body] = await Promise.all([
        schemas?.routeParams?.parseAsync(input?.routeParams),
        schemas?.searchParams?.parseAsync(input?.searchParams),
        schemas?.body?.parseAsync(input?.body),
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validatedData: any = {} // TODO: Don't use any here (but it's much easier, the rest is difficult enough...)
    if (routeParams) validatedData.routeParams = routeParams
    if (searchParams) validatedData.searchParams = searchParams
    if (body) validatedData.body = body
    return validatedData as InputObject<
        InputType<TRouteParamsSchema>,
        InputType<TSearchParamsSchema>,
        InputType<TBodySchema>
    >
}
