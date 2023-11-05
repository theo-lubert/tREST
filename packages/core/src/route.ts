import type {
    InputSchema,
    InputType,
    RouteHandler,
    ReturnFunction,
    TypedRouter,
} from './types'
export type * from './types'
import { inputValidation } from './input'

export function route<
    TRouteResponse,
    TRouteParamsSchema extends InputSchema | undefined,
    TSearchParamsSchema extends InputSchema | undefined,
    TBodySchema extends InputSchema | undefined,
>(
    options: RouteHandler<
        TRouteResponse,
        TRouteParamsSchema,
        TSearchParamsSchema,
        TBodySchema
    >
): TypedRouter<typeof options> {
    return {
        route: (async (input: {
            routeParams?: InputType<TRouteParamsSchema>
            searchParams?: InputType<TSearchParamsSchema>
            body?: InputType<TBodySchema>
        }) => {
            const validatedInput = await inputValidation(options.input, input)
            console.log(`[tREST Core] validatedInput:`, validatedInput)
            return options.func(validatedInput)
        }) as ReturnFunction<
            InputType<TRouteParamsSchema>,
            InputType<TSearchParamsSchema>,
            InputType<TBodySchema>,
            TRouteResponse
        >,
    }
}
