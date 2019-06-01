const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);
console.log('Express GraphQL Server Now Running On localhost:3000/graphql');