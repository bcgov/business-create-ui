import { BaseAddressObjIF } from '@/interfaces'

export interface OrgPersonIF {
    id: Number| null
    firstName: string;
    middleName?: string;
    lastName: string;
    roles: string[];
    address: BaseAddressObjIF | {};
}
