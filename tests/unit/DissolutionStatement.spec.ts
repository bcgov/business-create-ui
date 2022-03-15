import Vue from 'vue'
import { wrapperFactory } from '../jest-wrapper-factory'
import DissolutionStatement from '@/components/Dissolution/DissolutionStatement.vue'
import { CorpTypeCd, DissolutionStatementTypes } from '@/enums'
import { DissolutionResources } from '@/resources'

// Input field selectors to test changes to the DOM elements.
const typeSelector: string = '#dissolution-statement-'
const summaryErrorSelector: string = '.invalid-section'

describe(`Dissolution Statement component for a Cooperative Association`, () => {
  let wrapper: any

  it('Loads the component in edit mode and both dissolution statement types are not selected', () => {
    wrapper = wrapperFactory(
      DissolutionStatement,
      null,
      {
        entityType: CorpTypeCd.COOP
      },
      null,
      DissolutionResources
    )

    let selector = `${typeSelector}${DissolutionStatementTypes.NO_ASSETS_NO_LIABILITIES_197}`
    expect(wrapper.find(selector).attributes('aria-checked')).toBe('false')
    selector = `${typeSelector}${DissolutionStatementTypes.NO_ASSETS_PROVISIONS_LIABILITIES_197}`
    expect(wrapper.find(selector).attributes('aria-checked')).toBe('false')
  })

  it('Selects the radio button if the value is set in the store', () => {
    wrapper = wrapperFactory(
      DissolutionStatement,
      null,
      {
        entityType: CorpTypeCd.COOP,
        dissolution: {
          dissolutionStatementStep: {
            valid: true,
            dissolutionStatementType: DissolutionStatementTypes.NO_ASSETS_NO_LIABILITIES_197
          }
        }
      },
      null,
      DissolutionResources
    )

    const selector = `${typeSelector}${DissolutionStatementTypes.NO_ASSETS_NO_LIABILITIES_197}`
    expect(wrapper.find(selector).attributes('aria-checked')).toBe('true')
  })

  it('Displays the summary text for selected dissolution statement type', () => {
    wrapper = wrapperFactory(
      DissolutionStatement,
      { isSummary: true },
      {
        entityType: CorpTypeCd.COOP,
        dissolution: {
          dissolutionStatementStep: {
            valid: true,
            dissolutionStatementType: DissolutionStatementTypes.NO_ASSETS_NO_LIABILITIES_197
          }
        }
      },
      null,
      DissolutionResources
    )
    expect(wrapper.find('.dissolution-summary-description').text()).toBeDefined()
  })

  it('Updates the store correctly if a dissolution statement type is selected', async () => {
    wrapper = wrapperFactory(
      DissolutionStatement,
      null,
      {
        entityType: CorpTypeCd.COOP,
        dissolution: {
          dissolutionStatementStep: {
            valid: false,
            dissolutionStatementType: null
          }
        }
      },
      null,
      DissolutionResources
    )

    // Verify agreement type is null
    expect(wrapper.vm.$data.dissolutionStatementType).toBe(null)

    // Select the Sample Radio btn
    const sampleSelector = `${typeSelector}${DissolutionStatementTypes.NO_ASSETS_NO_LIABILITIES_197}`
    const radio = wrapper.find(sampleSelector)
    radio.trigger('click')
    await Vue.nextTick()

    // Verify state is updated
    expect(wrapper.vm.$data.dissolutionStatementType).toBe(DissolutionStatementTypes.NO_ASSETS_NO_LIABILITIES_197)
  })
})
