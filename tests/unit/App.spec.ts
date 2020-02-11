// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import axios from '@/utils/axios-auth'
import sinon from 'sinon'
import { store } from '@/store'
import { shallowMount, createLocalVue } from '@vue/test-utils'

// Components
import App from '@/App.vue'
import SbcHeader from 'sbc-common-components/src/components/SbcHeader.vue'
import SbcFooter from 'sbc-common-components/src/components/SbcFooter.vue'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'
import { EntityInfo, Stepper, Actions } from '@/components/common'

// Other
import mockRouter from './MockRouter'

Vue.use(Vuetify)
let vuetify = new Vuetify({})

describe('App component', () => {
  let wrapper: any

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()
    wrapper = shallowMount(App, { localVue, store, router, vuetify, stubs: { Affix: true } })
  })

  afterEach(() => {
    wrapper.destroy()
    sinon.restore()
  })

  it('renders the sub-components properly', () => {
    expect(wrapper.find(SbcHeader).exists()).toBe(true)
    expect(wrapper.find(SbcFooter).exists()).toBe(true)
    expect(wrapper.find(SbcFeeSummary).exists()).toBe(true)
    expect(wrapper.find(EntityInfo).exists()).toBe(true)
    expect(wrapper.find(Stepper).exists()).toBe(true)
    expect(wrapper.find(Actions).exists()).toBe(true)
  })

  it('loads a draft filing into store', async () => {
    // Mock Filing response from api
    const data = {
      header: {
        name: 'incorporationApplication',
        filingId: 12345,
        status: 'draft'
      },
      incorporationApplication: {
        contactPoint: {
          email: 'mockEmail@mock.com',
          phone: '(250) 123-4567'
        },
        nameRequest: {
          legalType: 'BC',
          nrNumber: 'NR7654446'
        },
        offices: {
          registeredOffice: {
            deliveryAddress: {
              streetAddress: 'delivery_address - address line one',
              addressCity: 'delivery_address city',
              addressCountry: 'delivery_address country',
              postalCode: 'H0H0H0',
              addressRegion: 'BC'
            },
            mailingAddress: {
              streetAddress: 'mailing_address - address line one',
              addressCity: 'mailing_address city',
              addressCountry: 'mailing_address country',
              postalCode: 'H0H0H0',
              addressRegion: 'BC'
            }
          },
          recordsOffice: {
            deliveryAddress: {
              streetAddress: 'delivery_address - address line one',
              addressCity: 'delivery_address city',
              addressCountry: 'delivery_address country',
              postalCode: 'H0H0H0',
              addressRegion: 'BC'
            },
            mailingAddress: {
              streetAddress: 'mailing_address - address line one',
              addressCity: 'mailing_address city',
              addressCountry: 'mailing_address country',
              postalCode: 'H0H0H0',
              addressRegion: 'BC'
            }
          }
        }
      }
    }
    await wrapper.vm.parseDraft(data)

    // Validate nrData
    expect(store.state.stateModel.nameRequest.entityType).toBe('BC')
    expect(store.state.stateModel.nameRequest.filingId).toBe(12345)

    // Validate Office Addresses
    expect(store.state.stateModel.defineCompanyStep.officeAddresses.registeredOffice)
      .toBe(data.incorporationApplication.offices.registeredOffice)
    expect(store.state.stateModel.defineCompanyStep.officeAddresses.recordsOffice)
      .toBe(data.incorporationApplication.offices.recordsOffice)

    // Validate Contact Info
    expect(store.state.stateModel.defineCompanyStep.businessContact).toBe(data.incorporationApplication.contactPoint)
  })
})
