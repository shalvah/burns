'use strict';

const expect = require('chai').expect;
const decache = require('decache');

describe('Events repository', function () {

    describe('#add()', function () {

        afterEach(function () {
            decache('../../../src/repositories/events');
        });

        it('allows for registering events at different places', function (done) {
            const eventsRepository = require('../../../src/repositories/events');
            eventsRepository.add({eventOne: []});
            eventsRepository.add({eventTwo: []});
            expect(eventsRepository.events).to.be.an('object').that.has.all.keys(['eventOne', 'eventTwo']);
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

            const eventsRepository = require('../../../src/repositories/events');
            eventsRepository.add({
                eventA: [handlerOne, handlerTwo],
                eventB: handlerOne
            });
            eventsRepository.add({
                eventA: [handlerThree],
                eventB: handlerTwo
            });
            eventsRepository.add({
                eventA: handlerFour,
                eventB: [handlerThree, handlerFour]
            });

            expect(eventsRepository.events).to.be.an('object').that.has.all.keys('eventA', 'eventB');
            expect(eventsRepository.events.eventA.handlers)
                .to.be.an('array')
                .that.has.members([handlerOne, handlerTwo, handlerThree, handlerFour]);
            expect(eventsRepository.events.eventB.handlers)
                .to.be.an('array')
                .that.has.members([handlerOne, handlerTwo, handlerThree, handlerFour]);
            done();
        });
    });

    describe('#handlers()', function () {

        afterEach(function () {
            decache('../../../src/repositories/events');
        });

        it('returns an empty array when event not registered or no handlers registered for event', function (done) {
            const eventsRepository = require('../../../src/repositories/events');
            expect(eventsRepository.handlers('apocalypse'))
                .to.be.an('array').that.has.length(0);

            eventsRepository.add({ apocalypse: []});
            expect(eventsRepository.handlers('apocalypse'))
                .to.be.an('array').that.has.length(0);
            done();
        });

        it('returns all registered handlers', function (done) {
            const handlerOne = () => {
            };
            const handlerTwo = () => {
            };
            const handlerThree = () => {
            };

            const eventsRepository = require('../../../src/repositories/events');
            eventsRepository.add({
                myWedding: [handlerOne, handlerTwo],
            });
            eventsRepository.add({
                myWedding: handlerThree
            });
            eventsRepository.add({
                myBirthday: {
                    handlers: [handlerOne, handlerTwo, handlerThree]
                },
            });

            expect(eventsRepository.handlers('myWedding'))
                .to.be.an('array')
                .that.has.members([handlerOne, handlerTwo, handlerThree]);
            expect(eventsRepository.handlers('myBirthday'))
                .to.be.an('array')
                .that.has.members([handlerOne, handlerTwo, handlerThree]);
            done();
        });
    });

    describe('#broadcastConfig()', function () {

        afterEach(function () {
            decache('../../../src/repositories/events');
        });

        it('falls back to default options when event not registered or no broadcast options set for event', function (done) {
            const eventsRepository = require('../../../src/repositories/events');
            expect(eventsRepository.broadcastConfig('apocalypse'))
                .to.deep.include({ broadcastOn: null, broadcastIf: true});

            eventsRepository.add({ apocalypse: [] });
            expect(eventsRepository.broadcastConfig('apocalypse'))
                .to.deep.include({ broadcastOn: null, broadcastIf: true});

            eventsRepository.add({ apocalypse: { broadcastOn: '2012' }});
            expect(eventsRepository.broadcastConfig('apocalypse'))
                .to.deep.include({ broadcastOn: '2012', broadcastIf: true});

            done();
        });

        it('returns broadcast options for an event', function (done) {
            const eventsRepository = require('../../../src/repositories/events');
            const dummy = () => {};
            eventsRepository.add({ apocalypse: { broadcastOn: '2012', broadcastIf: dummy }});

            expect(eventsRepository.broadcastConfig('apocalypse'))
                .to.deep.include({ broadcastOn: '2012', broadcastIf: dummy });
            done();
        });
    });

});
