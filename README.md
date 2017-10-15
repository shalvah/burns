<p align="center"><img src="burns.gif"><p>
<h1 align="center">Burns</h1>

Burns is a zero-dependency NodeJS module that lets you manage your application events without writing spaghetti code

## Getting Started
```
npm install --save burns
```

```js
let burns = require('burns');
```

### Dispatching events
To fire an event, simply call `event` with the name of the event you wish to fire:

```js
burns.event('postLiked');
```

You may also pass in a payload containing data to be transmitted with the event:

```js
burns.event('userSignUp', { username: 'ayCarumba' });
```

## Registering Events
To register your events with Burns, call `Burns#register` with an object with event names as keys and one or more event listeners as value:

```js
burns.register({
    'userFollowed': NotifyUser,
    'userSignUp': [
      SendEmail,
      CongratulateReferrer
    ]
});
```

### Defining Listeners and Handlers
Listeners are ES6 classes or constructor functions (called with `new`) with one or more **handlers**

```js
class CongratulateReferrer {
    handle(data) {
        let email = makeEmail(`Congrats! ${data.user.name} signed up on your recommendation!`);
        sendEmailTo(data.referrer.email, email);
    }
}

function CongratulateReferrer {
  this.handle = function (data) {
    var email = makeEmail(`Congrats! ${data.user.name} signed up on your recommendation!`);
    sendEmailTo(data.referrer.email, email);
  }
}
```

**Handlers** are methods in listener classes. Typically, Burns looks for the `hand;e` method in your class and calls that. However, you can choose to define a handler in a class for specific events, by using `on` + the UpperCased event name. In such a case, `handle` will NOT be called. For instance:


```js
class GenericListener {
    onSpecialEvent(data) {}
    handle(data) {}
}

burns.register({
  'special-event': GenericListener,
  'maggie-talks': GenericListener
})
burns.event('special_event'); // will call onSpecialEvent
burns.event('maggie-talks'); // will call handle
````

You may also specify a `defaultListener`. Burns will call this listener's handlers (`on{EventName}` if it exists, otherwise `handle`) only if you have not registered any listener for that event. For instance, in the following code snippet, `handle` will be called for `unregisteredEvent` and `onAnotherUnregisteredEvent` will be called for `anotherUnregisteredEvent`

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

## Asynchronous? 

## Like it?
Star and share, and give me a shout out [on Twitter](http://twitter.com/theshalvah)
