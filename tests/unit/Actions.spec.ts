/* eslint prefer-promise-reject-errors: "off" */

import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { shallowMount, createLocalVue, createWrapper } from '@vue/test-utils'
import sinon from 'sinon'
import { AxiosInstance as axios } from '@/utils'
import Actions from '@/components/common/Actions.vue'
import mockRouter from './MockRouter'
import LegalServices from '@/services/legal-services'
import { CorpTypeCd, FilingTypes } from '@/enums'
import { CourtOrderStepIF, DefineCompanyIF, EffectiveDateTimeIF, IncorporationAgreementIF, NameRequestIF,
  OrgPersonIF, PeopleAndRoleIF, ShareStructureIF, TombstoneIF } from '@/interfaces'
import { ShareClassIF } from '@bcrs-shared-components/interfaces'
import { vi } from 'vitest'

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

// mock services function
const mockUpdateFiling = vi.spyOn((LegalServices as any), 'updateFiling').mockImplementation(() => {})

// Populate session variables
sessionStorage.setItem('AUTH_WEB_URL', 'https://auth.web.url/')
sessionStorage.setItem('DASHBOARD_URL', 'https://dashboard.url/')

// Mock NR data
const nrData = {
  applicants: {
    addrLine1: 'address line 1',
    addrLine2: 'address line 2',
    addrLine3: 'address line 3',
    city: 'Victoria',
    countryTypeCd: 'CA',
    emailAddress: 'tester@test.com',
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Joe',
    phoneNumber: '250-111-2222',
    postalCd: 'V1V 1A2',
    stateProvinceCd: 'BC'
  },
  consentFlag: 'R',
  corpNum: null,
  legalType: 'BEN',
  expirationDate: 'Thu, 31 Dec 2099 23:59:59 GMT',
  names: [
    {
      choice: 1,
      consumptionDate: null,
      corpNum: null,
      name: 'ABC 1234',
      state: 'APPROVED'
    },
    {
      choice: 2,
      consumptionDate: null,
      corpNum: null,
      name: 'CDE 1234',
      state: 'NE'
    }
  ],
  nrNum: 'NR 1234567',
  request_action_cd: 'NEW',
  requestTypeCd: 'BC',
  state: 'APPROVED'
}

describe('Actions component', () => {
  let wrapper: any

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    wrapper = shallowMount(Actions, { localVue, router, vuetify })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('Enables File and Pay button when certify from is valid', async () => {
    store.stateModel.certifyState = {
      valid: true,
      certifiedBy: 'Some certifier'
    }
    store.stateModel.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.nameRequest.legalType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.defineCompanyStep = { valid: true } as DefineCompanyIF
    store.stateModel.addPeopleAndRoleStep = { valid: true } as PeopleAndRoleIF
    store.stateModel.createShareStructureStep = { valid: true } as ShareStructureIF
    store.stateModel.incorporationAgreementStep = { valid: true } as IncorporationAgreementIF
    store.stateModel.effectiveDateTime = { valid: true } as EffectiveDateTimeIF
    await Vue.nextTick()

    // verify File and Pay button state
    expect(wrapper.find('#file-pay-btn').attributes('disabled')).toBeUndefined()
  })

  it('Renders the component properly', () => {
    expect(wrapper.find('#action-buttons-container').exists()).toBe(true)
  })
})

describe('Emits error event if NR validation fails in file and pay', () => {
  let wrapper: any
  const { assign } = window.location

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: vi.fn() } as any

    const expiredNR = { ...nrData }
    expiredNR.expirationDate = 'Thu, 31 Dec 2019 23:59:59 GMT'
    expiredNR.state = 'EXPIRED'

    // GET NR data
    sinon.stub(axios, 'get')
      .withArgs('nameRequests/NR 1234567')
      .returns(new Promise(resolve => resolve({
        data: expiredNR
      })))

    // init store
    store.stateModel.currentDate = '2020/01/29'
    store.stateModel.nameRequest = {
      legalType: CorpTypeCd.BENEFIT_COMPANY,
      nrNum: 'NR 1234567'
    } as NameRequestIF
    store.stateModel.nameRequestApprovedName = 'My Name Request Inc.'
    store.stateModel.tombstone = {
      filingType: FilingTypes.INCORPORATION_APPLICATION,
      userEmail: 'completing-party@example.com',
      keycloakRoles: []
    } as TombstoneIF
    store.stateModel.certifyState = {
      valid: true,
      certifiedBy: 'Some certifier'
    }
    store.stateModel.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.defineCompanyStep = { valid: true } as DefineCompanyIF
    store.stateModel.addPeopleAndRoleStep = { valid: true } as PeopleAndRoleIF
    store.stateModel.createShareStructureStep = { valid: true } as ShareStructureIF
    store.stateModel.incorporationAgreementStep = { valid: true } as IncorporationAgreementIF
    store.stateModel.effectiveDateTime = { valid: true } as EffectiveDateTimeIF
    store.stateModel.courtOrderStep = { valid: true } as CourtOrderStepIF

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    router.push({ name: 'incorporation-review-confirm', query: { id: 'T1234567' } })
    wrapper = shallowMount(Actions, { localVue, router, vuetify })
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('Emits the error event for an expired NR', async () => {
    // mock the console.log function to hide "Eror on onClickFilePay():"
    const { log } = console
    delete console.log
    console.log = vi.fn()

    const mockBuildFiling = vi.spyOn(wrapper.vm, 'buildIncorporationFiling')

    await wrapper.vm.onClickFilePay()

    const rootWrapper = createWrapper(wrapper.vm.$root)

    expect(rootWrapper.emitted('name-request-invalid-error')).toEqual([['EXPIRED']])
    expect(mockBuildFiling).not.toHaveBeenCalled()
    expect(window.location.assign).not.toHaveBeenCalled()
    expect(wrapper.vm.$route.name).toBe('incorporation-review-confirm')

    // restore console.log
    console.log = log
  })
})

describe('Actions component - Filing Functionality', () => {
  let wrapper: any
  const { assign } = window.location
  const effectiveDate = new Date(new Date().setDate(new Date().getDate() + 5))
  const formattedEffectiveDate = effectiveDate.toISOString().replace('Z', '+00:00')

  // the filing body that would get sent to the API
  const filing = {
    header: {
      name: 'incorporationApplication',
      certifiedBy: 'Certified By',
      date: '2020/01/29',
      effectiveDate: formattedEffectiveDate,
      filingId: 1234,
      folioNumber: '123456',
      isFutureEffective: true
    },
    business: {
      identifier: 'T1234567',
      legalType: 'BEN'
    },
    incorporationApplication: {
      nameRequest: {
        nrNumber: 'NR 1234567',
        legalType: 'BEN',
        legalName: 'My Name Request Inc.'
      },
      nameTranslations: [],
      offices: {
        registeredOffice: {
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
        },
        recordsOffice: {
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
      },
      contactPoint: {
        email: 'registered-office@example.com',
        phone: '111-222-3333',
        extension: 444
      },
      parties: [
        {
          officer: {
            id: '1',
            firstName: 'Joe',
            lastName: 'Swanson',
            middleName: 'P',
            organizationName: '',
            partyType: 'person',
            email: 'completing-party@example.com'
          },
          mailingAddress: {
            streetAddress: 'mailing_address-addresslineone',
            streetAddressAdditional: '',
            addressCity: 'mailing_addresscity',
            addressCountry: 'CA',
            postalCode: 'H0H0H0',
            addressRegion: 'BC'
          },
          deliveryAddress: {
            streetAddress: 'delivery_address-addresslineone',
            streetAddressAdditional: '',
            addressCity: 'delivery_addresscity',
            addressCountry: 'CA',
            postalCode: 'H0H0H0',
            addressRegion: 'BC'
          },
          appointmentDate: '2018-01-01',
          roles: [
            {
              roleType: 'CompletingParty',
              appointmentDate: '2018-01-01'
            },
            {
              roleType: 'Director',
              appointmentDate: '2018-01-01'
            }
          ]
        },
        {
          officer: {
            id: '2',
            firstName: '',
            lastName: '',
            middleName: '',
            organizationName: 'XyzInc.',
            partyType: 'organization'
          },
          mailingAddress: {
            streetAddress: 'mailing_address-addresslineone',
            streetAddressAdditional: '',
            addressCity: 'mailing_addresscity',
            addressCountry: 'CA',
            postalCode: 'H0H0H0',
            addressRegion: 'BC'
          },
          appointmentDate: '2018-01-01',
          roles: [
            {
              roleType: 'Incorporator',
              appointmentDate: '2018-01-01'
            }
          ]
        }
      ],
      shareStructure: {
        shareClasses: [
          {
            id: '1',
            name: 'ShareClass1',
            priority: 1,
            hasMaximumShares: true,
            maxNumberOfShares: 100,
            hasParValue: true,
            parValue: 10,
            currency: 'CAD',
            hasRightsOrRestrictions: false,
            series: [
              {
                id: '1',
                name: 'ShareSeries1',
                priority: 1,
                hasMaximumShares: true,
                maxNumberOfShares: 50,
                hasRightsOrRestrictions: false
              },
              {
                id: '2',
                name: 'ShareSeries2',
                priority: 2,
                hasMaximumShares: true,
                maxNumberOfShares: 100,
                hasRightsOrRestrictions: false
              }
            ]
          },
          {
            id: '2',
            name: 'ShareClass2',
            priority: 1,
            hasMaximumShares: false,
            maxNumberOfShares: null,
            hasParValue: false,
            parValue: null,
            currency: null,
            hasRightsOrRestrictions: true,
            series: [

            ]
          }
        ]
      },
      incorporationAgreement: {
        agreementType: 'sample'
      }
    }
  }

  beforeEach(() => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: vi.fn() } as any

    // GET NR data
    sinon.stub(axios, 'get')
      .withArgs('nameRequests/NR 1234567')
      .returns(new Promise(resolve => resolve({
        data: { ...nrData }
      })))

    // init store
    store.stateModel.currentDate = '2020/01/29'
    store.stateModel.nameRequest = {
      legalType: CorpTypeCd.BENEFIT_COMPANY,
      nrNum: 'NR 1234567'
    } as NameRequestIF
    store.stateModel.nameRequestApprovedName = 'My Name Request Inc.'
    store.stateModel.nameTranslations = []
    store.stateModel.tombstone = {
      filingType: FilingTypes.INCORPORATION_APPLICATION,
      userEmail: 'completing-party@example.com',
      folioNumber: '123456',
      keycloakRoles: []
    } as TombstoneIF
    store.stateModel.certifyState.certifiedBy = filing.header.certifiedBy
    store.stateModel.businessContact = {
      email: filing.incorporationApplication.contactPoint.email,
      phone: filing.incorporationApplication.contactPoint.phone,
      extension: filing.incorporationApplication.contactPoint.extension
    }
    store.stateModel.effectiveDateTime.effectiveDate = effectiveDate
    store.stateModel.businessContact = {
      email: 'registered-office@example.com',
      confirmEmail: 'registered-office@example.com',
      phone: '111-222-3333',
      extension: 444
    }
    store.stateModel.defineCompanyStep.officeAddresses = filing.incorporationApplication.offices
    store.stateModel.tombstone.folioNumber = filing.header.folioNumber
    store.stateModel.addPeopleAndRoleStep.orgPeople = filing.incorporationApplication.parties as OrgPersonIF[]
    store.stateModel.createShareStructureStep.shareClasses =
      filing.incorporationApplication.shareStructure.shareClasses as ShareClassIF[]
    store.stateModel.filingId = 1234
    store.stateModel.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.tempId = 'T1234567'
    store.stateModel.effectiveDateTime.isFutureEffective = filing.header.isFutureEffective
    store.stateModel.incorporationAgreementStep.agreementType =
      filing.incorporationApplication.incorporationAgreement.agreementType
    store.stateModel.isSavingResuming = false

    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    router.push({ name: 'incorporation-define-company', query: { id: 'T1234567' } })
    wrapper = shallowMount(Actions, { localVue, router, vuetify })
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('Calls the buildIncorporationFiling method when onClickSave is called', async () => {
    // Mock the function call
    const mockBuildFiling = vi.spyOn(wrapper.vm, 'buildIncorporationFiling')

    // Work-around to interact with the stubbed vuetify button component in ShallowMount
    await wrapper.vm.onClickSave()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    // verify no redirection
    expect(window.location.assign).not.toHaveBeenCalled()

    // verify no routing
    expect(wrapper.vm.$route.name).toBe('incorporation-define-company')
  })

  it('Calls the updateFiling method with the correct filing structure when onClickSave is called', async () => {
    await wrapper.vm.onClickSave()

    expect(mockUpdateFiling).toHaveBeenCalledWith('T1234567', filing, true)
    expect(mockUpdateFiling).toHaveReturned()

    // verify no redirection
    expect(window.location.assign).not.toHaveBeenCalled()

    // verify no routing
    expect(wrapper.vm.$route.name).toBe('incorporation-define-company')
  })

  it('Calls the buildIncorporationFiling method when onClickSaveResume is called', async () => {
    const mockBuildFiling = vi.spyOn(wrapper.vm, 'buildIncorporationFiling')

    await wrapper.vm.onClickSaveResume()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    // also verify event emission
    const events = wrapper.emitted('goToDashboard')
    expect(events.length).toBe(1)
  })

  it('Calls the updateFiling method with the correct filing structure when onClickSaveResume is called', async () => {
    await wrapper.vm.onClickSaveResume()

    expect(mockUpdateFiling).toHaveBeenCalledWith('T1234567', filing, true)
    expect(mockUpdateFiling).toHaveReturned()

    // also verify event emission
    const events = wrapper.emitted('goToDashboard')
    expect(events.length).toBe(1)
  })

  it('Emits the error event for a PAD error', async () => {
    // mock the console.log function to hide "Eror on onClickFilePay():"
    const { log } = console
    delete console.log
    console.log = vi.fn()

    const padErrorFiling = {
      errors: [
        {
          message: 'Your account is in the 3 day PAD confirmation period. You will be able to do transactions only ' +
            'after the period is over.',
          payment_error_type: 'ACCOUNT_IN_PAD_CONFIRMATION_PERIOD'
        }
      ],
      filing
    }
    const mockBuildFiling = vi.spyOn(wrapper.vm, 'buildIncorporationFiling')
    mockUpdateFiling.mockReset()
      .mockImplementation(() => {
        return Promise.reject(padErrorFiling)
      })

    await wrapper.vm.onClickFilePay()
    await Vue.nextTick()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    expect(mockUpdateFiling).toHaveBeenCalledWith('T1234567', filing, false)
    expect(mockUpdateFiling).toHaveLastReturnedWith(padErrorFiling)

    const rootWrapper = createWrapper(wrapper.vm.$root)
    const events = rootWrapper.emitted('save-error-event')
    expect(events.length).toBe(1)
    expect(events[0][0].errors[0].message).toBe('Your account is in the 3 day PAD confirmation period. You ' +
      'will be able to do transactions only after the period is over.')

    expect(window.location.assign).not.toHaveBeenCalled()

    // restore console.log
    console.log = log
  })

  it('Calls the buildIncorporationFiling and updateFiling methods when onClickFilePay is called', async () => {
    const mockBuildFiling = vi.spyOn(wrapper.vm, 'buildIncorporationFiling')
    mockUpdateFiling.mockReset()
      .mockImplementation(() => Promise.resolve({
        header: {
          paymentToken: 789,
          isPaymentActionRequired: true
        }
      }))

    await wrapper.vm.onClickFilePay()

    expect(mockBuildFiling).toHaveBeenCalled()
    expect(mockBuildFiling).toHaveReturned()

    expect(mockUpdateFiling).toHaveBeenCalledWith('T1234567', filing, false)
    expect(mockUpdateFiling).toHaveReturned()

    // verify redirection
    const baseUrl = 'https://auth.web.url/makepayment/789/https%3A%2F%2Fdashboard.url%2FT1234567%3Ffiling_id%3D1234'
    expect(window.location.assign).toHaveBeenCalledWith(baseUrl)
  })

  it('Emits "Go To Dashboard" event when onClickCancel is called', async () => {
    const mockBuildFiling = vi.spyOn(wrapper.vm, 'buildIncorporationFiling')
    mockUpdateFiling.mockReset().mockImplementation(() => {})

    await wrapper.vm.onClickCancel()

    expect(mockBuildFiling).not.toHaveBeenCalled()
    expect(mockUpdateFiling).not.toHaveBeenCalled()

    // verify event emission
    const events = wrapper.emitted('goToDashboard')
    expect(events.length).toBe(1)
  })
})
