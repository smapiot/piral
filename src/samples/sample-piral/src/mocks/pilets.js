function isPiletQuery(content) {
  try {
    const q = JSON.parse(content).query.replace(/\s+/g, ' ');
    return q.indexOf('query initialData { pilets {') !== -1;
  } catch (e) {
    return false;
  }
}

module.exports = function(_, req, res) {
  if ((req.path = '/' && req.method === 'POST' && isPiletQuery(req.content)))
    return res({
      content: JSON.stringify({
        data: {
          pilets: [],
        },
      }),
    });
};
