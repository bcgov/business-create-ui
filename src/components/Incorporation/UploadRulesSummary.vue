<template>
  <v-card flat id="upload-rules-summary" class="border-0">
    <!-- Summary Header -->
    <div class="upload-rules-summary-header">
      <v-icon color="appDkBlue">mdi-format-list-text</v-icon>
      <label class="upload-rules-title pl-2">Rules</label>
    </div>

    <div v-if="!getCreateRulesStep.validationDetail.valid" class="invalid-section">
      <div class="upload-rules-error-message">
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text">This step is unfinished.</span>
          <router-link
            :to="{ path: `/${RouteNames.INCORPORATION_RULES}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>
    </div>

    <div v-if="getCreateRulesStep.validationDetail.valid" class="upload-rules-success-message">
      <v-row no-gutters>
        <v-col md="1">
          <v-icon class="upload-success-chk">mdi-check</v-icon>
        </v-col>
        <v-col md="11" id="file-name-col">
          <span id="file-name" v-if="getCreateRulesStep.rulesDoc" >{{getCreateRulesStep.rulesDoc.name}}</span>
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
import { CreateRulesIF } from '@/interfaces'

@Component({})
export default class UploadRulesSummary extends Vue {
  @Getter getCreateRulesStep!: CreateRulesIF

  // Enum for template
  readonly RouteNames = RouteNames
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.upload-rules-summary-header {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 1.25rem;
  border-radius: 4px 4px 0px 0px !important;

  .upload-rules-title {
    font-weight: bold;
    color: $gray9;
  }
}

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
