const visualizerName = 'piral-inspector-visualizer';
const persistAttribute = 'persist';
const piletColorMap = {};
const colors = [
  '#001F3F',
  '#0074D9',
  '#7FDBFF',
  '#39CCCC',
  '#3D9970',
  '#2ECC40',
  '#01FF70',
  '#FFDC00',
  '#FF851B',
  '#FF4136',
  '#85144B',
  '#F012BE',
  '#B10DC9',
];

function getTarget(element: Element) {
  const row = element.childNodes;
  const rects: Array<DOMRect> = Array.prototype.map.call(row, (item: Node) => {
    if (item instanceof Element) {
      return item.getBoundingClientRect();
    } else if (item instanceof Text) {
      const range = document.createRange();
      range.selectNode(item);
      return range.getBoundingClientRect();
    } else {
      return new DOMRectReadOnly(0, 0, 0, 0);
    }
  });

  const relevant = rects.filter((m) => m.height !== 0 && m.width !== 0);

  if (relevant.length === 0) {
    return new DOMRectReadOnly(0, 0, 0, 0);
  }

  return relevant.reduce((a, b) => {
    const x = Math.min(a.left, b.left);
    const y = Math.min(a.top, b.top);
    const width = Math.max(a.right, b.right) - x;
    const height = Math.max(a.bottom, b.bottom) - y;
    return new DOMRectReadOnly(x, y, width, height);
  });
}

function hide(vis: HTMLElement) {
  vis.style.opacity = '0';
  // vis.style.pointerEvents = 'auto';
}

function show(vis: HTMLElement) {
  vis.style.opacity = '1';
  // vis.style.pointerEvents = 'none';
}

function updatePosition(source: Element, vis: HTMLElement) {
  const targetRect = getTarget(source);
  vis.style.left = targetRect.left + 'px';
  vis.style.top = targetRect.top + 'px';
  vis.style.width = targetRect.width + 'px';
  vis.style.height = targetRect.height + 'px';
}

class PiralInspectorVisualizer extends HTMLElement {
  update = () => {
    const persist = this.getAttribute(persistAttribute) !== null;
    this.innerText = '';

    document.querySelectorAll('piral-component').forEach((element) => {
      const pilet = element.getAttribute('origin');
      const vis = this.appendChild(document.createElement('div'));
      const info = vis.appendChild(document.createElement('div'));
      vis.style.position = 'absolute';
      vis.style.zIndex = '2147483647';
      vis.style.border = '1px solid #ccc';
      vis.style.pointerEvents = 'none';
      info.style.color = 'white';
      info.textContent = pilet;
      info.style.position = 'absolute';
      info.style.right = '0';
      info.style.top = '0';
      info.style.fontSize = '8px';
      info.style.background =
        piletColorMap[pilet] || (piletColorMap[pilet] = colors[Object.keys(piletColorMap).length % colors.length]);

      if (!persist) {
        hide(vis);

        element.addEventListener('mouseenter', () => {
          updatePosition(element, vis);
          show(vis);
        });
        element.addEventListener('mouseleave', () => {
          hide(vis);
        });
      } else {
        updatePosition(element, vis);
        show(vis);
      }
    });
  };

  connectedCallback() {
    this.style.position = 'absolute';
    this.style.top = '0';
    this.style.left = '0';
    this.style.width = '0';
    this.style.height = '0';

    window.addEventListener('resize', this.update);
    window.addEventListener('add-component', this.update);
    window.addEventListener('remove-component', this.update);

    this.update();
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.update);
    window.removeEventListener('add-component', this.update);
    window.removeEventListener('remove-component', this.update);
  }

  static get observedAttributes() {
    return [persistAttribute];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === persistAttribute && oldValue !== newValue) {
      this.update();
    }
  }
}

customElements.define(visualizerName, PiralInspectorVisualizer);

export function createVisualizer() {
  const visualizer = document.querySelector(visualizerName);

  if (!visualizer) {
    document.body.appendChild(document.createElement(visualizerName));
  }
}

export function destroyVisualizer() {
  const visualizer = document.querySelector(visualizerName);

  if (visualizer) {
    visualizer.remove();
  }
}

export function toggleVisualizer() {
  const visualizer = document.querySelector(visualizerName);

  if (visualizer) {
    if (visualizer.getAttribute(persistAttribute) !== null) {
      visualizer.removeAttribute(persistAttribute);
    } else {
      visualizer.setAttribute(persistAttribute, '');
    }
  }
}
