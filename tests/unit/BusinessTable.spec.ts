import { AmalgamationTypes, AmlRoles, AmlStatuses, AmlTypes, FilingTypes } from '@/enums'
import { wrapperFactory } from '../vitest-wrapper-factory'
import BusinessTable from '@/components/Amalgamation/BusinessTable.vue'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import AmalgamationMixin from '@/mixins/amalgamation-mixin'

describe('Business Table - display', () => {
  it('displays correctly when there are no amalgamating businesses', () => {
    const wrapper = wrapperFactory(
      BusinessTable,
      null,
      {
        amalgamation: {
          amalgamatingBusinesses: []
        }
      }
    )

    const table = wrapper.find('#business-table')
    expect(table.exists()).toBe(true)

    // verify table headers
    const th = table.findAll('thead tr > th')
    expect(th.length).toBe(6)
    expect(th.at(0).text()).toBe('Business Name')
    expect(th.at(1).text()).toBe('Business Type')
    expect(th.at(2).text()).toBe('Mailing Address')
    expect(th.at(3).text()).toBe('Role')
    expect(th.at(4).text()).toBe('Status')
    expect(th.at(5).text()).toBe('Action')

    // verify table data
    const td = table.findAll('tbody tr > td')
    expect(td.length).toBe(1)
    expect(td.at(0).attributes('colspan')).toBe('6')
    expect(td.at(0).text()).toBe('No businesses added')

    wrapper.destroy()
  })

  const amalgamatingBusinesses = [
    {
      label: 'BC Limited holding business - horiz amalgamation',
      amalgamationType: AmalgamationTypes.HORIZONTAL,
      type: AmlTypes.LEAR,
      identifier: 'BC1111111',
      name: 'My BC Limited Company',
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
      legalType: CorpTypeCd.BC_COMPANY,
      expectedBusinessType: 'BC Limited Company',
      role: AmlRoles.PRIMARY
    },
    {
      label: 'BC Limited primary business - vert amalgamation',
      amalgamationType: AmalgamationTypes.VERTICAL,
      type: AmlTypes.LEAR,
      identifier: 'BC1111111',
      name: 'My BC Limited Company',
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
      legalType: CorpTypeCd.BC_COMPANY,
      expectedBusinessType: 'BC Limited Company',
      role: AmlRoles.HOLDING
    },
    {
      label: 'Benefit Company amalgamating business with no address',
      amalgamationType: AmalgamationTypes.REGULAR,
      type: AmlTypes.LEAR,
      identifier: 'BC2222222',
      name: 'My Benefit Company',
      authInfo: { contacts: [ { email: 'bc2222222@example.com' } ] },
      address: undefined,
      legalType: CorpTypeCd.BENEFIT_COMPANY,
      expectedBusinessType: 'BC Benefit Company',
      role: AmlRoles.AMALGAMATING
    },
    {
      label: 'foreign business in Federal jurisdiction',
      amalgamationType: AmalgamationTypes.REGULAR,
      type: AmlTypes.FOREIGN,
      identifier: 'CA-3333333',
      legalName: 'My Federal Business',
      expectedBusinessType: 'Foreign',
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
      identifier: 'US-4444444',
      legalName: 'My USA Business',
      expectedBusinessType: 'Foreign',
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
        BusinessTable,
        null,
        {
          amalgamation: {
            type: business.amalgamationType,
            amalgamatingBusinesses: [ business ]
          },
          tombstone: {
            filingType: FilingTypes.AMALGAMATION_APPLICATION,
            authRoles: []
          }
        }
      )

      const table = wrapper.find('#business-table')
      expect(table.exists()).toBe(true)

      // verify table headers
      const th = table.findAll('thead tr > th')
      expect(th.length).toBe(6)
      expect(th.at(0).text()).toBe('Business Name')
      expect(th.at(1).text()).toBe('Business Type')
      expect(th.at(2).text()).toBe('Mailing Address')
      expect(th.at(3).text()).toBe('Role')
      expect(th.at(4).text()).toBe('Status')
      expect(th.at(5).text()).toBe('Action')

      // verify table data
      const td = table.findAll('tbody tr > td')
      expect(td.length).toBe(6)
      expect(td.at(0).classes('business-name')).toBe(true)
      expect(td.at(1).classes('business-type')).toBe(true)
      expect(td.at(2).classes('business-address')).toBe(true)
      expect(td.at(3).classes('business-role')).toBe(true)
      expect(td.at(4).classes('business-status')).toBe(true)
      expect(td.at(5).classes('business-actions')).toBe(true)

      if ((business.type === AmlTypes.LEAR)) {
        expect(td.at(0).text()).toContain(business.name)
        expect(td.at(0).text()).toContain(business.authInfo.contacts[0].email)

        expect(td.at(1).text()).toContain(business.expectedBusinessType)

        if (business.addresses) {
          expect(td.at(2).text()).toContain(business.addresses.registeredOffice.mailingAddress.streetAddress)
          expect(td.at(2).text()).toContain(business.addresses.registeredOffice.mailingAddress.addressCity)
          expect(td.at(2).text()).toContain('Canada')
          expect(td.at(2).text()).toContain(business.addresses.registeredOffice.mailingAddress.postalCode)
        } else {
          expect(td.at(2).text()).toBe('Affiliate to view')
        }

        if (business.role === AmlRoles.AMALGAMATING) {
          expect(td.at(3).text()).toBe('Amalgamating Business')
        }
        if (business.role === AmlRoles.HOLDING) {
          expect(td.at(3).text()).toBe('Holding Business')
        }
        if (business.role === AmlRoles.PRIMARY) {
          expect(td.at(3).text()).toBe('Primary Business')
        }

        expect(td.at(4).exists()).toBe(true) // see separate BusinessTableStatus tests

        if (business.role === AmlRoles.AMALGAMATING) {
          // button only exists on amalgamating businesses (not holding or primary)
          expect(td.at(5).find('.v-btn').exists()).toBe(true)
        }
      }

      if ((business.type === AmlTypes.FOREIGN)) {
        expect(td.at(0).text()).toBe(business.legalName)
        expect(td.at(1).text()).toBe(business.expectedBusinessType)
        expect(td.at(2).text()).toBe(business.expectedJurisdiction)
        expect(td.at(3).text()).toBe('Amalgamating Business')
        expect(td.at(4).exists()).toBe(true) // see separate BusinessTableStatus tests
        expect(td.at(5).find('.v-btn').exists()).toBe(true)
      }

      wrapper.destroy()
    })
  }
})

describe('Business Table - validity', () => {
  it('emits True when there are no businesses in the table', () => {
    const wrapper = wrapperFactory(
      BusinessTable,
      null,
      {
        amalgamation: {
          amalgamatingBusinesses: []
        }
      }
    )

    expect(wrapper.emitted('allOk').pop()[0]).toEqual(true)
  })

  it('emits False when not every business is OK', () => {
    const wrapper = wrapperFactory(
      BusinessTable,
      null,
      {
        amalgamation: {
          amalgamatingBusinesses: [
            {
              address: {},
              legalType: CorpTypeCd.BC_COMPANY,
              type: AmlTypes.LEAR,
              isHistorical: true // status will be "ERROR_HISTORICAL"
            }
          ]
        }
      }
    )

    expect(wrapper.emitted('allOk').pop()[0]).toEqual(false)
  })

  it('emits True when every business is OK', () => {
    const wrapper = wrapperFactory(
      BusinessTable,
      null,
      {
        amalgamation: {
          amalgamatingBusinesses: [
            // both of these will be status "OK"
            {
              addresses: {},
              legalType: CorpTypeCd.BC_COMPANY,
              type: AmlTypes.LEAR
            },
            {
              addresses: {},
              legalType: CorpTypeCd.BC_COMPANY,
              type: AmlTypes.LEAR
            }
          ]
        }
      }
    )

    expect(wrapper.emitted('allOk').pop()[0]).toBe(true)
  })
})

// FUTURE: try to get this working
// ATM, local rules are mocked (eg, wrapper.vm.notAffiliated()), but not the actual rules in the mixin.
// It's probably this: https://vitest.dev/guide/mocking.html#mocking-pitfalls.
// Maybe try vi.mock() to mock the imported mixin?
describe.skip('Business Table - rule evaluation', () => {
  let wrapper: any

  const rules = [
    { methodName: 'notAffiliated', error: AmlStatuses.ERROR_NOT_AFFILIATED },
    { methodName: 'notHistorical', error: AmlStatuses.ERROR_HISTORICAL },
    { methodName: 'notFrozen', error: AmlStatuses.ERROR_FROZEN },
    { methodName: 'notInGoodStanding', error: AmlStatuses.ERROR_NOT_IN_GOOD_STANDING },
    { methodName: 'limitedRestoration', error: AmlStatuses.ERROR_LIMITED_RESTORATION },
    { methodName: 'futureEffectiveFiling', error: AmlStatuses.ERROR_FUTURE_EFFECTIVE_FILING },
    { methodName: 'draftTask', error: AmlStatuses.ERROR_DRAFT_TASK },
    { methodName: 'pendingFiling', error: AmlStatuses.ERROR_PENDING_FILING },
    { methodName: 'foreign', error: AmlStatuses.ERROR_FOREIGN },
    { methodName: 'foreignUnlimited', error: AmlStatuses.ERROR_FOREIGN_UNLIMITED },
    { methodName: 'cccMismatch', error: AmlStatuses.ERROR_CCC_MISMATCH },
    { methodName: 'foreignUnlimited2', error: AmlStatuses.ERROR_FOREIGN_UNLIMITED2 },
    { methodName: 'xproUlcCcc', error: AmlStatuses.ERROR_XPRO_ULC_CCC },
    { methodName: 'foreignUnlimited3', error: AmlStatuses.ERROR_FOREIGN_UNLIMITED3 },
    { methodName: 'needBcCompany', error: AmlStatuses.ERROR_NEED_BC_COMPANY },
    { methodName: 'foreignHorizontal', error: AmlStatuses.ERROR_FOREIGN_HORIZONTAL }
  ]

  beforeAll(() => {
    wrapper = wrapperFactory(
      BusinessTable,
      null,
      {
        amalgamation: {
          amalgamatingBusinesses: [{ /* dummy business */ }]
        },
        tombstone: {
          authRoles: ['staff']
        }
      }
    )

    // mock all rules to return their error
    for (let i = 0; i < rules.length; i++) {
      vi.spyOn(wrapper.vm, rules[i].methodName).mockReturnValue(rules[i].error)
    }
    // THESE WORK:
    console.log('value1 = ', wrapper.vm.notAffiliated())
    console.log('value2 = ', wrapper.vm.notHistorical())
    console.log('value3 = ', wrapper.vm.notInGoodStanding())

    // THIS DOESN'T WORK ("is not a function"):
    console.log('value4 = ', (AmalgamationMixin as any).notAffiliated())
  })

  it('has the expected number of rules', () => {
    expect(rules.length).toBe(16)
    expect(wrapper.vm.rules.length).toBe(16)
  })

  // check each rule sequentially
  for (let i = 0; i < rules.length; i++) {
    it(`fails rule "${rules[i].methodName}"`, () => {
      // first, verify that current rule fails
      expect(wrapper.vm.businesses[0].status).toBe(rules[i].error)

      // now override rule to return null
      vi.spyOn(wrapper.vm, rules[i].methodName).mockReturnValue(null)

      // if this is the last rule...
      if (i === (rules.length - 1)) {
        // verify that no rules have failed
        expect(wrapper.vm.businesses[0].status).toBe(AmlStatuses.OK)
      } else {
        // verify that another rule has failed
        expect(wrapper.vm.businesses[0].status).toBe(rules[i + 1].error)
      }

      wrapper.destroy()
    })
  }
})
