import * as http from 'http';

export function startServer(port: number, handler) {
  const server = http.createServer(handler);
  server.listen(port);
  return server;
}
