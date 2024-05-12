const dns = require('node:dns/promises');

(async () => {
  const result = await dns.lookup('nodejs.org');

  console.log(result);
})();
