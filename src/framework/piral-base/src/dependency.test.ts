import { compileDependency, evalDependency } from './dependency';

describe('Handling Dependencies', () => {
  it('handles a directly exported module without sub-dependencies', () => {
    console.log = jest.fn();
    console.error = jest.fn();
    const result = evalDependency(
      'my-dependency',
      'module.exports = { setup: function(api) { console.log(api, "Module A"); } }',
      undefined,
    );
    result.setup(undefined);
    expect(console.log).toHaveBeenCalledWith(undefined, 'Module A');
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('handles a directly exported module with a resolved sub-dependency', () => {
    const log = jest.fn();
    console.error = jest.fn();
    const deps = {
      test: log,
    };
    (global as any).System = {
      resolve(url) {
        return url;
      },
      get(depName) {
        return deps[depName];
      },
    };
    const result = evalDependency(
      'my-dependency',
      'var log = require("test"); module.exports = { setup: function(api) { log(api, "Module A"); } }',
      undefined,
    );
    result.setup(undefined);
    expect(log).toHaveBeenCalledWith(undefined, 'Module A');
    expect(log).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('handles a directly exported module with an unresolved sub-dependency crashing in setup', () => {
    console.error = jest.fn();
    const deps = {};
    (global as any).System = {
      resolve(url) {
        return url;
      },
      get(depName) {
        return deps[depName];
      },
    };
    const result = evalDependency(
      'my-dependency',
      'var log = require("test"); module.exports = { setup: function(api) { log(api, "Module A"); } }',
      undefined,
    );
    expect(result.setup).toBeUndefined();
    expect(() => result.setup(undefined)).toThrow();
  });

  it('handles a proper UMD module with no sub-dependencies', () => {
    console.error = jest.fn();
    const result = evalDependency(
      'my-dependency',
      '!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.weather=t():e.weather=t()}("undefined"!=typeof self?self:this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,n){e.exports=n(1)},function(e,t,n){"use strict";function r(e){console.log("Hi from weather"),e.data.temperature=void 0,e.registerTile("weather",function(t){t.innerHTML="<h3>Weather</h3><div>Loading Weather ...</div>",fetch("http://api.openweathermap.org/data/2.5/weather?q=Munich&appid=bd5e378503939ddaee76f12ad7a97608").then(function(e){return e.json()}).then(function(n){var r=n.main.temp-273.15;e.data.temperature=r,e.emit("temperature-changed",{value:r}),t.innerHTML="<h3>Weather</h3><div><b>".concat(n.weather[0].main,"</b> in ").concat(n.name,"</div><div>").concat(r," °C</div><div>").concat(n.wind.speed," m/s</div>")})})}Object.defineProperty(t,"__esModule",{value:!0}),t.setup=r}])});',
      undefined,
    );
    expect(result.setup).not.toBeUndefined();
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('compile does not like a module without a setup method', async () => {
    console.error = jest.fn();
    console.warn = jest.fn();
    const result = await compileDependency('my-dependency', 'module.exports = {  }', undefined);
    expect(result.setup).not.toBeUndefined();
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('compile does not like an empty module', async () => {
    console.error = jest.fn();
    console.warn = jest.fn();
    const result = await compileDependency('my-dependency', 'module.exports = undefined;', undefined);
    expect(result.setup).not.toBeUndefined();
    expect(console.warn).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('compile likes a proper module with a setup function', () => {
    console.warn = jest.fn();
    console.error = jest.fn();
    const result = evalDependency('my-dependency', 'module.exports = { setup: function() { } }', undefined);
    expect(result.setup).not.toBeUndefined();
    expect(console.warn).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });
});
