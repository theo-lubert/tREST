/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    InputSchema,
    InputType,
    RouteHandlerOptions,
    TypedRouter,
    InputObject,
    HandlerFunction,
} from './types'
export type * from './types'
import { inputValidation } from './input'

export type AnyPromisedFunction = (...args: any[]) => Promise<any>

export function routeWithHandler<
    TRouteParamsSchema extends InputSchema,
    TSearchParamsSchema extends InputSchema,
    TBodySchema extends InputSchema,
    TRouteResponse,
    THandler extends (...args: any[]) => Promise<unknown>,
    TRouteFunc extends (...args: any[]) => Promise<any>,
>(
    options: RouteHandlerOptions<
        TRouteParamsSchema,
        TSearchParamsSchema,
        TBodySchema,
        TRouteResponse,
        THandler
    >,
    handler: TRouteFunc
): TypedRouter<typeof options, TRouteFunc> {
    return {
        route: handler,
    }
}

export function coreRoute<
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
        HandlerFunction<
            InputType<TRouteParamsSchema>,
            InputType<TSearchParamsSchema>,
            InputType<TBodySchema>,
            TRouteResponse
        >
    >
): TypedRouter<typeof options> {
    return routeWithHandler(
        options,
        async (
            input: InputObject<
                InputType<TRouteParamsSchema>,
                InputType<TSearchParamsSchema>,
                InputType<TBodySchema>
            >
        ) => {
            const validatedInput = await inputValidation(options.input, input)
            console.log(`[tREST Core] validatedInput:`, validatedInput)
            return await options.func(validatedInput)
        }
    ) as TypedRouter<typeof options>
}
