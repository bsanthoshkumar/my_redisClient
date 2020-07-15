const redis = require('./src/redis');

const client = redis.createClient({ db: 2 });

client.ping((err, res) => {
  if (err) throw err;
  console.log(res);
});

client.set('name', 'santhosh', (err, res) => console.log('set', res));
client.get('name', (err, res) => console.log('get', res));
client.incr('number', (err, res) => console.log('incr', res));
client.get('number', (err, res) => console.log('get', res));
client.keys('*', (err, res) => console.log('keys', res));

client.lpush('list', 1);
client.lpush('list', [2, 3, 4], (err, res) => console.log('lpush', res));
client.lrange('list', 0, 100, (err, res) => console.log('lrange', res));
client.rpush('list', 'a');
client.rpush('list', ['b', 'c', 'd'], (err, res) => console.log('rpush', res));
client.lrange('list', 0, 100, (err, res) => console.log('lrange', res));

client.close();
