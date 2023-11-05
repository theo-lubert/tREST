import { z } from 'zod'
import tREST from '@trestjs/nextjs'
import { useRouteQuery } from '.'

export const GETRoute = tREST.route
    .input({
        searchParams: z.object({
            hello: z.string().optional(),
        }),
    })
    .func(async ({ searchParams: { hello } }) => {
        const data = {
            hello,
        }
        return data
    })

// React query
export const useRESTQuery = useRouteQuery<typeof GETRoute>('GET', '/api/test')

// const { data } = useRESTQuery({ searchParams: { hello: 'world' } })
