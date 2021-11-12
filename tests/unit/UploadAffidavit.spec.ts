import Vue from 'vue'
import { shallowWrapperFactory, wrapperFactory } from '../jest-wrapper-factory'
import Affidavit from '@/components/Affidavit/Affidavit.vue'
import { DissolutionResources } from '@/resources'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

// Test Case Data
const uploadAffidavitTestCases = [
  {
    entityType: 'CP',
    helpText: 'The Cooperative Association has no assets; and',
    checkboxLabel: `I confirm the following items are included as required in the Cooperative Associations Act`
  },
  {
    entityType: 'BEN',
    helpText: 'The Company has no assets; and',
    checkboxLabel: `I confirm the following items are included as required in the Business Corporations Act`
  },
  {
    entityType: 'CC',
    helpText: 'The Company has no assets; and',
    checkboxLabel: `I confirm the following items are included as required in the Business Corporations Act`
  },
  {
    entityType: 'BC',
    helpText: 'The Company has no assets; and',
    checkboxLabel: `I confirm the following items are included as required in the Business Corporations Act`
  },
  {
    entityType: 'ULC',
    helpText: 'The Company has no assets; and',
    checkboxLabel: `I confirm the following items are included as required in the Business Corporations Act`
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
