import { wrapperFactory, shallowWrapperFactory } from '../jest-wrapper-factory'
import ListPeopleAndRoles from '@/components/Incorporation/ListPeopleAndRoles.vue'

describe('List People And Roles component', () => {
  let wrapper: any

  const mockPersonList = [
    {
      'officer': {
        'id': 0,
        'firstName': 'Cameron',
        'lastName': 'Bowler',
        'middleName': 'D',
        'organizationName': '',
        'partyType': 'person',
        'email': 'completing-party@example.com'
      },
      'roles': [
        { 'roleType': 'Completing Party', 'appointmentDate': '2020-03-30' },
        { 'roleType': 'Director', 'appointmentDate': '2020-03-30' }
      ],
      'mailingAddress': {
        'streetAddress': '122-12210 Boul De Pierrefonds',
        'streetAddressAdditional': '',
        'addressCity': 'Pierrefonds',
        'addressRegion': 'QC',
        'postalCode': 'H9A 2X6',
        'addressCountry': 'CA'
      },
      'deliveryAddress': {
        'streetAddress': '122-12210 Boul De Pierrefonds',
        'streetAddressAdditional': '',
        'addressCity': 'Pierrefonds',
        'addressRegion': 'QC',
        'postalCode': 'H9A 2X6',
        'addressCountry': 'CA'
      }
    },
    {
      'officer': {
        'id': 1,
        'firstName': '',
        'lastName': '',
        'middleName': '',
        'organizationName': 'Sysco Foods Company',
        'partyType': 'organization'
      },
      'roles': [
        { 'roleType': 'Incorporator', 'appointmentDate': '2020-03-30' }
      ],
      'mailingAddress': {
        'streetAddress': '12-1044 Boul 21De Normandie',
        'streetAddressAdditional': '',
        'addressCity': 'Saint-Jean-Sur-Richelieu',
        'addressRegion': 'QC',
        'postalCode': 'J3A 1H7',
        'addressCountry': 'CA'
      }
    }
  ]

  it('does not show the peoples / roles list if there is no data to display', () => {
    wrapper = shallowWrapperFactory(ListPeopleAndRoles)
    const displayListCount = wrapper.vm.$el.querySelectorAll('.people-roles-content').length

    expect(displayListCount).toEqual(0)
    expect(wrapper.vm.$el.querySelector('.people-roles-content')).toBeNull()
  })

  it('displays the correct amount of peoples / roles list when data is present', () => {
    wrapper = shallowWrapperFactory(ListPeopleAndRoles, { personList: mockPersonList })
    const displayListCount = wrapper.vm.$el.querySelectorAll('.people-roles-content').length

    expect(displayListCount).toEqual(2)
    expect(wrapper.vm.$el.querySelector('.people-roles-content')).not.toBeNull()
  })

  it('displays the correct name data in the peoples / roles list', () => {
    wrapper = wrapperFactory(ListPeopleAndRoles, { personList: mockPersonList })

    const peoplesListItem1 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]
    const peoplesListItem2 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[1]

    expect(peoplesListItem1.querySelector('.people-roles-title').textContent)
      .toContain('Cameron D Bowler')

    expect(peoplesListItem2.querySelector('.people-roles-title').textContent)
      .toContain('Sysco Foods Company')
  })

  it('displays the correct address data in the peoples / roles list', () => {
    // Mounting the Wrapper to allow for the test to reach into the baseAddress component to validate data
    wrapper = wrapperFactory(ListPeopleAndRoles, { personList: mockPersonList })

    const peoplesListItem1 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]
    const peoplesListItem2 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[1]

    expect(peoplesListItem1.querySelector('.peoples-roles-mailing-address').textContent)
      .toContain('122-12210 Boul De Pierrefonds')

    expect(peoplesListItem2.querySelector('.peoples-roles-mailing-address').textContent)
      .toContain('12-1044 Boul 21De Normandie')
  })

  it('displays the `same as Mailing Address` text when mailing and delivery match', () => {
    // Mounting the Wrapper to allow for the test to reach into the baseAddress component to validate data
    wrapper = wrapperFactory(ListPeopleAndRoles, { personList: mockPersonList })

    const peoplesListItem = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]

    expect(peoplesListItem.querySelector('.peoples-roles-mailing-address').textContent)
      .toContain('122-12210 Boul De Pierrefonds')

    expect(peoplesListItem.querySelector('.peoples-roles-delivery-address').textContent)
      .toContain('Same as Mailing Address')
  })

  it('displays the correct addresses text when mailing and delivery do NOT match', () => {
    mockPersonList[0].deliveryAddress.streetAddress = '123 Different rd'
    // Mounting the Wrapper to allow for the test to reach into the baseAddress component to validate data
    wrapper = wrapperFactory(ListPeopleAndRoles, { personList: mockPersonList })

    const peoplesListItem = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]

    expect(peoplesListItem.querySelector('.peoples-roles-mailing-address').textContent)
      .toContain('122-12210 Boul De Pierrefonds')

    expect(peoplesListItem.querySelector('.peoples-roles-delivery-address').textContent).not
      .toContain('Same as Mailing Address')

    expect(peoplesListItem.querySelector('.peoples-roles-delivery-address').textContent)
      .toContain('123 Different rd')
  })

  it('displays the correct roles', () => {
    wrapper = shallowWrapperFactory(ListPeopleAndRoles, { personList: mockPersonList })
    const peoplesListItem1 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]
    const peoplesListItem2 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[1]

    expect(peoplesListItem1.querySelectorAll('.col-roles')[0].textContent)
      .toContain('Completing Party')
    expect(peoplesListItem1.querySelectorAll('.col-roles')[1].textContent)
      .toContain('Director')

    expect(peoplesListItem2.querySelector('.col-roles').textContent).toContain('Incorporator')
  })

  it('displays the actions menu when viewed not in summary view', () => {
    wrapper = shallowWrapperFactory(ListPeopleAndRoles, { personList: mockPersonList })
    const peoplesListItem1 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]
    const peoplesListItem2 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[1]

    expect(peoplesListItem1.querySelector('.actions')).not.toBeNull()
    expect(peoplesListItem2.querySelector('.actions')).not.toBeNull()
  })

  it('does NOT display the actions menu when viewed in summary view', () => {
    wrapper = wrapperFactory(ListPeopleAndRoles, { personList: mockPersonList, isSummary: true })
    const peoplesListItem1 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]
    const peoplesListItem2 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[1]

    expect(peoplesListItem1.querySelector('.actions')).toBeNull()
    expect(peoplesListItem2.querySelector('.actions')).toBeNull()
  })

  it('displays the Summary header when in summary view', () => {
    wrapper = shallowWrapperFactory(ListPeopleAndRoles, { personList: mockPersonList, isSummary: true })

    expect(wrapper.vm.$el.querySelector('.people-roles-summary-header').textContent)
      .toContain('People and Roles')
  })

  it('does NOT display the Summary header when NOT in summary view', () => {
    wrapper = shallowWrapperFactory(ListPeopleAndRoles, { personList: mockPersonList })

    expect(wrapper.vm.$el.querySelector('.people-roles-summary-header')).toBeNull()
  })

  it('displays invalid warning message when in summary view and step 2 data is invalid', () => {
    wrapper = shallowWrapperFactory(ListPeopleAndRoles,
      {
        personList: mockPersonList,
        showErrorSummary: true,
        isSummary: true
      })

    expect(wrapper.vm.$el.querySelector('.people-roles-invalid-message').textContent)
      .toContain('This step is unfinished.')

    expect(wrapper.vm.$el.querySelector('.people-roles-invalid-message').textContent)
      .toContain('Return to this step to finish it')
  })

  it('sends you to step 2 when the error message link is clicked', () => {
    wrapper = wrapperFactory(ListPeopleAndRoles,
      {
        personList: mockPersonList,
        showErrorSummary: true,
        isSummary: true
      })

    expect(wrapper.vm.$route.name).toBeNull()

    const errorLink = wrapper.find('#router-link')
    errorLink.trigger('click')

    expect(wrapper.vm.$route.name).toBe('incorporation-people-roles')
  })
})
