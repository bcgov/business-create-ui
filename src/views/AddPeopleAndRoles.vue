<template>
  <div>
    <section class="mt-10">
      <header id="people-role-header">
        <h2>1. Add People or Corporations/Firms to your Application</h2>
      </header>
      <PeopleAndRoles/>
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Vue } from 'vue-property-decorator'
import { Getter, Action, State } from 'vuex-class'

// Interfaces
import { GetterIF, ActionBindingIF } from '@/interfaces'

// Mixins
import { EntityFilterMixin } from '@/mixins'

// Components
import { PeopleAndRoles } from '@/components/AddPeopleAndRoles'

@Component({
  components: {
    PeopleAndRoles
  }
})
export default class AddPeopleAndRoles extends Mixins(EntityFilterMixin) {
  // Global getters
  @Getter isEntityType!: GetterIF

  // Global actions
  @Action setIgnoreChanges!: ActionBindingIF

  /** Called when component is created. */
  private created (): void {
    // ignore data changes until page has loaded
    this.setIgnoreChanges(true)
    Vue.nextTick(() => {
      this.setIgnoreChanges(false)
    })
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

header {
  p {
    padding-top:0.5rem
  }
}
</style>
