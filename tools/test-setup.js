const Adapter = require('enzyme-adapter-react-16');
const { configure } = require('enzyme');

configure({
  adapter: new Adapter(),
});

global.matchMedia = () => ({ matches: false });
global.requestAnimationFrame = cb => setTimeout(cb, 0);
