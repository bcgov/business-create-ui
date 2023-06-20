<template>
  <div id="upload-rules-summary">
    <div
      v-if="!getCreateRulesStep.validationDetail.valid"
      class="invalid-section"
    >
      <div class="upload-rules-error-message">
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text mx-1">This step is unfinished.</span>
          <router-link
            :to="{ path: `/${RouteNames.INCORPORATION_RULES}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>
    </div>

    <div
      v-if="getCreateRulesStep.validationDetail.valid"
      class="upload-rules-success-message"
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
            v-if="getCreateRulesStep.rulesFile"
            id="file-name"
          >{{ getCreateRulesStep.rulesFile.name }}</span>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'

// Enums
import { RouteNames } from '@/enums'
import { CreateRulesIF } from '@/interfaces'

@Component({})
export default class UploadRulesSummary extends Vue {
  @Getter(useStore) getCreateRulesStep!: CreateRulesIF

  // Enum for template
  readonly RouteNames = RouteNames
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.upload-rules-error-message {
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 1.25rem;
  color: $app-blue;

  .error-text {
    margin-right: 4px;
  }
}

.upload-rules-success-message {
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 1.25rem;
  color: $gray7;

  .upload-success-chk {
    margin-right: 9px;
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
