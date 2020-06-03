// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { State, Getter, Action } from 'vuex-class'

// Interfaces
import { ActionBindingIF, StateModelIF, IncorporationFilingIF, GetterIF } from '@/interfaces'

// Constants
import { INCORPORATION_APPLICATION } from '@/constants'

// Enums
import { EntityTypes } from '@/enums'
/**
 * Mixin that provides the integration with the legal api.
 */
@Component({})
export default class FilingTemplateMixin extends Vue {
  // Global state
  @State stateModel!: StateModelIF

  // Global getters
  @Getter isTypeBcomp!: GetterIF
  @Getter getApprovedName!: string
  @Getter getTempId!: string

  // Global actions
  @Action setEntityType!: ActionBindingIF
  @Action setBusinessContact!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF
  @Action setNameRequestState!: ActionBindingIF
  @Action setOrgPersonList!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF
  @Action setCertifyState!: ActionBindingIF
  @Action setShareClasses!: ActionBindingIF
  @Action setEffectiveDate!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setFolioNumber!: ActionBindingIF
  @Action setIncorporationAgreementStepData!: ActionBindingIF

  /** Constructs a filing body, used when saving a filing. */
  buildFiling (): IncorporationFilingIF {
    // Format DateTime for Filing
    const effectiveDate = this.stateModel?.incorporationDateTime?.effectiveDate || ''
    const formattedDateTime = effectiveDate &&
      (effectiveDate.toISOString()).replace('Z', '+00:00')

    // Build and return filing
    let filing:IncorporationFilingIF = {
      filing: {
        header: {
          name: INCORPORATION_APPLICATION,
          certifiedBy: this.stateModel?.certifyState?.certifiedBy || '',
          date: this.stateModel?.currentDate || '',
          folioNumber: this.stateModel.defineCompanyStep.folioNumber
        },
        business: {
          legalType: this.stateModel?.entityType || '',
          identifier: this.getTempId || ''
        },
        incorporationApplication: {
          offices: this.stateModel?.defineCompanyStep?.officeAddresses || {},
          contactPoint: {
            email: this.stateModel?.defineCompanyStep?.businessContact?.email || '',
            phone: this.stateModel?.defineCompanyStep?.businessContact?.phone || '',
            extension: this.stateModel?.defineCompanyStep?.businessContact?.extension || ''
          },
          parties: this.stateModel?.addPeopleAndRoleStep?.orgPeople || [],
          shareClasses: this.stateModel?.createShareStructureStep?.shareClasses || [],
          incorporationAgreement: {
            agreementType: this.stateModel.incorporationAgreementStep.agreementType
          }
        }
      }
    }

    if (this.stateModel?.nameRequest?.nrNumber) {
      let nrObj = {
        nrNumber: this.stateModel.nameRequest?.nrNumber,
        legalType: this.stateModel?.entityType,
        legalName: this.getApprovedName
      }
      filing.filing.incorporationApplication.nameRequest = nrObj
    }

    // Pass the effective date only for a future effective filing.
    if (formattedDateTime) {
      filing.filing.header.effectiveDate = formattedDateTime
    }
    return filing
  }

  /**
   * Method to parse a received draft filing into the store
   * @param draftFiling The draft filing body to be parsed and assigned to store
   */
  parseDraft (draftFiling: any): void {
    // FUTURE: set types so each of these validate their parameters
    // ref: https://www.typescriptlang.org/docs/handbook/generics.html
    // Set Entity Type
    this.setEntityType(draftFiling.business.legalType)

    // Set Office Addresses
    this.setOfficeAddresses(draftFiling.incorporationApplication.offices)

    // Set Contact Info
    const draftContact = {
      ...draftFiling.incorporationApplication.contactPoint,
      confirmEmail: draftFiling.incorporationApplication.contactPoint.email
    }
    this.setBusinessContact(draftContact)

    // Set Persons and Organizations
    this.setOrgPersonList(draftFiling.incorporationApplication.parties)

    // Set Share Structure
    this.setShareClasses(draftFiling.incorporationApplication.shareClasses)

    // Set Incorporation Agreement
    this.setIncorporationAgreementStepData({
      agreementType: draftFiling.incorporationApplication.incorporationAgreement?.agreementType
    })

    // Set Certify Form
    this.setCertifyState({
      valid: false,
      certifiedBy: draftFiling.header.certifiedBy
    })

    // Date check to improve UX and work around default effectiveDate set by backend.
    const draftEffectiveDate = draftFiling.header.effectiveDate
    const effectiveDate = draftEffectiveDate < new Date().toISOString() ? null : draftEffectiveDate

    // Set Future Effective Time
    this.setEffectiveDate(effectiveDate)
    this.setIsFutureEffective(!!effectiveDate)

    // Set Folio Number
    this.setFolioNumber(draftFiling.header.folioNumber)
  }
}
