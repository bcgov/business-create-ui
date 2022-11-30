import { getShowErrors } from './../../src/store/getters/state-getters'
import Vue from 'vue'
import { wrapperFactory } from '../jest-wrapper-factory'
import AgreementType from '@/components/common/AgreementType.vue'
import { CorpTypeCd } from '@/enums'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

// Input field selectors to test changes to the DOM elements.
const typeSelector = '#agreement-type-'
const summaryErrorMessageSelector = '.agreement-invalid-message'
const summaryTextSelector = '.summary-desc'

// NB: Agreement Type does not apply to COOPERATIVE
const agreementTypeTestCases = [
  {
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    sampleAgreement: {
      agreementType: 'sample'
    },
    customAgreement: {
      agreementType: 'custom'
    },
    sampleSummaryText: 'The sample Incorporation Agreement and Articles containing a benefit ' +
      'provision has been completed and a copy has been added to the company\'s record book.',
    customSummaryText: 'The custom Incorporation Agreement and custom Articles containing a benefit ' +
      'provision has been completed and a copy has been added to the company\'s record book.'
  },
  {
    entityType: CorpTypeCd.BC_COMPANY,
    sampleAgreement: {
      agreementType: 'sample'
    },
    customAgreement: {
      agreementType: 'custom'
    },
    sampleSummaryText: 'The sample Incorporation Agreement and Articles ' +
    'has been completed and a copy has been added to the company\'s record book.',
    customSummaryText: 'The custom Incorporation Agreement and custom Articles ' +
    'has been completed and a copy has been added to the company\'s record book.'
  }
]

const ulcAndCccTestCases = [
  {
    entityType: CorpTypeCd.BC_ULC_COMPANY,
    customAgreement: {
      agreementType: 'custom'
    },
    customSummaryText: 'The custom Incorporation Agreement and custom Articles containing the liability' +
    ' provision required by the Business Corporations Act 51.11 has been completed and a copy has been added' +
    ' to the company\'s record book.'
  },
  {
    entityType: CorpTypeCd.BC_CCC,
    customAgreement: {
      agreementType: 'custom'
    },
    customSummaryText: 'The custom Incorporation Agreement and custom Articles containing the community' +
    ' provision required by the Business Corporations Act 51.911 has been completed and a copy has been added' +
    ' to the company\'s record book.'
  }
]

for (const test of agreementTypeTestCases) {
  describe(`Incorporation agreement component for a ${GetCorpFullDescription(test.entityType)}`, () => {
    let wrapper: any

    it('Loads the component in edit mode and both agreement types are not selected', () => {
      wrapper = wrapperFactory(
        AgreementType,
        null,
        {
          entityType: test.entityType,
          incorporationAgreementStep: ''
        }
      )
      const sampleSelector = `${typeSelector}${test.sampleAgreement.agreementType}`
      const customSelector = `${typeSelector}${test.customAgreement.agreementType}`

      expect(wrapper.find(sampleSelector).attributes('aria-checked')).toBe('false')
      expect(wrapper.find(customSelector).attributes('aria-checked')).toBe('false')
    })

    it('Selects the radio button if the value is set in the store', () => {
      wrapper = wrapperFactory(
        AgreementType,
        null,
        {
          entityType: test.entityType,
          incorporationAgreementStep: test.sampleAgreement
        }
      )
      const sampleSelector = `${typeSelector}${test.sampleAgreement.agreementType}`
      const customSelector = `${typeSelector}${test.customAgreement.agreementType}`

      expect(wrapper.find(sampleSelector).attributes('aria-checked')).toBe('true')
      expect(wrapper.find(customSelector).attributes('aria-checked')).toBe('false')
    })

    it('Displays the summary text for sample agreement type', () => {
      wrapper = wrapperFactory(
        AgreementType,
        { isSummary: true },
        {
          entityType: test.entityType,
          incorporationAgreementStep: test.sampleAgreement
        }
      )

      expect(wrapper.find(summaryTextSelector).text()).toContain(test.sampleSummaryText)
    })

    it('Displays the summary text for custom agreement type', () => {
      wrapper = wrapperFactory(
        AgreementType,
        { isSummary: true },
        {
          entityType: test.entityType,
          incorporationAgreementStep: test.customAgreement
        }
      )

      expect(wrapper.find(summaryTextSelector).text()).toContain(test.customSummaryText)
    })

    it('Displays the error message in summary view if no agreement type is selected', () => {
      wrapper = wrapperFactory(
        AgreementType,
        {
          isSummary: true,
          showErrorSummary: true
        },
        {
          entityType: test.entityType
        },
        null,
        null,
        {
          getShowErrors: {
            get (): boolean { return true }
          }
        }
      )

      expect(wrapper.find(summaryErrorMessageSelector).text()).toContain('This step is unfinished.')
    })

    it('Updates the store correctly if a sample agreement type is selected', async () => {
      wrapper = wrapperFactory(
        AgreementType,
        null,
        {
          entityType: test.entityType,
          incorporationAgreementStep: {
            agreementType: null
          }
        }
      )

      // Verify agreement type is null
      expect(wrapper.vm.$data.agreementType).toBe(null)

      // Select the Sample Radio btn
      const sampleSelector = `${typeSelector}${test.sampleAgreement.agreementType}`
      const radio = wrapper.find(sampleSelector)
      radio.trigger('click')
      await Vue.nextTick()

      // Verify state is updated
      expect(wrapper.vm.$data.agreementType).toBe(test.sampleAgreement.agreementType)
    })

    it('Updates the store correctly if a custom agreement type is selected', async () => {
      wrapper = wrapperFactory(
        AgreementType,
        null,
        {
          entityType: test.entityType,
          incorporationAgreementStep: {
            agreementType: null
          }
        }
      )

      // Verify agreement type is null
      expect(wrapper.vm.$data.agreementType).toBe(null)

      // Select the Sample Radio btn
      const customSelector = `${typeSelector}${test.customAgreement.agreementType}`
      const radio = wrapper.find(customSelector)
      radio.trigger('click')
      await Vue.nextTick()

      // Verify state is updated
      expect(wrapper.vm.$data.agreementType).toBe(test.customAgreement.agreementType)
    })
  })
}

for (const test of ulcAndCccTestCases) {
  describe(`Incorporation agreement component for a ${GetCorpFullDescription(test.entityType)}`, () => {
    let wrapper: any

    it('Loads the component in edit mode and both agreement types are not selected', () => {
      wrapper = wrapperFactory(
        AgreementType,
        null,
        {
          entityType: test.entityType,
          incorporationAgreementStep: ''
        }
      )
      const sampleSelector = `${typeSelector}${test.customAgreement.agreementType}`

      expect(wrapper.find(sampleSelector).attributes('aria-checked')).toBe('false')
    })

    it('Selects the radio button if the value is set in the store', () => {
      wrapper = wrapperFactory(
        AgreementType,
        null,
        {
          entityType: test.entityType,
          incorporationAgreementStep: test.customAgreement
        }
      )
      const sampleSelector = `${typeSelector}${test.customAgreement.agreementType}`

      expect(wrapper.find(sampleSelector).attributes('aria-checked')).toBe('true')
    })

    it('Displays the summary text for sample agreement type', () => {
      wrapper = wrapperFactory(
        AgreementType,
        { isSummary: true },
        {
          entityType: test.entityType,
          incorporationAgreementStep: test.customAgreement
        }
      )

      expect(wrapper.find(summaryTextSelector).text()).toContain(test.customSummaryText)
    })

    it('Displays the error message in summary view if no agreement type is selected', () => {
      wrapper = wrapperFactory(
        AgreementType,
        {
          isSummary: true,
          showErrorSummary: true
        },
        {
          entityType: test.entityType
        },
        null,
        null,
        {
          getShowErrors: {
            get (): boolean { return true }
          }
        }
      )

      expect(wrapper.find(summaryErrorMessageSelector).text()).toContain('This step is unfinished.')
    })

    it('Updates the store correctly if a sample agreement type is selected', async () => {
      wrapper = wrapperFactory(
        AgreementType,
        null,
        {
          entityType: test.entityType,
          incorporationAgreementStep: {
            agreementType: null
          }
        }
      )

      // Verify agreement type is null
      expect(wrapper.vm.$data.agreementType).toBe(null)

      // Select the Sample Radio btn
      const sampleSelector = `${typeSelector}${test.customAgreement.agreementType}`
      const radio = wrapper.find(sampleSelector)
      radio.trigger('click')
      await Vue.nextTick()

      // Verify state is updated
      expect(wrapper.vm.$data.agreementType).toBe(test.customAgreement.agreementType)
    })
  })
}
