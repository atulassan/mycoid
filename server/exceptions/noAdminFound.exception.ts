import { HttpException } from './index';

export class NoAdminFoundException extends HttpException {
  constructor() {
    super(400, 'No Admin Found');
  }
}
