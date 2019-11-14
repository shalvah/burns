export = makeEventsDispatcher;
/**
 * @param {typeof import("../repositories/config")} configRepository
 * @param {typeof import("../repositories/events")} eventsRepository
 */
declare function makeEventsDispatcher(configRepository: {
    options: import("../repositories/config").Config;
    set(options: import("../repositories/config").Config): void;
    createBroadcaster(key: string): any;
}, eventsRepository: {
    events: {};
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
