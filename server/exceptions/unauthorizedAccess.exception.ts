import { HttpException } from './index';

export class UnauthorizedAccessException extends HttpException {
  constructor() {
    super(401, 'Unauthorized Access !!');
  }
}
