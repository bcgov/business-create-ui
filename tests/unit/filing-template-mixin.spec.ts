import { wrapperFactory } from '../vitest-wrapper-factory'
import MixinTester from '@/mixin-tester.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { AuthorizationRoles, AuthorizedActions, BusinessTypes, FilingStatus, FilingTypes, PartyTypes,
  RestorationTypes, RoleTypes, StaffPaymentOptions } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { NameRequestIF } from '@/interfaces'
import { CorrectNameOptions } from '@bcrs-shared-components/enums'
import { setAuthRole } from '../set-auth-role'

setActivePinia(createPinia())
const store = useStore()

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

    // no name translations
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
    store.stateModel.tempId = 'T1234567'
    store.stateModel.registration.businessAddress = {
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
    store.stateModel.registration.naics = {
      naicsCode: '12345',
      naicsDescription: 'Some NAICS Description'
    }
    store.stateModel.nameRequest = {
      legalType: CorpTypeCd.SOLE_PROP as any,
      nrNum: 'NR 1234567'
    } as NameRequestIF

    store.stateModel.nameRequestApprovedName = 'My Approved Name'
    store.stateModel.businessContact = {
      email: 'eleven@example.com',
      phone: '(111) 222-3333',
      extension: 444
    }
    store.stateModel.entityType = CorpTypeCd.SOLE_PROP // sole prop
    store.stateModel.registration.businessType = BusinessTypes.SP // not DBA
    store.stateModel.registration.businessNumber = '111222333'
    store.stateModel.registration.businessTypeConfirm = false
    store.stateModel.addPeopleAndRoleStep.orgPeople = [
      {
        officer: {
          id: '1234',
          email: 'lucille@bcregtest.gov.bc.ca',
          lastName: 'TWENTY',
          firstName: 'BCREGTEST Lucille',
          partyType: PartyTypes.PERSON,
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
            roleType: RoleTypes.COMPLETING_PARTY,
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
          partyType: PartyTypes.ORGANIZATION,
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
            roleType: RoleTypes.PROPRIETOR,
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
            correctNameOption: CorrectNameOptions.CORRECT_NEW_NR,
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
    expect(store.stateModel.registration).toEqual({
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
    expect(store.stateModel.businessContact).toEqual({
      email: 'eleven@example.com',
      confirmEmail: 'eleven@example.com',
      phone: '(111) 222-3333',
      extension: '444'
    })
  })
})

describe('Registration Filing - refresh from current user', () => {
  let wrapper: any

  const completingParty = () => ({
    officer: {
      id: '1234',
      email: 'old-completing-party@example.com',
      lastName: 'TWENTY',
      firstName: 'BCREGTEST Lucille',
      partyType: PartyTypes.PERSON,
      middleName: 'J',
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
    roles: [{ roleType: RoleTypes.COMPLETING_PARTY, appointmentDate: '2022-05-17' }]
  })

  const organization = () => ({
    officer: {
      id: '4321',
      email: 'kitty@example.com',
      lastName: '',
      firstName: '',
      partyType: PartyTypes.ORGANIZATION,
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
    roles: [{ roleType: RoleTypes.PROPRIETOR, appointmentDate: '2022-05-17' }]
  })

  const orgPeople = () => store.stateModel.addPeopleAndRoleStep.orgPeople

  beforeEach(() => {
    wrapper = wrapperFactory(MixinTester, null, {})

    store.setAuthorizedActions([])
    store.setUserInfo({ firstname: 'Completing', lastname: 'Party', keycloakGuid: '', loginSource: 'BCSC' })
    store.setUserEmail('completing-party@example.com')
    store.setUserAddress({
      addressCity: 'City',
      addressCountry: 'CA',
      addressRegion: 'BC',
      postalCode: 'V8V 8V8',
      streetAddress: '1234 Some Street',
      streetAddressAdditional: 'Suite ABC'
    })
    store.stateModel.addPeopleAndRoleStep.orgPeople = [completingParty(), organization()] as any
    store.stateModel.certifyState = { valid: true, certifiedBy: 'BCREGTEST Lucille TWENTY' }
  })

  afterEach(() => {
    store.setAuthorizedActions([])
    wrapper.destroy()
  })

  describe('refreshCompletingParty', () => {
    it('replaces the name, email and address with the current user info', () => {
      wrapper.vm.refreshCompletingParty()

      const cp = orgPeople()[0]
      expect(cp.officer.firstName).toBe('Completing')
      expect(cp.officer.lastName).toBe('Party')
      expect(cp.officer.middleName).toBe('')
      expect(cp.officer.email).toBe('completing-party@example.com')
      expect(cp.mailingAddress).toEqual({
        addressCity: 'City',
        addressCountry: 'CA',
        addressRegion: 'BC',
        postalCode: 'V8V 8V8',
        streetAddress: '1234 Some Street',
        streetAddressAdditional: 'Suite ABC'
      })
    })

    it('preserves the other fields on the completing party and the other parties', () => {
      wrapper.vm.refreshCompletingParty()

      expect(orgPeople()[0].officer.id).toBe('1234')
      expect(orgPeople()[0].officer.partyType).toBe(PartyTypes.PERSON)
      expect(orgPeople()[0].roles).toEqual(completingParty().roles)
      expect(orgPeople()[1]).toEqual(organization())
    })

    it('uses empty strings when the user has no first name or email', () => {
      store.setUserInfo({ firstname: '', lastname: 'Party', keycloakGuid: '', loginSource: 'BCSC' })
      store.setUserEmail('')

      wrapper.vm.refreshCompletingParty()

      expect(orgPeople()[0].officer.firstName).toBe('')
      expect(orgPeople()[0].officer.email).toBe('')
    })

    it('gives the party its own copy of the user address', () => {
      wrapper.vm.refreshCompletingParty()

      orgPeople()[0].mailingAddress.streetAddress = '999 Changed St'

      expect(store.getUserAddress.streetAddress).toBe('1234 Some Street')
    })

    it('does nothing when the user may edit the completing party', () => {
      store.setAuthorizedActions([AuthorizedActions.EDITABLE_COMPLETING_PARTY])

      wrapper.vm.refreshCompletingParty()

      expect(orgPeople()[0]).toEqual(completingParty())
    })

    it('does nothing when there is no completing party', () => {
      store.stateModel.addPeopleAndRoleStep.orgPeople = [organization()] as any

      wrapper.vm.refreshCompletingParty()

      expect(orgPeople()).toEqual([organization()])
    })

    it('does nothing when the completing party is an organization', () => {
      const orgCompletingParty = {
        ...organization(),
        roles: [{ roleType: RoleTypes.COMPLETING_PARTY, appointmentDate: '2022-05-17' }]
      }
      store.stateModel.addPeopleAndRoleStep.orgPeople = [orgCompletingParty] as any

      wrapper.vm.refreshCompletingParty()

      expect(orgPeople()[0]).toEqual(orgCompletingParty)
    })
  })

  describe('refreshCertifiedBy', () => {
    it('sets Certified By to the current user name and keeps the certified flag', () => {
      wrapper.vm.refreshCertifiedBy()

      expect(store.stateModel.certifyState).toEqual({ valid: true, certifiedBy: 'Completing Party' })
    })

    it('uses only the last name when the user has no first name', () => {
      store.setUserInfo({ firstname: '', lastname: 'Party', keycloakGuid: '', loginSource: 'BCSC' })

      wrapper.vm.refreshCertifiedBy()

      expect(store.stateModel.certifyState.certifiedBy).toBe('Party')
    })

    it('does nothing when the user may edit Certified By', () => {
      store.setAuthorizedActions([AuthorizedActions.EDITABLE_CERTIFY_NAME])

      wrapper.vm.refreshCertifiedBy()

      expect(store.stateModel.certifyState.certifiedBy).toBe('BCREGTEST Lucille TWENTY')
    })

    it('does nothing when Certified By is blank by design', () => {
      store.setAuthorizedActions([AuthorizedActions.BLANK_CERTIFY_STATE])
      store.stateModel.certifyState = { valid: false, certifiedBy: '' }

      wrapper.vm.refreshCertifiedBy()

      expect(store.stateModel.certifyState.certifiedBy).toBe('')
    })

    it('leaves Certified By unchanged when it already matches the user', () => {
      store.stateModel.certifyState = { valid: false, certifiedBy: 'Completing Party' }

      wrapper.vm.refreshCertifiedBy()

      expect(store.stateModel.certifyState).toEqual({ valid: false, certifiedBy: 'Completing Party' })
    })
  })
})

describe('Staff Payment', () => {
  it('builds FAS data correctly', () => {
    store.stateModel.staffPaymentStep.staffPayment = {
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
    store.stateModel.staffPaymentStep.staffPayment = {
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
    store.stateModel.staffPaymentStep.staffPayment = {
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
    store.stateModel.staffPaymentStep.staffPayment = {
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

    expect(store.stateModel.staffPaymentStep.staffPayment).toEqual({
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

    expect(store.stateModel.staffPaymentStep.staffPayment).toEqual({
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

    expect(store.stateModel.staffPaymentStep.staffPayment).toEqual({
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
    expect(store.stateModel.staffPaymentStep.staffPayment).toEqual({
      option: -1,
      routingSlipNumber: '',
      bcolAccountNumber: '',
      datNumber: '',
      folioNumber: '',
      isPriority: false
    })
  })
})

for (const entityType of ['BEN', 'BC', 'CC', 'ULC']) {
  describe('Base corporate incorporation filing: ' + entityType, () => {
    // load coop filing data
    const ia = require('./test-data/incorpApp.json')
    ia.filing.business.legalType = entityType
    ia.filing.incorporationApplication.nameRequest.legalType = entityType
    let wrapper: any

    beforeEach(() => {
      wrapper = wrapperFactory(MixinTester, null, {})
    })

    afterEach(() => {
      wrapper.destroy()
    })

    it('courtOrder attribute is not required', () => {
      wrapper.vm.parseIncorporationDraft(ia.filing)
      const filing = wrapper.vm.buildIncorporationFiling()
      expect(filing.incorporationApplication).not.toHaveProperty('courtNumber')
    })

    it('strips the Completing Party from parties on load and submission', () => {
      wrapper.vm.parseIncorporationDraft(ia.filing)

      // the Completing Party role is gone from the store, but the person who was
      // also a Director is kept (so no parties are dropped here)
      const orgPeople = store.stateModel.addPeopleAndRoleStep.orgPeople
      expect(orgPeople.length).toBe(3)
      expect(orgPeople.some(p => p.roles.some(r => r.roleType === 'Completing Party'))).toBe(false)

      // and it stays out of the built filing
      const filing = wrapper.vm.buildIncorporationFiling()
      expect(filing.incorporationApplication.parties
        .some(p => p.roles.some(r => r.roleType === 'Completing Party'))).toBe(false)
    })

    it('can include courtOrder attribute', () => {
      ia.filing.incorporationApplication.courtOrder = {
        'fileNumber': '12034567',
        'hasPlanOfArrangement': true
      }
      wrapper.vm.parseIncorporationDraft(ia.filing)
      const filing = wrapper.vm.buildIncorporationFiling()
      expect(filing.incorporationApplication.courtOrder).toEqual({
        fileNumber: '12034567',
        effectOfOrder: 'planOfArrangement',
        hasPlanOfArrangement: true
      })
    })
  })
}

describe('Restoration Filing', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = wrapperFactory(MixinTester, null, {})

    store.stateModel.businessContact = {
      email: 'test@example.com',
      phone: '(250) 123-4567',
      extension: 123
    }
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('excludes contactPoint for a limited restoration', () => {
    store.stateModel.restoration.type = RestorationTypes.LIMITED

    const filing = wrapper.vm.buildRestorationFiling()

    expect(filing.restoration.contactPoint).toBeUndefined()
  })

  it('includes contactPoint for a full restoration', () => {
    store.stateModel.restoration.type = RestorationTypes.FULL

    const filing = wrapper.vm.buildRestorationFiling()

    expect(filing.restoration.contactPoint).toBeDefined()
    expect(filing.restoration.contactPoint.email).toBe('test@example.com')
    expect(filing.restoration.contactPoint.phone).toBe('(250) 123-4567')
    expect(filing.restoration.contactPoint.extension).toBe(123)
  })

  it('does not include extension in contactPoint when extension is empty', () => {
    store.stateModel.restoration.type = RestorationTypes.FULL
    store.stateModel.businessContact.extension = null

    const filing = wrapper.vm.buildRestorationFiling()

    expect(filing.restoration.contactPoint.extension).toBeUndefined()
  })
})

describe('Continuation In Filing - staff payment', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = wrapperFactory(MixinTester, null, {})
    store.setEntityType(CorpTypeCd.BEN_CONTINUE_IN)
    store.setFilingType(FilingTypes.CONTINUATION_IN)
    setAuthRole(store, AuthorizationRoles.STAFF)
  })

  afterEach(() => {
    setAuthRole(store, null)
    wrapper.destroy()
  })

  it('does not persist staff payment during the authorization stage', () => {
    store.setFilingStatus(FilingStatus.DRAFT) // authorization stage
    // store shows zero fees during authorization (display-only)
    store.stateModel.staffPaymentStep.staffPayment.option = StaffPaymentOptions.NO_FEE

    const filing = wrapper.vm.buildContinuationInFiling()

    expect(filing.header.waiveFees).toBeUndefined()
  })

  it('persists staff payment during the application stage', () => {
    store.setFilingStatus(FilingStatus.APPROVED) // application stage
    store.stateModel.staffPaymentStep.staffPayment.option = StaffPaymentOptions.NO_FEE

    const filing = wrapper.vm.buildContinuationInFiling()

    expect(filing.header.waiveFees).toBe(true)
  })

  it('shows zero fees when parsing an authorization stage draft', () => {
    store.setFilingStatus(FilingStatus.DRAFT) // authorization stage

    wrapper.vm.parseContinuationInDraft({
      header: { filingId: 123 },
      continuationIn: { nameRequest: { legalType: CorpTypeCd.BEN_CONTINUE_IN } }
    })

    expect(store.getStaffPaymentStep.staffPayment.option).toBe(StaffPaymentOptions.NO_FEE)
  })

  it('ignores a leaked waiveFees flag when parsing an application stage draft', () => {
    store.setFilingStatus(FilingStatus.APPROVED) // application stage

    wrapper.vm.parseContinuationInDraft({
      header: { filingId: 123, waiveFees: true },
      continuationIn: { nameRequest: { legalType: CorpTypeCd.BEN_CONTINUE_IN } }
    })

    expect(store.getStaffPaymentStep.staffPayment.option).toBe(StaffPaymentOptions.NONE)
  })
})

describe('Amalgamation Filing - staff document delivery', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = wrapperFactory(MixinTester, null, {})
    store.stateModel.tombstone.filingType = FilingTypes.AMALGAMATION_APPLICATION
    store.setEntityType(CorpTypeCd.BENEFIT_COMPANY)
    setAuthRole(store, AuthorizationRoles.STAFF)
  })

  afterEach(() => {
    setAuthRole(store, null)
    store.setDocumentOptionalEmail('')
    wrapper.destroy()
  })

  it('persists the document optional email entered by staff', () => {
    store.setDocumentOptionalEmail('client@example.com')

    const filing = wrapper.vm.buildAmalgamationFiling()

    expect(filing.header.documentOptionalEmail).toBe('client@example.com')
  })

  it('omits the document optional email when staff did not enter one', () => {
    store.setDocumentOptionalEmail('')

    const filing = wrapper.vm.buildAmalgamationFiling()

    expect(filing.header.documentOptionalEmail).toBeUndefined()
  })

  it('omits the document optional email for non-staff users', () => {
    setAuthRole(store, AuthorizationRoles.PUBLIC_USER)
    store.setDocumentOptionalEmail('client@example.com')

    const filing = wrapper.vm.buildAmalgamationFiling()

    expect(filing.header.documentOptionalEmail).toBeUndefined()
  })

  it('restores the document optional email from a draft', async () => {
    await wrapper.vm.parseAmalgamationDraft({
      header: { filingId: 123, documentOptionalEmail: 'client@example.com' },
      amalgamationApplication: { nameRequest: { legalType: CorpTypeCd.BENEFIT_COMPANY } }
    })

    expect(store.getDocumentDelivery.documentOptionalEmail).toBe('client@example.com')
  })
})

describe('Amalgamation Filing', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = wrapperFactory(MixinTester, null, {})
    const s = useStore()
    s.stateModel.tombstone.filingType = FilingTypes.AMALGAMATION_APPLICATION
    s.setEntityType(CorpTypeCd.BENEFIT_COMPANY)
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('emits shareStructure.resolutionDates when there are resolutions', () => {
    const s = useStore()
    s.setResolutions([{ date: '2020-05-13' }, { date: '2021-06-14' }] as any)

    const filing = wrapper.vm.buildAmalgamationFiling()

    expect(filing.amalgamationApplication.shareStructure.resolutionDates)
      .toEqual([{ date: '2020-05-13' }, { date: '2021-06-14' }])
    // the resolution objects are still carried for draft restore
    expect(filing.amalgamationApplication.resolutions).toEqual([{ date: '2020-05-13' }, { date: '2021-06-14' }])
  })

  it('omits shareStructure.resolutionDates when there are no resolutions', () => {
    const s = useStore()
    s.setResolutions([])

    const filing = wrapper.vm.buildAmalgamationFiling()

    expect(filing.amalgamationApplication.shareStructure.resolutionDates).toBeUndefined()
  })

  it('serializes an extrapro COLIN row with no foreignJurisdiction', () => {
    const s = useStore()
    s.setAmalgamatingBusinesses([{
      type: 'colin',
      role: 'amalgamating',
      identifier: 'A1234567',
      name: 'Extra Pro Business',
      legalType: CorpTypeCd.EXTRA_PRO_A,
      jurisdiction: 'ON'
    }] as any)

    const filing = wrapper.vm.buildAmalgamationFiling()

    const entry = filing.amalgamationApplication.amalgamatingBusinesses[0]
    expect(entry.type).toBe('colin')
    expect(entry.identifier).toBe('A1234567')
    expect(entry.foreignJurisdiction).toBeUndefined()
    expect(entry.legalName).toBeUndefined()
  })
})
