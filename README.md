Trabajo final del curso NodeJS año 2016
=======================================

Alta, Baja y Modificaciones de Empleados usando NodeJS, Express, MongoDB y Jade.
Busqueda de empleados
Listado de empleados

Instalación
-----------

```
git clone https://github.com/pjg711/trabajo-final-nodejs.git
cd trabajo-final-nodejs
npm install
bower install

# iniciar servidor 
npm start

# abrir en un navegador
http://localhost:3200
```

Testing
-------
```
npm test

  Admin
    Logeo de admin
      ✓ logeo
      ✓ listado de empleados

  Empleados
    ✓ Nuevo Empleado (39ms)
    ✓ Borrar empleado

  Prueba Login Admin y agregar nuevo empleado
    Empleados
      Logeo como admin
        ✓ logeo
        ✓ crear nuevo empleado (671ms)


  6 passing (3s)
```

Login
-----

![Alt text](readme/login.png "login")

Inicio
------

![Alt text](readme/inicio.png "Pantalla de inicio")

Presentación de la busqueda de empleados
----------------------------------------

![Alt text](readme/busqueda.png "Presentacion de fichas en la busqueda de empleados")

Panel
-----

![Alt text](readme/panel.png "Listado de empleados")
