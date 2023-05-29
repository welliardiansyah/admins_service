import { RoleDTO } from './role.dto';

export class RoleResponseDTO {
  success: string;
  message: string;
  data: RoleDTO[];
  statusCode: number;
  error: string;
}
