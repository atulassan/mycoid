import { HttpException } from './index';

export class UserPasswordAlreadyCreatedException extends HttpException {
  constructor() {
    super(
      400,
      'Sorry password already created please login to change password!!',
    );
  }
}
