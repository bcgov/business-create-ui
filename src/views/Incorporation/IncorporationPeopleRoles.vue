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
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { PeopleAndRoleIF, PeopleAndRolesResourceIF } from '@/interfaces'
import { CommonMixin } from '@/mixins'
import { RouteNames } from '@/enums'
import PeopleAndRoles from '@/components/common/PeopleAndRoles.vue'

@Component({
  components: {
    PeopleAndRoles
  },
  mixins: [
    CommonMixin
  ]
})
export default class IncorporationPeopleRoles extends Vue {
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter(useStore) getPeopleAndRolesResource!: PeopleAndRolesResourceIF

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.INCORPORATION_PEOPLE_ROLES) {
      // scroll to invalid components
      await this.$nextTick()
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
    font-weight: bold;
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
