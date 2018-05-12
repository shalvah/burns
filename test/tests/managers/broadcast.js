'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const decache = require('decache');

const makeMockConfig = require('../../mocks/config');
const makeMockEvents = require('../../mocks/events');
const makeMockBroadcasters = require('../../mocks/broadcasters');

describe('Broadcast manager', function() {

    describe('#broadcast()', function() {

        afterEach(function () {
            decache('../../../src/managers/broadcast');
        });

        it('does not broadcast if broadcaster config option is set to null', function(done) {
            const mockConfig = makeMockConfig({ broadcaster: null });
            const mockEvents = makeMockEvents({ broadcastOn: 'theChannel' });
            const mockBroadcasters = makeMockBroadcasters();

            sinon.spy(mockBroadcasters, 'get');

            const broadcastManager = require('../../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { the: 'payload' });

            expect(mockBroadcasters.get.notCalled).to.equal(true);
            done();
        });

        it('does not broadcast if broadcastOn event config is not set', function(done) {
            const mockConfig = makeMockConfig({ broadcaster: 'log' });
            const mockEvents = makeMockEvents();
            const mockBroadcasters = makeMockBroadcasters();
            sinon.spy(mockBroadcasters, 'get');

            const broadcastManager = require('../../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { the: 'payload' });

            expect(mockBroadcasters.get.notCalled).to.equal(true);
            done();
        });

        it('broadcasts via specified broadcaster if broadcastOn event config set and broadcaster config option is set', function(done) {
            let mockConfig = makeMockConfig({ broadcaster: 'log' });
            const mockEvents = makeMockEvents({ broadcastOn: 'theChannel' });

            let mockLogBroadcaster = {
                broadcast() {
                }
            };
            let mockPusherBroadcaster = {
                broadcast() {
                }
            };
            sinon.spy(mockLogBroadcaster, 'broadcast');
            sinon.spy(mockPusherBroadcaster, 'broadcast');
            const mockBroadcasters = makeMockBroadcasters({
                log: mockLogBroadcaster,
                pusher: mockPusherBroadcaster
            });

            let broadcastManager = require('../../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { the: 'payload' });
            expect(mockLogBroadcaster.broadcast.calledOnce).to.equal(true);
            expect(mockPusherBroadcaster.broadcast.calledOnce).to.equal(false);
            mockLogBroadcaster.broadcast.resetHistory();

            mockConfig = makeMockConfig({ broadcaster: 'pusher' });
            broadcastManager = require('../../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { the: 'payload' });
            expect(mockLogBroadcaster.broadcast.calledOnce).to.equal(false);
            expect(mockPusherBroadcaster.broadcast.calledOnce).to.equal(true);
            done();
        });
    });
});
