// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'

// Interfaces
import { StateModelIF, IncorporationFilingIF, GetterIF } from '@/interfaces'

/**
 * Mixin that provides the integration with the legal api.
 */
@Component
export default class FilingTemplateMixin extends Vue {
  // Global state
  @State stateModel!: StateModelIF

  // Global Getters
  @Getter isTypeBcomp!: GetterIF

  // Filing Properties
  private name!: string
  private certifiedBy!: string
  private email!: string
  private phone!: string
  private date!: string
  private nrNumber!: string
  private legalType!: string

  buildFiling (): IncorporationFilingIF {
    this.name = 'incorporationApplication'
    this.certifiedBy = this.stateModel.certifyState.certifiedBy
    this.email = this.stateModel.defineCompanyStep.businessContact.email
    this.phone = this.stateModel.defineCompanyStep.businessContact.phone
    this.date = this.stateModel.currentDate
    this.nrNumber = this.stateModel.nameRequest.nrNumber
    this.legalType = this.stateModel.nameRequest.entityType

    const filing = {
      filing: {
        header: {
          name: this.name,
          certifiedBy: this.certifiedBy,
          email: this.email,
          date: this.date
        },
        incorporationApplication: {
          nameRequest: {
            nrNumber: this.nrNumber,
            legalType: this.legalType
          },
          offices: this.stateModel.defineCompanyStep.officeAddresses,
          contactPoint: {
            email: this.email,
            phone: this.phone
          }
        }
      }
    }
    return filing
  }
}
