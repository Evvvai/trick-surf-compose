import { Role } from 'src/players/entities/role.enum';

export class JwtDto {
  steamid64: string;
  role: Role;
}
