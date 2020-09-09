import * as externals from './index';

describe('Externals module', () => {
  it('exports the FormData class', () => {
    const fd = new externals.FormData();
    expect(fd).not.toBeUndefined();
  });

  it('exports axios as a function', () => {
    const axios = externals.axios.default;
    expect(typeof axios).toBe('function');
  });

  it('exports getPort as a function', () => {
    const getPort = externals.getPort;
    expect(typeof getPort).toBe('function');
  });

  it('exports glob as a function', () => {
    const glob = externals.glob;
    expect(typeof glob).toBe('function');
  });

  it('exports the inquirer module', () => {
    const inq = externals.inquirer;
    expect(inq).not.toBeUndefined();
  });

  it('exports the logger module', () => {
    const logger = externals.logger;
    expect(logger).not.toBeUndefined();
  });

  it('exports getExtension as a function', () => {
    const getExtension = externals.mime.getExtension;
    expect(typeof getExtension).toBe('function');
  });

  it('exports rc as a function', () => {
    const rc = externals.rc;
    expect(typeof rc).toBe('function');
  });

  it('exports the tar module', () => {
    const tar = externals.tar;
    expect(tar).not.toBeUndefined();
  });

  it('exports the open module', () => {
    const open = externals.open;
    expect(open).not.toBeUndefined();
  });
});
