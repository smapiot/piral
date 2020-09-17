import { storage, cookie } from './storage';

function mockLocalStorage<T>(mockObj: T) {
  (window as any).__defineGetter__('localStorage', () => mockObj);
  return mockObj;
}

function mockCookieStorage(initialValue = '') {
  const doc = { cookie: initialValue };
  (document as any).__defineGetter__('cookie', () => doc.cookie);
  (document as any).__defineSetter__('cookie', (value) => {
    doc.cookie = value;
  });
  return doc;
}

describe('Storage Module', () => {
  it('storage gets item from local storage', () => {
    const localStorage = mockLocalStorage({
      getItem: jest.fn(() => 'bar'),
    });
    const result = storage.getItem('foo');
    expect(result).toBe('bar');
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
  });

  it('storage sets item to local storage', () => {
    const localStorage = mockLocalStorage({
      setItem: jest.fn(),
    });
    storage.setItem('foo', 'bar');
    expect(localStorage.setItem).toHaveBeenCalledWith('foo', 'bar');
  });

  it('storage removes item at local storage', () => {
    const localStorage = mockLocalStorage({
      removeItem: jest.fn(),
    });
    storage.removeItem('foo');
    expect(localStorage.removeItem).toHaveBeenCalledWith('foo');
  });

  it('cookie gets existing item from cookie', () => {
    mockCookieStorage('foo=bar;');
    const result = cookie.getItem('foo');
    expect(result).toBe('bar');
  });

  it('cookie gets non-existing item from empty cookie', () => {
    mockCookieStorage();
    const result = cookie.getItem('foo');
    expect(result).toBe('');
  });

  it('cookie gets non-existing item from non-empty cookie', () => {
    mockCookieStorage('bar=qux');
    const result = cookie.getItem('foo');
    expect(result).toBe('');
  });

  it('cookie sets item to cookie with domain', () => {
    const document = mockCookieStorage();
    cookie.setItem('foo', 'bar');
    expect(document.cookie).toBe('foo=bar;expires="";path=/;domain=.localhost;');
  });

  it('cookie sets item to cookie without domain', () => {
    const oldLocation = window.location;
    delete window.location;

    window.location = {
      host: '',
    };

    const document = mockCookieStorage();
    cookie.setItem('foo', 'bar');
    window.location = oldLocation;
    expect(document.cookie).toBe('foo=bar;expires="";path=/;');
  });

  it('cookie removes item at cookie', () => {
    const document = mockCookieStorage('foo=bar;');
    cookie.removeItem('foo');
    expect(document.cookie).toBe('foo=;expires="-1";path=/;domain=.localhost;');
  });
});
