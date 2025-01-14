import { convertError } from './stack';

// Create an element with provided attributes and optional children
function h(e: string, attrs: Record<string, string> = {}, ...children: (string | Node)[]) {
  const elem = document.createElement(e);

  for (const [k, v] of Object.entries(attrs)) {
    elem.setAttribute(k, v);
  }

  elem.append(...children);
  return elem;
}

// set :host styles to make playwright detect the element as visible
const templateStyle = /*css*/ `
:host {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  --monospace: 'SFMono-Regular', Consolas,
  'Liberation Mono', Menlo, Courier, monospace;
  --red: #ff5555;
  --yellow: #e2aa53;
  --purple: #cfa4ff;
  --cyan: #2dd9da;
  --dim: #c9c9c9;

  --window-background: #181818;
  --window-color: #d8d8d8;
}

.backdrop {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  margin: 0;
  background: rgba(0, 0, 0, 0.66);
}

.window {
  font-family: var(--monospace);
  line-height: 1.5;
  max-width: 80vw;
  color: var(--window-color);
  box-sizing: border-box;
  margin: 30px auto;
  padding: 2.5vh 4vw;
  position: relative;
  background: var(--window-background);
  border-radius: 6px 6px 8px 8px;
  box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
  overflow: hidden;
  border-top: 8px solid var(--red);
  direction: ltr;
  text-align: left;
}

pre {
  font-family: var(--monospace);
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 1em;
  overflow-x: scroll;
  scrollbar-width: none;
}

pre::-webkit-scrollbar {
  display: none;
}

pre.frame::-webkit-scrollbar {
  display: block;
  height: 5px;
}

pre.frame::-webkit-scrollbar-thumb {
  background: #999;
  border-radius: 5px;
}

pre.frame {
  scrollbar-width: thin;
}

.message {
  line-height: 1.3;
  font-weight: 600;
  white-space: pre-wrap;
}

.message-body {
  color: var(--red);
}

.plugin {
  color: var(--purple);
}

.file {
  color: var(--cyan);
  margin-bottom: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.frame {
  color: var(--yellow);
}

.stack {
  font-size: 13px;
  color: var(--dim);
}

.tip {
  font-size: 13px;
  color: #999;
  border-top: 1px dotted #999;
  padding-top: 13px;
  line-height: 1.8;
}

code {
  font-size: 13px;
  font-family: var(--monospace);
  color: var(--yellow);
}

.file-link {
  text-decoration: underline;
  cursor: pointer;
}

kbd {
  line-height: 1.5;
  font-family: ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: rgb(38, 40, 44);
  color: rgb(166, 167, 171);
  padding: 0.15rem 0.3rem;
  border-radius: 0.25rem;
  border-width: 0.0625rem 0.0625rem 0.1875rem;
  border-style: solid;
  border-color: rgb(54, 57, 64);
  border-image: initial;
}
`;

// Error Template
const createTemplate = () =>
  h(
    'div',
    { class: 'backdrop', part: 'backdrop' },
    h(
      'div',
      { class: 'window', part: 'window' },
      h(
        'pre',
        { class: 'message', part: 'message' },
        h('span', { class: 'plugin', part: 'plugin' }),
        h('span', { class: 'message-body', part: 'message-body' }),
      ),
      h('pre', { class: 'file', part: 'file' }),
      h('pre', { class: 'frame', part: 'frame' }),
      h('pre', { class: 'stack', part: 'stack' }),
      h(
        'div',
        { class: 'tip', part: 'tip' },
        'Click outside, press ',
        h('kbd', {}, 'Esc'),
        ' key, or fix the code to dismiss.',
        h('br'),
        'You can also disable this overlay by setting ',
        h('code', { part: 'config-option-name' }, 'dbg:error-overlay'),
        ' to ',
        h('code', { part: 'config-option-value' }, '"off"'),
        ' in ',
        h('code', { part: 'config-file-name' }, 'sessionStorage'),
        '.',
      ),
    ),
    h('style', {}, templateStyle),
  );

const fileRE = /(?:[a-zA-Z]:\\|\/).*?:\d+:\d*/g;
const codeframeRE = /^(?:>?\s*\d+\s+\|.*|\s+\|\s*\^.*)\r?\n/gm;

interface ExtendedError {
  [name: string]: any;
  message: string;
  stack: string;
  id?: string;
  frame?: string;
  plugin?: string;
  pluginCode?: string;
  loc?: {
    file?: string;
    line: number;
    column: number;
  };
}

interface ErrorOverlayProps {
  error: ExtendedError;
  container: HTMLElement;
  errorId: string;
  errorType: string;
  pilet: string;
}

export const overlayId = 'piral-error-overlay';

if (typeof window !== 'undefined' && 'customElements' in window) {
  class ErrorOverlay extends HTMLElement {
    root: ShadowRoot;
    closeOnEsc: (e: KeyboardEvent) => void;
    closeOnReload: () => void;

    constructor(props: ErrorOverlayProps, links = true) {
      super();

      const { error, pilet, errorType } = props;

      this.root = this.attachShadow({ mode: 'open' });
      this.root.appendChild(createTemplate());

      codeframeRE.lastIndex = 0;
      const hasFrame = error.frame && codeframeRE.test(error.frame);
      const message = hasFrame ? error.message.replace(codeframeRE, '') : error.message;

      if (pilet) {
        this.text('.plugin', `[${pilet}] `);
      }

      this.text('.message-body', message.trim());

      const [file] = (error.loc?.file || error.id || 'unknown file').split(`?`);

      if (error.loc) {
        this.text('.file', `${file}:${error.loc.line}:${error.loc.column}`, links);
      } else if (error.id) {
        this.text('.file', file);
      }

      if (hasFrame) {
        this.text('.frame', error.frame!.trim());
      }

      this.text('.stack', error.stack.split('\n').slice(0, 15).join('\n'), links);

      convertError(error, 0, 15).then((newStack) => {
        this.text('.stack', newStack, links);
      });

      this.root.querySelector('.window')!.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      this.addEventListener('click', () => {
        this.close();
      });

      this.closeOnEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.code === 'Escape') {
          this.close();
        }
      };

      this.closeOnReload = () => this.close();

      window.addEventListener('pilets-reloaded', this.closeOnReload);
      document.addEventListener('keydown', this.closeOnEsc);
    }

    text(selector: string, text: string, linkFiles = false) {
      const el = this.root.querySelector(selector)!;
      el.textContent = '';

      if (linkFiles) {
        let curIndex = 0;
        let match: RegExpExecArray | null;
        fileRE.lastIndex = 0;

        while ((match = fileRE.exec(text))) {
          const { 0: file, index } = match;
          if (index != null) {
            const frag = text.slice(curIndex, index);
            el.appendChild(document.createTextNode(frag));
            const link = document.createElement('a');
            link.textContent = file;
            link.className = 'file-link';
            link.onclick = () => {
              console.log('Clicked');
            };
            el.appendChild(link);
            curIndex += frag.length + file.length;
          }
        }
      } else {
        el.textContent = text;
      }
    }

    close() {
      this.parentNode?.removeChild(this);
      window.removeEventListener('pilets-reloaded', this.closeOnReload);
      document.removeEventListener('keydown', this.closeOnEsc);
    }
  }

  customElements.define(overlayId, ErrorOverlay);
}
