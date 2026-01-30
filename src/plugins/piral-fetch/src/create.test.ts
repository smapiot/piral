/**
 * @vitest-environment jsdom
 */
import 'whatwg-fetch';
import { describe, it, expect, vitest, beforeAll, afterAll } from 'vitest';
import getPort from 'get-port';
import cors from 'cors';
import express from 'express';
import { createFetchApi } from './create';

describe('Create fetch API Module', () => {
  let terminate = () => {};
  let port: number;

  beforeAll(async () => {
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

    let server = app.listen(port);
    terminate = () => server.close();
  });

  afterAll(() => terminate());

  it('works with default options against a JSON API', async () => {
    const context = { emit: vitest.fn() } as any;
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
    const context = { emit: vitest.fn() } as any;
    const { fetch } = createFetchApi({
      base: `http://localhost:${port}`,
    })(context) as any;
    const response = await fetch('json', { result: 'text' });
    const result = response.body;
    expect(typeof result).toBe('string');
    expect(Array.isArray(JSON.parse(result))).toBeTruthy();
  });

  it('has the correct response code', async () => {
    const context = { emit: vitest.fn() } as any;
    const { fetch } = createFetchApi({
      base: `http://localhost:${port}`,
    })(context) as any;
    const response = await fetch('json');
    const result = response.code;
    expect(result).toBe(200);
  });

  it('works with default options against a non-JSON API', async () => {
    const context = { emit: vitest.fn() } as any;
    const { fetch } = createFetchApi({
      base: `http://localhost:${port}`,
    })(context) as any;
    const response = await fetch('xml');
    const result = response.body;
    expect(result.substr(0, 5)).toBe(`<?xml`);
  });

  it('invokes configured middleware function and calls API', async () => {
    const context = { emit: vitest.fn() } as any;
    const middleware = vitest.fn((path, options, next) => next(path, options));
    const { fetch } = createFetchApi({
      base: `http://localhost:${port}`,
      middlewares: [middleware],
    })(context) as any;
    const response = await fetch('json');
    const result = response.body;
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(10);
    expect(result[0]).toBe(1);
    expect(middleware).toHaveBeenCalledOnce();
  });

  it('invokes middleware functions in top-down order', async () => {
    const context = { emit: vitest.fn() } as any;
    const invocationOrder: Array<number> = [];
    const createMiddleware = (myPosition: number) => (path: string, options: any, next: any) => {
      invocationOrder.push(myPosition);
      return next(path, options);
    };
    const { fetch } = createFetchApi({
      base: `http://localhost:${port}`,
      middlewares: [createMiddleware(1), createMiddleware(2), createMiddleware(3)],
    })(context) as any;
    await fetch('json');
    expect(invocationOrder).toEqual([1, 2, 3]);
  });

  it('allows middleware functions to terminate middleware chain', async () => {
    const context = { emit: vitest.fn() } as any;
    const expectedResponse = { code: 200, body: 'Terminated by middleware', text: 'Terminated by middleware' };
    const middleware = () => Promise.resolve(expectedResponse);
    const { fetch } = createFetchApi({
      base: `http://localhost:${port}`,
      middlewares: [middleware],
    })(context) as any;
    const globalFetch = vitest.spyOn(global, 'fetch');
    const response = await fetch('json');
    expect(response).toBe(expectedResponse);
    expect(globalFetch).not.toHaveBeenCalled();
  });
});
