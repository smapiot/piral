import { createTarball, unpackTarball, unpackGzTar } from './archive';
import { Stream, Readable } from 'stream';

class ReadableString extends Readable {
  private sent = false;

  constructor(private str: string) {
    super();
  }

  _read() {
    if (!this.sent) {
      this.push(Buffer.from(this.str));
      this.sent = true;
    } else {
      this.push(null);
    }
  }
}

interface CreateOptions {
  cwd?: string;
}

interface FileOptions {
  file?: string;
}

interface ExtractOptions {
  file?: string;
  cwd?: string;
  keep: boolean;
}

jest.mock('path', () =>
  // extend the auto mock of path
  Object.assign(jest.genMockFromModule('path'), {
    relative: (from: string, to: string) => {
      return to;
    },
    resolve: (...pathSegments: string[]) => {
      return pathSegments[1];
    },
  }),
);

const fileNotFoundError = 'File not found!';
jest.mock('tar', () => ({
  create: (options: CreateOptions & FileOptions, fileList: ReadonlyArray<string>) => {
    return new Promise((resolve, reject) => {
      if (options.file && options.file == 'foo.txt') {
        resolve(true);
      } else {
        reject(fileNotFoundError);
      }
    });
  },
  extract: (options: ExtractOptions & FileOptions, fileList?: ReadonlyArray<string>) => {
    return new Promise((resolve, reject) => {
      if (options.file && options.file.includes('foo.tgz')) {
        resolve(true);
      } else {
        reject(fileNotFoundError);
      }
    });
  },
  Parse: () => {
    return {
      position: 0,
      _stream: new Stream(),
      _ended: false,
      _streamEnd: () => {
        this._ended = true;
        console.log('_streamEnd');
      },
      process: (c: Buffer) => {
        console.log('process');
      },
      _startEntry: (c: Buffer) => {
        console.log('_startEntry');
      },
      on: (event: string, listener: (...args: any[]) => {}) => {
        console.log(`on event: ${event}`);
      },
      once: (event: string, listener: (...args: any[]) => {}) => {
        console.log(`once event: ${event}`);
      },
      emit: (event: string | symbol, ...args: any[]) => {
        console.log(`emit event: ${event.toString()}`);
        return true;
      },
    } as any;
  },
}));

describe('Archive Module', () => {
  it('create tarball', async () => {
    await createTarball('./', './target', 'foo.txt').then((result) => expect(result).toBeTruthy());
    await createTarball('./', './target', 'foo2.tgz').catch((err) => expect(err).toEqual(fileNotFoundError));
  });

  it('unpack tarball', async () => {
    await unpackTarball('./', 'foo.tgz').then((result) => expect(result).toBeTruthy());
    await unpackTarball('./', 'foo2.tgz').catch((err) => expect(err).toEqual(fileNotFoundError));
  });
});
