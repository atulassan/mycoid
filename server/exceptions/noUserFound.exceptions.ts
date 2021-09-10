import { HttpException } from './index';

export class NoUserFoundException extends HttpException {
  constructor() {
    super(404, 'No User Found');
  }
}
