import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import AssociationDetails from '@/components/Dissolution/AssociationDetails.vue'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'
import * as utils from '@/utils'

describe('Association Details component for firms', () => {
  it('displays alternate name correctly for a SP - With Legal Name Fix', () => {
    vi.spyOn(utils, 'GetFeatureFlag').mockImplementation(flag => {
      if (flag === 'enable-legal-name-fix') return true
      return null
    })
    const wrapper = shallowWrapperFactory(
      AssociationDetails,
      {
        entityLabel: 'Business',
        addressLabel: 'Business Address',
        showContactInfo: false,
        showBusinessDate: true,
        isSummary: true
      },
      {
        business: {
          businessId: 'FM1234567',
          legalName: 'My Legal Name',
          officeAddress: {}
        },
        entityType: CorpTypeCd.SOLE_PROP,
        alternateName: 'My Alternate Name'
      }
    )

    expect(wrapper.find('#entity-label').text()).toBe('Business')
    expect(wrapper.find('#company-name').text()).toBe('My Alternate Name')
    expect(wrapper.find('#entity-description').text()).toBe('BC Sole Proprietorship')
    expect(wrapper.find('#business-id').text()).toBe('FM1234567')
    expect(wrapper.find('#address-label').text()).toBe('Business Address')
    expect(wrapper.find('.mailing-address-header').text()).toBe('Mailing Address')
    expect(wrapper.find('.delivery-address-header').text()).toBe('Delivery Address')

    wrapper.destroy()
  })

  it('displays legal name correctly for a SP - Without Legal Name Fix', () => {
    vi.spyOn(utils, 'GetFeatureFlag').mockImplementation(flag => {
      if (flag === 'enable-legal-name-fix') return false
      return null
    })
    const wrapper = shallowWrapperFactory(
      AssociationDetails,
      {
        entityLabel: 'Business',
        addressLabel: 'Business Address',
        showContactInfo: false,
        showBusinessDate: true,
        isSummary: true
      },
      {
        business: {
          businessId: 'FM1234567',
          legalName: 'My Legal Name',
          officeAddress: {}
        },
        entityType: CorpTypeCd.SOLE_PROP,
        alternateName: 'My Alternate Name'
      }
    )

    expect(wrapper.find('#entity-label').text()).toBe('Business')
    expect(wrapper.find('#company-name').text()).toBe('My Legal Name')
    expect(wrapper.find('#entity-description').text()).toBe('BC Sole Proprietorship')
    expect(wrapper.find('#business-id').text()).toBe('FM1234567')
    expect(wrapper.find('#address-label').text()).toBe('Business Address')
    expect(wrapper.find('.mailing-address-header').text()).toBe('Mailing Address')
    expect(wrapper.find('.delivery-address-header').text()).toBe('Delivery Address')

    wrapper.destroy()
  })
})
