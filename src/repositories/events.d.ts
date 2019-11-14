export type EventHandler = (arg0: any) => false | void;
export type BroadcastConfig = {
    broadcastOn?: string | ((arg0: any) => string);
    broadcastWhen?: boolean | ((arg0: any) => boolean);
};
export type EventConfig = {
    handlers: ((arg0: any) => false | void)[];
} & {
    broadcastOn?: string | ((arg0: any) => string);
    broadcastWhen?: boolean | ((arg0: any) => boolean);
};
export declare const events: {};
/**
 * Get the handlers registered for an event.
 * @param {string} event
 * @returns {EventHandler[]}
 */
export declare function handlers(event: string): ((arg0: any) => false | void)[];
/**
 * Get the broadcasting configuration specified fr an event.
 *
 * @param {string} event
 * @returns {BroadcastConfig}
 */
export declare function broadcastConfig(event: string): {
    broadcastOn?: string | ((arg0: any) => string);
    broadcastWhen?: boolean | ((arg0: any) => boolean);
};
/**
 * @param {Object<string, EventHandler|EventHandler[]|EventConfig>} events
 */
export declare function add(events: {
    [x: string]: ((arg0: any) => false | void) | ((arg0: any) => false | void)[] | ({
        handlers: ((arg0: any) => false | void)[];
    } & {
        broadcastOn?: string | ((arg0: any) => string);
        broadcastWhen?: boolean | ((arg0: any) => boolean);
    });
}): void;
/**
 * @param {string} eventName
 * @param {EventHandler[]} handlers
 */
export declare function addEventHandlers(eventName: string, ...handlers: ((arg0: any) => false | void)[]): void;
/**
 * @param {string} eventName
 * @param {EventConfig} config
 */
export declare function updateEventConfig(eventName: string, config: {
    handlers: ((arg0: any) => false | void)[];
} & {
    broadcastOn?: string | ((arg0: any) => string);
    broadcastWhen?: boolean | ((arg0: any) => boolean);
}): void;
