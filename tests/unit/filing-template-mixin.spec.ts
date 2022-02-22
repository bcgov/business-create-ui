import { wrapperFactory } from '../jest-wrapper-factory'
import MixinTester from './mixin-tester.vue'
import { getVuexStore } from '@/store'

const store = getVuexStore()

describe('Incorporation Filing - Coop', () => {
  // load coop filing data
  const COOP_IA = require('./test-data/incorpAppCoop.json')
  let wrapper: any

  beforeEach(() => {
    wrapper = wrapperFactory(MixinTester, null, {})
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('no name translations for a coop IA', () => {
    wrapper.vm.parseIncorporationDraft(COOP_IA.filing)

    // no name translation input
    expect(wrapper.vm.getNameTranslations.length).toBe(0)

    // after building filing data, the name translations should be empty as well
    const filing = wrapper.vm.buildIncorporationFiling()
    expect(filing.incorporationApplication.nameTranslations.length).toBe(0)
  })
})

describe('Registration Filing', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = wrapperFactory(MixinTester, null, {})
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('correctly builds a registration filing', () => {
    // FUTURE: populate store...
    // business contact
    // business identifier
    // certify state
    // current date
    // entity type
    // folio number
    // is future effective
    // name request data
    // parties
    // staff filing data
    // start date
    // temp id

    store.state.stateModel.registration.businessAddress = {
      deliveryAddress: {
        addressCity: 'Alpha',
        addressCountry: 'CA',
        addressRegion: 'BC',
        deliveryInstructions: 'Delivery address',
        postalCode: 'V1V 1V1',
        streetAddress: '111 First St',
        streetAddressAdditional: 'Suite 1'
      },
      mailingAddress: {
        addressCity: 'Bravo',
        addressCountry: 'CA',
        addressRegion: 'BC',
        deliveryInstructions: 'Mailing address',
        postalCode: 'V2V 2V2',
        streetAddress: '222 Second St',
        streetAddressAdditional: 'Suite 2'
      }
    }

    const filing = wrapper.vm.buildRegistrationFiling()

    // FUTURE: check filing data...
    // FUTURE: compare to "registration.json" (see below)
    expect(filing).toEqual(
      expect.objectContaining({
        registration: expect.objectContaining({
          businessAddress: {
            deliveryAddress: {
              addressCity: 'Alpha',
              addressCountry: 'CA',
              addressRegion: 'BC',
              deliveryInstructions: 'Delivery address',
              postalCode: 'V1V 1V1',
              streetAddress: '111 First St',
              streetAddressAdditional: 'Suite 1'
            },
            mailingAddress: {
              addressCity: 'Bravo',
              addressCountry: 'CA',
              addressRegion: 'BC',
              deliveryInstructions: 'Mailing address',
              postalCode: 'V2V 2V2',
              streetAddress: '222 Second St',
              streetAddressAdditional: 'Suite 2'
            }
          }
        })
      })
    )
  })

  it('correctly parses a registration filing', () => {
    const REGISTRATION = require('./test-data/registration.json')

    wrapper.vm.parseRegistrationDraft(REGISTRATION.filing)

    // FUTURE: check the store...
    // business contact
    // business identifier
    // certify state
    // entity type
    // folio number
    // name request data
    // parties
    // staff filing data
    expect(store.state.stateModel.registration).toEqual({
      defineBusinessValid: false,
      startDate: '2001-02-03',
      businessAddress: {
        deliveryAddress: {
          addressCity: 'Alpha',
          addressCountry: 'CA',
          addressRegion: 'BC',
          deliveryInstructions: 'Delivery address',
          postalCode: 'V1V 1V1',
          streetAddress: '111 First St',
          streetAddressAdditional: 'Suite 1'
        },
        mailingAddress: {
          addressCity: 'Bravo',
          addressCountry: 'CA',
          addressRegion: 'BC',
          deliveryInstructions: 'Mailing address',
          postalCode: 'V2V 2V2',
          streetAddress: '222 Second St',
          streetAddressAdditional: 'Suite 2'
        }
      },
      feeAcknowledgement: false
    })
  })
})

describe('Staff Payment', () => {
  it('builds FAS data correctly', () => {
    store.state.stateModel.staffPaymentStep.staffPayment = {
      option: 1,
      routingSlipNumber: '123456789',
      bcolAccountNumber: '123456',
      datNumber: 'C1234567',
      folioNumber: 'ABC-123',
      isPriority: true
    }

    const wrapper = wrapperFactory(MixinTester, null, {}) as any

    const filing = { header: {} }
    wrapper.vm.buildStaffPayment(filing)

    expect(filing).toEqual({
      header: {
        routingSlipNumber: '123456789',
        priority: true
      }
    })
  })

  it('builds BCOL data correctly', () => {
    store.state.stateModel.staffPaymentStep.staffPayment = {
      option: 2,
      routingSlipNumber: '123456789',
      bcolAccountNumber: '123456',
      datNumber: 'C1234567',
      folioNumber: 'ABC-123',
      isPriority: true
    }

    const wrapper = wrapperFactory(MixinTester, null, {}) as any

    const filing = { header: {} }
    wrapper.vm.buildStaffPayment(filing)

    expect(filing).toEqual({
      header: {
        bcolAccountNumber: '123456',
        datNumber: 'C1234567',
        folioNumber: 'ABC-123',
        priority: true
      }
    })
  })

  it('builds NO_FEE data correctly', () => {
    store.state.stateModel.staffPaymentStep.staffPayment = {
      option: 0,
      routingSlipNumber: '123456789',
      bcolAccountNumber: '123456',
      datNumber: 'C1234567',
      folioNumber: 'ABC-123',
      isPriority: true
    }

    const wrapper = wrapperFactory(MixinTester, null, {}) as any

    const filing = { header: {} }
    wrapper.vm.buildStaffPayment(filing)

    expect(filing).toEqual({
      header: {
        waiveFees: true,
        priority: false
      }
    })
  })

  it('builds NONE data correctly', () => {
    store.state.stateModel.staffPaymentStep.staffPayment = {
      option: -1,
      routingSlipNumber: '123456789',
      bcolAccountNumber: '123456',
      datNumber: 'C1234567',
      folioNumber: 'ABC-123',
      isPriority: true
    }

    const wrapper = wrapperFactory(MixinTester, null, {}) as any

    const filing = { header: {} }
    wrapper.vm.buildStaffPayment(filing)

    expect(filing).toEqual({
      header: {}
    })
  })

  it('parses FAS data correctly', () => {
    const wrapper = wrapperFactory(MixinTester, null, {}) as any

    wrapper.vm.parseStaffPayment({
      header: {
        routingSlipNumber: '123456789',
        priority: true
      }
    })

    expect(store.state.stateModel.staffPaymentStep.staffPayment).toEqual({
      option: 1,
      routingSlipNumber: '123456789',
      bcolAccountNumber: '',
      datNumber: '',
      folioNumber: '',
      isPriority: true
    })
  })

  it('parses BCOL data correctly', () => {
    const wrapper = wrapperFactory(MixinTester, null, {}) as any

    wrapper.vm.parseStaffPayment({
      header: {
        bcolAccountNumber: '123456',
        datNumber: 'C1234567',
        folioNumber: 'ABC-123',
        priority: true
      }
    })

    expect(store.state.stateModel.staffPaymentStep.staffPayment).toEqual({
      option: 2,
      routingSlipNumber: '',
      bcolAccountNumber: '123456',
      datNumber: 'C1234567',
      folioNumber: 'ABC-123',
      isPriority: true
    })
  })

  it('parses NO_FEE data correctly', () => {
    const wrapper = wrapperFactory(MixinTester, null, {}) as any

    wrapper.vm.parseStaffPayment({
      header: {
        waiveFees: true
      }
    })

    expect(store.state.stateModel.staffPaymentStep.staffPayment).toEqual({
      option: 0,
      routingSlipNumber: '',
      bcolAccountNumber: '',
      datNumber: '',
      folioNumber: '',
      isPriority: false
    })
  })

  it('parses NONE data correctly', () => {
    const wrapper = wrapperFactory(MixinTester, null, {}) as any

    wrapper.vm.parseStaffPayment({
      header: {}
    })

    // check store for expected data
    expect(store.state.stateModel.staffPaymentStep.staffPayment).toEqual({
      option: -1,
      routingSlipNumber: '',
      bcolAccountNumber: '',
      datNumber: '',
      folioNumber: '',
      isPriority: false
    })
  })
})
