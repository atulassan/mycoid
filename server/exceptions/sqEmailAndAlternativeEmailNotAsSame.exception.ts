import { HttpException } from './index';

export class SqEmailAndAlternativeEmailNotAsSameException extends HttpException {
  constructor() {
    super(404, `Alternate email and SQ email should not be same`);
  }
}
