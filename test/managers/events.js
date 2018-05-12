'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const decache = require('decache');

describe('Events manager', function () {

    describe('#addEvents()', function () {

        afterEach(function () {
            decache('../../src/managers/events');
        });

        it('allows for registering events at different places', function (done) {
            const eventsManager = require('../../src/managers/events');
            eventsManager.addEvents({eventOne: []});
            eventsManager.addEvents({eventTwo: []});
            expect(eventsManager.events).to.be.an('object').that.has.all.keys(['eventOne', 'eventTwo']);
            done();
        });

        it('allows for adding handlers for the same event at different places', function (done) {
            const handlerOne = () => {
            };
            const handlerTwo = () => {
            };
            const handlerThree = () => {
            };
            const handlerFour = () => {
            };

            const eventsManager = require('../../src/managers/events');
            eventsManager.addEvents({
                eventA: [handlerOne, handlerTwo],
                eventB: handlerOne
            });
            eventsManager.addEvents({
                eventA: [handlerThree],
                eventB: handlerTwo
            });
            eventsManager.addEvents({
                eventA: handlerFour,
                eventB: [handlerThree, handlerFour]
            });

            expect(eventsManager.events).to.be.an('object').that.has.all.keys('eventA', 'eventB');
            expect(eventsManager.events.eventA.handlers)
                .to.be.an('array')
                .that.has.members([handlerOne, handlerTwo, handlerThree, handlerFour]);
            expect(eventsManager.events.eventB.handlers)
                .to.be.an('array')
                .that.has.members([handlerOne, handlerTwo, handlerThree, handlerFour]);
            done();
        });
    });

});
