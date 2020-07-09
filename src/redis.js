const net = require('net');
const RedisClient = require('./redisClient');

const parseHost = (options) => {
  const host = (options && options.host) || '127.0.0.1';
  const port = (options && options.port) || 6379;
  return { host, port };
};

const createClient = (options) => {
  const socket = net.connect(parseHost(options));
  return new RedisClient(socket, options);
};

module.exports = { createClient };
