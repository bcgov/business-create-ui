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
  @Action setFilingId!: ActionBindingIF
  @Action setRegisteredOffice!: ActionBindingIF
  @Action setRecordsOffice!: ActionBindingIF

  /**
   * Method to construct a filing body when making an api request
   */
  buildFiling (): IncorporationFilingIF {
    return {
      filing: {
        header: {
          name: INCORPORATION_APPLICATION,
          certifiedBy: this.stateModel.certifyState.certifiedBy,
          email: this.stateModel.defineCompanyStep.businessContact.email,
          date: this.stateModel.currentDate
        },
        incorporationApplication: {
          nameRequest: {
            nrNumber: this.stateModel.nameRequest.nrNumber,
            legalType: this.stateModel.nameRequest.entityType
          },
          offices: this.stateModel.defineCompanyStep.officeAddresses,
          contactPoint: {
            email: this.stateModel.defineCompanyStep.businessContact.email,
            phone: this.stateModel.defineCompanyStep.businessContact.phone
          }
        }
      }
    }
  }

  /**
   * Method to parse a received draft filing into the store
   * @param draftFiling The draft filing body to be parsed and assigned to store
   */
  async parseDraft (draftFiling: any): Promise<any> {
    try {
      // Set nameRequest data
      this.setNameRequestState({ entityType: draftFiling.incorporationApplication.nameRequest.legalType,
        filingId: draftFiling.header.filingId })

      // Set Office Addresses
      this.setRegisteredOffice(draftFiling.incorporationApplication.offices.registeredOffice)
      this.setRecordsOffice(draftFiling.incorporationApplication.offices.recordsOffice)

      // Set Contact Info
      this.setBusinessContact(draftFiling.incorporationApplication.contactPoint)
    } catch (e) {
      // TODO: Throw a flag to the ui from here, if we want to trigger error handling in ui
    }
  }
}
