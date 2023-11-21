import core from '@trestjs/core'
import { createRoute } from './route'
import { NextjsRouteHandler } from './types'
import { input } from './input'

// Utils

export function routePathFrom(filename: string) {
    const regex = /^(?:\/?src)?(?:\/?app\/)?(.*?)(?:\/[^/]*\.(ts|tsx|js|jsx))?$/
    const passthroughRegex = /\/\([^/]*\)/
    const result = filename.replace(passthroughRegex, '').match(regex)
    if (result && result.length > 1) {
        return `/${result[1].split('/').filter(Boolean).join('/')}`
    }
    return '/idontknownwhereiam'
}

export const route = {
    input,
    func: <TRouteResponse>(
        handler: NextjsRouteHandler<never, never, never, TRouteResponse>
    ) =>
        createRoute<never, never, never, TRouteResponse>({
            input: {},
            func: handler,
        }),
}

const _default = { ...route, router: core.router }
export default _default
