<template>
  <div id="restoration-applicant-information">
    <section
      id="add-applicant-info-section"
      class="mt-10"
    >
      <header>
        <h2>{{ getPeopleAndRolesResource.header }}</h2>
      </header>

      <RegPeopleAndRoles />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Watch } from 'vue-facing-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { PeopleAndRoleIF, PeopleAndRolesResourceIF } from '@/interfaces'
import { CommonMixin } from '@/mixins'
import { RouteNames } from '@/enums'
import RegPeopleAndRoles from '@/components/common/RegPeopleAndRoles.vue'

@Component({
  components: {
    RegPeopleAndRoles
  }
})
export default class RestorationApplicantInformation extends mixins(CommonMixin) {
  @Getter(useStore) getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter(useStore) getPeopleAndRolesResource!: PeopleAndRolesResourceIF
  @Getter(useStore) getShowErrors!: boolean

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
          'add-applicant-info-section'
        ]
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#restoration-applicant-information {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}

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
