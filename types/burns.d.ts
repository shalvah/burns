declare const _exports: Burns;
export = _exports;
/**
 * @typedef {import("./repositories/config").Config} Burns.Config
 * @typedef {import("./repositories/events").EventHandler} Burns.EventHandler
 * @typedef {import("./repositories/events").EventConfig} Burns.EventConfig
 */
declare class Burns {
    /**
     * @param {Burns.Config} config
     * @returns {Burns}
     */
    configure({ defaultHandler, broadcaster, pusher }?: import("./repositories/config").Config): Burns;
    /**
     *
     * @param {Object<string, Burns.EventHandler|Burns.EventHandler[]|Burns.EventConfig>} newEvents
     * @returns {Burns}
     */
    registerEvents(newEvents: {
        [x: string]: ((payload: any) => false | void) | ((payload: any) => false | void)[] | ({
            handlers: ((payload: any) => false | void)[];
        } & {
            broadcastOn?: string | ((payload: any) => string);
            broadcastIf?: boolean | ((payload: any) => boolean);
        });
    }): Burns;
    /**
     * Dispatch an event, and broadcast it, if configured.
     * @param {string} eventName
     * @param {?} eventData
     * @param {Object<string, ?>} options
     * @param {string=} options.exclude
     * @returns {Burns}
     */
    dispatch(eventName: string, eventData?: any, { exclude }?: {
        exclude?: string;
    }): Burns;
}
declare namespace Burns {
    export type Config = {
        defaultHandler?: (payload: any) => false | void;
        broadcaster?: string;
        pusher?: {} | import("pusher").ClusterOptions | import("pusher").HostOptions;
    };
    export type EventHandler = (payload: any) => false | void;
    export type EventConfig = {
        handlers: ((payload: any) => false | void)[];
    } & {
        broadcastOn?: string | ((payload: any) => string);
        broadcastIf?: boolean | ((payload: any) => boolean);
    };
}
