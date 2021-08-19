<template>
  <div>
    <section class="mt-10">
      <header id="people-role-header">
        <h2>{{ getPeopleAndRolesResource.header }}</h2>
      </header>
      <PeopleAndRoles />
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import { ActionBindingIF, PeopleAndRoleIF, PeopleAndRolesResourceIF } from '@/interfaces'

// Mixins
import { CommonMixin, EntityFilterMixin } from '@/mixins'

// Enums
import { RouteNames } from '@/enums'

// Components
import { PeopleAndRoles } from '@/components/AddPeopleAndRoles'

@Component({
  components: {
    PeopleAndRoles
  }
})
export default class AddPeopleAndRoles extends Mixins(CommonMixin, EntityFilterMixin) {
  @Getter getShowErrors!: boolean
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter getPeopleAndRolesResource!: PeopleAndRolesResourceIF

  @Action setIgnoreChanges!: ActionBindingIF

  /** Called when component is created. */
  private created (): void {
    // ignore data changes until page has loaded
    this.setIgnoreChanges(true)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
  }

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.ADD_PEOPLE_AND_ROLES) {
      // Scroll to invalid components.
      await Vue.nextTick()
      await this.validateAndScroll(
        {
          peopleAndRoles: this.getAddPeopleAndRoleStep.valid
        },
        ['people-and-roles']
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.step-container {
  margin-top: 1rem;
  padding: 1.25rem;
}

.meta-container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;

  > label:first-child {
    font-weight: 700;
  }
}

@media (min-width: 768px) {
  .meta-container {
    flex-flow: row nowrap;

    > label:first-child {
      flex: 0 0 auto;
      padding-right: 2rem;
      width: 12rem;
    }
  }
}

header p {
  padding-top: 0.5rem;
}
</style>
