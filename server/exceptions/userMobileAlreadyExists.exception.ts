import { HttpException } from './index';

export class UserMobileAlreadyExists extends HttpException {
  constructor(userName: String) {
    super(404, `${userName} Mobile Number Already Exists`);
  }
}
 