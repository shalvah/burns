'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const decache = require('decache');

describe('Burns', function() {

    describe('#dispatch()', function() {

        beforeEach(function () {
            sinon.spy(console, 'log');
        });

        afterEach(function () {
            console.log.restore();
            decache('../../src/burns');
        });

        it('calls handlers for an event with the passed payload', function(done) {
            const handler = sinon.spy();

            const burns = require('../../src/burns');
            burns.registerEvents({ eventW: handler });
            const eventPayload = { key: 'value' };
            burns.dispatch('eventW', eventPayload);

            setTimeout(() => {
                expect(handler.calledOnce).to.equal(true);
                expect(handler.calledWith(eventPayload)).to.equal(true);
                done();
            }, 0);
        });

        it('passes an empty payload to the handler if none sent at dispatch', function(done) {
            const handler = sinon.spy();

            const burns = require('../../src/burns');
            burns.registerEvents({ eventZ: handler });
            burns.dispatch('eventZ');

            setTimeout(() => {
                expect(handler.calledOnce).to.equal(true);
                expect(handler.getCall(0).args[0]).to.deep.equal({});
                done();
            }, 0);
        });

        it('calls handlers for an event in the order they were defined', function(done) {
            const handlerOne = sinon.spy();
            const handlerTwo = sinon.spy();
            const handlerThree = sinon.spy();

            require('../../src/burns').registerEvents({
                eventX: [handlerOne, handlerTwo, handlerThree]
            }).dispatch('eventX');

            setTimeout(() => {
                expect(handlerOne.calledOnce).to.equal(true);
                expect(handlerTwo.calledAfter(handlerOne)).to.equal(true);
                expect(handlerThree.calledAfter(handlerTwo)).to.equal(true);
                done();
            }, 0);
        });

        it('does NOT call remaining handlers for an event if one returns false', function(done) {
            const handlerOne = sinon.spy(() => false);
            const handlerTwo = sinon.spy();
            const handlerThree = sinon.spy();

            require('../../src/burns').registerEvents({
                eventY: [handlerOne, handlerTwo, handlerThree]
            }).dispatch('eventY');

            setTimeout(() => {
                expect(handlerOne.calledOnce).to.equal(true);
                expect(handlerTwo.notCalled).to.equal(true);
                expect(handlerThree.notCalled).to.equal(true);
                done();
            }, 0);
        });

        it('calls the default handler if event not registered', function(done) {
            const defaultHandler = sinon.spy();

            require('../../src/burns').configure({
                defaultHandler
            }).dispatch('im_unregistered');

            setTimeout(() => {
                expect(defaultHandler.calledOnce).to.equal(true);
                done();
            }, 0);
        });

        it('does NOT call the default handler if event registered', function(done) {
            const defaultHandler = sinon.spy();
            const handlerOne = sinon.spy();

            const burns = require('../../src/burns');
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

        it('broadcasts the event if broadcastOn set', function(done) {
            const handler = sinon.spy();

            const burns = require('../../src/burns');
            burns.configure({
                broadcaster: 'log'
            }).registerEvents({
                theEvent: {
                    handlers: [ handler ],
                    broadcastOn: 'theChannel'
                }
            }).dispatch('theEvent');

            expect(console.log.calledOnce).to.equal(true);
            const logOutput = console.log.getCall(0).args[0];
            expect(logOutput).to.contain('theChannel');
            expect(logOutput).to.contain('theEvent');

            setTimeout(() => {
                expect(handler.calledOnce).to.equal(true);
                done();
            }, 0);
        });
    });
});
