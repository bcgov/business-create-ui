<template>
  <div id="upload-memorandum-summary">
    <div
      v-if="!getCreateMemorandumStep.validationDetail.valid"
      class="invalid-section pl-5"
    >
      <div class="upload-memorandum-error-message">
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text mx-1">This step is unfinished.</span>
          <router-link
            :to="{ path: `/${RouteNames.INCORPORATION_MEMORANDUM}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>
    </div>

    <div
      v-if="getCreateMemorandumStep.validationDetail.valid"
      class="upload-memorandum-success-message pl-5"
    >
      <v-row no-gutters>
        <v-col md="1">
          <v-icon class="upload-success-chk">
            mdi-check
          </v-icon>
        </v-col>
        <v-col
          id="file-name-col"
          md="11"
        >
          <span
            v-if="getCreateMemorandumStep.memorandumFile"
            id="file-name"
          >
            {{ getCreateMemorandumStep.memorandumFile.name }}
          </span>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-facing-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'

// Enums
import { RouteNames } from '@/enums'
import { CreateMemorandumIF } from '@/interfaces'

@Component({})
export default class UploadMemorandumSummary extends Vue {
  @Getter(useStore) getCreateMemorandumStep!: CreateMemorandumIF

  // Enum for template
  readonly RouteNames = RouteNames
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

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
    font-size: $px-24;
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
