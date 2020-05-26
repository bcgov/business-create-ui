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
  // Global State
  @State stateModel!: StateModelIF

  // Global Getters
  @Getter isTypeBcomp!: GetterIF
  @Getter getApprovedName!: string
  @Getter getBusinessIdentifier!: string
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

  /** Constructs a filing body, used when saving a filing. */
  buildFiling (): IncorporationFilingIF {
    // Format DateTime for Filing
    const effectiveDate = this.stateModel.incorporationDateTime.effectiveDate
    const formattedDateTime = effectiveDate &&
      (effectiveDate.toISOString()).replace('Z', '+00:00')

    // Build and return filing
    let filing:IncorporationFilingIF = {
      filing: {
        header: {
          name: INCORPORATION_APPLICATION,
          certifiedBy: this.stateModel.certifyState.certifiedBy,
          email: this.stateModel.defineCompanyStep.businessContact.email,
          date: this.stateModel.currentDate,
          folioNumber: this.stateModel.defineCompanyStep.folioNumber
        },
        business: {
          legalType: this.stateModel.entityType,
          identifier: this.getBusinessIdentifier
        },
        incorporationApplication: {
          nameRequest: {
            nrNumber: this.stateModel.nameRequest.nrNumber,
            legalType: this.stateModel.nameRequest.entityType,
            legalName: this.getApprovedName
          },
          offices: this.stateModel.defineCompanyStep.officeAddresses,
          contactPoint: {
            email: this.stateModel.defineCompanyStep.businessContact.email,
            phone: this.stateModel.defineCompanyStep.businessContact.phone,
            extension: this.stateModel.defineCompanyStep.businessContact.extension
          },
          parties: this.stateModel.addPeopleAndRoleStep.orgPeople,
          shareClasses: this.stateModel.createShareStructureStep.shareClasses
        }
      }
    }
    // Pass the effective date only for a future effective filing.
    if (formattedDateTime) {
      filing.filing.header.effectiveDate = formattedDateTime
    }
    return filing
  }

  /**
   *
   * @param draftFiling
   */
  /**
   * Method to construct a filing body when making an api request
   */
  buildEmptyFiling (): IncorporationFilingIF {
    // Format DateTime for Filing
    const effectiveDate = new Date()
    const formattedDateTime = effectiveDate &&
      (effectiveDate.toISOString()).replace('Z', '+00:00')

    // Build and return filing
    let filing:IncorporationFilingIF = {
      filing: {
        header: {
          name: INCORPORATION_APPLICATION,
          certifiedBy: '',
          email: '',
          date: this.stateModel.currentDate
        },
        business: {
          legalType: EntityTypes.BCOMP,
          identifier: this.getBusinessIdentifier
        },
        incorporationApplication: {
          nameRequest: {
            nrNumber: this.stateModel.tempId,
            legalType: EntityTypes.BCOMP,
            legalName: this.getApprovedName
          },
          offices: {
          },
          contactPoint: {
            email: '',
            phone: '',
            extension: ''
          },
          parties: [],
          shareClasses: []
        }
      }
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
    // Set Office Addresses
    if (!draftFiling.incorporationApplication) {
      draftFiling = (this.buildEmptyFiling()).filing
    }
    this.setEntityType(draftFiling.business.legalType)
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

    // Set Certify Form
    this.setCertifyState({
      valid: false,
      certifiedBy: draftFiling.header.certifiedBy
    })

    // Set Future Effective Time
    this.setEffectiveDate(draftFiling.header.effectiveDate)
    this.setIsFutureEffective(!!draftFiling.header.effectiveDate)

    // Set Folio Number
    this.setFolioNumber(draftFiling.header.folioNumber)
  }
}
