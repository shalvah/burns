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
            let catchAllHandler = () => {};
            require('../src/burns').configure({
                defaultHandler: catchAllHandler
            });
            let burns = require('../src/burns');
            expect(burns.options.defaultHandler).to.equal(catchAllHandler);
        });
    });

    describe('#registerEvents()', function() {

        afterEach(function () {
            decache('../src/burns');
        });

        it('should allow for registering events at different places', function() {
            require('../src/burns').registerEvents({
                eventOne: []
            });
            require('../src/burns').registerEvents({
                eventTwo: []
            });
            let burns = require('../src/burns');
            expect(burns.events).to.be.an('object').that.has.all.keys(['eventOne', 'eventTwo']);
        });

        it('should allow for adding event handlers at different places', function() {
            let handlerOne = () => {};
            let handlerTwo = () => {};
            let handlerThree = () => {};
            let handlerFour = () => {};

            let burns = require('../src/burns');
            burns.registerEvents({
                eventA: [handlerOne, handlerTwo],
                eventB: handlerOne
            });
            burns.registerEvents({
                eventA: [handlerThree],
                eventB: handlerTwo
            });
            burns.registerEvents({
                eventA: handlerFour,
                eventB: [handlerThree, handlerFour]
            });

            expect(burns.events).to.be.an('object').that.has.all.keys('eventA', 'eventB');
            expect(burns.events.eventA)
                .to.be.an('array')
                .that.has.members([handlerOne, handlerTwo, handlerThree, handlerFour]);
            expect(burns.events.eventB)
                .to.be.an('array')
                .that.has.members([handlerOne, handlerTwo, handlerThree, handlerFour]);
        });
    });

    describe('#dispatch()', function() {

        afterEach(function () {
            decache('../src/burns');
        });

        it('should call handlers for an event with the passed payload', function() {

            let handler = (data) => sinon.spy();

            require('../src/burns').registerEvents({
                'event': handler
            });
            const eventPayload = {key: 'value'};
            require('../src/burns').dispatch('event', eventPayload);

            setTimeout(() => {
                expect(handler.calledOnce).to.equal(true);
                expect(handler.calledWith(eventPayload)).to.equal(true);
            }, 0);
        });

        it('should call handlers for an event in the order they were defined', function() {
            let handlerOne = () => sinon.spy();
            let handlerTwo = () => sinon.spy();
            let handlerThree = () => sinon.spy();

            require('../src/burns').registerEvents({
                'event': [handlerOne, handlerTwo, handlerThree]
            });
            require('../src/burns').dispatch('event');

            setTimeout(() => {
                expect(handlerOne.calledOnce).to.equal(true);
                expect(handlerTwo.calledAfter(handlerOne)).to.equal(true);
                expect(handlerThree.calledAfter(handlerTwo)).to.equal(true);
            }, 0);
        });

        it('should not call remaining handlers for an event if one returns false', function() {
            let handlerOne = () => sinon.spy();
            let handlerTwo = () => sinon.spy();
            let handlerThree = () => sinon.spy();

            require('../src/burns').registerEvents({
                'event': [handlerOne, handlerTwo, handlerThree]
            });
            require('../src/burns').dispatch('event');

            setTimeout(() => {
                expect(handlerOne.calledOnce).to.equal(true);
                expect(handlerTwo.notCalled).to.equal(true);
                expect(handlerThree.notCalled).to.equal(true);
            }, 0);
        });

        it('should call the default handler if event not registered', function() {
            let defaultHandler = () => sinon.spy();

            require('../src/burns').configure({
                defaultHandler
            });
            require('../src/burns').dispatch('test-event');

            setTimeout(() => {
                expect(defaultHandler.calledOnce).to.equal(true);
            }, 0);
        });

        it('should NOT call the default handler if event registered', function() {
            let defaultHandler = () => sinon.spy();
            let handlerOne = () => sinon.spy();

            let burns = require('../src/burns');
            burns.configure({
                defaultHandler
            }).registerEvents({
                'test-event': handlerOne
            }).dispatch('test-event');

            setTimeout(() => {
                expect(handlerOne.calledOnce).to.equal(true);
                expect(defaultHandler.notCalled).to.equal(true);
            }, 0);
        });
    });
});
