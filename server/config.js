 
/* 
PUERTO
  */

process.env.PORT = process.env.PORT || 3000;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  vencimiento del token
// ============================
/* segundos * minutos * horas * dias */

process.env.VAR_CADUCIDAD = '48h'

// ============================
//  Semilla
// ============================

process.env.SEED = process.env.SEED || 'semilla-de-desarrollo'


// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}



process.env.URLDB = urlDB;

// ============================
// Google Client ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '905863319791-klqkb77oos1dionfsn7m51loash2pc6e.apps.googleusercontent.com'