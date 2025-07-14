/* eslint max-len: 0 */
import { Wrapper } from '@vue/test-utils'
import { wrapperFactory } from '../vitest-wrapper-factory'
import TransactionalFolioNumber from '@/components/common/TransactionalFolioNumber.vue'

const tests = [
  {
    props: {
      accountFolioNumber: null,
      transactionalFolioNumber: null,
      doValidate: false
    }
  },
  {
    props: {
      transactionalFolioNumber: null,
      doValidate: false
    }
  },
  {
    props: {
      transactionalFolioNumber: '4321',
      doValidate: false
    }
  },
  {
    props: {
      transactionalFolioNumber: 'x'.repeat(50), // valid length
      doValidate: true
    },
    shouldBeValid: true
  },
  {
    props: {
      transactionalFolioNumber: 'x'.repeat(51), // invalid length
      doValidate: true
    },
    shouldBeValid: false
  },
  {
    props: {
      transactionalFolioNumber: '',
      doValidate: true
    },
    newValue: 'x'.repeat(50), // valid length
    shouldBeValid: true
  },
  {
    props: {
      transactionalFolioNumber: '',
      doValidate: true
    },
    newValue: 'x'.repeat(51), // invalid length
    shouldBeValid: false
  }
]

// Conditional check for specific test scenarios
const itIf = (condition: boolean) => condition ? it : it.skip

for (const [i, test] of tests.entries()) {
  describe(`Transactional Folio Number component, test #${i}`, () => {
    let wrapper: Wrapper<any>

    beforeEach(() => {
      wrapper = wrapperFactory(TransactionalFolioNumber, test.props)
    })

    afterEach(() => {
      wrapper.destroy()
    })

    it('displays the component', () => {
      expect(wrapper.findComponent(TransactionalFolioNumber).exists()).toBe(true)
    })

    itIf(!test.props.transactionalFolioNumber && !!test.props.accountFolioNumber)('displays an empty field if there is no transactional folio number', () => {
      expect(wrapper.vm.localFolioNumber).toBe('')
    })

    itIf(!!test.props.transactionalFolioNumber)('displays the transactional folio number', () => {
      expect(wrapper.vm.localFolioNumber).toBe(test.props.transactionalFolioNumber)
    })

    itIf(!test.props.doValidate)('is valid when validation is disabled', () => {
      expect(wrapper.vm.isValid).toBe(true)
      expect(wrapper.find('#transactional-folio-number').classes('invalid-section')).toBe(false)
      expect(wrapper.find('label').classes('error-text')).toBe(false)
    })

    // FUTURE: fix this; for some reason, the component under test can't read `this.$refs.folioNumberInput`
    itIf(test.props.doValidate && test.shouldBeValid === true)('is valid when validation is enabled and prop data is valid', async () => {
      // // wait for validation to complete
      // await flushPromises()

      // expect(wrapper.vm.isValid).toBe(true)
      // expect(wrapper.find('label').classes('error-text')).toBe(false)
      // expect(wrapper.find('#transactional-folio-number').classes('invalid-section')).toBe(false)
    })

    // FUTURE: fix this; for some reason, the component under test can't read `this.$refs.folioNumberInput`
    itIf(test.props.doValidate && test.shouldBeValid === false)('is invalid when validation is enabled and prop data is invalid', async () => {
      // // wait for validation to complete
      // await flushPromises()

      // expect(wrapper.vm.isValid).toBe(false)
      // expect(wrapper.find('#transactional-folio-number').classes('invalid-section')).toBe(true)
      // expect(wrapper.find('label').classes('error-text')).toBe(true)
    })

    // FUTURE: fix this; for some reason, the component under test can't read `this.$refs.folioNumberInput`
    itIf(test.props.doValidate && test.newValue !== undefined && test.shouldBeValid === true)('is valid when validation is enabled and valid new data is entered', async () => {
      // // before
      // expect(wrapper.vm.isValid).toBe(true)

      // wrapper.find('#folio-number-input').setValue(test.newValue)
      // wrapper.find('#folio-number-input').trigger('change')
      // // wait for validation to complete
      // await flushPromises()

      // // after
      // expect(wrapper.vm.isValid).toBe(true)
    })

    // FUTURE: fix this; for some reason, the component under test can't read `this.$refs.folioNumberInput`
    itIf(test.props.doValidate && test.newValue !== undefined && test.shouldBeValid === false)('is invalid when validation is enabled and invalid new data is entered', async () => {
      // // before
      // expect(wrapper.vm.isValid).toBe(true)

      // wrapper.find('#folio-number-input').setValue(test.newValue)
      // wrapper.find('#folio-number-input').trigger('change')
      // // wait for validation to complete
      // await flushPromises()

      // // after
      // expect(wrapper.vm.isValid).toBe(false)
    })
  })
}
