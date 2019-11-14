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
        [x: string]: ((arg0: any) => false | void) | ((arg0: any) => false | void)[] | ({
            handlers: ((arg0: any) => false | void)[];
        } & {
            broadcastOn?: string | ((arg0: any) => string);
            broadcastWhen?: boolean | ((arg0: any) => boolean);
        });
    }): Burns;
    dispatch(eventName: any, eventData?: {}, { exclude }?: {
        exclude?: any;
    }): Burns;
}
declare namespace Burns {
    export type Config = {
        defaultHandler?: (arg0: any) => false | void;
        broadcaster?: string;
        pusher?: {} | {
            appId: string;
            key: string;
            secret: string;
            cluster?: string;
        };
    };
    export type EventHandler = (arg0: any) => false | void;
    export type EventConfig = {
        handlers: ((arg0: any) => false | void)[];
    } & {
        broadcastOn?: string | ((arg0: any) => string);
        broadcastWhen?: boolean | ((arg0: any) => boolean);
    };
}
