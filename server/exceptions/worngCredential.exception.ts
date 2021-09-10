import { HttpException } from './index';

export class WrongCredentialsException extends HttpException {
  constructor() {
    super(404, 'User Not found with this Email id');
  }
}
