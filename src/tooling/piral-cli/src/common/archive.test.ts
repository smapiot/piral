import { createTarball, unpackTarball, unpackGzTar } from './archive';

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

jest.mock('path', () => ({
  relative: (from: string, to: string) => {
    return to;
  },
  resolve: (...pathSegments: string[]) => {
    return pathSegments[1];
  },
}));

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
    let stream = new ParseStream();
    const writer = stream.getWriter();
    writer.write('');
    return stream;
  },
}));

describe('Archive Module', () => {
  it('create tarball', async () => {
    await createTarball('./', './target', 'foo.txt').then(result => expect(result).toBeTruthy());
    await createTarball('./', './target', 'foo2.tgz').catch(err => expect(err).toEqual(fileNotFoundError));
  });

  it('unpack tarball', async () => {
    await unpackTarball('./', 'foo.tgz').then(result => expect(result).toBeTruthy());
    await unpackTarball('./', 'foo2.tgz').catch(err => expect(err).toEqual(fileNotFoundError));
  });

  it('unpack GZ TAR', async () => {

    
  });
});
