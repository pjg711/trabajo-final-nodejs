var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var employeeSchema = new Schema({
    nombre: String,
    apellido: String,
    email: String,
    password: String
});

employeeSchema.pre("save", function(next) {
    if(this.isModified('password'))
        this.password = crypto.createHash('md5').update(this.password).digest("hex");
    next();
});
employeeSchema.method('authenticate', function(password){
    return crypto.createHash('md5').update(password).digest("hex") === this.password;
});

var employeeModel = mongoose.model('employees', employeeSchema);
module.exports = employeeModel;