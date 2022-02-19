<template>
  <div id="incorporation-people-roles">
    <section class="mt-10">
      <header id="people-role-header">
        <h2>{{ getPeopleAndRolesResource.header }}</h2>
      </header>
      <PeopleAndRoles />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { PeopleAndRoleIF, PeopleAndRolesResourceIF } from '@/interfaces'
import { CommonMixin, EntityFilterMixin } from '@/mixins'
import { RouteNames } from '@/enums'
import PeopleAndRoles from '@/components/common/PeopleAndRoles.vue'

@Component({
  components: {
    PeopleAndRoles
  }
})
export default class IncorporationPeopleRoles extends Mixins(CommonMixin, EntityFilterMixin) {
  @Getter getShowErrors!: boolean
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter getPeopleAndRolesResource!: PeopleAndRolesResourceIF

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.INCORPORATION_PEOPLE_ROLES) {
      // scroll to invalid components
      await Vue.nextTick()
      await this.validateAndScroll(
        {
          peopleAndRoles: this.getAddPeopleAndRoleStep.valid
        },
        [
          'people-and-roles'
        ]
      )
    }
  }
}
</script>

<style lang="scss" scoped>
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
