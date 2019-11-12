require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const massive = require('massive');
const c = require('./controller')

const app = express();

app.use(express.json());

let { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

//endpoints
app.post('/auth/signup', c.signup)
app.post('/auth/login', c.login)
app.get('/auth/logout', c.logout)

app.get('/auth/user', c.user)

massive(CONNECTION_STRING).then(db => {
  app.set('db', db);
  app.listen(SERVER_PORT, () => {
    console.log(`Listening on port: ${SERVER_PORT}`);
  });
});

