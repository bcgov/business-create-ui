// Libraries
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'

// Utils
import { createLocalVue, mount } from '@vue/test-utils'

// Components
import { ListShareClass } from '@/components/CreateShareStructure'

Vue.use(Vuetify)
Vue.use(Vuelidate)

describe('List Shares and Series', () => {
  let vuetify
  let wrapper

  const shareClasses = [
    {
      id: 1,
      name: 'Common Shares',
      priority: 0,
      maxNumberOfShares: 10000,
      parValue: 1.00,
      currency: 'Canadian Dollar ($CDN)',
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
      parValue: 1.00,
      currency: 'Canadian Dollar ($CDN)',
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

  beforeEach(() => {
    const localVue = createLocalVue()
    vuetify = new Vuetify({})

    wrapper = mount(ListShareClass, {
      localVue,
      vuetify,
      propsData: {
        shareClasses: shareClasses
      }
    })
  })

  afterEach(async () => {
    await wrapper.destroy()
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
    expect(classListItem1.querySelectorAll('td')[1].textContent).toContain(10000)
    expect(classListItem1.querySelectorAll('td')[2].textContent).toContain('$1')
    expect(classListItem1.querySelectorAll('td')[3].textContent).toContain('Canadian Dollar ($CDN)')
    expect(classListItem1.querySelectorAll('td')[4].textContent).toContain('Yes')

    const classListItem2 = wrapper.vm.$el.querySelectorAll('.v-data-table .class-row')[3]

    expect(classListItem2.querySelectorAll('td')[0].textContent).toContain('Non-voting Shares 2')
    expect(classListItem2.querySelectorAll('td')[1].textContent).toContain(1000)
    expect(classListItem2.querySelectorAll('td')[2].textContent).toContain('No Par Value')
    expect(classListItem2.querySelectorAll('td')[3].textContent).toContain('')
    expect(classListItem2.querySelectorAll('td')[4].textContent).toContain('No')
  })

  it('displays the correct data in the selected table rows for ShareSeries', () => {
    const seriesListItem1 = wrapper.vm.$el.querySelectorAll('.v-data-table .series-row')[1]

    expect(seriesListItem1.querySelectorAll('td')[0].textContent).toContain('Share Series 2')
    expect(seriesListItem1.querySelectorAll('td')[1].textContent).toContain(100)
    expect(seriesListItem1.querySelectorAll('td')[2].textContent).toContain('$1.00')
    expect(seriesListItem1.querySelectorAll('td')[3].textContent).toContain('Canadian Dollar ($CDN)')
    expect(seriesListItem1.querySelectorAll('td')[4].textContent).toContain('No')

    const seriesListItem2 = wrapper.vm.$el.querySelectorAll('.v-data-table .series-row')[2]

    expect(seriesListItem2.querySelectorAll('td')[0].textContent).toContain('Share Series 3')
    expect(seriesListItem2.querySelectorAll('td')[1].textContent).toContain(50)
    expect(seriesListItem2.querySelectorAll('td')[2].textContent).toContain('No Par Value')
    expect(seriesListItem2.querySelectorAll('td')[3].textContent).toContain('')
    expect(seriesListItem2.querySelectorAll('td')[4].textContent).toContain('No')
  })
})
