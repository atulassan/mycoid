import { HttpException } from './index';

export class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, 'invalid token or token expired');
  }
}
