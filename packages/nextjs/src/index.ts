import qs from 'qs'
import { type NextRequest, NextResponse } from 'next/server'

import type {
    InputObject,
    InputType,
    InputSchema,
    ReturnFunction,
} from '@trestjs/core'
import core from '@trestjs/core'

// Utils

export function routePathFrom(filename: string) {
    // const regex = /^(?:\/?src)?(?:\/?app\/)?(.*)\/[^\/]*.(ts|tsx|js|jsx)$/
    // const regex =
    //     /^(?:\/?src)?(?:\/?app\/)?(.*?)(?:\/[^\/]*\.(ts|tsx|js|jsx))?$/
    // const passthroughRegex = /\/\([^\/]*\)/
    const regex = /^(?:\/?src)?(?:\/?app\/)?(.*?)(?:\/[^/]*\.(ts|tsx|js|jsx))?$/
    const passthroughRegex = /\/\([^/]*\)/
    const result = filename.replace(passthroughRegex, '').match(regex)
    if (result && result.length > 1) {
        return `/${result[1].split('/').filter(Boolean).join('/')}`
    }
    return '/idontknownwhereiam'
}

export async function reqSearchParams<RequestType extends Request>(
    req: RequestType
) {
    const { searchParams } = new URL(req.url)
    // console.log('searchParams.toString():', searchParams.toString())
    // console.log('qs.parse(searchParams.toString()):', qs.parse(searchParams.toString()))
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
                console.log('formData:', formData)
                console.log(
                    'qs.parse(formData.toString()):',
                    qs.parse(
                        Array.from(formData.entries())
                            .map(([key, value]) => `${key}=${value}`)
                            .join('&')
                    )
                )
                console.log(
                    'Object.fromEntries(formData.entries()):',
                    Object.fromEntries(formData.entries())
                )
                return qs.parse(
                    Array.from(formData.entries())
                        .map(([key, value]) => `${key}=${value}`)
                        .join('&')
                )
            }
            default:
                return undefined
        }
    } catch (err) {
        return undefined
    }
}

function ensureNextResponse<T>(response: T | NextResponse<T>): NextResponse<T> {
    return response instanceof NextResponse
        ? response
        : NextResponse.json(response)
}

type NextjsReturnFunction<
    TRouteParamsType,
    TSearchParamsType,
    TBodyType,
    TRouteResponse,
> = (
    input: InputObject<TRouteParamsType, TSearchParamsType, TBodyType>,
    request: NextRequest
) => Promise<TRouteResponse | NextResponse<TRouteResponse>>

export function nextjs_route<
    TRouteResponse,
    TRouteParamsSchema extends InputSchema | undefined,
    TSearchParamsSchema extends InputSchema | undefined,
    TBodySchema extends InputSchema | undefined,
>(options: {
    input: {
        routeParams?: TRouteParamsSchema
        searchParams?: TSearchParamsSchema
        body?: TBodySchema
    }
    func: NextjsReturnFunction<
        InputType<TRouteParamsSchema>,
        InputType<TSearchParamsSchema>,
        InputType<TBodySchema>,
        TRouteResponse
    >
}): {
    _type?: ReturnFunction<
        InputType<TRouteParamsSchema>,
        InputType<TSearchParamsSchema>,
        InputType<TBodySchema>,
        TRouteResponse
    >
    route: (
        request: NextRequest,
        opts?: { params: unknown }
    ) => Promise<NextResponse<TRouteResponse>>
} {
    return {
        route: async (request: NextRequest, opts?: { params: unknown }) => {
            const coreRoute = core.input(options.input ?? {}).func((async (
                validatedInput
            ) => {
                const response = await options.func(validatedInput, request)
                const nextResponse = ensureNextResponse(response)
                console.log(
                    `[tREST] ${request.method} ${request.url} => ${nextResponse.status}`
                )
                return nextResponse
            }) as ReturnFunction<
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
        },
    }
}

export function input<
    TRouteParamsSchema extends InputSchema = never,
    TSearchParamsSchema extends InputSchema = never,
    TBodySchema extends InputSchema = never,
>(
    input: Parameters<
        typeof core.input<TRouteParamsSchema, TSearchParamsSchema, TBodySchema>
    >[0]
) {
    return {
        func: <TRouteResponse>(
            handler: NextjsReturnFunction<
                InputType<TRouteParamsSchema>,
                InputType<TSearchParamsSchema>,
                InputType<TBodySchema>,
                TRouteResponse
            >
        ) =>
            nextjs_route({
                input,
                func: handler,
            }),
    }
}

export const route = {
    input,
    func: <TRouteResponse>(
        handler: NextjsReturnFunction<never, never, never, TRouteResponse>
    ) =>
        nextjs_route<TRouteResponse, never, never, never>({
            input: {},
            func: handler,
        }),
}

const _default = { route }
export default _default
