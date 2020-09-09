import { Writable } from 'stream';

export class MemoryStream extends Writable {
  private _buffers: Array<Buffer> = [];

  _write(chunk, enc, cb) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : new Buffer(chunk, enc);
    this._buffers.push(buffer);
    cb();
  }

  get value() {
    return Buffer.concat(this._buffers).toString('utf8').replace(/\s+$/, '');
  }
}
