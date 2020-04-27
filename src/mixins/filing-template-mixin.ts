// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { State, Getter, Action } from 'vuex-class'

// Interfaces
import { ActionBindingIF, StateModelIF, IncorporationFilingIF, GetterIF } from '@/interfaces'

// Constants
import { INCORPORATION_APPLICATION } from '@/constants'

/**
 * Mixin that provides the integration with the legal api.
 */
@Component
export default class FilingTemplateMixin extends Vue {
  // Global state
  @State stateModel!: StateModelIF

  // Global Getters
  @Getter isTypeBcomp!: GetterIF

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

  /**
   * Method to construct a filing body when making an api request
   */
  buildFiling (): IncorporationFilingIF {
    // Format DateTime for Filing
    const effectiveDate = this.stateModel.incorporationDateTime.effectiveDate
    const formattedDateTime = effectiveDate &&
      (effectiveDate.toISOString()).replace('Z', '+00:00')

    // Build and return filing
    return {
      filing: {
        header: {
          name: INCORPORATION_APPLICATION,
          certifiedBy: this.stateModel.certifyState.certifiedBy,
          email: this.stateModel.defineCompanyStep.businessContact.email,
          date: this.stateModel.currentDate,
          effectiveDate: formattedDateTime || ''
        },
        incorporationApplication: {
          nameRequest: {
            nrNumber: this.stateModel.nameRequest.nrNumber,
            legalType: this.stateModel.nameRequest.entityType
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
  }

  /**
   * Method to parse a received draft filing into the store
   * @param draftFiling The draft filing body to be parsed and assigned to store
   */
  parseDraft (draftFiling: any): void {
    try {
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

      // Set Certify Form
      this.setCertifyState({
        valid: false,
        certifiedBy: draftFiling.header.certifiedBy
      })

      // Set Future Effective Time
      this.setEffectiveDate(draftFiling.header.effectiveDate)
      this.setIsFutureEffective(!!draftFiling.header.effectiveDate)
    } catch (e) {
      // TODO: Throw a flag to the ui from here, if we want to trigger error handling in ui
    }
  }
}
