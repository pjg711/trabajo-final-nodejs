var app = module.parent.exports.app;
var passport = module.parent.exports.passport;
var Employees = require('../models/employees.js');
var Adminsl = require('../models/admins.js');

var adminAuth = function(req, res, next){
    //authorize role
    if(typeof req.user != "undefined") {
        next();
    } else {
        //Not authorized redirect
        res.redirect('/');
    }
}

app.use(function(req, res, next){
    res.locals.user = req.user;
    res.locals.path = req.path.split("/")[1]
    next();
});

app.get('/', function(req, res) {
    res.render('index', { title: 'Employee Wiki' });
});

app.get('/admin', function(req, res){
    res.render('login', { title: 'Login'});
});

app.post('/admin', passport.authenticate('AdminLogin', { 
    successRedirect: '/panel/employees',
    failureRedirect: '/admin',
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
    req.checkBody('nombre', 'El nombre es requerido').notEmpty();
    req.checkBody('apellido', 'El apellido es requerido').notEmpty();
    req.checkBody('email', 'El email es erróneo').notEmpty().withMessage('El email es requerido').isEmail();
    req.checkBody('password', 'La contraseña es requerida').notEmpty();
    req.checkBody('password2', 'La confirmación de la contraseña es requerida').notEmpty();
    req.checkBody('password', 'Las contraseñas no coinciden').equals(req.body.password2);
    var errores = req.validationErrors();
    if(errores){
        errores = errores.map(function(a) {return a.msg;});
        res.render('new', { 
            title: 'Nuevo empleado', 
            errores: errores, 
            params: req.body 
        });
        return;
    }
    var e = new Employees({
        nombre: req.body.nombre,
	apellido: req.body.apellido,
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
    Employees.findOne({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.render('edit', { title: 'Editar empleado', employee: doc});
        } else {
            res.end(err);
        }
    });
});
// recibiendo datos de la edicion del empleado
app.post('/panel/employees/edit/:id', adminAuth, function(req, res){
    req.checkBody('email', 'El email es erróneo').notEmpty().withMessage('El email es requerido').isEmail();
    req.checkBody('nombre', 'El nombre es requerido').notEmpty();
    req.checkBody('apellido', 'El apellido es requerido').notEmpty();
    var errores = req.validationErrors();
    if(errores) {
        errores = errores.map(function(a) {return a.msg;});
        res.render('edit', { 
            title: 'Editar empleado', 
            errores: errores, 
            employee: req.body 
        });
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
    Employees.find({$or:[{nombre:{"$regex": new RegExp(keyword, "i")}},{apellido:{"$regex": new RegExp(keyword, "i")}}]}, function(err, docs){
        res.send(docs);
    });
});