import { AmalgamationTypes, AmlRoles, AmlTypes, FilingTypes } from '@/enums'
import { wrapperFactory } from '../vitest-wrapper-factory'
import BusinessTableSummary from '@/components/Amalgamation/BusinessTableSummary.vue'

describe('Business Table Summary', () => {
  it('displays correctly when there are no amalgamating businesses', () => {
    const wrapper = wrapperFactory(
      BusinessTableSummary,
      null,
      {
        amalgamation: {
          amalgamatingBusinesses: []
        }
      }
    )

    const bts = wrapper.find('#business-table-summary')
    expect(bts.exists()).toBe(true)

    // verify table headers
    const th = bts.findAll('thead tr > th')
    expect(th.length).toBe(3)
    expect(th.at(0).text()).toBe('Business Name')
    expect(th.at(1).text()).toBe('Mailing Address')
    expect(th.at(2).text()).toBe('Role')

    // verify table data
    const td = bts.findAll('tbody tr > td')
    expect(td.length).toBe(1)
    expect(td.at(0).attributes('colspan')).toBe('3')
    expect(td.at(0).text()).toBe('No businesses added')

    wrapper.destroy()
  })

  const amalgamatingBusinesses = [
    {
      label: 'LEAR holding business - horiz amalgamation',
      amalgamationType: AmalgamationTypes.HORIZONTAL,
      type: AmlTypes.LEAR,
      identifier: 'BC1111111',
      name: 'Test Business 1',
      authInfo: { contacts: [ { email: 'bc1111111@example.com' } ] },
      addresses: {
        registeredOffice: {
          mailingAddress: {
            streetAddress: '123 Main St',
            addressCity: 'Victoria',
            addressCountry: 'CA',
            postalCode: 'V8V 8V8'
          }
        }
      },
      role: AmlRoles.PRIMARY
    },
    {
      label: 'LEAR primary business - vert amalgamation',
      amalgamationType: AmalgamationTypes.VERTICAL,
      type: AmlTypes.LEAR,
      identifier: 'BC1111111',
      name: 'Test Business 1',
      authInfo: { contacts: [ { email: 'bc1111111@example.com' } ] },
      addresses: {
        registeredOffice: {
          mailingAddress: {
            streetAddress: '123 Main St',
            addressCity: 'Victoria',
            addressCountry: 'CA',
            postalCode: 'V8V 8V8'
          }
        }
      },
      role: AmlRoles.HOLDING
    },
    {
      label: 'LEAR amalgamating business with no address',
      amalgamationType: AmalgamationTypes.REGULAR,
      type: AmlTypes.LEAR,
      identifier: 'BC2222222',
      name: 'Test Business 2',
      authInfo: { contacts: [ { email: 'bc2222222@example.com' } ] },
      address: undefined,
      role: AmlRoles.AMALGAMATING
    },
    {
      label: 'foreign business in Federal jurisdiction',
      amalgamationType: AmalgamationTypes.REGULAR,
      type: AmlTypes.FOREIGN,
      corpNumber: 'CA-3333333',
      legalName: 'Test Business 3',
      foreignJurisdiction: {
        country: 'CA',
        region: 'FEDERAL'
      },
      expectedJurisdiction: 'Federal, Canada',
      role: AmlRoles.AMALGAMATING
    },
    {
      label: 'foreign business in USA jurisdiction',
      amalgamationType: AmalgamationTypes.REGULAR,
      type: AmlTypes.FOREIGN,
      corpNumber: 'US-4444444',
      legalName: 'Test Business 4',
      foreignJurisdiction: {
        country: 'US'
      },
      expectedJurisdiction: 'United States of America',
      role: AmlRoles.AMALGAMATING
    }
  ]

  for (const business of amalgamatingBusinesses) {
    it(`displays correctly when there is a ${business.label}`, () => {
      const wrapper = wrapperFactory(
        BusinessTableSummary,
        null,
        {
          amalgamation: {
            type: business.amalgamationType,
            amalgamatingBusinesses: [ business ]
          },
          tombstone: {
            filingType: FilingTypes.AMALGAMATION_APPLICATION,
            keycloakRoles: []
          }
        }
      )

      const bts = wrapper.find('#business-table-summary')
      expect(bts.exists()).toBe(true)

      // verify table headers
      const th = bts.findAll('thead tr > th')
      expect(th.length).toBe(3)
      expect(th.at(0).text()).toBe('Business Name')
      expect(th.at(1).text()).toBe('Mailing Address')
      expect(th.at(2).text()).toBe('Role')

      // verify table data
      const td = bts.findAll('tbody tr > td')
      expect(td.length).toBe(3)

      if ((business.type === AmlTypes.LEAR)) {
        expect(td.at(0).text()).toContain(business.name)
        expect(td.at(0).text()).toContain(business.authInfo.contacts[0].email)

        if (business.addresses) {
          expect(td.at(1).text()).toContain(business.addresses.registeredOffice.mailingAddress.streetAddress)
          expect(td.at(1).text()).toContain(business.addresses.registeredOffice.mailingAddress.addressCity)
          expect(td.at(1).text()).toContain('Canada')
          expect(td.at(1).text()).toContain(business.addresses.registeredOffice.mailingAddress.postalCode)
        } else {
          expect(td.at(1).text()).toBe('Affiliate to view')
        }

        if (business.role === AmlRoles.AMALGAMATING) {
          expect(td.at(2).text()).toBe('Amalgamating Business')
        }
        if (business.role === AmlRoles.HOLDING) {
          expect(td.at(2).text()).toBe('Holding Business')
        }
        if (business.role === AmlRoles.PRIMARY) {
          expect(td.at(2).text()).toBe('Primary Business')
        }
      }

      if ((business.type === AmlTypes.FOREIGN)) {
        expect(td.at(0).text()).toBe(business.legalName)
        expect(td.at(1).text()).toBe(business.expectedJurisdiction)
        expect(td.at(2).text()).toBe('Amalgamating Business')
      }

      wrapper.destroy()
    })
  }
})
