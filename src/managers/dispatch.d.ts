export = makeEventsDispatcher;
/**
 * @param {typeof import("../repositories/config")} configRepository
 * @param {typeof import("../repositories/events")} eventsRepository
 */
declare function makeEventsDispatcher(configRepository: {
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
}): {
    queuedHandlers: {};
    /**
     * Dispatch an event.
     *
     * @param {string} eventName
     * @param {?} payload
     */
    dispatch(eventName: string, payload?: any): void;
    /**
     * Queue handlers to be called.
     * @param {string} eventName
     * @param {?} eventData
     */
    queueHandlers(eventName: string, eventData?: any): void;
    /**
     * Cancel queued handlers so they are no longer called.
     * @param {string} eventName
     */
    dequeueHandlers(eventName: string): void;
};
