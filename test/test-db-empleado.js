var Employee = require('../models/employees.js');
var mongoose = require('mongoose');

describe('Empleados', function() {
    before(function(done){
        mongoose.connect('mongodb://127.0.0.1/EmployeeWiki', done);
    });
    it('Nuevo Empleado',function(done) {
        var p = new Employee({ nombre: "Pablo", apellido: "Garcia" });
        p.save(function(err, doc){
            done();
        });
    });
    it('Borrar empleado',function(done) {
        var p = new Employee({ nombre: "Pablo", apellido: "Garcia" });
        Employee.remove({ _id: p.id });
        done();
    });
});


