<template>
  <v-card flat id="upload-memorandum">

    <!-- Summary Section -->
    <div id="upload-memorandum-summary" v-if="isSummary">
      <!-- Summary Header -->
      <div class="upload-memorandum-summary-header" >
        <v-icon color="dkBlue">mdi-text-box-multiple</v-icon>
        <label class="upload-memorandum-title font-weight-bold">Memorandum</label>
      </div>

      <!-- Summary error message -->
      <div
        v-if="!getCreateMemorandumStep.valid"
        class="upload-memorandum-error-message"
        :class="{ 'invalid-section': getValidateSteps }"
      >
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          &nbsp;
          <span class="error-text">This step is not complete.</span>
          &nbsp;
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
import { Getter } from 'vuex-class'

// Enums
import { RouteNames } from '@/enums'
import { CreateMemorandumIF } from '@/interfaces'

@Component({})
export default class UploadMemorandum extends Vue {
  @Prop({ default: false })
  private readonly isSummary: boolean

  @Getter getCreateMemorandumStep!: CreateMemorandumIF
  @Getter getValidateSteps!: boolean

  // Enum for template
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

.v-icon.mdi-information-outline {
  margin-top: -2px;
}
</style>
