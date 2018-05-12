'use strict';

const expect = require('chai').expect;
const decache = require('decache');

describe('Config repository', function() {

    describe('#set()', function() {

        afterEach(function () {
            decache('../../src/repositories/config');
        });

        it('overwrites the default options', function(done) {
            const config = require('../../src/repositories/config');
            expect(config.options.defaultHandler).to.equal(null);
            const catchAllHandler = () => {};
            config.set({ defaultHandler: catchAllHandler });

            expect(config.options.defaultHandler).to.equal(catchAllHandler);
            done();
        });
    });

    describe('#get()', function() {

        afterEach(function () {
            decache('../../src/repositories/config');
        });

        it('properly retrieves nested options with dot notation', function(done) {
            const config = require('../../src/repositories/config');
            config.options = { yay: { nested: { option: true }}};

            expect(config.get('yay.nested')).to.be.an('object').that.has.all.keys('option');
            expect(config.get('yay.nested').option).to.equal(true);
            expect(config.get('yay.nested.option')).to.equal(true);
            done();
        });
    });

});
