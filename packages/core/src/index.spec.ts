/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from 'vitest'
import { z } from 'zod'
import tREST from '.'
import { expectTypeOf } from '../../../helpers/test'

test('GET._type defined properly', async () => {
    const GET = tREST.func(async () => {
        return {
            id: '0123456789',
            test: true,
        } as const
    })

    expectTypeOf(GET._type!).toEqualTypeOf<
        () => Promise<{
            readonly id: '0123456789'
            readonly test: true
        }>
    >
    expectTypeOf(await GET.route()).toEqualTypeOf<{
        readonly id: '0123456789'
        readonly test: true
    }>
})

test('PATCH._type defined properly', async () => {
    const PATCH = tREST
        .input({
            routeParams: z.object({
                id: z.number(),
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

    expectTypeOf(PATCH._type!).toEqualTypeOf<
        (input: {
            routeParams: { id: number }
            body: { test: boolean }
        }) => Promise<{
            id: number
            test: boolean
        }>
    >
    expectTypeOf(
        await PATCH.route({
            routeParams: { id: 42 },
            body: { test: true },
        })
    ).toEqualTypeOf<{
        id: number
        test: boolean
    }>
})

test('PUT._type defined properly', async () => {
    const PUT = tREST
        .input({
            // routeParams: 'test', // TODO: This should fail
            searchParams: z.object({
                test: z.boolean(),
            }),
        })
        .func(async ({ searchParams: { test } }) => {
            return {
                id: '0123456789',
                test,
            } as const
        })

    expectTypeOf(PUT._type!).toEqualTypeOf<
        (input: { searchParams: { test: boolean } }) => Promise<{
            readonly id: '0123456789'
            readonly test: boolean
        }>
    >
    expectTypeOf(
        await PUT.route({
            searchParams: { test: true },
        })
    ).toEqualTypeOf<{
        readonly id: '0123456789'
        readonly test: boolean
    }>
})

test('POST._type defined properly', async () => {
    const POST = tREST
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

    expectTypeOf(POST._type!).toEqualTypeOf<
        (validatedData: { body: { test: boolean } }) => Promise<{
            readonly id: '0123456789'
            readonly test: boolean
        }>
    >
    expectTypeOf(await POST.route({ body: { test: true } })).toEqualTypeOf<{
        readonly id: '0123456789'
        readonly test: boolean
    }>
})

test('router defined properly', async () => {
    const router = tREST.router({
        GET: tREST.func(async () => {
            return {
                id: '0123456789',
                test: true,
            } as const
        }),
        PUT: tREST
            .input({
                // routeParams: 'test', // TODO: This should fail
                searchParams: z.object({
                    test: z.boolean(),
                }),
            })
            .func(async ({ searchParams: { test } }) => {
                return {
                    id: '0123456789',
                    test,
                } as const
            }),
        POST: tREST
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
            }),
        PATCH: tREST
            .input({
                routeParams: z.object({
                    id: z.number(),
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
            }),
    })

    expectTypeOf(router._type?.GET).toEqualTypeOf<
        | undefined
        | (() => Promise<{
              readonly id: '0123456789'
              readonly test: true
          }>)
    >()
    expectTypeOf(await router.GET()).toEqualTypeOf<{
        readonly id: '0123456789'
        readonly test: true
    }>()

    expectTypeOf(router._type?.PATCH).toEqualTypeOf<
        | undefined
        | ((validatedData: {
              routeParams: { id: number }
              body: { test: boolean }
          }) => Promise<{
              id: number
              test: boolean
          }>)
    >
    expectTypeOf(
        await router.PATCH({
            routeParams: { id: 42 },
            body: { test: true },
        })
    ).toEqualTypeOf<{
        id: number
        test: boolean
    }>

    expectTypeOf(router._type?.PUT).toEqualTypeOf<
        | undefined
        | ((validatedData: { searchParams: { test: boolean } }) => Promise<{
              readonly id: '0123456789'
              readonly test: boolean
          }>)
    >
    expectTypeOf(
        await router.PUT({
            searchParams: { test: true },
        })
    ).toEqualTypeOf<{
        readonly id: '0123456789'
        readonly test: boolean
    }>

    expectTypeOf(router._type?.POST).toEqualTypeOf<
        | undefined
        | ((validatedData: { body: { test: boolean } }) => Promise<{
              readonly id: '0123456789'
              readonly test: boolean
          }>)
    >
    expectTypeOf(await router.POST({ body: { test: true } })).toEqualTypeOf<{
        readonly id: '0123456789'
        readonly test: boolean
    }>
})
