import Vue from 'vue'
import Vuetify from 'vuetify'
import flushPromises from 'flush-promises'
import { createPinia, setActivePinia } from 'pinia'
import { useStore } from '@/store/store'
import { mount } from '@vue/test-utils'
import RegPeopleAndRoles from '@/components/common/RegPeopleAndRoles.vue'
import { RegistrationResourceSp } from '@/resources/Registration/SP'
import { RegistrationResourceGp } from '@/resources/Registration/GP'
import RegAddEditOrgPerson from '@/components/common/RegAddEditOrgPerson.vue'
import ListPeopleAndRoles from '@/components/common/ListPeopleAndRoles.vue'
import { AuthorizationRoles, RoleTypes } from '@/enums'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'
import { OrgPersonIF, ResourceIF } from '@/interfaces'
import { setAuthRole } from '../set-auth-role'

// mock the console.warn function to hide "[Vuetify] Unable to locate target XXX"
console.warn = vi.fn()

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const store = useStore()

// selectors to test changes to the DOM elements
const btnStartAddCompletingParty = '#btn-start-add-cp'
const btnAddCompletingParty = '#btn-add-cp'
const btnAddPerson = '#btn-add-person'
const btnAddOrganization = '#btn-add-organization'
const completingPartyRule = '.completing-party-rule'
const proprietorsRule = '.proprietors-rule'
const partnersRule = '.partners-rule'

function getPersonList (roles = null): any {
  const completingPartyRole = {
    roleType: 'Completing Party',
    appointmentDate: '2020-03-30'
  }

  return [
    {
      officer: {
        id: 0,
        firstName: 'Adam',
        lastName: 'Smith',
        middleName: 'D',
        organizationName: '',
        type: 'Person'
      },
      roles: roles || [completingPartyRole],
      address: {
        mailingAddress: {
          streetAddress: '123 Fake Street',
          streetAddressAdditional: '',
          addressCity: 'Victoria',
          addressRegion: 'BC',
          postalCode: 'V8Z 5C6',
          addressCountry: 'CA'
        },
        deliveryAddress: {
          streetAddress: '123 Fake Street',
          streetAddressAdditional: '',
          addressCity: 'Victoria',
          addressRegion: 'BC',
          postalCode: 'V8Z 5C6',
          addressCountry: 'CA'
        }
      }
    }
  ]
}

describe('Registration People And Roles component - SP', () => {
  let wrapperFactory: any

  beforeEach(() => {
    store.stateModel.entityType = CorpTypeCd.SOLE_PROP
    setAuthRole(store, AuthorizationRoles.STAFF)
    store.resourceModel = RegistrationResourceSp as ResourceIF

    wrapperFactory = () => mount(RegPeopleAndRoles, {
      vuetify,
      stubs: {
        RegAddEditOrgPerson: true,
        ListPeopleAndRoles: true
      }
    })
  })

  it('shows Start Add Completing Party button when people list is empty', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = []
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnStartAddCompletingParty).exists()).toBeTruthy()
    expect(wrapper.find(btnStartAddCompletingParty).text()).toContain('Start by Adding the Completing Party')
    // also verify list people component
    expect(wrapper.findComponent(ListPeopleAndRoles).exists()).toBeFalsy()
    wrapper.destroy()
  })

  it('does not show the other buttons when people list is empty', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = []
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddPerson).exists()).toBeFalsy()
    expect(wrapper.find(btnAddCompletingParty).exists()).toBeFalsy()
    expect(wrapper.find(btnAddOrganization).exists()).toBeFalsy()
    wrapper.destroy()
  })

  it('does not show Start Add Completing Party button when people list is not empty', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnStartAddCompletingParty).exists()).toBeFalsy()
    // also verify list people component
    expect(wrapper.findComponent(ListPeopleAndRoles).exists()).toBeTruthy()
    wrapper.destroy()
  })

  it('shows Add Person and Add Organization buttons when people list is not empty', async () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddPerson).exists()).toBeTruthy()
    expect(wrapper.find(btnAddOrganization).exists()).toBeTruthy()
    wrapper.destroy()
  })

  it('shows Add Completing Party button when people list is not empty and has no completing party', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList([
      { roleType: 'Proprietor', appointmentDate: '2020-03-30' }
    ])
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddCompletingParty).exists()).toBeTruthy()
    wrapper.destroy()
  })

  it('does not show Add Completing Party Button when people list is not empty and has completing party', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddCompletingParty).exists()).toBeFalsy()
    wrapper.destroy()
  })

  it('renders the add-edit component when add button is clicked', async () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()

    // verify before click
    expect(wrapper.findComponent(RegAddEditOrgPerson).exists()).toBe(false)

    // click the Add Person button
    await wrapper.vm.$el.querySelector(btnAddPerson).click()

    // click the Continue button in the dialog
    await wrapper.vm.$el.querySelector('.dialog-yes-btn').click()

    // wait for everything to update
    await flushPromises()

    // verify after click
    expect(wrapper.findComponent(RegAddEditOrgPerson).exists()).toBe(true)

    wrapper.destroy()
  })

  it('shows check mark next to roles added', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = [
      { roles: [{ roleType: RoleTypes.COMPLETING_PARTY }] } as OrgPersonIF,
      { roles: [{ roleType: RoleTypes.PROPRIETOR }] } as OrgPersonIF
    ]
    const wrapper = wrapperFactory()
    expect(wrapper.find(completingPartyRule).exists()).toBeTruthy()
    expect(wrapper.find(proprietorsRule).exists()).toBeTruthy()
    wrapper.destroy()
  })

  it('it does not show people list component when people list is empty', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = []
    const wrapper = wrapperFactory()
    expect(wrapper.findComponent(ListPeopleAndRoles).exists()).toBeFalsy()
    wrapper.destroy()
  })

  it('shows the people list component when people list is not empty', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    expect(wrapper.findComponent(ListPeopleAndRoles).exists()).toBeTruthy()
    wrapper.destroy()
  })

  it('destroys the people list component when the last org-person is removed', async () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()

    // verify before click
    expect(wrapper.findComponent(ListPeopleAndRoles).exists()).toBe(true)

    // call the On Remove Person event handler
    wrapper.vm.onRemovePerson(0)

    // wait for dialog to display
    await Vue.nextTick()

    // click the Remove button
    await wrapper.vm.$el.querySelector('.dialog-yes-btn').click()

    // wait for everything to update
    await flushPromises()

    // verify after click
    expect(wrapper.findComponent(ListPeopleAndRoles).exists()).toBe(false)

    wrapper.destroy()
  })
})

describe('Registration People And Roles component - GP', () => {
  let wrapperFactory: any

  beforeEach(() => {
    store.stateModel.entityType = CorpTypeCd.PARTNERSHIP
    setAuthRole(store, AuthorizationRoles.STAFF)
    store.resourceModel = RegistrationResourceGp as ResourceIF

    wrapperFactory = () => mount(RegPeopleAndRoles, {
      vuetify,
      stubs: {
        RegAddEditOrgPerson: true,
        ListPeopleAndRoles: true
      }
    })
  })

  it('shows Start Add Completing Party button when people list is empty', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = []
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnStartAddCompletingParty).exists()).toBeTruthy()
    expect(wrapper.find(btnStartAddCompletingParty).text()).toContain('Start by Adding the Completing Party')
    // also verify list people component
    expect(wrapper.findComponent(ListPeopleAndRoles).exists()).toBeFalsy()
    wrapper.destroy()
  })

  it('does not show the other buttons when people list is empty', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = []
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddPerson).exists()).toBeFalsy()
    expect(wrapper.find(btnAddCompletingParty).exists()).toBeFalsy()
    expect(wrapper.find(btnAddOrganization).exists()).toBeFalsy()
    wrapper.destroy()
  })

  it('does not show Start Add Completing Party button when people list is not empty', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnStartAddCompletingParty).exists()).toBeFalsy()
    // also verify list people component
    expect(wrapper.findComponent(ListPeopleAndRoles).exists()).toBeTruthy()
    wrapper.destroy()
  })

  it('shows Add Person and Add Organization buttons when people list is not empty', async () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddPerson).exists()).toBeTruthy()
    expect(wrapper.find(btnAddOrganization).exists()).toBeTruthy()
    wrapper.destroy()
  })

  it('shows Add Completing Party button when people list is not empty and has no completing party', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList([
      { roleType: 'Partner', appointmentDate: '2020-03-30' }
    ])
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddCompletingParty).exists()).toBeTruthy()
    wrapper.destroy()
  })

  it('does not show Add Completing Party Button when people list is not empty and has completing party', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddCompletingParty).exists()).toBeFalsy()
    wrapper.destroy()
  })

  it('renders the add-edit component when add button is clicked', async () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()

    // verify before click
    expect(wrapper.findComponent(RegAddEditOrgPerson).exists()).toBe(false)

    // click the Add Person button
    await wrapper.vm.$el.querySelector(btnAddPerson).click()

    // NB: no dialog atm

    // wait for everything to update
    await flushPromises()

    // verify after click
    expect(wrapper.findComponent(RegAddEditOrgPerson).exists()).toBe(true)

    wrapper.destroy()
  })

  it('shows check mark next to roles added', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = [
      { roles: [{ roleType: RoleTypes.COMPLETING_PARTY }] } as OrgPersonIF,
      { roles: [{ roleType: RoleTypes.PARTNER }] } as OrgPersonIF,
      { roles: [{ roleType: RoleTypes.PARTNER }] } as OrgPersonIF
    ]
    const wrapper = wrapperFactory()
    expect(wrapper.find(completingPartyRule).exists()).toBeTruthy()
    expect(wrapper.find(partnersRule).exists()).toBeTruthy()
    wrapper.destroy()
  })

  it('it does not show people list component when people list is empty', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = []
    const wrapper = wrapperFactory()
    expect(wrapper.findComponent(ListPeopleAndRoles).exists()).toBeFalsy()
    wrapper.destroy()
  })

  it('shows the people list component when people list is not empty', () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    expect(wrapper.findComponent(ListPeopleAndRoles).exists()).toBeTruthy()
    wrapper.destroy()
  })

  it('destroys the people list component when the last org-person is removed', async () => {
    store.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()

    // verify before click
    expect(wrapper.findComponent(ListPeopleAndRoles).exists()).toBe(true)

    // call the On Remove Person event handler
    wrapper.vm.onRemovePerson(0)

    // wait for dialog to display
    await Vue.nextTick()

    // click the Remove button
    await wrapper.vm.$el.querySelector('.dialog-yes-btn').click()

    // wait for everything to update
    await flushPromises()

    // verify after click
    expect(wrapper.findComponent(ListPeopleAndRoles).exists()).toBe(false)

    wrapper.destroy()
  })
})
