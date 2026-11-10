const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '..', 'database.sqlite'));
db.serialize();

db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

const obtenerTodas = (callback) => {
    db.all('SELECT * FROM tasks', [], callback);
};

const crearTarea = (title, callback) => {
    db.run('INSERT INTO tasks (title) VALUES (?)', [title], function (error) {
        callback(error, this ? this.lastID : null);
    });
};

const actualizarTarea = (id, title, completed, callback) => {
    db.run('UPDATE tasks SET title = ?, completed = ? WHERE id = ?',
        [title, completed, id], function (error) {
            callback(error, this ? this.changes : 0);
        });
};

const eliminarTarea = (id, callback) => {
    db.run('DELETE FROM tasks WHERE id = ?', [id], function (error) {
        callback(error, this ? this.changes : 0);
    });
};

module.exports = { obtenerTodas, crearTarea, actualizarTarea, eliminarTarea };