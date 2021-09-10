import { HttpException } from './index';

export class ContactAdminException extends HttpException {
  constructor() {
    super(404, 'Your account has been blocked by Admin please contact Admin');
  }
}
