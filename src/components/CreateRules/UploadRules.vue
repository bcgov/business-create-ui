<template>
  <v-card flat id="upload-rules">

    <!-- Summary Section -->
    <div id="upload-rules-summary" v-if="isSummary">
      <!-- Summary Header -->
      <div class="upload-rules-summary-header" >
        <v-icon color="#38598A">mdi-format-list-text</v-icon>
        <label class="upload-rules-title"><strong>Rules</strong></label>
      </div>

      <!-- Summary error message -->
      <div v-if="!valid" class="upload-rules-error-message">
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text"> This step is not complete. </span>
          <router-link :to="{ path: `/${RouteNames.CREATE_RULES}`, query: { showErrors: true } }">
            Return to this step to complete it.
          </router-link>
        </span>
      </div>
    </div>

    <v-card-title>Rules Placeholder component</v-card-title>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

// Enums
import { RouteNames } from '@/enums'

@Component({})
export default class UploadRules extends Vue {
  // Global state
  @State(state => state.stateModel.createRulesStep.valid)
  readonly valid!: boolean

  @Prop({ default: false })
  private isSummary: boolean

  // Entity Enum
  readonly RouteNames = RouteNames
}

</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
.upload-rules-summary-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;

  .upload-rules-title {
    padding-left: 0.5rem;
  }
}

.upload-rules-error-message {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $primary-blue;
}
</style>
