const { parseResponse } = require('./parser');

class RedisClient {
  constructor(socket, options) {
    this.socket = socket;
    this.options = options;
    this.callbacks = [];
    this.socket.on('readable', this.#gotResponse.bind(this));
    this.socket.setEncoding('utf-8');
    options.db && this.select(options.db, (err, res) => console.log(res));
  }

  #gotResponse = () => {
    let data = '',
      chunk;

    while ((chunk = this.socket.read())) {
      data += chunk;
    }

    const responses = parseResponse(data);
    this.#callCallbacks(responses);
  };

  #callCallbacks = (responses) => {
    responses.forEach((response) => {
      const { err, res } = response;
      const callback = this.callbacks.shift();
      if (callback) callback(err, res);
    });
  };

  #sendRequest = (command, callback) => {
    this.callbacks.push(callback);
    this.socket.write(command);
  };

  select(db, callback) {
    const command = `SELECT ${db}\r\n`;
    this.#sendRequest(command, callback);
  }

  ping(callback) {
    const command = `PING\r\n`;
    this.#sendRequest(command, callback);
  }

  set(key, value, callback) {
    const command = `SET ${key} "${value}"\r\n`;
    this.#sendRequest(command, callback);
  }

  get(key, callback) {
    const command = `GET ${key}\r\n`;
    this.#sendRequest(command, callback);
  }

  close(callback) {
    const interval = setInterval(() => {
      if (!this.callbacks.length) {
        this.socket.end(callback);
        clearInterval(interval);
      }
    }, 1000);
  }
}

module.exports = RedisClient;
