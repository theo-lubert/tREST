/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import type { InputObject, InputSchema, InputType } from '@trestjs/core'

export type NextjsReturnFunction<TRouteResponse> = (
    request: NextRequest,
    opts?: { params: unknown }
) => Promise<NextResponse<TRouteResponse>>

export type RouteHandler<
    TRouteParamsSchema extends InputSchema | undefined,
    TSearchParamsSchema extends InputSchema | undefined,
    TBodySchema extends InputSchema | undefined,
    TRouteResponse,
    THandler extends (
        ...args: any[]
    ) => Promise<TRouteResponse | NextResponse<TRouteResponse>>,
> = {
    input: {
        routeParams?: TRouteParamsSchema
        searchParams?: TSearchParamsSchema
        body?: TBodySchema
    }
    func: THandler
}

export type NextjsRouteHandler<
    TRouteParamsSchema extends InputSchema,
    TSearchParamsSchema extends InputSchema,
    TBodySchema extends InputSchema,
    TRouteResponse,
> = (
    input: InputObject<
        InputType<TRouteParamsSchema>,
        InputType<TSearchParamsSchema>,
        InputType<TBodySchema>
    >,
    request: NextRequest,
    opts?: { params: unknown }
) => Promise<TRouteResponse | NextResponse<TRouteResponse>>
