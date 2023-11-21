import type { InputSchema } from '@trestjs/core'
import { NextjsRouteHandler } from './types'
import { createRoute } from './route'

export function input<
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
            handler: NextjsRouteHandler<
                TRouteParamsSchema,
                TSearchParamsSchema,
                TBodySchema,
                TRouteResponse
            >
        ) =>
            createRoute({
                input,
                func: handler,
            }),
    }
}
