/**
 * Description: Control cluster waiting or working any task.
 */

/** Import generics dependences */
import http from 'http';
import dotenv from 'dotenv';

// Init dotenv for load all environments.
dotenv.config();

http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200);
    res.end('GET hello world\n');
  } else if (req.method === 'POST') {
    res.writeHead(200);
    res.end('POST hello world\n');
  } else {
    res.writeHead(405);
    res.end('Method Not Allowed');
  }
}).listen(process.env.PORT);
console.log(`Worker ${process.pid} Start HTTP Server PORT ${process.env.PORT}`);