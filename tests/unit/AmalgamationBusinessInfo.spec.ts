/* eslint-disable max-len */
import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import { AmalgamationBusinessInfo } from '@/views'
import OfficeAddresses from '@/components/common/OfficeAddresses.vue'
import BusinessContactInfo from '@/components/common/BusinessContactInfo.vue'
import { AmalgamationTypes, CorpTypeCd, FilingTypes } from '@bcrs-shared-components/enums'
import MessageBox from '@/components/common/MessageBox.vue'
import MessageBoxWarning from '@/components/common/MessageBoxWarning.vue'

describe('Amalgamation Business Information - regular amalgamation', () => {
  let wrapper: any

  beforeAll(() => {
    wrapper = shallowWrapperFactory(
      AmalgamationBusinessInfo,
      null,
      {
        amalgamation: { type: AmalgamationTypes.REGULAR },
        entityType: CorpTypeCd.BC_COMPANY,
        tombstone: { filingType: FilingTypes.AMALGAMATION_APPLICATION }
      },
      null,
      null
    )
  })

  afterAll(() => {
    wrapper.destroy()
  })

  it('renders the page', () => {
    expect(wrapper.find('#amalgamation-business-info').exists()).toBe(true)
  })

  it('renders office addresses section', () => {
    const section = wrapper.findAll('section').at(0)
    expect(section.find('header h2').text()).toBe('Registered and Records Office Addresses')
    expect(section.find('header p').text()).toContain('Enter the Registered Office and Records Office Mailing and Delivery Addresses of the resulting')
    expect(section.findComponent(OfficeAddresses).exists()).toBe(true)
    expect(section.findComponent(MessageBoxWarning).exists()).toBe(false)
  })

  it('renders contact information section', () => {
    const section = wrapper.findAll('section').at(1)
    expect(section.find('header h2').text()).toBe('Registered Office Contact Information')
    expect(section.find('header p').text()).toContain('Enter the contact information for the resulting business. The BC Business Registry will use this')
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
  })
})

describe('Amalgamation Business Information - horizontal amalgamation', () => {
  let wrapper: any

  beforeAll(() => {
    wrapper = shallowWrapperFactory(
      AmalgamationBusinessInfo,
      null,
      {
        amalgamation: { type: AmalgamationTypes.HORIZONTAL },
        entityType: CorpTypeCd.BC_COMPANY,
        tombstone: { filingType: FilingTypes.AMALGAMATION_APPLICATION }
      },
      null,
      null
    )
  })

  afterAll(() => {
    wrapper.destroy()
  })

  it('renders the page', () => {
    expect(wrapper.find('#amalgamation-business-info').exists()).toBe(true)
  })

  it('renders office addresses section', () => {
    const section = wrapper.findAll('section').at(0)
    expect(section.find('header h2').text()).toBe('Registered and Records Office Addresses')
    expect(section.find('header p').text()).toContain('Delivery Addresses of the primary business')
    // default store state has no adopted offices, so the invalid-addresses warning shows
    const messageBox = section.findComponent(MessageBoxWarning)
    expect(messageBox.exists()).toBe(true)
    const messages = messageBox.props('messages')
    expect(messages.length).toBe(3)
    expect(messages[0].prefix).toBe('Incomplete or incorrect Address:')
    expect(messages[1].message).toContain('open the primary company')
    expect(messages[2].prefix).toBe('Note:')
    expect(messages[2].message).toContain('Address changes take effect at 12:01 am Pacific time')
    expect(section.findComponent(OfficeAddresses).exists()).toBe(true)
  })

  it('renders contact information section', () => {
    const section = wrapper.findAll('section').at(1)
    expect(section.find('header h2').text()).toBe('Registered Office Contact Information')
    expect(section.find('header p').text()).toContain('The resulting business will use this contact information adopted from the primary business in this')
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
  })
})

describe('Amalgamation Business Information - short-form office addresses error bar', () => {
  const VALID_BC_ADDRESS = {
    streetAddress: '123 Fake Street',
    streetAddressAdditional: '',
    addressCity: 'Victoria',
    addressRegion: 'BC',
    postalCode: 'V8Z 5C6',
    addressCountry: 'CA',
    deliveryInstructions: ''
  }
  const COMPLETE_OFFICES = {
    registeredOffice: { mailingAddress: VALID_BC_ADDRESS, deliveryAddress: VALID_BC_ADDRESS },
    recordsOffice: { mailingAddress: VALID_BC_ADDRESS, deliveryAddress: VALID_BC_ADDRESS }
  }
  const INCOMPLETE_OFFICES = {
    registeredOffice: {
      mailingAddress: { ...VALID_BC_ADDRESS, streetAddress: '' },
      deliveryAddress: VALID_BC_ADDRESS
    },
    recordsOffice: { mailingAddress: VALID_BC_ADDRESS, deliveryAddress: VALID_BC_ADDRESS }
  }

  const factory = (officeAddresses: any, showErrors: boolean): any => {
    return shallowWrapperFactory(
      AmalgamationBusinessInfo,
      null,
      {
        amalgamation: { type: AmalgamationTypes.HORIZONTAL },
        defineCompanyStep: { officeAddresses },
        entityType: CorpTypeCd.BC_COMPANY,
        showErrors,
        tombstone: { filingType: FilingTypes.AMALGAMATION_APPLICATION }
      },
      null,
      null
    )
  }

  // NB - scope to the offices section (the contact card below has its own invalid-section binding)
  it('shows the red error bar when adopted offices are incomplete and errors are shown', () => {
    const wrapper = factory(INCOMPLETE_OFFICES, true)
    expect(wrapper.findAll('section').at(0).find('.invalid-section').exists()).toBe(true)
    wrapper.destroy()
  })

  it('does not show the red error bar when adopted offices are complete', () => {
    const wrapper = factory(COMPLETE_OFFICES, true)
    expect(wrapper.findAll('section').at(0).find('.invalid-section').exists()).toBe(false)
    wrapper.destroy()
  })

  it('does not show the red error bar when errors are not shown', () => {
    const wrapper = factory(INCOMPLETE_OFFICES, false)
    expect(wrapper.findAll('section').at(0).find('.invalid-section').exists()).toBe(false)
    wrapper.destroy()
  })

  it('shows the warning box (not the gold box) when adopted offices are incomplete', () => {
    const wrapper = factory(INCOMPLETE_OFFICES, false)
    const section = wrapper.findAll('section').at(0)
    const messageBox = section.findComponent(MessageBoxWarning)
    expect(messageBox.exists()).toBe(true)
    expect(messageBox.props('messages')[0].prefix).toBe('Incomplete or incorrect Address:')
    expect(section.findComponent(MessageBox).exists()).toBe(false)
    wrapper.destroy()
  })

  it('shows the gold box (not the warning box) when adopted offices are complete', () => {
    const wrapper = factory(COMPLETE_OFFICES, true)
    const section = wrapper.findAll('section').at(0)
    expect(section.findComponent(MessageBoxWarning).exists()).toBe(false)
    const goldBox = section.findComponent(MessageBox)
    expect(goldBox.exists()).toBe(true)
    expect(goldBox.attributes('color')).toBe('gold')
    expect(goldBox.text()).toContain('visit the primary')
    wrapper.destroy()
  })
})

describe('Amalgamation Business Information - vertical amalgamation', () => {
  let wrapper: any

  beforeAll(() => {
    wrapper = shallowWrapperFactory(
      AmalgamationBusinessInfo,
      null,
      {
        amalgamation: { type: AmalgamationTypes.VERTICAL },
        // reset the offices set by the error-bar describe above (the store is shared)
        defineCompanyStep: { officeAddresses: {} },
        entityType: CorpTypeCd.BC_COMPANY,
        tombstone: { filingType: FilingTypes.AMALGAMATION_APPLICATION }
      },
      null,
      null
    )
  })

  afterAll(() => {
    wrapper.destroy()
  })

  it('renders the page', () => {
    expect(wrapper.find('#amalgamation-business-info').exists()).toBe(true)
  })

  it('renders office addresses section', () => {
    const section = wrapper.findAll('section').at(0)
    expect(section.find('header h2').text()).toBe('Registered and Records Office Addresses')
    expect(section.find('header p').text()).toContain('Delivery Addresses of the holding business')
    // default store state has no adopted offices, so the invalid-addresses warning shows
    const messageBox = section.findComponent(MessageBoxWarning)
    expect(messageBox.exists()).toBe(true)
    const messages = messageBox.props('messages')
    expect(messages[0].prefix).toBe('Incomplete or incorrect Address:')
    expect(messages[1].message).toContain('open the holding company')
    expect(section.findComponent(OfficeAddresses).exists()).toBe(true)
  })

  it('renders contact information section', () => {
    const section = wrapper.findAll('section').at(1)
    expect(section.find('header h2').text()).toBe('Registered Office Contact Information')
    expect(section.find('header p').text()).toContain('The resulting business will use this contact information adopted from the holding business in this')
    expect(wrapper.findComponent(BusinessContactInfo).exists()).toBe(true)
  })
})
