// import { z } from 'zod'
import type {
    HandlerFunction,
    RemoveNever,
    InferRouteType,
    InferRouteFunc,
    InferMethod,
    UnknownTypedRouterFormat,
} from './types'
export type * from './types'
import { input } from './input'
import { coreRoute } from './route'
export { routeWithHandler } from './route'

export function router<
    T extends {
        OPTIONS?: TOPTIONS
        HEAD?: THEAD
        GET?: TGET
        PUT?: TPUT
        POST?: TPOST
        PATCH?: TPATCH
        DELETE?: TDELETE
    },
    TOPTIONS extends UnknownTypedRouterFormat = InferMethod<T, 'OPTIONS'>,
    THEAD extends UnknownTypedRouterFormat = InferMethod<T, 'HEAD'>,
    TGET extends UnknownTypedRouterFormat = InferMethod<T, 'GET'>,
    TPUT extends UnknownTypedRouterFormat = InferMethod<T, 'PUT'>,
    TPOST extends UnknownTypedRouterFormat = InferMethod<T, 'POST'>,
    TPATCH extends UnknownTypedRouterFormat = InferMethod<T, 'PATCH'>,
    TDELETE extends UnknownTypedRouterFormat = InferMethod<T, 'DELETE'>,
>(router: {
    OPTIONS?: TOPTIONS
    HEAD?: THEAD
    GET?: TGET
    PUT?: TPUT
    POST?: TPOST
    PATCH?: TPATCH
    DELETE?: TDELETE
}) {
    const { OPTIONS, HEAD, GET, PUT, POST, PATCH, DELETE } = router
    return {
        OPTIONS: OPTIONS && 'route' in OPTIONS ? OPTIONS?.route : undefined,
        HEAD: HEAD && 'route' in HEAD ? HEAD?.route : undefined,
        GET: GET && 'route' in GET ? GET?.route : undefined,
        PUT: PUT && 'route' in PUT ? PUT?.route : undefined,
        POST: POST && 'route' in POST ? POST?.route : undefined,
        PATCH: PATCH && 'route' in PATCH ? PATCH?.route : undefined,
        DELETE: DELETE && 'route' in DELETE ? DELETE?.route : undefined,
    } as RemoveNever<{
        _type?: RemoveNever<{
            OPTIONS: InferRouteType<typeof OPTIONS>
            HEAD: InferRouteType<typeof HEAD>
            GET: InferRouteType<typeof GET>
            PUT: InferRouteType<typeof PUT>
            POST: InferRouteType<typeof POST>
            PATCH: InferRouteType<typeof PATCH>
            DELETE: InferRouteType<typeof DELETE>
        }>

        OPTIONS: InferRouteFunc<typeof OPTIONS>
        HEAD: InferRouteFunc<typeof HEAD>
        GET: InferRouteFunc<typeof GET>
        PUT: InferRouteFunc<typeof PUT>
        POST: InferRouteFunc<typeof POST>
        PATCH: InferRouteFunc<typeof PATCH>
        DELETE: InferRouteFunc<typeof DELETE>
    }>
}

export const route = {
    input,
    func: <TRouteResponse>(
        handler: HandlerFunction<never, never, never, TRouteResponse>
    ) =>
        coreRoute<never, never, never, TRouteResponse>({
            input: {},
            func: handler,
        }),
}

const _default = { ...route, route, router }
export default _default
