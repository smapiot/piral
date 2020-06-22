import 'url-polyfill';
import 'whatwg-fetch';
import { createFetchApi } from './create';

describe('Create fetch API Module', () => {
  let terminate = () => {};
  let port;

  beforeAll(async () => {
    const express = require('express');
    const cors = require('cors');
    const getPort = require('get-port');
    const app = express();
    port = await getPort();

    app.use(cors());

    app.get('/json', (_, res) => {
      res.json([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    app.get('/xml', (_, res) => {
      res.set('Content-Type', 'text/xml');
      res.send(
        Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>`),
      );
    });

    terminate = app.listen(port);
  });

  afterAll(() => terminate());

  it('works with default options against a JSON API', async () => {
    const context = { emit: jest.fn() } as any;
    const { fetch } = createFetchApi({
      base: `http://localhost:${port}`,
    })(context) as any;
    const response = await fetch('json');
    const result = response.body;
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(10);
    expect(result[0]).toBe(1);
  });

  it('interprets the result as text if explicitly used despite JSON API', async () => {
    const context = { emit: jest.fn() } as any;
    const { fetch } = createFetchApi({
      base: `http://localhost:${port}`,
    })(context) as any;
    const response = await fetch('json', { result: 'text' });
    const result = response.body;
    expect(typeof result).toBe('string');
    expect(Array.isArray(JSON.parse(result))).toBeTruthy();
  });

  it('has the correct response code', async () => {
    const context = { emit: jest.fn() } as any;
    const { fetch } = createFetchApi({
      base: `http://localhost:${port}`,
    })(context) as any;
    const response = await fetch('json');
    const result = response.code;
    expect(result).toBe(200);
  });

  it('works with default options against a non-JSON API', async () => {
    const context = { emit: jest.fn() } as any;
    const { fetch } = createFetchApi({
      base: `http://localhost:${port}`,
    })(context) as any;
    const response = await fetch('xml');
    const result = response.body;
    expect(result.substr(0, 5)).toBe(`<?xml`);
  });
});
