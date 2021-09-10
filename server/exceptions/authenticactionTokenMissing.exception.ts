import { HttpException } from './index';

export class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(400, 'authorization missing in the headers');
  }
}
