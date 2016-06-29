var Browser = require('zombie');
var assert = require('assert');

Browser.localhost('127.0.0.1',3200);
var browser = new Browser();
describe('Admin', function(){
    before(function(done){
        browser.visit('/admin', done);
    });
    describe('Logeo de admin', function(){
        before(function(done){
            browser
                .fill('email', 'admin@admin.com')
                .fill('password', '123456')
                .pressButton('Login', done);
        });
        it('logeo', function() {
            browser.assert.success();
        });
        it('listado de empleados', function() {
            browser.assert.text('title', 'Employee Wiki');
        });
    });    
});