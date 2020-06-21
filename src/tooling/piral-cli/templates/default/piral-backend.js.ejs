const https = require('https');

const mock = true;
const headers = {
  'content-type': 'application/json',
};

module.exports = function(_, req, res) {
  if (req.url === '/api/posts' && req.method === 'GET') {
    if (mock) {
      return res({
        headers,
        content: JSON.stringify([
          {
            userId: 1,
            id: 1,
            title: 'First title',
            body: 'First body',
          },
        ]),
      });
    } else {
      return new Promise((resolve, reject) => {
        const fetch = https.get('https://jsonplaceholder.typicode.com/posts', response => {
          const parts = [];

          response.on('data', chunk => parts.push(chunk));

          response.on('end', () => resolve(res({ headers, content: Buffer.concat(parts) })));
        });

        fetch.on('error', err => reject(err));
      });
    }
  }
};
