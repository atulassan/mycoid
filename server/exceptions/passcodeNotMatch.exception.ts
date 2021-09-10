import { HttpException } from './index';

export class PasscodeNotMatchException extends HttpException {
  constructor() {
    super(400, 'passcode not matched');
  }
}
