import { shallowWrapperFactory } from '../jest-wrapper-factory'
import TransactionalFolionNumber from '@/components/common/TransactionalFolioNumber.vue'

const tests = [
  {
    props: {
      accountFolioNumber: null,
      transactionalFolioNumber: null,
      doValidate: false
    },
    value: null
  },
  {
    props: {
      accountFolioNumber: '1234',
      transactionalFolioNumber: null,
      doValidate: false
    }
  },
  {
    props: {
      accountFolioNumber: '1234',
      transactionalFolioNumber: '4321',
      doValidate: false
    }
  }
]

for (const [i, test] of tests.entries()) {
  describe(`Transactional Folio Number component, test #${i}`, () => {
    let wrapper

    beforeAll(() => {
      wrapper = shallowWrapperFactory(TransactionalFolionNumber, test.props)
    })

    afterAll(() => {
      wrapper.destroy()
    })

    it('displays the component', () => {
      expect(wrapper.find(TransactionalFolionNumber).exists()).toBe(true)
    })

    it('displays the default account folio number', () => {
      if (!test.props.transactionalFolioNumber && test.props.accountFolioNumber) {
        expect(wrapper.vm.localFolioNumber).toBe(test.props.accountFolioNumber)
      }
    })

    it('displays the transactional folio number', () => {
      if (test.props.transactionalFolioNumber) {
        expect(wrapper.vm.localFolioNumber).toBe('4321')
      }
    })

    it('is valid when validation is disabled', () => {
      if (!test.props.doValidate) {
        expect(wrapper.vm.isValid).toBe(true)
        // TODO: check element classes
      }
    })
  })
}
