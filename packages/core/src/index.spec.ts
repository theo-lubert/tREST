import { test, expectTypeOf } from 'vitest'
import { z } from 'zod'
import tREST from '.'

test('GET._type defined properly', async () => {
    const GET = tREST.func(async () => {
        return {
            id: '0123456789',
            test: true,
        } as const
    })

    expectTypeOf(GET._type).toMatchTypeOf<
        () => Promise<{
            id: '0123456789'
            test: true
        }>
    >
    expectTypeOf(await GET.route()).toMatchTypeOf<{
        id: '0123456789'
        test: true
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
        await PATCH.route({
            routeParams: { id: 42 },
            body: { test: true },
        })
    ).toMatchTypeOf<{
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

    expectTypeOf(PUT._type).toMatchTypeOf<
        (validatedData: { searchParams: { test: boolean } }) => Promise<{
            id: '0123456789'
            test: boolean
        }>
    >
    expectTypeOf(
        await PUT.route({
            searchParams: { test: true },
        })
    ).toMatchTypeOf<{
        id: '0123456789'
        test: boolean
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

    expectTypeOf(POST._type).toMatchTypeOf<
        (validatedData: { body: { test: boolean } }) => Promise<{
            id: '0123456789'
            test: boolean
        }>
    >
    expectTypeOf(await POST.route({ body: { test: true } })).toMatchTypeOf<{
        id: '0123456789'
        test: boolean
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

    expectTypeOf(router._type?.GET).toMatchTypeOf<
        | undefined
        | (() => Promise<{
              id: '0123456789'
              test: true
          }>)
    >()
    expectTypeOf(await router.GET()).toMatchTypeOf<{
        id: '0123456789'
        test: true
    }>()

    expectTypeOf(router._type?.PATCH).toMatchTypeOf<
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
    ).toMatchTypeOf<{
        id: number
        test: boolean
    }>

    expectTypeOf(router._type?.PUT).toMatchTypeOf<
        | undefined
        | ((validatedData: { searchParams: { test: boolean } }) => Promise<{
              id: '0123456789'
              test: boolean
          }>)
    >
    expectTypeOf(
        await router.PUT({
            searchParams: { test: true },
        })
    ).toMatchTypeOf<{
        id: '0123456789'
        test: boolean
    }>

    expectTypeOf(router._type?.POST).toMatchTypeOf<
        | undefined
        | ((validatedData: { body: { test: boolean } }) => Promise<{
              id: '0123456789'
              test: boolean
          }>)
    >
    expectTypeOf(await router.POST({ body: { test: true } })).toMatchTypeOf<{
        id: '0123456789'
        test: boolean
    }>
})
