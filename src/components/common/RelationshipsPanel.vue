<template>
  <v-card flat id="relationship-style">
    <v-tooltip content-class="top-tooltip" transition="fade-transition" top>
      <template v-slot:activator="{ on, attrs }">
        <div class="relationship_title" v-bind="attrs" v-on="on">
          <span class="dotted-underline">
            Please select applicant's relationship to the company at the time the company was dissolved:
          </span>
        </div>
      </template>
      Full restoration application must be related to the dissolved business.
    </v-tooltip>
    <div class="form__row three-column mt-3">
      <v-card flat rounded="sm" class="relationship_title gray-card px-4">
        <v-row no-gutters class="align-center mt-5">

          <v-col cols="4">
            <v-checkbox id="heir-legal-rep-checkbox" class="mt-0" v-model="selectedRelationships"
              :value="RelationshipTypes.HEIR_LEGAL_REP" :label="RelationshipTypes.HEIR_LEGAL_REP"
              :rules="relationshipRules" />
          </v-col>

          <v-col cols="4">
            <v-checkbox id="officer-checkbox" class="mt-0" v-model="selectedRelationships" :value="RelationshipTypes.OFFICER"
              :label="RelationshipTypes.OFFICER" :rules="relationshipRules" />
          </v-col>

          <v-col cols="4">
            <v-checkbox id="director-checkbox" class="mt-0" v-model="selectedRelationships" :value="RelationshipTypes.DIRECTOR"
              :label="RelationshipTypes.DIRECTOR" :rules="relationshipRules" />
          </v-col>

          <v-col cols="4">
            <v-checkbox id="shareholder-checkbox" class="mt-0" v-model="selectedRelationships" :value="RelationshipTypes.SHAREHOLDER"
              :label="RelationshipTypes.SHAREHOLDER" :rules="relationshipRules" />
          </v-col>

          <v-col cols="4">
            <v-checkbox id="court-ordered-party-checkbox" class="mt-0" v-model="selectedRelationships"
              :value="RelationshipTypes.COURT_ORDERED_PARTY" :label="RelationshipTypes.COURT_ORDERED_PARTY"
              :rules="relationshipRules" />
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
import { Getter, Action } from 'vuex-class'
import { RelationshipTypes } from '@/enums/relationshipTypes'

@Component({
  mixins: [
    AddEditOrgPersonMixin
  ]
})

export default class RelationshipsPanel extends Vue {
  @Action setRestorationRelationships!: ActionBindingIF

  // Local properties
  protected selectedRelationships = [] as Array<RelationshipTypes>

  // Relationship Types Enum for the template
  readonly RelationshipTypes = RelationshipTypes

  /** Called before the component is mounted */
  beforeMount (): void {
    this.selectedRelationships.push(RelationshipTypes.HEIR_LEGAL_REP)
  }

  /** The validation rules for the Relationships. */
  get relationshipRules (): Array<VuetifyRuleFunction> {
    return [() => this.selectedRelationships.length > 0 || 'A relationship is required']
  }

   /** Set state of Relationships Array when a radio is selected/deselected. */
   @Watch('selectedRelationships')
  private setRelationships (val) {
    this.setRestorationRelationships(this.selectedRelationships)
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
