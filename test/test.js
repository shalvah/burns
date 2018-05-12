'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const decache = require('decache');

describe('Burns', function() {

    describe('#configure()', function() {

        afterEach(function () {
            decache('../src/burns');
        });

        it('should overwrite the default options', function(done) {
            const catchAllHandler = () => {}
            const burns = require('../src/burns');
            burns.configure({ defaultHandler: catchAllHandler });

            expect(burns.options.defaultHandler).to.equal(catchAllHandler);
            done();
        });
    });

    describe('#registerEvents()', function() {

        afterEach(function () {
            decache('../src/burns');
        });

        it('should allow for registering events at different places', function(done) {
            const burns = require('../src/burns');
            burns.registerEvents({ eventOne: [] });
            burns.registerEvents({ eventTwo: [] });
            expect(burns.events).to.be.an('object').that.has.all.keys(['eventOne', 'eventTwo']);
            done();
        });

        it('should allow for adding handlers for the same event at different places', function(done) {
            const handlerOne = () => {};
            const handlerTwo = () => {};
            const handlerThree = () => {};
            const handlerFour = () => {};

            const burns = require('../src/burns');
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
            expect(burns.events.eventA.handlers)
                .to.be.an('array')
                .that.has.members([handlerOne, handlerTwo, handlerThree, handlerFour]);
            expect(burns.events.eventB.handlers)
                .to.be.an('array')
                .that.has.members([handlerOne, handlerTwo, handlerThree, handlerFour]);
            done();
        });
    });

    describe('#dispatch()', function() {

        afterEach(function () {
            decache('../src/burns');
        });

        it('should call handlers for an event with the passed payload', function(done) {
            const handler = sinon.spy();

            const burns = require('../src/burns');
            burns.registerEvents({ eventW: handler });
            const eventPayload = { key: 'value' };
            burns.dispatch('eventW', eventPayload);

            setTimeout(() => {
                expect(handler.calledOnce).to.equal(true);
                expect(handler.calledWith(eventPayload)).to.equal(true);
                done();
            }, 0);
        });

        it('should call handlers for an event in the order they were defined', function(done) {
            const handlerOne = sinon.spy();
            const handlerTwo = sinon.spy();
            const handlerThree = sinon.spy();

            require('../src/burns').registerEvents({
                eventX: [handlerOne, handlerTwo, handlerThree]
            }).dispatch('eventX');

            setTimeout(() => {
                expect(handlerOne.calledOnce).to.equal(true);
                expect(handlerTwo.calledAfter(handlerOne)).to.equal(true);
                expect(handlerThree.calledAfter(handlerTwo)).to.equal(true);
                done();
            }, 0);
        });

        it('should not call remaining handlers for an event if one returns false', function(done) {
            const handlerOne = sinon.spy(() => false);
            const handlerTwo = sinon.spy();
            const handlerThree = sinon.spy();

            require('../src/burns').registerEvents({
                eventY: [handlerOne, handlerTwo, handlerThree]
            }).dispatch('eventY');

            setTimeout(() => {
                expect(handlerOne.calledOnce).to.equal(true);
                expect(handlerTwo.notCalled).to.equal(true);
                expect(handlerThree.notCalled).to.equal(true);
                done();
            }, 0);
        });

        it('should call the default handler if event not registered', function(done) {
            const defaultHandler = sinon.spy();

            require('../src/burns').configure({
                defaultHandler
            }).dispatch('im_unregistered');

            setTimeout(() => {
                expect(defaultHandler.calledOnce).to.equal(true);
                done();
            }, 0);
        });

        it('should NOT call the default handler if event registered', function(done) {
            const defaultHandler = sinon.spy();
            const handlerOne = sinon.spy();

            const burns = require('../src/burns');
            burns.configure({
                defaultHandler
            }).registerEvents({
                im_registered: handlerOne
            }).dispatch('im_registered');

            setTimeout(() => {
                expect(handlerOne.calledOnce).to.equal(true);
                expect(defaultHandler.notCalled).to.equal(true);
                done();
            }, 0);
        });
    });
});
