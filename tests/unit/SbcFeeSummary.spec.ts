import Vue from 'vue'
import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'
import sinon from 'sinon'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import SbcFeeSummary from 'sbc-common-components/src/components/SbcFeeSummary.vue'

Vue.use(Vuetify)
Vue.filter('currency', (x) => x)

const vuetify = new Vuetify({})

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

// Populate session variable
const payURL = 'https://pay.api.url/'
sessionStorage.setItem('PAY_API_URL', payURL)

describe('SBC Fee Summary - BEN voluntary dissolution', () => {
  const filingData = [{
    filingTypeCode: 'DIS_VOL',
    entityType: 'BEN',
    waiveFees: false,
    priority: false,
    futureEffective: false
  }]
  let wrapper: any

  beforeEach(async () => {
    const get = sinon.stub(axios, 'get')

    // GET BEN Voluntary Dissolution fees from SbcFeeSummary component
    get.withArgs('https://pay.api.url/fees/BEN/DIS_VOL')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          filingFees: 20.0,
          filingType: 'Voluntary dissolution',
          filingTypeCode: 'DIS_VOL',
          futureEffectiveFees: 0,
          priorityFees: 0,
          processingFees: 0,
          serviceFees: 1.50,
          tax: {
            'gst': 0,
            'pst': 0
          },
          total: 21.5
        }
      })))

    // GET BEN Voluntary Dissolution future effective fees from SbcFeeSummary component
    get.withArgs('https://pay.api.url/fees/BEN/DIS_VOL?futureEffective=true')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          filingFees: 20.0,
          filingType: 'Voluntary dissolution',
          filingTypeCode: 'DIS_VOL',
          futureEffectiveFees: 100.0,
          priorityFees: 0,
          processingFees: 0,
          serviceFees: 1.5,
          tax: {
            'gst': 0,
            'pst': 0
          },
          total: 121.5
        }
      })))

    wrapper = mount(SbcFeeSummary, { vuetify, propsData: { filingData, payURL } })
  })

  afterEach(() => {
    sinon.restore()
    wrapper.destroy()
  })

  it('calculates the correct fees', async () => {
    // wait for all queries to complete
    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain('Fee Summary')
    expect(text).toContain('Voluntary dissolution 20')
    expect(text).toContain('Service Fee 1.5')
    expect(text).toContain('Total Fees CAD 21.5')
  })

  it('calculates the correct fees when future effective', async () => {
    wrapper.setProps({ filingData: [
      { ...filingData[0], futureEffective: true }
    ] })
    // wait for all queries to complete
    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain('Fee Summary')
    expect(text).toContain('Voluntary dissolution 20')
    expect(text).toContain('Future Effective Fee 100')
    expect(text).toContain('Service Fee 1.5')
    expect(text).toContain('Total Fees CAD 121.5')
  })
})

describe('SBC Fee Summary - COOP voluntary dissolution', () => {
  const filingData = [
    {
      filingTypeCode: 'DIS_VOL',
      entityType: 'CP',
      waiveFees: false,
      priority: false,
      futureEffective: false
    },
    {
      filingTypeCode: 'AFDVT',
      entityType: 'CP',
      waiveFees: false,
      priority: false,
      futureEffective: false
    },
    {
      filingTypeCode: 'SPRLN',
      entityType: 'CP',
      waiveFees: false,
      priority: false,
      futureEffective: false
    }
  ]
  let wrapper: any

  beforeEach(async () => {
    const get = sinon.stub(axios, 'get')

    // GET CP Voluntary Dissolution fees from SbcFeeSummary component
    get.withArgs('https://pay.api.url/fees/CP/DIS_VOL')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          filingFees: 20.0,
          filingType: 'Voluntary dissolution',
          filingTypeCode: 'DIS_VOL',
          futureEffectiveFees: 0,
          priorityFees: 0,
          processingFees: 0,
          serviceFees: 0,
          tax: {
            'gst': 0,
            'pst': 0
          },
          total: 20.0
        }
      })))

    // GET CP Voluntary Dissolution future effective fees from SbcFeeSummary component
    get.withArgs('https://pay.api.url/fees/CP/DIS_VOL?futureEffective=true')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          filingFees: 20.0,
          filingType: 'Voluntary dissolution',
          filingTypeCode: 'DIS_VOL',
          futureEffectiveFees: 100.0,
          priorityFees: 0,
          processingFees: 0,
          serviceFees: 0,
          tax: {
            'gst': 0,
            'pst': 0
          },
          total: 120.0
        }
      })))

    // GET CP Voluntary Dissolution waive fees from SbcFeeSummary component
    get.withArgs('https://pay.api.url/fees/CP/DIS_VOL?waiveFees=true')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          filingFees: 0,
          filingType: 'Voluntary dissolution',
          filingTypeCode: 'DIS_VOL',
          futureEffectiveFees: 0,
          priorityFees: 0,
          processingFees: 0,
          serviceFees: 0,
          tax: {
            'gst': 0,
            'pst': 0
          },
          total: 0
        }
      })))

    // GET CP Special Resolution fees from SbcFeeSummary component
    get.withArgs('https://pay.api.url/fees/CP/SPRLN')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          filingFees: 70.0,
          filingType: 'Special resolution',
          filingTypeCode: 'SPRLN',
          futureEffectiveFees: 0,
          priorityFees: 0,
          processingFees: 0,
          serviceFees: 0,
          tax: {
            gst: 0,
            pst: 0
          },
          total: 70.0
        }
      })))

    // GET CP Special Resolution future effective fees from SbcFeeSummary component
    get.withArgs('https://pay.api.url/fees/CP/SPRLN?futureEffective=true')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          filingFees: 70.0,
          filingType: 'Special resolution',
          filingTypeCode: 'SPRLN',
          futureEffectiveFees: 100.0,
          priorityFees: 0,
          processingFees: 0,
          serviceFees: 0,
          tax: {
            gst: 0,
            pst: 0
          },
          total: 170.0
        }
      })))

    // GET CP Special Resolution waive fees
    get.withArgs('https://pay.api.url/fees/CP/SPRLN?waiveFees=true')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          filingFees: 0,
          filingType: 'Special resolution',
          filingTypeCode: 'SPRLN',
          futureEffectiveFees: 0,
          priorityFees: 0,
          processingFees: 0,
          serviceFees: 0,
          tax: {
            gst: 0,
            pst: 0
          },
          total: 0
        }
      })))

    // GET CP Affidavit fees from SbcFeeSummary component
    get.withArgs('https://pay.api.url/fees/CP/AFDVT')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          filingFees: 20.0,
          filingType: 'Affidavit',
          filingTypeCode: 'AFDVT',
          futureEffectiveFees: 0,
          priorityFees: 0,
          processingFees: 0,
          serviceFees: 0,
          tax: {
            gst: 0,
            pst: 0
          },
          total: 20.0
        }
      })))

    // GET CP Affidavit future effective fees from SbcFeeSummary component
    get.withArgs('https://pay.api.url/fees/CP/AFDVT?futureEffective=true')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          filingFees: 20.0,
          filingType: 'Affidavit',
          filingTypeCode: 'AFDVT',
          futureEffectiveFees: 100.0,
          priorityFees: 0,
          processingFees: 0,
          serviceFees: 0,
          tax: {
            gst: 0,
            pst: 0
          },
          total: 120.0
        }
      })))

    // GET CP Affidavit waive fees from SbcFeeSummary component
    get.withArgs('https://pay.api.url/fees/CP/AFDVT?waiveFees=true')
      .returns(new Promise((resolve) => resolve({
        data:
        {
          filingFees: 0,
          filingType: 'Affidavit',
          filingTypeCode: 'AFDVT',
          futureEffectiveFees: 0,
          priorityFees: 0,
          processingFees: 0,
          serviceFees: 0,
          tax: {
            gst: 0,
            pst: 0
          },
          total: 0
        }
      })))

    wrapper = mount(SbcFeeSummary, { vuetify, propsData: { filingData, payURL } })
  })

  afterEach(() => {
    sinon.restore()
    wrapper.destroy()
  })

  it('calculates the correct fees', async () => {
    // wait for all queries to complete
    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain('Fee Summary')
    expect(text).toContain('Voluntary dissolution 20')
    expect(text).toContain('Affidavit 20')
    expect(text).toContain('Special resolution 70')
    expect(text).toContain('Total Fees CAD 110')
  })

  it('calculates the correct fees when future effective', async () => {
    wrapper.setProps({ filingData: [
      { ...filingData[0], futureEffective: true },
      filingData[1],
      filingData[2]
    ] })
    // wait for all queries to complete
    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain('Fee Summary')
    expect(text).toContain('Voluntary dissolution 20')
    expect(text).toContain('Future Effective Fee 100')
    expect(text).toContain('Affidavit 20')
    expect(text).toContain('Special resolution 70')
    expect(text).toContain('Total Fees CAD 210')
  })

  it('calculates 0 fees for no fee option', async () => {
    wrapper.setProps({ filingData: [
      { ...filingData[0], waiveFees: true },
      { ...filingData[1], waiveFees: true },
      { ...filingData[2], waiveFees: true }
    ] })
    // wait for all queries to complete
    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain('Fee Summary')
    expect(text).toContain('Voluntary dissolution No Fee')
    expect(text).toContain('Affidavit No Fee')
    expect(text).toContain('Special resolution No Fee')
    expect(text).toContain('Total Fees CAD 0')
  })
})
