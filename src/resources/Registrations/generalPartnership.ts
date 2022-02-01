import { IncorporationResourceIF } from '@/interfaces'
import { CorpTypeCd, FilingCodes, NameRequestTypes } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'
import { RegistrationSteps } from '@/resources/Registrations/stepTemplates'

export const GeneralPartnershipResource: any = {
  entityType: CorpTypeCd.PARTNERSHIP,
  displayName: GetCorpFullDescription(CorpTypeCd.PARTNERSHIP),
  nameRequestType: NameRequestTypes.GP,
  steps: RegistrationSteps,
  filingData: [{
    entityType: CorpTypeCd.PARTNERSHIP,
    filingTypeCode: FilingCodes.REGISTRATION_GP
  }]
}
