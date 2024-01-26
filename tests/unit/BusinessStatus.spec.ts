import { AmlStatuses } from '@/enums'
import { wrapperFactory } from '../vitest-wrapper-factory'
import BusinessStatus from '@/components/Amalgamation/BusinessStatus.vue'

describe('Business Status', () => {
  const tests = [
    {
      label: 'OK',
      status: AmlStatuses.OK,
      tooltip: 'The currently selected BC Registries account has access to this business.'
    },
    {
      label: 'Error CCC Mismatch',
      status: AmlStatuses.ERROR_CCC_MISMATCH,
      tooltip: 'A BC community contribution company must amalgamate to form a new BC community'
    },
    {
      label: 'Error Draft Task',
      status: AmlStatuses.ERROR_DRAFT_TASK,
      tooltip: 'This business has a draft task. It cannot be part of an amalgamation.'
    },
    {
      label: 'Error Frozen',
      status: AmlStatuses.ERROR_FROZEN,
      tooltip: 'This business is frozen. Frozen businesses cannot be part of an amalgamation.'
    },
    {
      label: 'Error Foreign',
      status: AmlStatuses.ERROR_FOREIGN,
      tooltip: 'A foreign corporation cannot be amalgamated except by Registries staff.'
    },
    {
      label: 'Error Foreign Horizontal',
      status: AmlStatuses.ERROR_FOREIGN_HORIZONTAL,
      tooltip: 'A foreign company (including an extraprovincial company) cannot be part of a'
    },
    {
      label: 'Error Foreign Unlimited',
      status: AmlStatuses.ERROR_FOREIGN_UNLIMITED,
      tooltip: 'A foreign corporation must not amalgamate with a BC company and continue as an'
    },
    {
      label: 'Error Foreign Unlimited 2',
      status: AmlStatuses.ERROR_FOREIGN_UNLIMITED2,
      tooltip: 'A BC company cannot amalgamate with an existing foreign corporation to form a BC'
    },
    {
      label: 'Error Foreign Unlimited 3',
      status: AmlStatuses.ERROR_FOREIGN_UNLIMITED3,
      tooltip: 'A BC unlimited liability company cannot amalgamate with a foreign company.'
    },
    {
      label: 'Error Future Effective Filing',
      status: AmlStatuses.ERROR_FUTURE_EFFECTIVE_FILING,
      tooltip: 'This business has a future effective filing. It cannot be part of an amalgamation'
    },
    {
      label: 'Error Historical',
      status: AmlStatuses.ERROR_HISTORICAL,
      tooltip: 'This business is historical. It cannot be part of an amalgamation.'
    },
    {
      label: 'Error Limited Restoration',
      status: AmlStatuses.ERROR_LIMITED_RESTORATION,
      tooltip: 'This business is under limited restoration. It cannot be part of an amalgamation'
    },
    {
      label: 'Error Need BC Company',
      status: AmlStatuses.ERROR_NEED_BC_COMPANY,
      tooltip: 'You must add at least one BC company.'
    },
    {
      label: 'Error Not Affiliated',
      status: AmlStatuses.ERROR_NOT_AFFILIATED,
      tooltip: 'This business is not affiliated with the currently selected BC Registries account.'
    },
    {
      label: 'Error Not In Good Standing',
      status: AmlStatuses.ERROR_NOT_IN_GOOD_STANDING,
      tooltip: 'This business is not in good standing. This filing cannot be submitted until all'
    },
    {
      label: 'Error Pending Filing',
      status: AmlStatuses.ERROR_PENDING_FILING,
      tooltip: 'This business has a pending filing. It cannot be part of an amalgamation.'
    },
    {
      label: 'Error XPRO ULC CCC',
      status: AmlStatuses.ERROR_XPRO_ULC_CCC,
      tooltip: 'An extraprovincial company cannot amalgamate to form a new BC unlimited liability'
    }
  ]

  it('has the expected number of tests', () => {
    expect(tests.length).toBe(1 + 16) // OK + 16 errors
  })

  for (const test of tests) {
    it(`correctly displays status "${test.label}"`, () => {
      const wrapper = wrapperFactory(BusinessStatus, { status: test.status })

      const div = wrapper.find('.business-status')
      expect(div.exists()).toBe(true)

      // verify icon
      if (test.status === AmlStatuses.OK) {
        expect(div.find('.v-icon.mdi-check').exists()).toBe(true)
      } else {
        expect(div.find('.v-icon.mdi-alert').exists()).toBe(true)
      }

      // verify text
      if (test.status === AmlStatuses.OK) {
        expect(div.text()).toContain('Ready')
      } else {
        expect(div.text()).toContain('Attention Required')
      }

      // verify tooltip
      // (can't verify v-tooltip text directly because it's attached outside this component)
      expect((wrapper.vm as any).tooltip).toContain(test.tooltip)

      wrapper.destroy()
    })
  }
})
