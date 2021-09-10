import { HttpException } from './index';

export class UnsupportedImageFormatException extends HttpException {
  constructor() {
    super(400, 'unsupported Image format');
  }
}
