import { wrapperFactory } from '../jest-wrapper-factory'
import MixinTester from './mixin-tester.vue'

describe('Enum Mixin', () => {
  let vm: any

  beforeEach(() => {
    const wrapper = wrapperFactory(MixinTester, null, {})
    vm = wrapper.vm
  })

  it('returns correct values for Coop Type to Description helper', () => {
    expect(vm.coopTypeToDescription('CSC')).toBe('Community Service Cooperative')
    expect(vm.coopTypeToDescription('CP')).toBe('Ordinary Cooperative')
    expect(vm.coopTypeToDescription('HC')).toBe('Housing Cooperative')
  })
})
