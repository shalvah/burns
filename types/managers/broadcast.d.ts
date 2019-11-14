export = makeBroadcastManager;
/**
 * @param {typeof import("../repositories/config")} configRepository
 * @param {typeof import("../repositories/events")} eventsRepository
 * @param {typeof import("../repositories/broadcasters")} broadcastersRepository
 */
declare function makeBroadcastManager(configRepository: {
    options: import("../repositories/config").Config;
    set(options: import("../repositories/config").Config): void;
    createBroadcaster(key: string): any;
}, eventsRepository: {
    events: {}; /**
     * Broadcast an event.
     *
     * @param {string} event
     * @param {?} payload
     * @param {Object<string, ?>} options
     * @param {string=} options.exclude
     */
    handlers(event: string): ((payload: any) => false | void)[];
    broadcastConfig(event: string): {
        broadcastOn?: string | ((payload: any) => string);
        broadcastIf?: boolean | ((payload: any) => boolean);
    };
    add(events: {
        [x: string]: ((payload: any) => false | void) | ((payload: any) => false | void)[] | ({
            handlers: ((payload: any) => false | void)[];
        } & {
            broadcastOn?: string | ((payload: any) => string);
            broadcastIf?: boolean | ((payload: any) => boolean);
        });
    }): void;
    addEventHandlers(eventName: string, ...handlers: ((payload: any) => false | void)[]): void;
    updateEventConfig(eventName: string, config: {
        handlers: ((payload: any) => false | void)[];
    } & {
        broadcastOn?: string | ((payload: any) => string);
        broadcastIf?: boolean | ((payload: any) => boolean);
    }): void;
}, broadcastersRepository: {
    createBroadcaster(driver: string, config: any): {
        broadcast: (channels: string | string[], eventName: string, eventData: any, options: {
            exclude?: string;
        }) => any;
    }; /**
     * Broadcast an event.
     *
     * @param {string} event
     * @param {?} payload
     * @param {Object<string, ?>} options
     * @param {string=} options.exclude
     */
}): {
    /**
     * Broadcast an event.
     *
     * @param {string} event
     * @param {?} payload
     * @param {Object<string, ?>} options
     * @param {string=} options.exclude
     */
    broadcast(event: string, payload?: any, options?: {
        exclude?: string;
    }): Promise<void>;
};
