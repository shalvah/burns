'use strict';

const expect = require('chai').expect;
let sinon = require('sinon');
let decache = require('decache');

describe('Burns', function() {

    describe('#configure()', function() {

        afterEach(function () {
            decache('../index');
        });

        it('should overwrite the global options', function() {
            class CatchAllHandler {};
            require('../index').configure({
                defaultListener: CatchAllHandler
            });
            let burns = require('../index');
            expect(burns.options.defaultListener).to.equal(CatchAllHandler);
        });
    });

    describe('#event()', function() {

        afterEach(function () {
            decache('../index');
        });

        it('should call listeners for an event with the passed payload', function() {

            let handler = sinon.spy();
            class Listener {
                handle(data) { handler(data);}
            }

            require('../index').register({
                'event': Listener
            });
            const eventPayload = {key: 'value'};
            require('../index').event('event', eventPayload);

            setTimeout(() => {
                expect(handler.calledOnce).to.equal(true);
                expect(handler.calledWith(eventPayload)).to.equal(true);
            }, 0);
        });

        it('should call listeners for an event in the order they were defined', function() {
            let handlerOne = sinon.spy();
            let handlerTwo = sinon.spy();
            let handlerThree = sinon.spy();

            class ListenerOne {
                handle() { handlerOne();}
            }

            class ListenerTwo {
                handle() { handlerTwo(); }
            }

            class ListenerThree {
                handle() { handlerThree(); }
            }

            require('../index').register({
                'event': [ListenerOne, ListenerTwo, ListenerThree]
            });
            require('../index').event('event');

            setTimeout(() => {
                expect(handlerOne.calledOnce).to.equal(true);
                expect(handlerTwo.calledAfter(handlerOne)).to.equal(true);
                expect(handlerThree.calledAfter(handlerTwo)).to.equal(true);
            }, 0);
        });

        it('should not call next listeners for an event if one returns false', function() {
            let handlerOne = sinon.spy();
            let handlerTwo = sinon.spy();
            let handlerThree = sinon.spy();

            class ListenerOne {
                handle() { handlerOne(); return false; }
            }

            class ListenerTwo {
                handle() { handlerTwo(); }
            }

            class ListenerThree {
                handle() { handlerThree(); }
            }

            require('../index').register({
                'event': [ListenerOne, ListenerTwo, ListenerThree]
            });
            require('../index').event('event');

            setTimeout(() => {
                expect(handlerOne.calledOnce).to.equal(true);
                expect(handlerTwo.notCalled).to.equal(true);
                expect(handlerThree.notCalled).to.equal(true);
            }, 0);
        });

        it('should call on{EventName}() rather than handle() where present', function() {
            let handlerOne = sinon.spy();
            let handlerTwo = sinon.spy();

            class Listener {
                onTestEvent() { handlerOne(); }
                handle() { handlerTwo(); }
            }

            require('../index').register({
                'test-event': Listener
            });
            require('../index').event('test-event');

            setTimeout(() => {
                expect(handlerOne.calledOnce).to.equal(true);
                expect(handlerTwo.notCalled).to.equal(true);
            }, 0);
        });

        it('should call the default listener if event not registered', function() {
            let defaultHandler = sinon.spy();

            class DefaultListener {
                handle() { defaultHandler(); }
            }

            require('../index').configure({
                defaultListener: DefaultListener
            });
            require('../index').event('test-event');

            setTimeout(() => {
                expect(defaultHandler.calledOnce).to.equal(true);
            }, 0);
        });

        it('should NOT call the default listener if event registered', function() {
            let defaultHandler = sinon.spy();
            let handlerOne = sinon.spy();

            class DefaultListener {
                handle() { defaultHandler(); }
            }

            class ListenerOne {
                handle() { handlerOne(); }
            }

            let burns = require('../index');
            burns.configure({
                defaultListener: DefaultListener
            }).register({
                'test-event': ListenerOne
            }).event('test-event');

            setTimeout(() => {
                expect(handlerOne.calledOnce).to.equal(true);
                expect(defaultHandler.notCalled).to.equal(true);
            }, 0);
        });
    });
});