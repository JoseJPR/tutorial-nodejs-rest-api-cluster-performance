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

// Show console message with status clusters.
const updateInfo = (clusterId) => {
  for (const id in cluster.workers) {
    let statusCluster = 'WAITING';
    if (cluster.workers[id].process.pid === clusterId) statusCluster = 'WORKING';
    stream.write(`CLUSTER PID > [${cluster.workers[id].process.pid}] | STATUS > ${statusCluster} | DATE > ${Date.now()}`);
  }
};

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

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', () => {
      updateInfo(cluster.workers[id].process.pid);
    });
  }
} else {
  http.createServer((req, res) => {
    if (req.method === 'GET') {
      res.writeHead(200);
      res.end('GET hello world\n');
      process.send({ cmd: 'Method GET' });
    } else if (req.method === 'POST') {
      res.writeHead(200);
      res.end('POST hello world\n');
      process.send({ cmd: 'Method POST' });
    } else {
      res.writeHead(405);
      res.end('Method Not Allowed');
      process.send({ cmd: 'Method Not Allowed' });
    }
  }).listen(process.env.PORT);
  console.log(`Worker ${process.pid} Start HTTP Server PORT ${process.env.PORT}`);
}