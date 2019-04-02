<h1 align="center">Burns</h1>

<p align="center">
  <img src="burns.gif"><br>
  <em>Excellent</em>
</p>

[![npm version](https://badge.fury.io/js/burns.svg)](https://badge.fury.io/js/burns)
[![Build Status](https://travis-ci.org/shalvah/burns.svg?branch=master)](https://travis-ci.org/shalvah/burns)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=shalvah/burns)](https://dependabot.com)

Burns is a lightweight (no dependencies!) Node.js module for managing application events elegantly. Define your events and handlers in one place and dispatch them when you need to.

Inspired by Laravel's [events](https://laravel.com/docs/master/events) and [broadcasting](https://laravel.com/docs/master/broadcasting) systems.

## What you get
- Easy visibility of all application events
- Default handler to catch generic events
- Attaching event handlers at multiple places
- Asynchronous handling of events
- Inbuilt event broadcasting

## Installation
```bash
npm install burns
```

You can OPTIONALLY install type definitions to get better intellisense and autocompletion.
```bash
npm install --save-dev @types/burns
```

## How to use

```js
const burns = require('burns');
```

Define an event handler:

```js
// handlers/order.js

function sendOrderShippedEmail(data)
{
    mailer.sendEmail(`Hi ${data.userName}, Your order ${data.orderId} has been shipped`);
}
```

Register the event and attach the handler:
```js
let orderHandlers = require('./handlers/order');
burns.registerEvents({
  orderShipped: orderHandlers.sendOrderShippedEmail
});
```

Dispatch the event when you're ready! :rocket:
```js
burns.dispatch('orderShipped', {
    orderId: order.id,
    userName: user.name
});
```

### Registering events
Register events by calling ` registerEvents` with a single object. The names of your events should be the keys of this object and their handlers the values:

```js
burns.registerEvents({
  newPurchase: sendReceipt,
  orderShipped: notifyUser
});
```
You can also attach multiple handlers to a single event:

```js
burns.registerEvents({
  userSignUp: [
    userListener.sendEmail,
    userListener.congratulateReferrer
  ]
})
```
Burns allows you to register events at multiple locations. This means that for a large application, you can have each application component define its own events and handlers by calling `registerEvents` wherever it needs to.

### Defining handlers
A handler is a function that responds to an event. A handler takes a single parameter, the event payload which you pass when dispatching the event:

```js
function sendReceipt(data)
{
    let receipt = createReceipt(data.order, data.user);
    mailer.sendEmail('Here is your order receipt', receipt);
}

burns.registerEvents({
  newPurchase: sendReceipt,
});

// this will call sendReceipt with data = {}
burns.dispatch('newPurchase');

// this will call sendReceipt with data containing order and user
burns.dispatch('newPurchase', {
    order: getOrder(),
    user: findUser()
});
```


#### Stopping event propagation
Suppose you're running a subscription service (like Netflix) where you bill users every month. Your app can fire a `newBillingPeriod` event and perform multiple actions when this event is fired: charge the customer's card, extend their subscription, send them a receipt. Burns allows you to register multiple handlers for the event, and will call them in the order in which they were registered:

```js
burns.registerEvents({
  newBillingPeriod: [
      chargeCustomerCard,
      extendCustomerSubscription,
      sendCustomerReceipt
   ]
})
```

If the process of charging the customer's card fails, you probably wouldn't want to go through with the other actions. In such a situation, you can prevent the subsequent handlers from being called by returning `false` from the current handler:

```js
function chargeCustomerCard(customer) {
  if (!PaymentProcessor.chargeCard(customer)) {
      // bonus: dispatch a 'chargeCardFailed` event. Cool, huh?
    burns.dispatch('chargeCardFailed', customer);
    return false;
  }

}
```

#### Using a default handler
You may specify a `defaultHandler`. Burns will pass a dispatched event to this handler if no handlers are registered for it:

```js
function handleEverything (data) {}

burns.configure({
    defaultHandler: handleEverything
});

// this will call handleEverything
burns.dispatch('unregisteredEvent', somePayload);
```

### Dispatching events
To dispatch an event, call ` dispatch` with the name of the event:

```js
burns.dispatch('postLiked');
```

You may also pass in a payload containing data to be transmitted with the event:

```js
burns.dispatch('postLiked', {
    postId: 69,
    likedBy: 42
});
```
This object will be passed as an argument to the handler.

## Broadcasting events
Supposing you have an `orderStatusUpdated` event that is fired when the status of an order is updated, and you wish to update the order status on your frontend in realtime. Burns handles this for you via event broadcasting.

You'll need to specify a `broadcaster`. For now, broadcasting is only supported to the console log (broadcaster: 'log') and [Pusher](http://pusher.com) (broadcaster: 'pusher'). The default broadcaster is `log`, which will log all broadcasts to the Node console. (You can disable broadcasting by setting `broadcaster: null`.)

If you're broadcasting with Pusher, pass in your credentials as a `pusher` object:

```js
burns.configure({
  broadcaster: 'pusher',
  pusher: {
    appId: 'APP_ID',
    key: 'APP_KEY',
    secret: 'SECRET_KEY',
    cluster: 'CLUSTER',
  }
})
```
You'll also need to run `npm install pusher` to pull in the Pusher Node SDK.

Then register the `orderStatusUpdated` using the "advanced" configuration format:

```js
burns.registerEvents({
  orderStatusUpdated: {
      handlers: [
          notifyUser
      ],
      broadcastOn: 'orderStatusUpdates'
  }
})
```

The `broadcastOn` key specifies the name of the channel on which the event will be broadcast. It can be a string or a function that takes in the event payload and returns a channel name.

Now when you call

```js
burns.dispatch('orderStatusUpdated', order);
```

Burns will automatically publish a message on the channel *orderStatusUpdates* with your order data as the payload. All that's left is for you to listen for this event on the frontend.

If you'd like to exclude the client that triggered the event from receiving the broadcast, you can pass in an object as the third parameter to `dispatch()`. The 'exclude' key should contain the socket ID of the client to exclude:

```js
burns.dispatch('orderStatusUpdated', order, { exclude: socketId });
```

## But Node already supports events natively!
Yes, and that's a great thing for handling events at lower levels in your code base (for instance, on `open` of a file, on `data` of a stream). When dealing with events at a higher level (such as a new user signing up), Burns is perfect for helping you keep your code clean and organized.

## Asynchronous vs. Synchronous
[Unlike NodeJS' inbuilt events system](https://nodejs.org/api/events.html#events_asynchronous_vs_synchronous), Burns calls your event handlers asynchronously in the order in which they were registered. This means that the functions are queued behind whatever I/O event callbacks that are already in the event queue, thus enabling you to send a response to your user immediately, while your event gets handled in the background

## Like it?
Star and share, and give me a shout out [on Twitter](http://twitter.com/theshalvah)

## Contributing
If you have an bugfix, idea or feature you'd like to implement, you're welcome to send in a PR!

(Requires Node v8 or above)
- Clone the repo

```bash
git clone https://github.com/shalvah/burns.git
```

- Create a branch for your fix/feature:

```bash
git checkout -b my-patch
```

- Write your code. Add tests too, if you know how. If you're not sure how, just send in the PR anyway.

- Make sure all tests are passing

```bash
npm run test
```

## Todo
- add support for `broadcastWhen` option
- add a `subscribe` method that allows for a handler to subscribe to an event
- add support for Promises in event handlers
