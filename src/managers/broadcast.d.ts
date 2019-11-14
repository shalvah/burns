export = makeBroadcastManager;
/**
 * @param {typeof import("../repositories/config")} configRepository
 * @param {typeof import("../repositories/events")} eventsRepository
 * @param {typeof import("../repositories/broadcasters")} broadcastersRepository
 */
declare function makeBroadcastManager(configRepository: {
    options: import("../repositories/config").Config;
    set(options: import("../repositories/config").Config): void;
    get(key: string): any;
}, eventsRepository: {
    events: {};
    handlers(event: string): ((arg0: any) => false | void)[];
    broadcastConfig(event: string): {
        broadcastOn?: string | ((arg0: any) => string);
        broadcastWhen?: boolean | ((arg0: any) => boolean);
    };
    add(events: {
        [x: string]: ((arg0: any) => false | void) | ((arg0: any) => false | void)[] | ({
            handlers: ((arg0: any) => false | void)[];
        } & {
            broadcastOn?: string | ((arg0: any) => string);
            broadcastWhen?: boolean | ((arg0: any) => boolean);
        });
    }): void;
    addEventHandlers(eventName: string, ...handlers: ((arg0: any) => false | void)[]): void;
    updateEventConfig(eventName: string, config: {
        handlers: ((arg0: any) => false | void)[];
    } & {
        broadcastOn?: string | ((arg0: any) => string);
        broadcastWhen?: boolean | ((arg0: any) => boolean);
    }): void;
}, broadcastersRepository: {
    get(driver: string, config: any): {
        broadcast: (arg0: string, arg1: string, arg2: any, arg3: any) => any;
    };
}): {
    /**
     * Broadcast an event.
     *
     * @param {string} event
     * @param {?} payload
     * @param {?} options
     */
    broadcast(event: string, payload?: any, options?: any): void;
};
