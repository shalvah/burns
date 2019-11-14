export type EventHandler = (payload: any) => false | void;
export type BroadcastConfig = {
    broadcastOn?: string | ((payload: any) => string);
    broadcastIf?: boolean | ((payload: any) => boolean);
};
export type EventConfig = {
    handlers: ((payload: any) => false | void)[];
} & {
    broadcastOn?: string | ((payload: any) => string);
    broadcastIf?: boolean | ((payload: any) => boolean);
};
export declare const events: {};
/**
 * Get the handlers registered for an event.
 * @param {string} event
 * @returns {EventHandler[]}
 */
export declare function handlers(event: string): ((payload: any) => false | void)[];
/**
 * Get the broadcasting configuration specified fr an event.
 *
 * @param {string} event
 * @returns {BroadcastConfig}
 */
export declare function broadcastConfig(event: string): {
    broadcastOn?: string | ((payload: any) => string);
    broadcastIf?: boolean | ((payload: any) => boolean);
};
/**
 * @param {Object<string, EventHandler|EventHandler[]|EventConfig>} events
 */
export declare function add(events: {
    [x: string]: ((payload: any) => false | void) | ((payload: any) => false | void)[] | ({
        handlers: ((payload: any) => false | void)[];
    } & {
        broadcastOn?: string | ((payload: any) => string);
        broadcastIf?: boolean | ((payload: any) => boolean);
    });
}): void;
/**
 * @param {string} eventName
 * @param {EventHandler[]} handlers
 */
export declare function addEventHandlers(eventName: string, ...handlers: ((payload: any) => false | void)[]): void;
/**
 * @param {string} eventName
 * @param {EventConfig} config
 */
export declare function updateEventConfig(eventName: string, config: {
    handlers: ((payload: any) => false | void)[];
} & {
    broadcastOn?: string | ((payload: any) => string);
    broadcastIf?: boolean | ((payload: any) => boolean);
}): void;
