'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const decache = require('decache');

describe('Burns', function() {

    describe('#configure()', function() {

        afterEach(function () {
            decache('../src/burns');
        });

        it('should overwrite the default options', function() {
            class CatchAllHandler {}
            require('../src/burns').configure({
                defaultListener: CatchAllHandler
            });
            let burns = require('../src/burns');
            expect(burns.options.defaultListener).to.equal(CatchAllHandler);
        });
    });

    describe('#register()', function() {

        afterEach(function () {
            decache('../src/burns');
        });

        it('should allow for registering events at different places', function() {
            require('../src/burns').register({
                eventOne: []
            });
            require('../src/burns').register({
                eventTwo: []
            });
            let burns = require('../src/burns');
            expect(burns.events).to.be.an('object').that.has.all.keys(['eventOne', 'eventTwo']);
        });

        it('should allow for adding event listeners at different places', function() {
            class ListenerOne {
                handle() {}
            }

            class ListenerTwo {
                handle() {}
            }

            class ListenerThree {
                handle() {}
            }

            class ListenerFour {
                handle() {}
            }

            let burns = require('../src/burns');
            burns.register({
                eventA: [ListenerOne, ListenerTwo],
                eventB: ListenerOne
            });
            burns.register({
                eventA: [ListenerThree],
                eventB: ListenerTwo
            });
            burns.register({
                eventA: ListenerFour,
                eventB: [ListenerThree, ListenerFour]
            });

            expect(burns.events).to.be.an('object').that.has.all.keys('eventA', 'eventB');
            expect(burns.events.eventA)
                .to.be.an('array')
                .that.has.members([ListenerOne, ListenerTwo, ListenerThree, ListenerFour]);
            expect(burns.events.eventB)
                .to.be.an('array')
                .that.has.members([ListenerOne, ListenerTwo, ListenerThree, ListenerFour]);
        });
    });

    describe('#event()', function() {

        afterEach(function () {
            decache('../src/burns');
        });

        it('should call listeners for an event with the passed payload', function() {

            let handler = sinon.spy();
            class Listener {
                handle(data) { handler(data);}
            }

            require('../src/burns').register({
                'event': Listener
            });
            const eventPayload = {key: 'value'};
            require('../src/burns').event('event', eventPayload);

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

            require('../src/burns').register({
                'event': [ListenerOne, ListenerTwo, ListenerThree]
            });
            require('../src/burns').event('event');

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

            require('../src/burns').register({
                'event': [ListenerOne, ListenerTwo, ListenerThree]
            });
            require('../src/burns').event('event');

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

            require('../src/burns').register({
                'test-event': Listener
            });
            require('../src/burns').event('test-event');

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

            require('../src/burns').configure({
                defaultListener: DefaultListener
            });
            require('../src/burns').event('test-event');

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

            let burns = require('../src/burns');
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
