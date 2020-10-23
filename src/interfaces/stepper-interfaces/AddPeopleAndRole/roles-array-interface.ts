import { RoleTypes } from '@/enums'

export interface RolesIF {
  roleType: RoleTypes;
  appointmentDate?: string;
  cessationDate?: string;
}
