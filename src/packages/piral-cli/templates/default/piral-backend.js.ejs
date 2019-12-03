const request = require('request');

const mock = true;
const headers = {
  'content-type': 'application/json',
};

module.exports = function(_, req, res) {
  if (req.url == '/api/posts' && req.method === 'GET') {
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
      return new Promise(resolve => {
        request('https://jsonplaceholder.typicode.com/posts', (err, _, content) => {
          if (!err) {
            resolve(
              res({
                headers,
                content,
              }),
            );
          } else {
            resolve();
          }
        });
      });
    }
  }
};
