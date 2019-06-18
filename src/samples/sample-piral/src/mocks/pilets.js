const request = require('request');

function isPiletQuery(content) {
  try {
    const q = JSON.parse(content).query.replace(/\s+/g, ' ');
    return q.indexOf('query initialData { pilets {') !== -1;
  } catch (e) {
    return false;
  }
}

// Place a script here to "redirect" a standard API to some GraphQL.
const apiService = '';// 'http://localhost:9000/api/v1/pilet';

module.exports = function(_, req, res) {
  if ((req.path = '/' && req.method === 'POST' && isPiletQuery(req.content)))
    if (apiService) {
      return new Promise(resolve => {
        request.get(apiService, (_1, _2, body) => {
          const response = res({
            content: JSON.stringify({
              data: {
                pilets: JSON.parse(body).items,
              },
            }),
          });
          resolve(response);
        });
      });
    } else {
      return res({
        content: JSON.stringify({
          data: {
            pilets: [],
          },
        }),
      });
    }
};
