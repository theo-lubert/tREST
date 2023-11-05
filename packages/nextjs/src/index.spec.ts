import { test, expectTypeOf } from 'vitest'
import { z } from 'zod'
import tREST from '.'
import { NextRequest, NextResponse } from 'next/server'

// Nest.js mock utils

function mockNextRequest(
    method: string,
    urlPath: string,
    params?: unknown,
    body?: unknown
): [NextRequest, { params: unknown }] {
    return [
        {
            method,
            url: `http://localhost${urlPath}`,
            headers: {
                'Content-Type': 'application/json',
            },
            json: () => body,
        } as unknown as NextRequest,
        { params },
    ]
}

// Test cases implementation

test('GET._type defined properly', async () => {
    const GET = tREST.route.func(async () => {
        return NextResponse.json({
            id: '0123456789',
            test: true,
        } as const)
    })

    expectTypeOf(GET._type).toMatchTypeOf<
        () => Promise<{
            id: '0123456789'
            test: true
        }>
    >
    expectTypeOf(await GET.route(...mockNextRequest('GET', '/'))).toMatchTypeOf<
        NextResponse<{
            id: '0123456789'
            test: true
        }>
    >
})

test('PUT._type defined properly', async () => {
    const PUT = tREST.route
        .input({
            searchParams: z.object({
                test: z.coerce.boolean(),
            }),
        })
        .func(async ({ searchParams: { test } }) => {
            return {
                id: '0123456789',
                test,
            } as const
        })

    expectTypeOf(PUT._type).toMatchTypeOf<
        (validatedData: { searchParams: { test: boolean } }) => Promise<{
            id: '0123456789'
            test: boolean
        }>
    >
    expectTypeOf(await PUT.route(...mockNextRequest('PUT', '/?test=true')))
        .toMatchTypeOf<
        NextResponse<{
            id: '0123456789'
            test: boolean
        }>
    >
})

test('POST._type defined properly', async () => {
    const POST = tREST.route
        .input({
            body: z.object({
                test: z.boolean(),
            }),
        })
        .func(async ({ body: { test } }) => {
            return {
                id: '0123456789',
                test,
            } as const
        })

    expectTypeOf(POST._type).toMatchTypeOf<
        (validatedData: { body: { test: boolean } }) => Promise<{
            id: '0123456789'
            test: boolean
        }>
    >
    expectTypeOf(
        await POST.route(...mockNextRequest('POST', '/', {}, { test: true }))
    ).toMatchTypeOf<
        NextResponse<{
            id: '0123456789'
            test: boolean
        }>
    >
})

test('PATCH._type defined properly', async () => {
    const PATCH = tREST.route
        .input({
            routeParams: z.object({
                id: z.coerce.number(),
            }),
            body: z.object({
                test: z.boolean(),
            }),
        })
        .func(async ({ routeParams: { id }, body: { test } }) => {
            return {
                id,
                test,
            }
        })

    expectTypeOf(PATCH._type).toMatchTypeOf<
        (validatedData: {
            routeParams: { id: number }
            body: { test: boolean }
        }) => Promise<{
            id: number
            test: boolean
        }>
    >
    expectTypeOf(
        await PATCH.route(
            ...mockNextRequest('PATCH', '/', { id: '42' }, { test: true })
        )
    ).toMatchTypeOf<
        NextResponse<{
            id: number
            test: boolean
        }>
    >
})
