var app = module.parent.exports.app;
var passport = module.parent.exports.passport;
var Employees = require('../models/employees.js');
var Admins = require('../models/admins.js');

var adminAuth = function(req, res, next){
    //authorize role
    if(typeof req.user != "undefined") {
        next();
    } else {
        //Not authorized redirect
        res.redirect('/');
    }
}

app.get('/', function(req, res) {
    res.render('index', { title: 'Employee Wiki' });
});
/*
app.get('/', function(req, res) {
    res.redirect('/login');
});
*/

app.get('/login', function(req, res){
    res.render('login', { title: 'Login'});
});

app.post('/login', passport.authenticate('AdminLogin', { 
    successRedirect: '/panel/employees',
    failureRedirect: '/login',
    failureFlash: true })
);

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/panel/employees', adminAuth, function(req, res){
    var msg = req.flash('message');
    Employees.find({}, function(err, docs){
        res.render('panel', { title: 'Employee Wiki', employees: docs, flashmsg: msg});
    });
});
// creando nuevo empleado
app.get('/panel/employees/new', adminAuth, function(req, res){
    res.render('new', { title: 'Nuevo empleado' });
});
// recibiendo datos de nuevo empleado
app.post('/panel/employees/new', adminAuth, function(req, res) {
    //validando datos
    req.checkBody('nombre', 'First name is required').notEmpty();
    req.checkBody('apellido', 'Last name is required').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty().withMessage('Email is required').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Confirm is required').notEmpty();
    req.checkBody('password', 'Passwords do not match').equals(req.body.password2);

    var errors = req.validationErrors();
    if(errors){
        errors = errors.map(function(a) {return a.msg;});
        res.render('new', { title: 'New', errors: errors, params: req.body });
        return;
    }
    var e = new Employees({
        nombre: req.body.firstName,
	apellido: req.body.lastName,
	email: req.body.email,
	password: req.body.password
    });
    e.save(function(err, doc){
        if(!err){
            res.redirect('/panel/employees');
        }else{
            res.end(err);
	}    
    });
});
// borrando empleado
app.get('/panel/employees/delete/:id', adminAuth, function(req, res){
    Employees.remove({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.redirect('/panel/employees');
        } else {
            res.end(err);
	}
    });
});
// para editar empleado
app.get('/panel/employees/edit/:id', adminAuth, function(req, res){
    Employees.findOne({ _id: req.params.id }, { nombre:"", apellido:"", email:"", password:"", password2:"" }, function(err, doc){
        if(!err){
            res.render('edit', { title: 'Editar empleado', employee: doc});
        } else {
            res.end(err);
        }
    });
});
// recibiendo datos de la edicion del empleado
app.post('/panel/employees/edit/:id', adminAuth, function(req, res){
    req.checkBody('email', 'Invalid email').notEmpty().withMessage('Email is required').isEmail();
    req.checkBody('nombre', 'First name is required').notEmpty();
    req.checkBody('apellido', 'Last name is required').notEmpty();

    var errors = req.validationErrors();
    if(errors) {
        errors = errors.map(function(a) {return a.msg;});
        res.render('edit', { title: 'Editar empleado', errors: errors, employee: req.body });
        return;
    }
    Employees.findOne({ _id: req.params.id }, function(err, doc){
        if(!err){
            doc.nombre = req.body.nombre;
            doc.apellido = req.body.apellido;
            doc.email = req.body.email;
            doc.save(function(err, doc){
                if(!err){
                    res.redirect('/panel/employees');
                } else {
                    res.end(err);    
                }    
            }); 
        } else {
            res.end(err);    
        }
    });
});


// busqueda
app.get('/employee/search/:keyword', function(req, res){
    var keyword = req.params.keyword;
    console.log(keyword);
    Employees.find({ $or:[{nombre:{"$regex": new RegExp(keyword, "i")} },{apellido:{"$regex": new RegExp(keyword, "i")}}]}, function(err, docs){
        res.send(docs);
    });
});
