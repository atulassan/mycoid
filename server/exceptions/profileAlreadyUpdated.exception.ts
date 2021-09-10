import { HttpException } from './index';

export class ProfileAlreadyUpdatedException extends HttpException {
  constructor() {
    super(404, 'User Profile Already Updated.');
  }
}
