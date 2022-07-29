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
    // FUTURE:
    //   business identifier
    //   certify state
    //   current date
    //   folio number
    //   is future effective
    //   staff filing data
    //   start date

    // populate store
    store.state.stateModel.tempId = 'T1234567'

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

    store.state.stateModel.registration.naics = {
      naicsCode: '12345',
      naicsDescription: 'Some NAICS Description'
    }

    store.state.stateModel.nameRequest = {
      entityType: 'SP',
      nrNumber: 'NR 1234567',
      details: { approvedName: 'My Approved Name' }
    }

    store.state.stateModel.businessContact = {
      email: 'eleven@example.com',
      phone: '(111) 222-3333',
      extension: '444'
    }

    store.state.stateModel.entityType = 'SP' // sole prop
    store.state.stateModel.registration.businessType = 'SP' // not DBA

    store.state.stateModel.registration.businessNumber = '111222333'
    store.state.stateModel.registration.businessTypeConfirm = false

    store.state.stateModel.addPeopleAndRoleStep.orgPeople = [
      {
        officer: {
          id: '1234',
          email: 'lucille@bcregtest.gov.bc.ca',
          lastName: 'TWENTY',
          firstName: 'BCREGTEST Lucille',
          partyType: 'person',
          middleName: '',
          organizationName: '',
          businessNumber: ''
        },
        mailingAddress: {
          postalCode: 'V8V 8V8',
          addressCity: 'Victoria',
          addressRegion: 'BC',
          streetAddress: '1234 Main Street',
          addressCountry: 'CA',
          streetAddressAdditional: ''
        },
        roles: [
          {
            roleType: 'Completing Party',
            appointmentDate: '2022-05-17'
          }
        ]
      },
      {
        officer: {
          id: '4321',
          email: 'kitty@example.com',
          lastName: '',
          firstName: '',
          partyType: 'organization',
          middleName: '',
          organizationName: 'Crazy Cat Consulting Company',
          businessNumber: '123456789'
        },
        mailingAddress: {
          postalCode: 'V8V 8V8',
          addressCity: 'Victoria',
          addressRegion: 'BC',
          streetAddress: '1234 Main Street',
          addressCountry: 'CA',
          streetAddressAdditional: ''
        },
        deliveryAddress: {
          postalCode: 'V8V 8V8',
          addressCity: 'Victoria',
          addressRegion: 'BC',
          streetAddress: '1234 Main Street',
          addressCountry: 'CA',
          streetAddressAdditional: ''
        },
        roles: [
          {
            roleType: 'Proprietor',
            appointmentDate: '2022-05-17'
          }
        ]
      }
    ]

    const filing = wrapper.vm.buildRegistrationFiling()

    // verify filing data
    expect(filing).toEqual(
      expect.objectContaining({
        registration: expect.objectContaining({
          business: {
            identifier: 'T1234567',
            naics: {
              naicsCode: '12345',
              naicsDescription: 'Some NAICS Description'
            },
            taxId: '111222333'
          },
          offices: {
            businessOffice: {
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
          },
          businessType: 'SP',
          contactPoint: {
            email: 'eleven@example.com',
            phone: '(111) 222-3333',
            extension: 444
          },
          nameRequest: {
            legalName: 'My Approved Name',
            legalType: 'SP',
            nrNumber: 'NR 1234567'
          },
          parties: [
            {
              officer: {
                id: '1234',
                email: 'lucille@bcregtest.gov.bc.ca',
                lastName: 'TWENTY',
                firstName: 'BCREGTEST Lucille',
                partyType: 'person',
                middleName: '',
                organizationName: ''
              },
              mailingAddress: {
                postalCode: 'V8V 8V8',
                addressCity: 'Victoria',
                addressRegion: 'BC',
                streetAddress: '1234 Main Street',
                addressCountry: 'CA',
                streetAddressAdditional: ''
              },
              roles: [
                {
                  roleType: 'Completing Party',
                  appointmentDate: '2022-05-17'
                }
              ]
            },
            {
              officer: {
                id: '4321',
                email: 'kitty@example.com',
                lastName: '',
                firstName: '',
                partyType: 'organization',
                middleName: '',
                organizationName: 'Crazy Cat Consulting Company',
                taxId: '123456789'
              },
              mailingAddress: {
                postalCode: 'V8V 8V8',
                addressCity: 'Victoria',
                addressRegion: 'BC',
                streetAddress: '1234 Main Street',
                addressCountry: 'CA',
                streetAddressAdditional: ''
              },
              deliveryAddress: {
                postalCode: 'V8V 8V8',
                addressCity: 'Victoria',
                addressRegion: 'BC',
                streetAddress: '1234 Main Street',
                addressCountry: 'CA',
                streetAddressAdditional: ''
              },
              roles: [
                {
                  roleType: 'Proprietor',
                  appointmentDate: '2022-05-17'
                }
              ]
            }
          ]
        })
      })
    )
  })

  it('correctly parses a registration filing', () => {
    const REGISTRATION = require('./test-data/registration.json')

    wrapper.vm.parseRegistrationDraft(REGISTRATION.filing)

    // FUTURE:
    //   business identifier
    //   certify state
    //   folio number
    //   parties
    //   staff filing data

    // verify the store
    expect(store.state.stateModel.registration).toEqual({
      defineBusinessValid: false,
      startDate: '2021-02-03',
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
      businessType: 'SP',
      businessNumber: '111222333',
      feeAcknowledgement: false,
      naics: {
        naicsCode: '12345',
        naicsDescription: 'Some NAICS Description'
      },
      businessTypeConfirm: false,
      isAutoPopulatedBusinessNumber: false
    })
    // NB: name request object is not restored from filing
    expect(store.state.stateModel.businessContact).toEqual({
      email: 'eleven@example.com',
      confirmEmail: 'eleven@example.com',
      phone: '(111) 222-3333',
      extension: '444'
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
