var Employee = require('../models/employees.js');
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/EmployeeWiki');

describe('Employees', function() {
        it('new employee',function () {
                var p = new Employee({ nombre: "Cristian", apellido: "Cortez" });
                p.save(function(err, doc){
                        console.log(err, doc);
                        done();
                });
        });
        it('post form',function () {

        });
});


