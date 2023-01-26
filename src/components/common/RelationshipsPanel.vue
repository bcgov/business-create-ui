<template>
  <v-card flat id="relationship-style">
    <v-tooltip content-class="top-tooltip" transition="fade-transition" top>
      <template v-slot:activator="{ on, attrs }">
        <div class="relationship_title" v-bind="attrs" v-on="on">
          <span class="dotted-underline">{{ getPeopleAndRolesResource.rolesTitle || 'Relationship' }}</span>
        </div>
      </template>
      Full restoration application must be related to the dissolved business.
    </v-tooltip>
    <div class="form__row three-column mt-3">
      <v-card flat rounded="sm" class="relationship_title gray-card px-4">
        <v-row no-gutters class="align-center mt-5">

          <v-col cols="4">
            <v-checkbox id="heir-legal-rep-checkbox" class="mt-0" v-model="selectedRoles"
              :value="RoleTypes.HEIR_LEGAL_REP" :label="RoleTypes.HEIR_LEGAL_REP"
              :rules="roleRules" />
          </v-col>

          <v-col cols="4">
            <v-checkbox id="officer-checkbox" class="mt-0" v-model="selectedRoles" :value="RoleTypes.OFFICER"
              :label="RoleTypes.OFFICER" :rules="roleRules" />
          </v-col>

          <v-col cols="4">
            <v-checkbox id="director-checkbox" class="mt-0" v-model="selectedRoles" :value="RoleTypes.DIRECTOR"
              :label="RoleTypes.DIRECTOR" :rules="roleRules" />
          </v-col>

          <v-col cols="4">
            <v-checkbox id="shareholder-checkbox" class="mt-0" v-model="selectedRoles" :value="RoleTypes.SHAREHOLDER"
              :label="RoleTypes.SHAREHOLDER" :rules="roleRules" />
          </v-col>

          <v-col cols="4">
            <v-checkbox id="court-ordered-party-checkbox" class="mt-0" v-model="selectedRoles"
              :value="RoleTypes.COURT_ORDERED_PARTY" :label="RoleTypes.COURT_ORDERED_PARTY"
              :rules="roleRules" />
          </v-col>
        </v-row>
      </v-card>
    </div>
  </v-card>
</template>
<script lang="ts">

import Vue from 'vue'
import { Component, Watch, Emit, Prop } from 'vue-property-decorator'
import { AddEditOrgPersonMixin } from '@/mixins'
import { EffectiveDateTimeIF, FormIF } from '@/interfaces'
import { VuetifyRuleFunction } from '@/types'

@Component({
  mixins: [
    AddEditOrgPersonMixin
  ]
})

export default class RelationshipsPanel extends Vue {
  /** Called before the component is mounted */
  beforeMount (): void {
    this.selectedRoles.push(this.RoleTypes.HEIR_LEGAL_REP)
  }
}

</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

#relationship-style {
  padding-bottom: 1rem;
  padding-left: 1rem;
  margin-right: 1.5rem;
  line-height: 1.2rem;
}

label {
  font-weight: bold;
}

.gray-card {
  background-color: rgba(0, 0, 0, 0.06);
  margin-right: 3rem;
}

.form__row.three-column {
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  margin-right: -0.5rem;
  margin-left: -0.5rem;

}

.relationship_title {
  padding-top: 0;
  margin-top: 0;
  margin-left: 1rem;
  font-size: 1rem;
}
</style>
