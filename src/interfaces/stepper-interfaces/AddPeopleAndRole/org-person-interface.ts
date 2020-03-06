import { BaseAddressObjIF } from '@/interfaces'

export interface OrgPersonIF {
    id: Number| null
    type: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    orgName: string
    roles: string[];
    address: BaseAddressObjIF | {};
}
