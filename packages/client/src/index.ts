/* eslint-disable @typescript-eslint/no-explicit-any */
import qs from 'qs'
import type {
    InferBody,
    InferResponse,
    InferRouteParams,
    InferSearchParams,
    InputObject,
    HandlerFunction,
} from '@trestjs/core'

export function fetchRoute<
    TRoute extends {
        _type?: HandlerFunction<
            TRouteParams,
            TSearchParams,
            TBody,
            TRouteResponse
        >
    },
    T = TRoute extends {
        _type?: infer T
    }
        ? T
        : never,
    TRouteParams = InferRouteParams<T>,
    TSearchParams = InferSearchParams<T>,
    TBody = InferBody<T>,
    TRouteResponse = InferResponse<T>,
>(method: string, routePath: string, fetchOptions?: RequestInit) {
    return (async (input?: InputObject<TRouteParams, TSearchParams, TBody>) => {
        const options = {
            method,
            ...fetchOptions,
            headers: {
                'Content-Type': 'application/json',
                ...fetchOptions?.headers,
            },
        }
        if (input && 'body' in input && input.body) {
            options.body = JSON.stringify(input.body)
        }
        let params: string | undefined
        if (input && 'searchParams' in input && input.searchParams) {
            params = `?${qs.stringify(input.searchParams)}`
        }

        if (input && 'routeParams' in input && input.routeParams) {
            const routeParams = input.routeParams as Record<string, unknown>
            for (const key of Object.keys(routeParams)) {
                routePath = routePath.replace(
                    `[${key}]`,
                    String(routeParams[key])
                )
            }
        }
        const res = await fetch(`${routePath}${params || ''}`, options)
        return (await res.json()) as TRouteResponse
    }) as HandlerFunction<TRouteParams, TSearchParams, TBody, TRouteResponse>
}
