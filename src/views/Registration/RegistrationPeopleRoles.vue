<template>
  <div id="registration-people-roles">
    <section class="mt-10">
      <header id="people-role-header">
        <h2>{{ getPeopleAndRolesResource.header }}</h2>
      </header>

      <RegPeopleAndRoles />
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
import RegPeopleAndRoles from '@/components/common/RegPeopleAndRoles.vue'

@Component({
  components: {
    RegPeopleAndRoles
  },
  mixins: [
    CommonMixin
  ]
})
export default class RegistrationPeopleRoles extends Vue {
  @Getter(useStore) getShowErrors!: boolean
  @Getter(useStore) getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter(useStore) getPeopleAndRolesResource!: PeopleAndRolesResourceIF

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.REGISTRATION_PEOPLE_ROLES) {
      // scroll to invalid components
      await this.$nextTick()
      await this.validateAndScroll(
        {
          peopleAndRolesValid: this.getAddPeopleAndRoleStep.valid
        },
        [
          'reg-people-and-roles'
        ]
      )
    }
  }
}
</script>
