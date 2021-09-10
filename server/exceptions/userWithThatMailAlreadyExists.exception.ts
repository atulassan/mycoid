import { HttpException } from './index';

export class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: String) {
    super(200, `${email} Email Already Exists`);
  }
}
 