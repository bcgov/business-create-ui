import { shallowWrapperFactory } from '../vitest-wrapper-factory'
import AssociationDetails from '@/components/Dissolution/AssociationDetails.vue'
import { CorpTypeCd } from '@bcrs-shared-components/enums/'

describe('Association Details component for firms', () => {
  it('displays operating name correctly for a SP', () => {
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
        alternateName: 'My Operating Name'
      }
    )

    expect(wrapper.find('#entity-label').text()).toBe('Business')
    expect(wrapper.find('#company-name').text()).toBe('My Operating Name')
    expect(wrapper.find('#entity-description').text()).toBe('BC Sole Proprietorship')
    expect(wrapper.find('#business-id').text()).toBe('FM1234567')
    expect(wrapper.find('#address-label').text()).toBe('Business Address')
    expect(wrapper.find('.mailing-address-header').text()).toBe('Mailing Address')
    expect(wrapper.find('.delivery-address-header').text()).toBe('Delivery Address')

    wrapper.destroy()
  })
})
