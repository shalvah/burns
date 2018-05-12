'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const decache = require('decache');

describe('Log broadcaster', function() {

    describe('#broadcast()', function() {

        let logger;

        beforeEach(function () {
            logger = sinon.spy(console, 'log');
        });

        afterEach(function () {
            console.log.restore();
            decache('../../../src/broadcasters/log');
        });

        it('logs event name, channel and payload to console', function(done) {
            const logBroadcaster = require('../../../src/broadcasters/log')({});
            logBroadcaster.broadcast('theChannel', 'theEvent', { the: 'payload' });

            expect(logger.calledOnce).to.equal(true);
            const logOutput = logger.getCall(0).args[0];
            expect(logOutput).to.contain('theChannel');
            expect(logOutput).to.contain('theEvent');
            expect(logOutput).to.contain(JSON.stringify({ the: 'payload' }, null, 4));

            done();
        });
    });
});
