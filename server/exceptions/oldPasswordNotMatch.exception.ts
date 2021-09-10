import { HttpException } from './index';

export class OldPasswordNotMatchException extends HttpException {
  constructor() {
    super(404, 'Old Password Not Matched');
  }
}
