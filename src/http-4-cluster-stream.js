/**
 * Description: Control cluster waiting or working any task.
 */

/** Import generics dependences */
import cluster from 'cluster';
import http from 'http';
import os from 'os';
import fs from 'fs';
import dotenv from 'dotenv';

// Init dotenv for load all environments.
dotenv.config();

// Get CPUs number.
const cpus = os.cpus();

// Create stream.
const stream = fs.createWriteStream('./output');

if (cluster.isMaster) {
  // Clear terminal.
  process.stdout.write('\x1Bc');
  // Show cpus number.
  console.log(`CPUs number: ${cpus.length} | Cluster Master PID: ${process.pid} is running`);
  // Iterate on cpus array and active cluster type fork for each cpu.
  cpus.forEach(() => {
    cluster.fork();
  });

  // Active listener "listening" for get when cluster is actived.
  cluster.on('listening', (worker, address) => {
    console.log(`CLUSTER PID > [${worker.process.pid}] | STATUS > LISTENING WITH PORT > ${address.port}`);
  });
} else {
  http.createServer((req, res) => {

    stream.write(`PROCCESS PID > [${process.pid}] | STATUS > WORKING | DATE > ${Date.now()}`);

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
}