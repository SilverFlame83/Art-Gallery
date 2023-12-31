const mongoose = require('mongoose');

const { DB_CONNECTION_STRING } = require('./index');

module.exports = (app) => {
    return new Promise((resolve, reject)=>{
        mongoose.connect(DB_CONNECTION_STRING, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    
        const db = mongoose.connection;
        db.on('error', (err) => {
            console.error('connection error:',err);
            reject(err)
        });
        db.once('open', function () {
            console.log('Database is ready');
            resolve();
         });

    });
}