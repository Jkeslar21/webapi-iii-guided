const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// middleware
function bouncer(req, res, next) {
  res.status(404).json('You barely touched anything and F*CKED it all up!')
}

function teamNamer(req, res, next) {
  req.team = 'WEB XVII' // middleware can modify the request
  next(); // go ahead and execute the next middleware/route handler
}

// My Attempt
function LoR(req, res, next) {
  const date = new Date();
  const sec = date.getSeconds();
  if (sec % 3 === 0) {
    res.status(403).json('you shall not pass!')
  } else {
    next();
  }
}

// Instructor's Solution
function moodyGateKeeper(req, res, next) {
  const seconds = new Date().getSeconds();
  if (seconds % 3 === 0) {
    res.status(403).send('You shall not pass!')
  } else {
    next();
  }
}

// server.use(bouncer)
server.use(express.json());
server.use(helmet());
server.use(teamNamer);
// server.use(moodyGateKeeper);

// routing
server.use('/api/hubs', hubsRouter);

// route handlers ARE middleware
server.get('/', restricted, (req, res, next) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.team} to the Jungle</p>
    `);
});

function restricted(req, res, next) {
  const password = req.headers.password;
  if (password === 'mellon') {
    next();
  } else {
    res.status(401).send('You shall not pass Balrog!');
  }
}

// Ternary
function restricted(req, res, next) {
  const password = req.headers.password;
  password === 'mellon'
  ? next()
  : res.status(401).send('You shall not pass Balrog!'); 
}


module.exports = server;
