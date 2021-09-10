import { HttpException } from './index';

export class UserPaymentAlreadyUpdatedException extends HttpException {
  constructor() {
    super(404, 'user payment aleady updated.');
  }
}
