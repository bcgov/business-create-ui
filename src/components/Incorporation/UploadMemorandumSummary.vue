<template>
  <v-card id="upload-memorandum-summary-card" flat class="rounded-0">
    <div class="upload-memorandum-summary-header review-header">
      <v-icon color="appDkBlue">mdi-format-list-text</v-icon>
      <label class="upload-memorandum-title pl-2"><strong>Memorandum</strong></label>
    </div>

    <div v-if="!getCreateMemorandumStep.validationDetail.valid" class="invalid-section pl-5">
      <div class="upload-memorandum-error-message">
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text mr-1">This step is unfinished.</span>
          <router-link
            :to="{ path: `/${RouteNames.INCORPORATION_MEMORANDUM}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>
    </div>

    <div v-if="getCreateMemorandumStep.validationDetail.valid" class="upload-memorandum-success-message pl-5">
      <v-row no-gutters>
        <v-col md="1">
          <v-icon class="upload-success-chk">mdi-check</v-icon>
        </v-col>
        <v-col md="11" id="file-name-col">
          <span v-if="getCreateMemorandumStep.memorandumDoc" id="file-name">
            {{getCreateMemorandumStep.memorandumDoc.name}}
          </span>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

// Enums
import { RouteNames } from '@/enums'
import { CreateMemorandumIF } from '@/interfaces'

@Component({})
export default class UploadMemorandumSummary extends Vue {
  @Getter getCreateMemorandumStep!: CreateMemorandumIF

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
    color: $gray9;
  }
}

.upload-memorandum-error-message {
  padding-top: 30px;
  padding-bottom: 30px;
  color: $app-blue;
}

.upload-memorandum-success-message {
  padding-top: 30px;
  padding-bottom: 30px;
  color: $gray7;

  .upload-success-chk {
    font-size: 1.5rem;
    color: $app-dk-green;
  }

  #file-name-col {
    margin-top: 2px;
    margin-left: -50px;
  }
}

.v-icon.mdi-information-outline {
  margin-top: -2px;
  margin-right: 4px;
}
</style>
