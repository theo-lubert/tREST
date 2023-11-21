import { fetchRoute } from '@trestjs/client'
import type {
    InputObject,
    HandlerFunction,
    InferBody,
    InferResponse,
    InferRouteParams,
    InferSearchParams,
    HttpMethod,
} from '@trestjs/core'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

export interface UseTRESTQueryOptions<T> extends UseQueryOptions<T> {}

export function queryKeyFrom<TRouteParams, TSearchParams, TBody>(
    url: string,
    input?: InputObject<TRouteParams, TSearchParams, TBody>
) {
    return [
        url,
        ...(input && 'routeParams' in input
            ? Object.entries(input.routeParams as Record<string, unknown>).map(
                  ([k, v]) => `${k}: ${v}`
              )
            : []),
        ...(input && 'searchParams' in input
            ? Object.entries(input.searchParams as Record<string, unknown>).map(
                  ([k, v]) => `${k}: ${v}`
              )
            : []),
    ]
}

export function useRouteQuery<
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
>(
    method: HttpMethod,
    url: string,
    fetchOptions?: RequestInit,
    queryKey?: string[]
) {
    return (
        input: InputObject<TRouteParams, TSearchParams, TBody>,
        options?: UseTRESTQueryOptions<TRouteResponse>
    ) => {
        const route = fetchRoute<
            TRoute,
            T,
            TRouteParams,
            TSearchParams,
            TBody,
            TRouteResponse
        >(method, url, fetchOptions)
        const queryKeys = queryKey ?? queryKeyFrom(url, input)
        return useQuery<TRouteResponse>({
            queryKey: queryKeys,
            queryFn: () => route(input),
            ...options,
        })
    }
}
