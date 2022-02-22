<template>
  <div id="registration-people-roles">
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
export default class RegistrationPeopleRoles extends Mixins(CommonMixin, EntityFilterMixin) {
  @Getter getShowErrors!: boolean
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter getPeopleAndRolesResource!: PeopleAndRolesResourceIF

  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.REGISTRATION_PEOPLE_ROLES) {
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
@import '@/assets/styles/theme.scss';
</style>
