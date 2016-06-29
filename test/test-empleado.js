var Browser = require('zombie');
var assert = require('assert');

Browser.localhost('127.0.0.1', 3200);
describe('Prueba Login Admin y agregar nuevo empleado', function(){
    describe('Empleados', function(){
        var browser = new Browser();
        before(function(done){
            browser.visit('/admin',done);
        });
        describe('Logeo como admin', function(){
            before(function(done){
                browser.fill('email', 'admin@admin.com').fill('password', '123456').pressButton('Login', done);
            });
            it('logeo', function() {
                browser.assert.success();
            });            
            it('crear nuevo empleado', function(done){
                browser.visit('/panel/employees/new', function(){
                    browser.fill('nombre','Pablo')
                        .fill('apellido', 'Garcia')
                        .fill('email', 'pablo.ju.garcia@gmail.com')
                        .fill('password', '123456')
                        .fill('password2', '123456')
                        .pressButton('Save', function(){
                            if(browser.location.pathname == '/panel/employees'){
                                done();
                            }else{
                                throw new Error('Fallo en alta de empleado');
                            }
                        });
                });
            });
        });
    });
});