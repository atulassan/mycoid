import { HttpException } from './index';

export class ResetPasswordLinkExpiredException extends HttpException {
  constructor() {
    super(400, 'Reset password link expired.');
  }
}
