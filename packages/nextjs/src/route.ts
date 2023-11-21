import qs from 'qs'
import { type NextRequest, NextResponse } from 'next/server'

import type {
    InputObject,
    InputType,
    InputSchema,
    TypedRouter,
    RouteHandlerOptions,
    HandlerFunction,
} from '@trestjs/core'
import core, { routeWithHandler } from '@trestjs/core'
import { NextjsReturnFunction, NextjsRouteHandler } from './types'

function ensureNextResponse<T>(response: T | NextResponse<T>): NextResponse<T> {
    return response instanceof NextResponse
        ? response
        : NextResponse.json(response)
}

export async function reqSearchParams<RequestType extends Request>(
    req: RequestType
) {
    const { searchParams } = new URL(req.url)
    return qs.parse(searchParams.toString())
    // return Object.fromEntries(searchParams.entries())
}

export async function reqBody<RequestType extends Request>(req: RequestType) {
    const headers = new Headers(req.headers)
    try {
        switch (headers.get('Content-Type')) {
            case 'application/json':
                return await req.json()
            case 'application/x-www-form-urlencoded': {
                const formData = await req.formData()
                return qs.parse(
                    Array.from(formData.entries())
                        .map(([key, value]) => `${key}=${value}`)
                        .join('&')
                )
                // return Object.fromEntries(formData.entries())
            }
            default:
                return undefined
        }
    } catch (err) {
        return undefined
    }
}

// export function createRoute2<
//     TRouteParamsSchema extends InputSchema | undefined,
//     TSearchParamsSchema extends InputSchema | undefined,
//     TBodySchema extends InputSchema | undefined,
//     TRouteResponse,
// >(options: {
//     input: {
//         routeParams?: TRouteParamsSchema
//         searchParams?: TSearchParamsSchema
//         body?: TBodySchema
//     }
//     func: NextjsReturnFunction<
//         InputType<TRouteParamsSchema>,
//         InputType<TSearchParamsSchema>,
//         InputType<TBodySchema>,
//         TRouteResponse
//     >
// }): {
//     _type?: ReturnFunction<
//         InputType<TRouteParamsSchema>,
//         InputType<TSearchParamsSchema>,
//         InputType<TBodySchema>,
//         TRouteResponse
//     >
//     route: (
//         request: NextRequest,
//         opts?: { params: unknown }
//     ) => Promise<NextResponse<TRouteResponse>>
// } {
//     return {
//         route: async (request: NextRequest, opts?: { params: unknown }) => {
//             const coreRoute = core.input(options.input ?? {}).func((async (
//                 validatedInput
//             ) => {
//                 const response = await options.func(validatedInput, request)
//                 const nextResponse = ensureNextResponse(response)
//                 console.log(
//                     `[tREST] ${request.method} ${request.url} => ${nextResponse.status}`
//                 )
//                 return nextResponse
//             }) as ReturnFunction<
//                 InputType<TRouteParamsSchema>,
//                 InputType<TSearchParamsSchema>,
//                 InputType<TBodySchema>,
//                 NextResponse<TRouteResponse>
//             >)
//             return coreRoute.route({
//                 routeParams: opts?.params,
//                 searchParams: await reqSearchParams(request),
//                 body: await reqBody(request),
//             } as unknown as InputObject<
//                 InputType<TRouteParamsSchema>,
//                 InputType<TSearchParamsSchema>,
//                 InputType<TBodySchema>
//             >)
//         },
//     }
// }

export function createRoute<
    TRouteParamsSchema extends InputSchema,
    TSearchParamsSchema extends InputSchema,
    TBodySchema extends InputSchema,
    TRouteResponse,
>(
    options: RouteHandlerOptions<
        TRouteParamsSchema,
        TSearchParamsSchema,
        TBodySchema,
        TRouteResponse,
        NextjsRouteHandler<
            InputType<TRouteParamsSchema>,
            InputType<TSearchParamsSchema>,
            InputType<TBodySchema>,
            TRouteResponse
        >
    >
): TypedRouter<typeof options, NextjsReturnFunction<TRouteResponse>> {
    return routeWithHandler(
        options,
        async (request: NextRequest, opts?: { params: unknown }) => {
            const coreRoute = core.input(options.input ?? {}).func((async (
                input
            ) => {
                const response = await options.func(input, request)
                const nextResponse = ensureNextResponse(response)
                console.log(
                    `[tREST] ${request.method} ${request.url} => ${nextResponse.status}`
                )
                return nextResponse
            }) as HandlerFunction<
                InputType<TRouteParamsSchema>,
                InputType<TSearchParamsSchema>,
                InputType<TBodySchema>,
                NextResponse<TRouteResponse>
            >)
            return coreRoute.route({
                routeParams: opts?.params,
                searchParams: await reqSearchParams(request),
                body: await reqBody(request),
            } as unknown as InputObject<
                InputType<TRouteParamsSchema>,
                InputType<TSearchParamsSchema>,
                InputType<TBodySchema>
            >)
        }
    )
    // return {
    //     route: (async (input: {
    //         routeParams?: InputType<TRouteParamsSchema>
    //         searchParams?: InputType<TSearchParamsSchema>
    //         body?: InputType<TBodySchema>
    //     }) => {
    //         const validatedInput = await inputValidation(options.input, input)
    //         console.log(`[tREST Core] validatedInput:`, validatedInput)
    //         return options.func(validatedInput)
    //     }) as ReturnFunction<
    //         InputType<TRouteParamsSchema>,
    //         InputType<TSearchParamsSchema>,
    //         InputType<TBodySchema>,
    //         TRouteResponse
    //     >,
    // }
}
