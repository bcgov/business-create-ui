import { wrapperFactory, shallowWrapperFactory } from '../vitest-wrapper-factory'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import { FilingTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

setActivePinia(createPinia())
const store = useStore()

describe('List People And Roles component - BEN IA', () => {
  let wrapper: any

  const mockPersonList = [
    {
      officer: {
        id: 0,
        firstName: 'Cameron',
        lastName: 'Bowler',
        middleName: 'D',
        organizationName: '',
        partyType: 'person',
        email: 'completing-party@example.com'
      },
      roles: [
        { roleType: 'Completing Party', appointmentDate: '2020-03-30' },
        { roleType: 'Director', appointmentDate: '2020-03-30' }
      ],
      mailingAddress: {
        streetAddress: '122-12210 Boul De Pierrefonds',
        streetAddressAdditional: '',
        addressCity: 'Pierrefonds',
        addressRegion: 'QC',
        postalCode: 'H9A 2X6',
        addressCountry: 'CA'
      },
      deliveryAddress: {
        streetAddress: '122-12210 Boul De Pierrefonds',
        streetAddressAdditional: '',
        addressCity: 'Pierrefonds',
        addressRegion: 'QC',
        postalCode: 'H9A 2X6',
        addressCountry: 'CA'
      }
    },
    {
      officer: {
        id: 1,
        firstName: '',
        lastName: '',
        middleName: '',
        organizationName: 'Sysco Foods Company',
        partyType: 'organization'
      },
      roles: [
        { roleType: 'Incorporator', appointmentDate: '2020-03-30' }
      ],
      mailingAddress: {
        streetAddress: '12-1044 Boul 21De Normandie',
        streetAddressAdditional: '',
        addressCity: 'Saint-Jean-Sur-Richelieu',
        addressRegion: 'QC',
        postalCode: 'J3A 1H7',
        addressCountry: 'CA'
      }
    }
  ]

  beforeAll(() => {
    store.stateModel.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.tombstone.filingType = FilingTypes.INCORPORATION_APPLICATION
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('does not show the peoples / roles list if there is no data to display', () => {
    wrapper = shallowWrapperFactory(
      ListPeopleAndRoles,
      null,
      { addPeopleAndRoleStep: { orgPeople: [] } }
    )

    expect(wrapper.findAll('.people-roles-content').length).toEqual(0)
    expect(wrapper.find('.people-roles-header').exists()).toBe(false)
    expect(wrapper.find('.people-roles-content').exists()).toBe(false)
  })

  it('displays the correct amount of peoples / roles list when data is present', () => {
    wrapper = shallowWrapperFactory(
      ListPeopleAndRoles,
      null,
      { addPeopleAndRoleStep: { orgPeople: mockPersonList } }
    )

    const header = wrapper.find('.people-roles-header')
    expect(header.exists()).toBe(true)
    expect(header.text()).toContain('Name')
    expect(header.text()).toContain('Mailing Address')
    expect(header.text()).toContain('Delivery Address')
    expect(header.text()).toContain('Roles')
    expect(header.text()).not.toContain('Email')

    expect(wrapper.findAll('.people-roles-content').length).toEqual(2)
    expect(wrapper.find('.people-roles-content').exists()).toBe(true)
  })

  it('displays the correct name data in the peoples / roles list', () => {
    wrapper = wrapperFactory(ListPeopleAndRoles,
      null,
      { addPeopleAndRoleStep: { orgPeople: mockPersonList } }
    )

    const peoplesListItem1 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]
    const peoplesListItem2 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[1]

    expect(peoplesListItem1.querySelector('.name-column .name').textContent)
      .toBe('Cameron D Bowler')

    expect(peoplesListItem2.querySelector('.name-column .name').textContent)
      .toBe('Sysco Foods Company')
  })

  it('displays the correct address data in the peoples / roles list', () => {
    // Mounting the Wrapper to allow for the test to reach into the baseAddress component to validate data
    wrapper = wrapperFactory(ListPeopleAndRoles,
      null,
      { addPeopleAndRoleStep: { orgPeople: mockPersonList } }
    )

    const peoplesListItem1 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]
    const peoplesListItem2 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[1]

    expect(peoplesListItem1.querySelector('.mailing-address-column').textContent)
      .toContain('122-12210 Boul De Pierrefonds')

    expect(peoplesListItem2.querySelector('.mailing-address-column').textContent)
      .toContain('12-1044 Boul 21De Normandie')
  })

  it('displays the "same as Mailing Address" text when mailing and delivery match', () => {
    // Mounting the Wrapper to allow for the test to reach into the baseAddress component to validate data
    wrapper = wrapperFactory(ListPeopleAndRoles,
      null,
      { addPeopleAndRoleStep: { orgPeople: mockPersonList } }
    )

    const peoplesListItem = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]

    expect(peoplesListItem.querySelector('.mailing-address-column').textContent)
      .toContain('122-12210 Boul De Pierrefonds')

    expect(peoplesListItem.querySelector('.delivery-address-column').textContent)
      .toContain('Same as Mailing Address')
  })

  it('displays the correct addresses text when mailing and delivery do not match', () => {
    mockPersonList[0].deliveryAddress.streetAddress = '123 Different rd'
    // Mounting the Wrapper to allow for the test to reach into the baseAddress component to validate data
    wrapper = wrapperFactory(ListPeopleAndRoles,
      null,
      { addPeopleAndRoleStep: { orgPeople: mockPersonList } }
    )

    const peoplesListItem = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]

    expect(peoplesListItem.querySelector('.mailing-address-column').textContent)
      .toContain('122-12210 Boul De Pierrefonds')

    expect(peoplesListItem.querySelector('.delivery-address-column').textContent).not
      .toContain('Same as Mailing Address')

    expect(peoplesListItem.querySelector('.delivery-address-column').textContent)
      .toContain('123 Different rd')
  })

  it('displays the correct roles', () => {
    wrapper = shallowWrapperFactory(ListPeopleAndRoles,
      null,
      { addPeopleAndRoleStep: { orgPeople: mockPersonList } }
    )

    const peoplesListItem1 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]
    const peoplesListItem2 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[1]

    // verify first party's roles
    expect(peoplesListItem1.querySelectorAll('.roles-column p')[0].textContent)
      .toContain('Completing Party')
    expect(peoplesListItem1.querySelectorAll('.roles-column p')[1].textContent)
      .toContain('Director')

    // verify second party's roles
    expect(peoplesListItem2.querySelector('.roles-column').textContent).toContain('Incorporator')
  })

  it('displays the actions menu when viewed not in summary view', () => {
    wrapper = shallowWrapperFactory(ListPeopleAndRoles,
      null,
      { addPeopleAndRoleStep: { orgPeople: mockPersonList } }
    )

    const peoplesListItem1 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]
    const peoplesListItem2 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[1]

    expect(peoplesListItem1.querySelector('.actions-column')).not.toBeNull()
    expect(peoplesListItem2.querySelector('.actions-column')).not.toBeNull()
  })

  it('does not display the actions menu when viewed in summary view', () => {
    wrapper = wrapperFactory(ListPeopleAndRoles,
      { isSummary: true },
      { addPeopleAndRoleStep: { orgPeople: mockPersonList } }
    )
    const peoplesListItem1 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]
    const peoplesListItem2 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[1]

    expect(peoplesListItem1.querySelector('.actions')).toBeNull()
    expect(peoplesListItem2.querySelector('.actions')).toBeNull()
  })

  it('displays warning message when in summary view and step 2 data is invalid', () => {
    wrapper = shallowWrapperFactory(ListPeopleAndRoles,
      {
        isSummary: true
      },
      {
        tombstone: { filingType: 'incorporationApplication' },
        addPeopleAndRoleStep: { orgPeople: mockPersonList },
        showErrors: true
      }
    )

    expect(wrapper.vm.$el.querySelector('.people-roles-invalid-message').textContent)
      .toContain('This step is unfinished.')

    expect(wrapper.vm.$el.querySelector('.people-roles-invalid-message').textContent)
      .toContain('Return to this step to finish it')
  })

  it('sends you to step 2 when the error message link is clicked', () => {
    wrapper = wrapperFactory(ListPeopleAndRoles,
      {
        isSummary: true
      },
      {
        tombstone: { filingType: 'incorporationApplication' },
        addPeopleAndRoleStep: { orgPeople: mockPersonList },
        showErrors: true
      }
    )

    expect(wrapper.vm.$route.name).toBeNull()

    const errorLink = wrapper.find('#router-link')
    errorLink.trigger('click')

    expect(wrapper.vm.$route.name).toBe('incorporation-people-roles')
  })
})

describe('List People And Roles component - SP registration', () => {
  let wrapper: any

  const mockPersonList = [
    {
      confirmBusiness: true,
      deliveryAddress: {
        addressCity: 'Vic',
        addressCountry: 'CA',
        addressRegion: 'BC',
        deliveryInstructions: 'no cats at this address',
        postalCode: 'V8V 8V8',
        streetAddress: '123 Main St',
        streetAddressAdditional: 'Suite A'
      },
      mailingAddress: {
        addressCity: 'Vic',
        addressCountry: 'CA',
        addressRegion: 'BC',
        deliveryInstructions: 'beware of cat',
        postalCode: 'V9V 9V9',
        streetAddress: '456 Other Ave',
        streetAddressAdditional: 'Suite D (Dungeon)'
      },
      officer: {
        businessNumber: '123456789',
        email: 'proprietor@example.com',
        firstName: '',
        id: '4d083e7a-4681-4c2a-a57f-3ed17a3579e9',
        lastName: '',
        middleName: '',
        organizationName: 'Crazy Cat Consulting Company',
        partyType: 'organization'
      },
      roles: [
        {
          appointmentDate: '2022-04-02',
          roleType: 'Proprietor'
        }
      ]
    },
    {
      deliveryAddress: {
        addressCity: 'Victoria',
        addressCountry: 'CA',
        addressRegion: 'BC',
        postalCode: 'V8W 2C3',
        streetAddress: '1012 Douglas St',
        streetAddressAdditional: ''
      },
      mailingAddress: {
        addressCity: 'Victoria',
        addressCountry: 'CA',
        addressRegion: 'BC',
        postalCode: 'V8W 2C3',
        streetAddress: '1012 Douglas St',
        streetAddressAdditional: ''
      },
      officer: {
        email: 'lucille@example.com',
        firstName: 'Lucille',
        id: '4f80eaa4-96e4-45fa-a088-ec4649c05d90',
        lastName: 'TWENTY',
        middleName: 'BCREGTEST',
        organizationName: '',
        partyType: 'person'
      },
      roles: [
        {
          appointmentDate: '2022-04-02',
          roleType: 'Completing Party'
        }
      ]
    }
  ]

  beforeAll(() => {
    store.stateModel.entityType = CorpTypeCd.SOLE_PROP
    store.stateModel.tombstone.filingType = FilingTypes.REGISTRATION
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('displays the correct name data in the peoples / roles list', () => {
    wrapper = wrapperFactory(ListPeopleAndRoles,
      null,
      { addPeopleAndRoleStep: { orgPeople: mockPersonList } }
    )

    const peoplesListItem1 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]
    const peoplesListItem2 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[1]

    // verify first party's name data
    expect(peoplesListItem1.querySelector('.name-column .name').textContent)
      .toBe('Crazy Cat Consulting Company')
    expect(peoplesListItem1.querySelector('.name-column .email').textContent)
      .toContain('proprietor@example.com')
    expect(peoplesListItem1.querySelector('.name-column .business-number').textContent)
      .toContain('123456789')

    // verify first party's name data
    expect(peoplesListItem2.querySelector('.name-column .name').textContent)
      .toBe('Lucille BCREGTEST TWENTY')
    expect(peoplesListItem2.querySelector('.name-column .email').textContent)
      .toContain('lucille@example.com')
  })

  it('displays the correct roles', () => {
    wrapper = shallowWrapperFactory(ListPeopleAndRoles,
      null,
      { addPeopleAndRoleStep: { orgPeople: mockPersonList } }
    )

    const peoplesListItem1 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[0]
    const peoplesListItem2 = wrapper.vm.$el.querySelectorAll('.people-roles-content')[1]

    // verify first party's roles
    expect(peoplesListItem1.querySelectorAll('.roles-column p')[0].textContent)
      .toContain('Proprietor')

    // verify second party's roles
    expect(peoplesListItem2.querySelectorAll('.roles-column p')[0].textContent)
      .toContain('Completing Party')
  })
})

describe('List People And Roles component - BEN restoration', () => {
  let wrapper: any

  const mockPersonList = [
    {
      officer: {
        id: 0,
        firstName: 'Cameron',
        lastName: 'Bowler',
        middleName: 'D',
        organizationName: '',
        partyType: 'person',
        email: 'applicant@example.com'
      },
      roles: [
        { roleType: 'Applicant', appointmentDate: '2020-03-30' }
      ],
      mailingAddress: {
        streetAddress: '122-12210 Boul De Pierrefonds',
        streetAddressAdditional: '',
        addressCity: 'Pierrefonds',
        addressRegion: 'QC',
        postalCode: 'H9A 2X6',
        addressCountry: 'CA'
      }
    }
  ]

  beforeAll(() => {
    store.stateModel.entityType = CorpTypeCd.BENEFIT_COMPANY
    store.stateModel.tombstone.filingType = FilingTypes.RESTORATION
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('does not show the peoples / roles list if there is no data to display', () => {
    wrapper = shallowWrapperFactory(
      ListPeopleAndRoles,
      {
        showDeliveryAddressColumn: false,
        showRolesColumn: false,
        showEmailColumn: true
      },
      {
        addPeopleAndRoleStep: { orgPeople: [] }
      }
    )

    expect(wrapper.findAll('.people-roles-content').length).toEqual(0)
    expect(wrapper.find('.people-roles-header').exists()).toBe(false)
    expect(wrapper.find('.people-roles-content').exists()).toBe(false)
  })

  it('displays the correct amount of peoples / roles list when data is present', () => {
    wrapper = shallowWrapperFactory(
      ListPeopleAndRoles,
      {
        showDeliveryAddressColumn: false,
        showRolesColumn: false,
        showEmailColumn: true
      },
      {
        addPeopleAndRoleStep: { orgPeople: mockPersonList }
      }
    )

    const header = wrapper.find('.people-roles-header')
    expect(header.exists()).toBe(true)
    expect(header.text()).toContain('Name')
    expect(header.text()).toContain('Mailing Address')
    expect(header.text()).not.toContain('Delivery Address')
    expect(header.text()).not.toContain('Roles')
    expect(header.text()).toContain('Email')

    expect(wrapper.findAll('.people-roles-content').length).toEqual(1)
    expect(wrapper.find('.people-roles-content').exists()).toBe(true)
  })
})
