const redis = require('./src/redis');

const client = redis.createClient({ db: 2 });

client.ping((err, res) => {
  if (err) throw err;
  console.log(res);
});

client.set('name', 'santhosh', (err, res) => console.log(res));
client.get('name', (err, res) => console.log(res));
client.incr('number', (err, res) => console.log(res));
client.get('number', (err, res) => console.log(res));
client.keys('*', (err, res) => console.log(res));

client.close();
