// import { z } from 'zod'
import type {
    ReturnFunction,
    RemoveNever,
    InferRouteType,
    InferRouteFunc,
    InferMethod,
    TypedRouterFormat,
} from './types'
export type * from './types'
import { input } from './input'
import { route as createRoute } from './route'

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
    TOPTIONS extends TypedRouterFormat = InferMethod<T, 'OPTIONS'>,
    THEAD extends TypedRouterFormat = InferMethod<T, 'HEAD'>,
    TGET extends TypedRouterFormat = InferMethod<T, 'GET'>,
    TPUT extends TypedRouterFormat = InferMethod<T, 'PUT'>,
    TPOST extends TypedRouterFormat = InferMethod<T, 'POST'>,
    TPATCH extends TypedRouterFormat = InferMethod<T, 'PATCH'>,
    TDELETE extends TypedRouterFormat = InferMethod<T, 'DELETE'>,
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
        handler: ReturnFunction<never, never, never, TRouteResponse>
    ) =>
        createRoute<TRouteResponse, never, never, never>({
            input: {},
            func: handler,
        }),
}

const _default = { ...route, router }
export default _default
