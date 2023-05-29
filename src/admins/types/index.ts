import { AdminsDocument } from 'src/database/entities/admins.entity';

export class AdminProfileResponse extends AdminsDocument {
  role?: Record<string, any>;

  constructor(init?: Partial<AdminProfileResponse>) {
    super();
    Object.assign(this, init);
  }
}
