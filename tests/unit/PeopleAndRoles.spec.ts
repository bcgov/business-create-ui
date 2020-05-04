// Libraries
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import mockRouter from './MockRouter'

// Store
import { getVuexStore } from '@/store'

// Utils
import { createLocalVue, mount } from '@vue/test-utils'

// Components
import { PeopleAndRoles } from '@/components/AddPeopleAndRoles'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Input field selectors to test changes to the DOM elements.
const btnStartAddCompletingParty: string = '#btn-start-add-cp'
const btnAddPerson: string = '#btn-add-person'
const btnAddCompletingParty: string = '#btn-add-cp'
const btnAddCorp: string = '#btn-add-corp'
const btnPanel: string = '.btn-panel'
const appointForm: string = '.appoint-form'
const checkCompletingParty: string = '.cp-valid'
const checkDirector: string = '.dir-valid'
const checkIncorporator: string = '.incorp-valid'
const completingPartyRole = { 'roleType': 'Completing Party', 'appointmentDate': '2020-03-30' }
const directorRole: string = 'Director'
const incorporatorRole: string = 'Incorporator'

function resetStore (): void {
  store.state.stateModel.addPeopleAndRoleStep.orgPeople = []
}

function getPersonList (roles = [completingPartyRole]) : any {
  const mockPersonList = [
    {
      'officer': {
        'id': 0,
        'firstName': 'Adam',
        'lastName': 'Smith',
        'middleName': 'D',
        'orgName': '',
        'type': 'Person'
      },
      'roles': roles,
      'address': {
        'mailingAddress': {
          'streetAddress': '123 Fake Street',
          'streetAddressAdditional': '',
          'addressCity': 'Victoria',
          'addressRegion': 'BC',
          'postalCode': 'V8Z 5C6',
          'addressCountry': 'CA'
        },
        'deliveryAddress': {
          'streetAddress': '123 Fake Street',
          'streetAddressAdditional': '',
          'addressCity': 'Victoria',
          'addressRegion': 'BC',
          'postalCode': 'V8Z 5C6',
          'addressCountry': 'CA'
        }
      }
    }
  ]
  return mockPersonList
}

describe('People And Roles component', () => {
  let wrapperFactory: any

  beforeEach(() => {
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = mockRouter.mock()

    wrapperFactory = (propsData) => {
      return mount(PeopleAndRoles, {
        localVue,
        router,
        store,
        vuetify
      })
    }
  })

  it('shows Start by Adding Completing Party Button when people list is empty', () => {
    store.state.stateModel.addPeopleAndRoleStep.orgPeople = []
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnStartAddCompletingParty).exists()).toBeTruthy()
    expect(wrapper.find(btnStartAddCompletingParty).text()).toContain('Start by Adding the Completing Party')
    wrapper.destroy()
  })

  it('Does not show other add buttons when people list is empty', () => {
    store.state.stateModel.addPeopleAndRoleStep.orgPeople = []
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddPerson).exists()).toBeFalsy()
    expect(wrapper.find(btnAddCompletingParty).exists()).toBeFalsy()
    expect(wrapper.find(btnAddCorp).exists()).toBeFalsy()
    wrapper.destroy()
  })

  it('does not Start by Adding Completing Party Button when people list is not empty', () => {
    store.state.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnStartAddCompletingParty).exists()).toBeFalsy()
    wrapper.destroy()
    resetStore()
  })

  it('shows Add Person and Add Corporation Button when people list is not empty', () => {
    store.state.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddCorp).exists()).toBeTruthy()
    expect(wrapper.find(btnAddPerson).exists()).toBeTruthy()
    wrapper.destroy()
    resetStore()
  })

  it('shows Add Completing Party Button when people list is not empty and has no Completing Party', () => {
    store.state.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList([
      { 'roleType': 'Director', 'appointmentDate': '2020-03-30' }
    ])
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddCompletingParty).exists()).toBeTruthy()
    wrapper.destroy()
    resetStore()
  })

  it('Does not show Add Completing Party Button when people list is not empty and has Completing Party', () => {
    store.state.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    expect(wrapper.find(btnAddCompletingParty).exists()).toBeFalsy()
    wrapper.destroy()
    resetStore()
  })

  it('Sets the data attributes as expected when add button is clicked', async () => {
    store.state.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    wrapper.find(btnAddPerson).trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$data.showOrgPersonForm).toBe(true)
    expect(wrapper.vm.$data.addEditInProgress).toBe(true)
    expect(wrapper.vm.$data.nextId).toBe(1)
    wrapper.destroy()
    resetStore()
  })

  it('Shows the add person form when add person button is clicked', async () => {
    store.state.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList()
    const wrapper = wrapperFactory()
    wrapper.find(btnAddPerson).trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find(appointForm).exists()).toBeTruthy()
    wrapper.destroy()
    resetStore()
  })

  it('Shows check mark next to roles added', () => {
    store.state.stateModel.addPeopleAndRoleStep.orgPeople = getPersonList([
      { 'roleType': 'Director', 'appointmentDate': '2020-03-30' },
      { 'roleType': 'Incorporator', 'appointmentDate': '2020-03-30' }
    ])
    const wrapper = wrapperFactory()
    expect(wrapper.find(checkIncorporator).exists()).toBeTruthy()
    expect(wrapper.find(checkDirector).exists()).toBeTruthy()
    expect(wrapper.find(checkCompletingParty).exists()).toBeFalsy()
    wrapper.destroy()
    resetStore()
  })
})
