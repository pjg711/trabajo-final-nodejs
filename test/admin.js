var Browser = require('zombie');
var assert = require('assert');

Browser.localhost('localhost', 3200);

describe('Admin visits login page', function() {
    var browser = new Browser();
    before(function(done) {
        browser.visit('/admin', done);
    });
    describe('Submits form', function() {
        before(function(done) {
            browser
                .fill('email', 'admin@admin.com')
                .fill('password', '123456')
                .pressButton('Login', done);
        });
        it('Should be successful', function() {
            browser.assert.success();
        });
        it('Should see employees panel page', function() {
            browser.assert.text('title', 'List');
        });
    });
});
