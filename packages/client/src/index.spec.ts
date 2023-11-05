import { test, expect } from 'vitest'
import { route } from '@trestjs/core'
import { fetchRoute } from '.'
import { z } from 'zod'
import express from 'express'

function mockServer(port: number) {
    const app = express()

    app.use(express.json())
    app.all('*', function (req, res) {
        res.send({
            method: req.method,
            url: req.originalUrl,
            searchParams: req.query,
            headers: req.headers,
            body: req.body,
        })
    })

    return app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

test('Fetch client should run properly', async () => {
    const port = 7863
    const app = mockServer(port)

    const GET = route
        // .input({ searchParams: z.object({ name: z.string() }) })
        .func(async () => {
            return {
                id: '0123456789',
                test: true,
            } as const
        })
    const GET_routeResponse = await fetchRoute<typeof GET>(
        'GET',
        `http://localhost:${port}/api`
    )({
        // TODO: Should not be needed, and should fail
        routeParams: undefined,
        searchParams: undefined,
        body: undefined,
    })
    console.log('GET_routeResponse:', GET_routeResponse)

    const PUT = route
        .input({
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
    const PUT_routeResponse = await fetchRoute<typeof PUT>(
        'PUT',
        `http://localhost:${port}/api`
    )({ searchParams: { test: true } })
    console.log('PUT_routeResponse:', PUT_routeResponse)

    const POST = route
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
    const POST_routeResponse = await fetchRoute<typeof POST>(
        'POST',
        `http://localhost:${port}/api`
    )({ body: { test: true } })
    console.log('POST_routeResponse:', POST_routeResponse)

    await app.close()
})
