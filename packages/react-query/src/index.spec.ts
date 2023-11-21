import { test } from 'vitest'
import { z } from 'zod'
import tREST from '@trestjs/nextjs'
import { type UseTRESTQueryOptions, useRouteQuery } from '.'
import { InputObject } from '@trestjs/core'
import { UseQueryResult } from '@tanstack/react-query'
import { expectTypeOf } from '../../../helpers/test'

// Test cases implementation

test('GET._type defined properly', async () => {
    const GETRoute = tREST
        .input({
            searchParams: z.object({
                hello: z.string(),
            }),
        })
        .func(async ({ searchParams: { hello } }) => {
            const data = {
                hello,
            }
            return data
        })

    const useRESTQuery = useRouteQuery<typeof GETRoute>('GET', '/api/test')

    expectTypeOf(useRESTQuery).toEqualTypeOf<
        (
            input: InputObject<never, { hello: string }, never>,
            options?: UseTRESTQueryOptions<{
                hello: string
            }>
        ) => UseQueryResult<{ hello: string }>
    >
})

// test('router defined properly', async () => {
//     const router = tREST.router({
//         GET: tREST
//             .input({
//                 searchParams: z.object({
//                     hello: z.string().optional(),
//                 }),
//             })
//             .func(async ({ searchParams: { hello } }) => {
//                 const data = {
//                     hello,
//                 }
//                 return data
//             }),
//     })
// })
