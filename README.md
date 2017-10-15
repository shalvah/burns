<h1 align="center">Burns</h1>

<p align="center">
  <img src="burns.gif"><br>
  <em>Excellent</em>
</p>

[![npm version](https://badge.fury.io/js/burns.svg)](https://badge.fury.io/js/burns)
[![Build Status](https://travis-ci.org/shalvah/burns.svg?branch=master)](https://travis-ci.org/shalvah/burns)

Burns is a zero-dependency Node.js module that lets you manage application events in a clean and consistent manner. Define your events in one place, define listeners to handle them, and fire them when you need to.

## Usage
```
npm install --save burns
```

```js
let burns = require('burns');
```

### Registering Events
To register your events with Burns, call ` register` with an object with event names as keys and one or more event listeners as values:

```js
burns.register({
    userFollowed: NotifyUser,
    userSignUp: [
      SendEmail,
      CongratulateReferrer
    ]
});
```

### Defining Listeners and Handlers
**Listeners** are ES6 classes or constructor functions (called with `new`) with one or more handlers

```js
class CongratulateReferrer {
    handle(data) {
        let email = makeEmail(`Congrats! ${data.username} signed up on your recommendation!`);
        sendEmailTo(data.referrer, email);
    }
}

function CongratulateReferrer {
  this.handle = function (data) {
    var email = makeEmail('Congrats!' + data.username + ' signed up on your recommendation!');
    sendEmailTo(data.referrer, email);
  }
}
```

**Handlers** are (non-static) methods in listener classes. Typically, Burns looks for the `handle` method in your listener and calls that. However, you can choose to define a handler for specific events, by using `on` + the UpperCased event name. In such a case, `handle` will NOT be called. For instance:


```js
class GenericListener {
    onSpecialEvent(data) {}
    handle(data) {}
}

burns.register({
  'special-event': GenericListener,
  'regular-event': GenericListener
})
burns.event('special-event'); // will call onSpecialEvent
burns.event('regular-event'); // will call handle
````

### Stopping Propagation
Burns calls your event listeners in the specified order. This means that, in the code snippet below, dispatching the 'event' event will call the appropriate method in ListenerOne first, and then the method in ListenerTwo: 

```js
burns.register({
  userSignUp: [SendWelcomeEmail, CongratulateReferrer]
})
```

If you want to stop the next handlers for the event from being called, simply return false from the current handler:

```js
class SendWelcomeEmail {
    handle(data) {
        emailUser(data.email);
        if (data.referrer === null) {
            return false;
        }
    }
}

class CongratulateReferrer {
    handle(data) {} // won't be called if there is no referrer
}

```

### Dispatching events
To dispatch an event, simply call ` event` with the name of the event:

```js
burns.event('postLiked');
```

You may also pass in a payload containing data to be transmitted with the event:

```js
burns.event('userSignUp', {
    username: 'ayCarumba',
    email: 'chunkylover53@aol.com',
    referrer: 'burns@cmburns.evil',
});
```

### Using a Default Listener
You may also specify a `defaultListener`. Burns will call this listener's handler (`on{EventName}` if it exists, otherwise `handle`) only if you have not registered any listener for that event. For instance, in the following code snippet, `handle` will be called for `unregisteredEvent` and `onAnotherUnregisteredEvent` will be called for `anotherUnregisteredEvent`

```js
class CatchAll {
    handle() {}
    onAnotherUnregisteredEvent() {}
}
burns.configure({
    defaultListener: CatchAll
});
burns.event('unregisteredEvent');
burns.event('anotherUnregisteredEvent');
```

### Event Names
By default, when looking for specific handlers, Burns will use `on` + the UpperCase form of your event name. Any non-alphanumeric characters will be removed. Thus, `'mrPlow'`, `'mr-plow'`, `'mr plow'`, `'MrPlow'`, and `'mr_plow'` will all be handled by the method `onMrPlow` if you have one defined (otherwise `handle`). However, it is recommended that you follow a fixed convention for naming your events.

## But Node already supports events natively!
Yes, and that's a great thing for handling events at lower levels in your code base (for instance, on open of a file, on read of a stream). When dealing with events at a higher level (such as a new user signing up), Burns allows you to define all your app's events in one central location (the `register` function), and write robust handlers (which you should probably put in a `listeners` directory).

## Asynchronous vs. Synchronous
[Unlike NodeJS' inbuilt events system](https://nodejs.org/api/events.html#events_asynchronous_vs_synchronous), Burns calls your event listeners asynchronously (still in the defined order, though). That is, the functions are queued behind whatever I/O event callbacks that are already in the event queue. This means that you can send a response to your user imediately, while your event gets handled in the background

## Like it?
Star and share, and give me a shout out [on Twitter](http://twitter.com/theshalvah)
