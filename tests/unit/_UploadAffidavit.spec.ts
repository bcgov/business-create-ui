import Vue from 'vue'
import { shallowWrapperFactory, wrapperFactory } from '../vitest-wrapper-factory'
import Affidavit from '@/components/Dissolution/CompleteAffidavit.vue'
import { DissolutionResources } from '@/resources'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

// Test Case Data
const uploadAffidavitTestCases = [
  {
    entityType: CorpTypeCd.COOP,
    helpText: 'The Cooperative Association has no assets; and',
    checkboxLabel: 'I confirm the following items are included as required in the Cooperative Associations Act'
  },
  {
    entityType: CorpTypeCd.BENEFIT_COMPANY,
    helpText: 'The Company has no assets; and',
    checkboxLabel: 'I confirm the following items are included as required in the Business Corporations Act'
  },
  {
    entityType: CorpTypeCd.BC_CCC,
    helpText: 'The Company has no assets; and',
    checkboxLabel: 'I confirm the following items are included as required in the Business Corporations Act'
  },
  {
    entityType: CorpTypeCd.BC_COMPANY,
    helpText: 'The Company has no assets; and',
    checkboxLabel: 'I confirm the following items are included as required in the Business Corporations Act'
  },
  {
    entityType: CorpTypeCd.BC_ULC_COMPANY,
    helpText: 'The Company has no assets; and',
    checkboxLabel: 'I confirm the following items are included as required in the Business Corporations Act'
  },
  {
    entityType: CorpTypeCd.BEN_CONTINUE_IN,
    helpText: 'The Company has no assets; and',
    checkboxLabel: 'I confirm the following items are included as required in the Business Corporations Act'
  },
  {
    entityType: CorpTypeCd.CCC_CONTINUE_IN,
    helpText: 'The Company has no assets; and',
    checkboxLabel: 'I confirm the following items are included as required in the Business Corporations Act'
  },
  {
    entityType: CorpTypeCd.CONTINUE_IN,
    helpText: 'The Company has no assets; and',
    checkboxLabel: 'I confirm the following items are included as required in the Business Corporations Act'
  },
  {
    entityType: CorpTypeCd.ULC_CONTINUE_IN,
    helpText: 'The Company has no assets; and',
    checkboxLabel: 'I confirm the following items are included as required in the Business Corporations Act'
  }
]

for (const test of uploadAffidavitTestCases) {
  describe(`Upload Affidavit view for a ${test.entityType}`, () => {
    let wrapper: any

    it('renders or hides the upload component', async () => {
      wrapper = shallowWrapperFactory(
        Affidavit,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      if (test.entityType === CorpTypeCd.COOP) {
        expect(wrapper.find('#upload-affidavit-card').exists()).toBe(true)
      } else {
        expect(wrapper.find('#upload-affidavit-card').exists()).toBe(false)
      }
    })

    it('displays the correct help text', async () => {
      wrapper = shallowWrapperFactory(
        Affidavit,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      wrapper.find('.help-btn').trigger('click')
      await Vue.nextTick()

      const helpList = wrapper.findAll('.affidavit-help li')
      expect(helpList.length).toBe(2)
      expect(helpList.at(0).text()).toContain(test.helpText)
    })

    it('displays the correct confirm text', async () => {
      wrapper = wrapperFactory(
        Affidavit,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      expect(wrapper.find('#confirm-affidavit-section').text()).toContain(test.checkboxLabel)
    })
  })
}
