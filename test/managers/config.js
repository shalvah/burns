'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const decache = require('decache');

describe('Config manager', function() {

    describe('#set()', function() {

        afterEach(function () {
            decache('../../src/managers/config');
        });

        it('overwrites the default options', function(done) {
            const config = require('../../src/managers/config');
            expect(config.options.defaultHandler).to.equal(null);
            const catchAllHandler = () => {};
            config.set({ defaultHandler: catchAllHandler });

            expect(config.options.defaultHandler).to.equal(catchAllHandler);
            done();
        });
    });

    describe('#get()', function() {

        afterEach(function () {
            decache('../../src/managers/config');
        });

        it('properly retrieves nested options with dot notation', function(done) {
            const config = require('../../src/managers/config');
            config.options = { yay: { nested: { option: true }}};

            expect(config.get('yay.nested.option')).to.equal(true);
            done();
        });
    });

});
