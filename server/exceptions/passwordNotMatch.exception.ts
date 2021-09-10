import { HttpException } from './index';

export class PasswordNotMatchException extends HttpException {
  constructor() {
    super(400, 'password not matched');
  }
}
