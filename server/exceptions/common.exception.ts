import { HttpException } from './index';

export class CommonException extends HttpException {
  constructor(code, message) {
    super(code, message);
  }
}
