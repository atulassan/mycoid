import { HttpException } from './index';

export class UserNameAlreadyExistsException extends HttpException {
  constructor(userName: String) {
    super(404, `${userName} username already exists`);
  }
}
