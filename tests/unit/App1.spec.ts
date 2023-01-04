import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import flushPromises from 'flush-promises'
import sinon from 'sinon'
import { getVuexStore } from '@/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { AxiosInstance as axios } from '@/utils'
import App from '@/App.vue'
import mockRouter from './MockRouter'

// mock fetch() as it is not defined in Jest
// NB: it should be `global.fetch` but that doesn't work and this does
window.fetch = jest.fn().mockImplementation(() => {
  return {
    headers: { get: () => new Date() },
    ok: true,
    statusTxt: ''
  }
})

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = jest.fn()

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

// Populate session variables
sessionStorage.setItem('AUTH_WEB_URL', 'https://auth.web.url/')
sessionStorage.setItem('DASHBOARD_URL', 'https://dashboard.url/')
sessionStorage.setItem('AUTH_API_URL', 'https://auth.api.url/')
sessionStorage.setItem('CURRENT_ACCOUNT', '{ "id": 668 }')
sessionStorage.setItem('PAY_API_URL', 'https://pay.api.url/')

describe('Incorporation - Define Company page for a BEN (numbered)', () => {
  let wrapper: any
  const { assign } = window.location

  beforeEach(async () => {
    // mock the window.location.assign function
    delete window.location
    window.location = { assign: jest.fn() } as any

    const get = sinon.stub(axios, 'get')

    // GET current user's info
    get.withArgs('https://auth.api.url/users/@me')
      .returns(new Promise(resolve => resolve({
        data:
        {
          contacts: [
            {
              email: 'completing-party@example.com',
              phone: '123-456-7890'
            }
          ],
          firstname: 'Completing',
          lastname: 'Party'
        }
      })))

    // GET specified org's info
    get.withArgs('https://auth.api.url/orgs/668')
      .returns(new Promise(resolve => resolve({
        data:
        {
          mailingAddress:
          {
            city: 'City',
            country: 'CA',
            region: 'BC',
            postalCode: 'V8V 8V8',
            street: '1234 Some Street',
            streetAdditional: 'Suite ABC'
          }
        }
      })))

    // GET authorizations (role)
    get.withArgs('https://auth.api.url/entities/T7654321/authorizations')
      .returns(new Promise(resolve => resolve({
        data:
        {
          roles: ['edit', 'view']
        }
      })))

    // GET IA filing
    get.withArgs('businesses/T7654321/filings')
      .returns(new Promise(resolve => resolve({
        data:
        {
          filing: {
            header: {
              name: 'incorporationApplication',
              filingId: 54321,
              status: 'DRAFT'
            },
            business: {
              identifier: 'T7654321',
              legalType: 'BEN'
            },
            incorporationApplication: {
              nameRequest: {
                legalType: 'BEN'
              }
            }
          }
        }
      })))

    // GET filing fees
    get.withArgs('https://pay.api.url/fees/BEN/BCINC?futureEffective=true')
      .returns(new Promise(resolve => resolve({
        data:
        {
          filingFees: { futureEffectiveFees: 100 }
        }
      })))

    // create a Local Vue and install router on it
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    router.push({ name: 'incorporation-define-company', query: { id: 'T7654321' } })

    wrapper = shallowMount(App, {
      localVue,
      store,
      router,
      vuetify,
      stubs: { Affix: true, SbcHeader: true }
    })

    // wait for all queries to complete
    await flushPromises()
  })

  afterEach(() => {
    window.location.assign = assign
    sinon.restore()
    wrapper.destroy()
  })

  it('loads a draft filing into the store', () => {
    // Validate IA for numbered company
    expect(store.state.stateModel.entityType).toBe('BEN')
    expect(store.state.stateModel.filingId).toBe(54321)

    // Validate no offices are loaded
    expect(store.state.stateModel.defineCompanyStep.officeAddresses)
      .toBeDefined()
    expect(store.state.stateModel.defineCompanyStep.officeAddresses.recordsOffice)
      .toBeUndefined()

    // Validate Contact Info
    expect(store.state.stateModel.businessContact)
      .toBeDefined()

    // Validate Share Structure
    expect(store.state.stateModel.createShareStructureStep.shareClasses)
      .toBeDefined()
  })

  it('does not load a name request into the store', () => {
    // Validate empty Name Request fields
    expect(store.state.stateModel.nameRequest.applicants).toEqual({})
    expect(store.state.stateModel.nameRequest.consentFlag).toBeNull()
    expect(store.state.stateModel.nameRequest.expirationDate).toBeNull()
    expect(store.state.stateModel.nameRequest.legalType).toBeNull()
    expect(store.state.stateModel.nameRequest.names).toEqual([])
    expect(store.state.stateModel.nameRequest.nrNum).toBe('')
    expect(store.state.stateModel.nameRequest.request_action_cd).toBeNull()
    expect(store.state.stateModel.nameRequest.state).toBeNull()

    // Validate empty Approved Name
    expect(store.state.stateModel.nameRequestApprovedName).toBeNull()
  })
})
