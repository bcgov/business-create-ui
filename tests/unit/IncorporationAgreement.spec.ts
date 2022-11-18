import { shallowWrapperFactory, wrapperFactory } from '../jest-wrapper-factory'
import IncorporationAgreement from '@/views/Incorporation/IncorporationAgreement.vue'
import { IncorporationResources } from '@/resources/'

const incorporationAgreementTestcases = [
  {
    entityType: 'BEN',
    helpHeader1: 'What is the sample Incorporation Agreement and Benefit Company Articles?',
    helpHeader2: 'Can I use the sample Incorporation Agreement and Benefit Company Articles?',
    helpText1: 'The sample Incorporation Agreement and Benefit Company Articles is a template that you can use'
  },
  {
    entityType: 'BC',
    helpHeader1: 'What is the sample Incorporation Agreement and BC Limited Company Articles?',
    helpHeader2: 'Retain the signed Incorporation Agreement and BC Limited Company Articles',
    helpText1: 'The sample Incorporation Agreement and Company Articles is a template that you can use to create an'
  },
  {
    entityType: 'ULC',
    helpHeader1: 'What is the sample Incorporation Agreement and Unlimited Liability Company Articles?',
    helpHeader2: 'Retain the signed Incorporation Agreement and BC Unlimited Liability Company Articles',
    helpText1: 'The sample Incorporation Agreement and Company Articles is a template that you can use to create an'
  },
  {
    entityType: 'CC',
    helpHeader1: 'What is the sample Incorporation Agreement and BC Community Contribution Company Articles?',
    helpHeader2: 'Retain the signed Incorporation Agreement and BC Community Contribution Company Articles',
    helpText1: 'The sample Incorporation Agreement and Company Articles is a template that you can use to create an'
  }
]

for (const test of incorporationAgreementTestcases) {
  describe(`Incorporation agreement view help text for a ${test.entityType}`, () => {
    let wrapper: any

    beforeAll(() => {
      wrapper = wrapperFactory(IncorporationAgreement, null, {
        entityType: test.entityType
      },
      null,
      IncorporationResources)
    })

    it('displayes correct help text ', async () => {
      let helpBtns = wrapper.findAll('.help-btn')
      expect(helpBtns.at(0).text()).toBe('Help with Incorporation Agreement and Articles')

      await wrapper.find('.help-btn').trigger('click')
      const helpSection = wrapper.find('.incorporation-agreement-help')
      const helpHeaders = wrapper.findAll('.incorporation-agreement-help h3')
      const helpList = wrapper.findAll('.incorporation-agreement-help li')

      expect(helpBtns.at(0).text()).toBe('Hide Help')
      expect(helpSection.exists()).toBe(true)
      expect(helpHeaders.at(0).text()).toContain(test.helpHeader1)
      expect(helpList.at(0).text()).toContain(test.helpText1)
      expect(helpHeaders.at(2).text()).toContain(test.helpHeader2)
    })
  })
}
