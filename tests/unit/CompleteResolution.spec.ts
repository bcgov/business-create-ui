import Vue from 'vue'
import { wrapperFactory } from '../jest-wrapper-factory'
import { CompleteResolution } from '@/components/CreateResolution'
import { DissolutionResources } from '@/resources'
import { CorpTypeCd } from '@/enums'

// Test Case Data
const completeResolutionTestCases = [
  {
    entityType: 'CP',
    introTextItem1: 'Before submitting your voluntary dissolution you must complete, sign, and date a',
    introTextItem2: 'special resolution',
    helpHeader: 'Help with Special Resolution',
    helpTextLabel: 'Upload a copy of the special resolution, which must include:',
    helpTextList1Item1: 'The name of the Cooperative Association,',
    sampleResolutionDesc: 'For your convenience, we have provided the special resolution form (Form 06 COO).  This',
    resolutionDateDesc: 'Enter the date the special resolution passed.',
    resolutionTextDesc: 'Enter the special resolution text as it appears on your printed form.',
    resolutionSignatureDesc:
      'Enter the full name of the person who signed the special resolution and the date they signed it.',
    confirmText: 'I confirm the following:',
    confirmTextListItem1: 'The Cooperative Association name is identified'
  },
  {
    entityType: 'BEN',
    introTextItem1: 'Before submitting your voluntary dissolution you must complete, sign, and date a',
    introTextItem2: 'resolution',
    helpHeader: 'Help with Resolution',
    helpTextList1Item1: 'The Company has no assets,',
    helpTextList2Item1: 'passed at a general meeting by a simple majority of the votes cast',
    confirmText: 'I confirm a resolution was passed by'
  },
  {
    entityType: 'CC',
    introTextItem1: 'Before submitting your voluntary dissolution you must complete, sign, and date a',
    introTextItem2: 'resolution',
    helpHeader: 'Help with Resolution',
    helpTextList1Item1: 'The Company has no assets,',
    helpTextList2Item1: 'passed at a general meeting by a simple majority of the votes cast',
    confirmText: 'I confirm a resolution was passed by'
  },
  {
    entityType: 'BC',
    introTextItem1: 'Before submitting your voluntary dissolution you must complete, sign, and date a',
    introTextItem2: 'resolution',
    helpHeader: 'Help with Resolution',
    helpTextList1Item1: 'The Company has no assets,',
    helpTextList2Item1: 'passed at a general meeting by a simple majority of the votes cast',
    confirmText: 'I confirm a resolution was passed by'
  },
  {
    entityType: 'ULC',
    introTextItem1: 'Before submitting your voluntary dissolution you must complete, sign, and date a',
    introTextItem2: 'resolution',
    helpHeader: 'Help with Resolution',
    helpTextList1Item1: 'The Company has no assets,',
    helpTextList2Item1: 'passed at a general meeting by a simple majority of the votes cast',
    confirmText: 'I confirm a resolution was passed by'
  }
]

for (const test of completeResolutionTestCases) {
  describe(`Complete Resolution view for a ${test.entityType}`, () => {
    let wrapper: any

    it('renders the complete resolution component', async () => {
      wrapper = wrapperFactory(
        CompleteResolution,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      expect(wrapper.find('#complete-resolution').exists()).toBe(true)
    })

    it('renders intro section', async () => {
      wrapper = wrapperFactory(
        CompleteResolution,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      expect(wrapper.find('#resolution-intro-section').exists()).toBe(true)
    })

    it('displays correct intro text', async () => {
      wrapper = wrapperFactory(
        CompleteResolution,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      const introText = wrapper.findAll('#resolution-intro-section header span span')

      expect(introText.exists()).toBe(true)
      expect(introText.at(0).text()).toContain(test.introTextItem1)
      expect(introText.at(1).text()).toContain(test.introTextItem2)
    })

    it('displays the correct help text', async () => {
      wrapper = wrapperFactory(
        CompleteResolution,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      wrapper.find('.help-btn').trigger('click')
      await Vue.nextTick()

      const helpHeader = wrapper.findAll('.create-resolution-help-header h2')
      const helpList = wrapper.findAll('.create-resolution-help li')

      expect(helpHeader.exists()).toBe(true)
      expect(helpHeader.at(0).text()).toContain(test.helpHeader)

      if (test.entityType === CorpTypeCd.COOP) {
        expect(helpList.length).toBe(2)
        expect(helpList.at(0).text()).toContain(test.helpTextList1Item1)
      } else {
        expect(helpList.length).toBe(5)
        expect(helpList.at(0).text()).toContain(test.helpTextList1Item1)
        expect(helpList.at(3).text()).toContain(test.helpTextList2Item1)
      }
    })

    it('renders or hides the sample resolution section', async () => {
      wrapper = wrapperFactory(
        CompleteResolution,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      if (test.entityType === CorpTypeCd.COOP) {
        expect(wrapper.find('#sample-resolution-section').exists()).toBe(true)
      } else {
        expect(wrapper.find('#sample-resolution-section').exists()).toBe(false)
      }
    })

    it('renders the correct sample resolution text', async () => {
      wrapper = wrapperFactory(
        CompleteResolution,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      const descText = wrapper.find('#sample-resolution-section .section-description')
      if (test.entityType === CorpTypeCd.COOP) {
        expect(descText.exists()).toBe(true)
        expect(descText.text()).toContain(test.sampleResolutionDesc)
      } else {
        expect(descText.exists()).toBe(false)
      }
    })

    it('renders or hides the resolution date section', async () => {
      wrapper = wrapperFactory(
        CompleteResolution,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      if (test.entityType === CorpTypeCd.COOP) {
        expect(wrapper.find('#resolution-date-section').exists()).toBe(true)
      } else {
        expect(wrapper.find('#resolution-date-section').exists()).toBe(false)
      }
    })

    it('renders the correct resolution date text', async () => {
      wrapper = wrapperFactory(
        CompleteResolution,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      const descText = wrapper.find('#resolution-date-section .section-description')
      if (test.entityType === CorpTypeCd.COOP) {
        expect(descText.exists()).toBe(true)
        expect(descText.text()).toEqual(test.resolutionDateDesc)
      } else {
        expect(descText.exists()).toBe(false)
      }
    })

    it('renders or hides the resolution text section', async () => {
      wrapper = wrapperFactory(
        CompleteResolution,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      if (test.entityType === CorpTypeCd.COOP) {
        expect(wrapper.find('#resolution-text-section').exists()).toBe(true)
      } else {
        expect(wrapper.find('#resolution-text-section').exists()).toBe(false)
      }
    })

    it('renders the correct resolution text', async () => {
      wrapper = wrapperFactory(
        CompleteResolution,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      const descText = wrapper.find('#resolution-text-section .section-description')
      if (test.entityType === CorpTypeCd.COOP) {
        expect(descText.exists()).toBe(true)
        expect(descText.text()).toEqual(test.resolutionTextDesc)
      } else {
        expect(descText.exists()).toBe(false)
      }
    })

    it('renders or hides the resolution signature info section', async () => {
      wrapper = wrapperFactory(
        CompleteResolution,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      if (test.entityType === CorpTypeCd.COOP) {
        expect(wrapper.find('#resolution-signature-info-section').exists()).toBe(true)
      } else {
        expect(wrapper.find('#resolution-signature-info-section').exists()).toBe(false)
      }
    })

    it('renders the correct resolution signature info text', async () => {
      wrapper = wrapperFactory(
        CompleteResolution,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      const descText = wrapper.find('#resolution-signature-info-section .section-description')
      if (test.entityType === CorpTypeCd.COOP) {
        expect(descText.exists()).toBe(true)
        expect(descText.text()).toEqual(test.resolutionSignatureDesc)
      } else {
        expect(descText.exists()).toBe(false)
      }
    })

    it('renders the confirm resolution section', async () => {
      wrapper = wrapperFactory(
        CompleteResolution,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      expect(wrapper.find('#confirm-resolution-section').exists()).toBe(true)
    })

    it('renders the correct confirm text in confirm section', async () => {
      wrapper = wrapperFactory(
        CompleteResolution,
        null,
        { entityType: test.entityType },
        null,
        DissolutionResources
      )

      const confirmChkText = wrapper.find('#confirm-resolution-section label[for="chk-confirm-resolution"]')
      expect(confirmChkText.exists()).toBe(true)
      expect(confirmChkText.text()).toContain(test.confirmText)

      const confirmList = wrapper.findAll('#confirm-resolution-section li')

      if (test.entityType === CorpTypeCd.COOP) {
        expect(confirmList.length).toBe(3)
        expect(confirmList.at(0).text()).toContain(test.confirmTextListItem1)
      } else {
        expect(confirmList.length).toBe(0)
      }
    })
  })
}
