const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');
const { configure } = require('enzyme');

configure({
  adapter: new Adapter(),
});

global.matchMedia = () => ({ matches: false });
global.requestAnimationFrame = cb => setTimeout(cb, 0);
