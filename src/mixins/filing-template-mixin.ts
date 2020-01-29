// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'

// Interfaces
import { StateModelIF, IncorporationFilingIF, GetterIF } from '@/interfaces'
import { BaseAddressObjIF } from '@/interfaces/address-interfaces/address-interface'

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
  private registeredOffice!: BaseAddressObjIF
  private recordsOffice!: BaseAddressObjIF

  buildFiling (): IncorporationFilingIF {
    this.name = 'incorporationApplication'
    this.certifiedBy = this.stateModel.certifyState.certifiedBy
    this.email = this.stateModel.defineCompanyStep.businessContact.email
    this.phone = this.stateModel.defineCompanyStep.businessContact.phone
    this.date = this.stateModel.currentDate
    this.nrNumber = this.stateModel.defineCompanyStep.nameRequest.nrNumber
    this.legalType = this.stateModel.defineCompanyStep.nameRequest.entityType

    // Temporary assignment of addresses. Will need to check for properties before assignment
    this.registeredOffice = {
      deliveryAddress: {
        addressCity: 'someCity',
        addressCountry: 'someCountry',
        addressRegion: 'someRegion',
        postalCode: 'somePostalCode',
        streetAddress: 'someStreet'
      },
      mailingAddress: {
        addressCity: 'someCity',
        addressCountry: 'someCountry',
        addressRegion: 'someRegion',
        postalCode: 'somePostalCode',
        streetAddress: 'someStreet'
      }
    }

    this.recordsOffice = {
      deliveryAddress: {
        addressCity: 'someCity',
        addressCountry: 'someCountry',
        addressRegion: 'someRegion',
        postalCode: 'somePostalCode',
        streetAddress: 'someStreet'
      },
      mailingAddress: {
        addressCity: 'someCity',
        addressCountry: 'someCountry',
        addressRegion: 'someRegion',
        postalCode: 'somePostalCode',
        streetAddress: 'someStreet'
      }
    }

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
          offices: {
            registeredOffice: this.registeredOffice
          },
          contactPoint: {
            email: this.email,
            phone: this.phone
          }
        }
      }
    }

    if (this.isTypeBcomp) {
      Object.assign(filing.filing.incorporationApplication.offices, { recordsOffice: this.recordsOffice })
    }
    return filing
  }
}
