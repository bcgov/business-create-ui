import Vue from 'vue'
import sinon from 'sinon'
import { shallowMount, Wrapper } from '@vue/test-utils'
import { axios } from '@/utils'
import MixinTester from './mixin-tester.vue'

describe('Legal API Mixin', () => {
  let get: any
  let put: any
  let wrapper: Wrapper<Vue>
  let vm: any

  beforeEach(async () => {
    get = sinon.stub(axios, 'get')
    put = sinon.stub(axios, 'put')
    wrapper = shallowMount(MixinTester)
    vm = wrapper.vm
    await Vue.nextTick()
  })

  afterEach(() => {
    sinon.restore()
    wrapper.destroy()
  })

  xit('fetches a draft IA correctly', async () => {
    // FUTURE
  })

  xit('fetches a draft dissolution correctly', async () => {
    // FUTURE
  })

  xit('updates an existing filing correctly', async () => {
    // FUTURE
  })

  it('fetches name request correctly', async () => {
    const NR = {
      foo: 'bar'
    }

    // mock endpoint
    get.withArgs('nameRequests/NR1234567')
      .returns(new Promise((resolve) => resolve({ data: NR })))

    // call method
    const nr = await vm.fetchNameRequest('NR1234567')

    // verify data
    expect(nr).toEqual(NR)
  })

  xit('formats an empty IA filing correctly', async () => {
    // FUTURE
  })
})
