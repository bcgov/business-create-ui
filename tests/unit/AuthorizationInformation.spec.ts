import Vue from 'vue'
import { wrapperFactory } from '../vitest-wrapper-factory'
import AuthorizationInformation from '@/components/ContinuationIn/AuthorizationInformation.vue'

describe('Authorization Information component', () => {
  it('renders the component correctly', async () => {
    const wrapper = wrapperFactory(
      AuthorizationInformation,
      null,
      null,
      null,
      null,
      // declare computed property to override computed property:
      {
        isExpro: () => true
      }
    )
    await Vue.nextTick()

    // verify main component exists
    expect(wrapper.findComponent(AuthorizationInformation).exists()).toBe(true)
    expect(wrapper.find('#authorization-information').exists()).toBe(true)

    // spot check some content (structure / text)
    const rows = wrapper.findAll('.row')
    expect(rows.length).toBe(5)

    expect(rows.at(0).find('label').text()).toBe('Extraprovincial Registration in B.C.')
    expect(rows.at(0).findAll('li > strong').at(0).text()).toBe('Registration Number in B.C.:')
    expect(rows.at(0).findAll('li > strong').at(1).text()).toBe('Registered Name in B.C.:')
    expect(rows.at(0).findAll('li > strong').at(2).text()).toBe('Date of Registration in B.C.:')

    expect(rows.at(1).find('label').text()).toBe('Previous Jurisdiction Information')
    expect(rows.at(1).findAll('li > strong').at(0).text()).toBe('Previous Jurisdiction:')
    expect(rows.at(1).findAll('li > strong').at(1).text()).toBe('Identifying Number:')
    expect(rows.at(1).findAll('li > strong').at(2).text()).toBe('Registered Name:')
    expect(rows.at(1).findAll('li > strong').at(3).text()).toBe('Business Number:')
    expect(rows.at(1).findAll('li > strong').at(4).text()).toBe('Date of Incorporation, Continuation, or Amalgamation:')

    expect(rows.at(2).find('label').text()).toBe('Proof of Authorization')

    expect(rows.at(3).find('label').text()).toBe('Unlimited Liability Corporation Information')

    expect(rows.at(4).find('label').text()).toBe('Confirmation')
    expect(rows.at(4).find('.v-input--checkbox').text()).toContain('I understand that the extraprovincial')

    wrapper.destroy()
  })
})
