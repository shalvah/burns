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

            sinon.spy(mockBroadcasters, 'createBroadcaster');

            const broadcastManager = require('../../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { the: 'payload' });

            expect(mockBroadcasters.createBroadcaster.notCalled).to.equal(true);
            done();
        });

        it('does not broadcast if broadcastOn event config is not set', function(done) {
            const mockConfig = makeMockConfig({ broadcaster: 'log' });
            const mockEvents = makeMockEvents();
            const mockBroadcasters = makeMockBroadcasters();
            sinon.spy(mockBroadcasters, 'createBroadcaster');

            const broadcastManager = require('../../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { the: 'payload' });

            expect(mockBroadcasters.createBroadcaster.notCalled).to.equal(true);
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

        it('supports broadcastOn as a function', function(done) {
            let mockConfig = makeMockConfig({ broadcaster: 'log' });
            const mockEvents = makeMockEvents({
                broadcastOn: payload => payload.key + '-theChannel'
            });

            let mockLogBroadcaster = {
                broadcast() {
                }
            };
            sinon.spy(mockLogBroadcaster, 'broadcast');
            const mockBroadcasters = makeMockBroadcasters({
                log: mockLogBroadcaster
            });

            let broadcastManager = require('../../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { key: 'value' });
            expect(mockLogBroadcaster.broadcast.calledOnce).to.equal(true);
            expect(mockLogBroadcaster.broadcast.getCall(0).args[0]).to.equal('value-theChannel');
            mockLogBroadcaster.broadcast.resetHistory();
            done();
        });

        it('does not broadcast if broadcastIf event config is false', function(done) {
            const mockConfig = makeMockConfig({ broadcaster: 'log', broadcastIf: 1 === 0 });
            const mockEvents = makeMockEvents();
            const mockBroadcasters = makeMockBroadcasters();
            sinon.spy(mockBroadcasters, 'createBroadcaster');

            const broadcastManager = require('../../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { the: 'payload' });

            expect(mockBroadcasters.createBroadcaster.notCalled).to.equal(true);
            done();
        });

        it('does not broadcast if broadcastIf event config is a function returning false or resolving to false', function(done) {
            const mockEvents = makeMockEvents();
            const mockBroadcasters = makeMockBroadcasters();
            sinon.spy(mockBroadcasters, 'createBroadcaster');
            let mockConfig = makeMockConfig({ broadcaster: 'log', broadcastIf: (payload) => payload.the === 'not payload' });

            let broadcastManager = require('../../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { the: 'payload' });

            expect(mockBroadcasters.createBroadcaster.notCalled).to.equal(true);

            mockConfig = makeMockConfig({ broadcaster: 'log', broadcastIf: () => Promise.resolve(false) });
            broadcastManager = require('../../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { the: 'payload' });
            expect(mockBroadcasters.createBroadcaster.notCalled).to.equal(true);
            done();
        });

        it('broadcasts if broadcastIf event config is true', function(done) {
            const mockConfig = makeMockConfig({ broadcaster: 'log', broadcastIf: true });
            const mockEvents = makeMockEvents({ broadcastOn: 'theChannel' });
            const mockBroadcasters = makeMockBroadcasters();
            sinon.spy(mockBroadcasters, 'createBroadcaster');

            const broadcastManager = require('../../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { the: 'payload' });
            expect(mockBroadcasters.createBroadcaster.calledOnce).to.equal(true);
            mockBroadcasters.createBroadcaster.resetHistory();
            done();
        });

        it('broadcasts if broadcastIf event config is function returning true or resolving to true', function(done) {
            const mockEvents = makeMockEvents({ broadcastOn: 'theChannel' });
            const mockBroadcasters = makeMockBroadcasters();
            sinon.spy(mockBroadcasters, 'createBroadcaster');

            let mockConfig = makeMockConfig({ broadcaster: 'log', broadcastIf: (payload) => payload.the === 'payload' });

            let broadcastManager = require('../../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { the: 'payload' });
            expect(mockBroadcasters.createBroadcaster.calledOnce).to.equal(true);
            mockBroadcasters.createBroadcaster.resetHistory();


            mockConfig = makeMockConfig({ broadcaster: 'log', broadcastIf: () => Promise.resolve(true) });
            broadcastManager = require('../../../src/managers/broadcast')(mockConfig, mockEvents, mockBroadcasters);
            broadcastManager.broadcast('theEvent', { the: 'payload' });
            expect(mockBroadcasters.createBroadcaster.calledOnce).to.equal(true);
            mockBroadcasters.createBroadcaster.resetHistory();
            done();
        });
    });
});
