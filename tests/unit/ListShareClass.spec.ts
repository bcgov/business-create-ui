import Vuetify from 'vuetify'
import { createPinia, setActivePinia } from 'pinia'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import ListShareClass from '@/components/common/ListShareClass.vue'
import MessageBoxWarning from '@/components/common/MessageBoxWarning.vue'
import { AmalgamationTypes, FilingTypes } from '@/enums'
import flushPromises from 'flush-promises'

const vuetify = new Vuetify({})
const localVue = createLocalVue()
setActivePinia(createPinia())

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('List Shares and Series component', () => {
  let wrapper

  const shareClasses = [
    {
      id: 1,
      name: 'Common Shares',
      priority: 0,
      maxNumberOfShares: 10000,
      parValue: 1.58,
      currency: 'CAD',
      hasRightsOrRestrictions: true,
      series: [
        {
          id: 1,
          name: 'Share Series 1',
          priority: 1,
          hasMaximumShares: true,
          maxNumberOfShares: 50,
          hasRightsOrRestrictions: false
        },
        {
          id: 2,
          name: 'Share Series 2',
          priority: 2,
          hasMaximumShares: true,
          maxNumberOfShares: 100,
          hasRightsOrRestrictions: false
        }
      ]
    },
    {
      id: 2,
      name: 'Non-voting Shares',
      priority: 1,
      maxNumberOfShares: 1000,
      parValue: null,
      currency: '',
      hasRightsOrRestrictions: false,
      series: [
        {
          id: 1,
          name: 'Share Series 3',
          priority: 1,
          hasMaximumShares: true,
          maxNumberOfShares: 50,
          hasRightsOrRestrictions: false
        }
      ]
    },
    {
      id: 3,
      name: 'Common Shares 2',
      priority: 2,
      maxNumberOfShares: 10000,
      parValue: 0.568,
      currency: 'CAD',
      hasRightsOrRestrictions: true,
      series: []
    },
    {
      id: 4,
      priority: 3,
      name: 'Non-voting Shares 2',
      maxNumberOfShares: 1000,
      parValue: null,
      currency: '',
      hasRightsOrRestrictions: false,
      series: []
    }]

  beforeEach(async () => {
    wrapper = mount(ListShareClass, {
      localVue,
      vuetify,
      propsData: { shareClasses }
    })
    await flushPromises()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('displays the correct amount of share classes / series when data is present', () => {
    const classRowCount = wrapper.vm.$el.querySelectorAll('.v-data-table .class-row').length
    const seriesRowCount = wrapper.vm.$el.querySelectorAll('.v-data-table .series-row').length

    expect(classRowCount).toEqual(4)
    expect(seriesRowCount).toEqual(3)
  })

  it('displays the correct name data in the share classes / series table', () => {
    const classListItem1 = wrapper.vm.$el.querySelectorAll('.v-data-table .class-row')[0]
    const seriesListItem1 = wrapper.vm.$el.querySelectorAll('.v-data-table .series-row')[0]

    expect(classListItem1.querySelector('.list-item__title').textContent).toContain('Common Shares')
    expect(seriesListItem1.querySelector('.series-name').textContent).toContain('Share Series 1')
  })

  it('displays the correct data in the selected table rows for shareClass', () => {
    const classListItem1 = wrapper.vm.$el.querySelectorAll('.v-data-table .class-row')[2]

    expect(classListItem1.querySelectorAll('td')[0].textContent).toContain('Common Shares 2')
    expect(classListItem1.querySelectorAll('td')[1].textContent).toContain('10,000')
    expect(classListItem1.querySelectorAll('td')[2].textContent).toContain('0.568')
    expect(classListItem1.querySelectorAll('td')[3].textContent).toContain('CAD')
    expect(classListItem1.querySelectorAll('td')[4].textContent).toContain('Yes')

    const classListItem2 = wrapper.vm.$el.querySelectorAll('.v-data-table .class-row')[3]

    expect(classListItem2.querySelectorAll('td')[0].textContent).toContain('Non-voting Shares 2')
    expect(classListItem2.querySelectorAll('td')[1].textContent).toContain('1,000')
    expect(classListItem2.querySelectorAll('td')[2].textContent).toContain('No Par Value')
    expect(classListItem2.querySelectorAll('td')[3].textContent).toContain('')
    expect(classListItem2.querySelectorAll('td')[4].textContent).toContain('No')
  })

  it('displays the correct data in the selected table rows for ShareSeries', () => {
    const seriesListItem1 = wrapper.vm.$el.querySelectorAll('.v-data-table .series-row')[1]

    expect(seriesListItem1.querySelectorAll('td')[0].textContent).toContain('Share Series 2')
    expect(seriesListItem1.querySelectorAll('td')[1].textContent).toContain('100')
    expect(seriesListItem1.querySelectorAll('td')[2].textContent).toContain('1.58')
    expect(seriesListItem1.querySelectorAll('td')[3].textContent).toContain('CAD')
    expect(seriesListItem1.querySelectorAll('td')[4].textContent).toContain('No')

    const seriesListItem2 = wrapper.vm.$el.querySelectorAll('.v-data-table .series-row')[2]

    expect(seriesListItem2.querySelectorAll('td')[0].textContent).toContain('Share Series 3')
    expect(seriesListItem2.querySelectorAll('td')[1].textContent).toContain('50')
    expect(seriesListItem2.querySelectorAll('td')[2].textContent).toContain('No Par Value')
    expect(seriesListItem2.querySelectorAll('td')[3].textContent).toContain('')
    expect(seriesListItem2.querySelectorAll('td')[4].textContent).toContain('No')
  })

  it('assigns the correct data for ShareClasses after moving an item', async () => {
    // Validate the Class values pre move
    expect(wrapper.vm.$props.shareClasses[0].name).toBe('Common Shares')
    expect(wrapper.vm.$props.shareClasses[1].name).toBe('Non-voting Shares')

    // Validate the Series values pre move
    expect(wrapper.vm.$props.shareClasses[0].series[0].name).toBe('Share Series 1')
    expect(wrapper.vm.$props.shareClasses[0].series[1].name).toBe('Share Series 2')

    // Identify and click the dropdown menu
    const dropDownMenu = wrapper.find('.more-actions-btn')
    await dropDownMenu.trigger('click')

    expect(wrapper.find('.move-up-selector').exists()).toBe(true)
    expect(wrapper.find('.move-down-selector').exists()).toBe(true)

    const moveDown = wrapper.find('.move-down-selector')
    await moveDown.trigger('click')

    // Validate class data post move
    expect(wrapper.vm.$props.shareClasses[0].name).toBe('Non-voting Shares')
    expect(wrapper.vm.$props.shareClasses[1].name).toBe('Common Shares')

    // Validate series data post move
    expect(wrapper.vm.$props.shareClasses[0].series[0].name).toBe('Share Series 3')
  })
})

describe('formatParValue()', () => {
  let wrapper

  beforeAll(() => {
    wrapper = shallowMount(ListShareClass)
  })

  afterAll(() => {
    wrapper.destroy()
  })

  it('formats null par value correctly', () => {
    // NB: zero par values are invalid
    expect(wrapper.vm.formatParValue({ parValue: null })).toBe('No Par Value')
  })

  it('formats par values for specific currencies correctly', () => {
    const parValues = [
      // very small number
      { currency: 'CAD', parValue: 1E-20, expected: '$0.00000000000000000001' },
      // very large number
      { currency: 'CAD', parValue: 1E38, expected: '$100,000,000,000,000,000,000,000,000,000,000,000,000.00' },
      // maximum significant digits
      { currency: 'CAD', parValue: 0.1234567890123456, expected: '$0.1234567890123456' },
      { currency: 'CAD', parValue: 1234567890123456, expected: '$1,234,567,890,123,456.00' },
      // misc numbers / different currencies
      { currency: 'USD', parValue: 0.01, expected: '$0.01' },
      { currency: 'AUD', parValue: 0.01, expected: '$0.01' },
      { currency: 'CAD', parValue: 0.01, expected: '$0.01' },
      { currency: 'CAD', parValue: 0.1, expected: '$0.10' },
      { currency: 'CAD', parValue: 1, expected: '$1.00' },
      { currency: 'CAD', parValue: 1000000, expected: '$1,000,000.00' },
      { currency: 'CAD', parValue: 1000000.1234, expected: '$1,000,000.1234' }
    ]

    parValues.forEach(({ currency, parValue, expected }) => {
      expect(wrapper.vm.formatParValue({ parValue, currency })).toBe(expected)
    })
  })

  it('formats par values for other currencies correctly', () => {
    const parValues = [
      // very small number
      { currency: '', parValue: 1E-20, expected: '0.00000000000000000001' },
      // very large number
      { currency: '', parValue: 1E38, expected: '100,000,000,000,000,000,000,000,000,000,000,000,000' },
      // maximum significant digits
      { currency: '', parValue: 0.1234567890123456, expected: '0.1234567890123456' },
      { currency: '', parValue: 1234567890123456, expected: '1,234,567,890,123,456' },
      // misc numbers
      { currency: '', parValue: 0.01, expected: '0.01' },
      { currency: '', parValue: 0.1, expected: '0.1' },
      { currency: '', parValue: 1, expected: '1' },
      { currency: '', parValue: 1000000, expected: '1,000,000' },
      { currency: '', parValue: 1000000.1234, expected: '1,000,000.1234' }
    ]

    parValues.forEach(({ currency, parValue, expected }) => {
      expect(wrapper.vm.formatParValue({ parValue, currency })).toBe(expected)
    })
  })
})

describe('series currency rendering', () => {
  const makeWrapper = (shareClasses) => mount(ListShareClass, {
    localVue,
    vuetify,
    propsData: { shareClasses }
  })

  it('falls back to the parent class currency when the series currency is unset', async () => {
    const wrapper = makeWrapper([{
      id: 1,
      name: 'Class A',
      priority: 0,
      maxNumberOfShares: 100,
      parValue: 1,
      currency: 'CAD',
      hasRightsOrRestrictions: false,
      series: [{
        id: 1,
        name: 'Series A1',
        priority: 1,
        maxNumberOfShares: 10,
        hasRightsOrRestrictions: false
      }]
    }])
    await flushPromises()

    const seriesRow = wrapper.vm.$el.querySelectorAll('.v-data-table .series-row')[0]
    expect(seriesRow.querySelectorAll('td')[3].textContent).toContain('CAD')
    wrapper.destroy()
  })

  it('uses the series\' own currency when it differs from the parent class', async () => {
    const wrapper = makeWrapper([{
      id: 1,
      name: 'Class A',
      priority: 0,
      maxNumberOfShares: 100,
      parValue: 1,
      currency: 'CAD',
      hasRightsOrRestrictions: false,
      series: [{
        id: 1,
        name: 'Series A1',
        priority: 1,
        maxNumberOfShares: 10,
        currency: 'USD',
        hasRightsOrRestrictions: false
      }]
    }])
    await flushPromises()

    const seriesRow = wrapper.vm.$el.querySelectorAll('.v-data-table .series-row')[0]
    expect(seriesRow.querySelectorAll('td')[3].textContent).toContain('USD')
    wrapper.destroy()
  })

  it('uses the series\' currencyAdditional when the series carries legacy OTHER currency', async () => {
    const wrapper = makeWrapper([{
      id: 1,
      name: 'Class A',
      priority: 0,
      maxNumberOfShares: 100,
      parValue: 1,
      currency: 'CAD',
      hasRightsOrRestrictions: false,
      series: [{
        id: 1,
        name: 'Series A1',
        priority: 1,
        maxNumberOfShares: 10,
        currency: 'OTHER',
        currencyAdditional: 'Bitcoin',
        hasRightsOrRestrictions: false
      }]
    }])
    await flushPromises()

    const seriesRow = wrapper.vm.$el.querySelectorAll('.v-data-table .series-row')[0]
    expect(seriesRow.querySelectorAll('td')[3].textContent).toContain('Bitcoin')
    wrapper.destroy()
  })
})

describe('formatCurrency()', () => {
  let wrapper

  beforeAll(() => {
    wrapper = shallowMount(ListShareClass)
  })

  afterAll(() => {
    wrapper.destroy()
  })

  it('returns the currency code for standard ISO currencies', () => {
    expect(wrapper.vm.formatCurrency({ currency: 'CAD' })).toBe('CAD')
    expect(wrapper.vm.formatCurrency({ currency: 'USD' })).toBe('USD')
    expect(wrapper.vm.formatCurrency({ currency: 'EUR' })).toBe('EUR')
  })

  it('returns the free-text value for grandfathered OTHER currency', () => {
    expect(wrapper.vm.formatCurrency({ currency: 'OTHER', currencyAdditional: 'Bitcoin' }))
      .toBe('Bitcoin')
    expect(wrapper.vm.formatCurrency({ currency: 'OTHER', currencyAdditional: 'Swiss Francs' }))
      .toBe('Swiss Francs')
  })

  it('falls back to "Other" when OTHER currency has no free-text value', () => {
    expect(wrapper.vm.formatCurrency({ currency: 'OTHER', currencyAdditional: '' })).toBe('Other')
    expect(wrapper.vm.formatCurrency({ currency: 'OTHER', currencyAdditional: null })).toBe('Other')
    expect(wrapper.vm.formatCurrency({ currency: 'OTHER' })).toBe('Other')
  })
})

describe('error summary messaging', () => {
  it('shows the return link for a regular amalgamation', () => {
    const wrapper = shallowWrapperFactory(ListShareClass,
      { shareClasses: [], isSummary: true, showErrorSummary: true, isAmalgamationFiling: true },
      {
        amalgamation: { type: AmalgamationTypes.REGULAR },
        tombstone: { filingType: FilingTypes.AMALGAMATION_APPLICATION }
      }
    )

    const message = wrapper.find('.share-summary-invalid-message').text()
    expect(message).toContain('This step is unfinished.')
    expect(message).toContain('Return to this step to finish it')

    // the red border spans the whole section (message + table)
    expect(wrapper.find('section.invalid-section').exists()).toBe(true)

    wrapper.destroy()
  })

  it('directs short-form amalgamations to the holding/primary business', () => {
    const wrapper = shallowWrapperFactory(ListShareClass,
      { shareClasses: [], isSummary: true, showErrorSummary: true, isAmalgamationFiling: true },
      {
        amalgamation: { type: AmalgamationTypes.HORIZONTAL },
        tombstone: { filingType: FilingTypes.AMALGAMATION_APPLICATION }
      }
    )

    // the warning is a red message box with the fix-path instructions
    const messageBox = wrapper.find('.share-summary-invalid-message').findComponent(MessageBoxWarning)
    expect(messageBox.exists()).toBe(true)
    const messages = messageBox.props('messages')
    expect(messages[0].prefix).toBe('Incomplete or incorrect shares or share structure:')
    expect(messages[1].message).toContain('open the primary company')
    expect(wrapper.find('#router-link').exists()).toBe(false)

    // the red border is on the share table only, not the section around the message box
    // (the table is stubbed in this shallow render, so match the class alone)
    expect(wrapper.find('section.invalid-section').exists()).toBe(false)
    expect(wrapper.find('.invalid-section').exists()).toBe(true)

    wrapper.destroy()
  })
})
