/**
 * Import main dependencies.
 */
import autocannon from 'autocannon';

// Define Autocannon Intances with custom config.
const instance = autocannon({
  url: 'http://localhost:3000',
  connections: 10, // The number of concurrent connections to use. default: 10.
  duration: 5, // The number of seconds to run the autocannnon. default: 10.
})

// Track information for result and show in terminal.
autocannon.track(instance, { renderProgressBar: true });
