<template>
  <v-card flat id="upload-memorandum">

    <!-- Summary Section -->
    <div id="upload-memorandum-summary" v-if="isSummary">
      <!-- Summary Header -->
      <div class="upload-memorandum-summary-header" >
        <v-icon color="#38598A">mdi-text-box-multiple</v-icon>
        <label class="upload-memorandum-title"><strong>Memorandum</strong></label>
      </div>

      <!-- Summary error message -->
      <div v-if="!valid" class="upload-memorandum-error-message">
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text"> This step is not complete. </span>
          <router-link :to="{ path: `/${RouteNames.CREATE_MEMORANDUM}`, query: { showErrors: true } }">
            Return to this step to complete it.
          </router-link>
        </span>
      </div>
    </div>

    <v-card-title>Memorandum Placeholder component</v-card-title>
  </v-card>
</template>
<script lang="ts">
// Libraries
import { Component, Prop, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

// Enums
import { RouteNames } from '@/enums'

@Component({})
export default class UploadMemorandum extends Vue {
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
.upload-memorandum-summary-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;

  .upload-memorandum-title {
    padding-left: 0.5rem;
  }
}

.upload-memorandum-error-message {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $primary-blue;
}
</style>
