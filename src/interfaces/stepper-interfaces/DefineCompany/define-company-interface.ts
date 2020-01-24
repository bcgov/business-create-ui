import { BusinessContactIF, NameRequestIF } from '@/interfaces'

export interface DefineCompanyIF {
    valid: boolean;
    businessContact : BusinessContactIF;
    nameRequest: NameRequestIF;
}
