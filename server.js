const express = require('express');
const path = require('path');
const tareasRoutes = require('./routes/tareasRoutes');

const app = express();
const puerto = 3000;

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/tasks', tareasRoutes);

app.listen(puerto, () => {
    console.log(`Servidor ejecutándose en http://localhost:${puerto}`);
});