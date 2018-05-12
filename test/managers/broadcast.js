'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const decache = require('decache');

const makeMockConfig = require('../mocks/config');
const makeMockEvents = require('../mocks/events');

describe('Broadcast manager', function() {

    describe('#broadcast()', function() {

        afterEach(function () {
            decache('../../src/managers/broadcast');
        });

        it('does not broadcast if broadcaster config option is set to null', function(done) {
            const mockConfig = makeMockConfig({ broadcaster: null });
            const mockEvents = makeMockEvents({ broadcastOn: 'theChannel' });

            let broadcasterSpy = sinon.spy();
            const mockBroadcasters = {
                get (driver, config) {
                    broadcasterSpy();
                }
            };

            const broadcastManager = require('../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { the: 'payload' });

            expect(broadcasterSpy.notCalled).to.equal(true);
            done();
        });

        it('does not broadcast if broadcastOn event config is not set', function(done) {
            const mockConfig = makeMockConfig({ broadcaster: 'log' });
            const mockEvents = makeMockEvents();

            let broadcasterSpy = sinon.spy();
            const mockBroadcasters = {
                get (driver, config) {
                    broadcasterSpy();
                }
            };

            const broadcastManager = require('../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { the: 'payload' });

            expect(broadcasterSpy.notCalled).to.equal(true);
            done();
        });

        it('broadcasts via log if broadcastOn event config set and broadcaster config option is log', function(done) {
            const mockConfig = makeMockConfig({ broadcaster: 'log' });
            const mockEvents = makeMockEvents({ broadcastOn: 'theChannel' });

            let mockLogBroadcaster = {
                broadcast() {
                }
            };
            sinon.spy(mockLogBroadcaster, 'broadcast');

            const mockBroadcasters = {
                get (driver, config) {
                    return mockLogBroadcaster;
                }
            };

            const broadcastManager = require('../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { the: 'payload' });

            expect(mockLogBroadcaster.broadcast.calledOnce).to.equal(true);
            done();
        });
    });
});
