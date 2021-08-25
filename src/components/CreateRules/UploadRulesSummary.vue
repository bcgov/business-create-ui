<template>
  <v-card flat>
    <!-- Summary Section -->
    <div id="upload-rules-summary" v-if="isSummary">
      <!-- Summary Header -->
      <div class="upload-rules-summary-header" >
        <v-icon color="appDkBlue">mdi-format-list-text</v-icon>
        <label class="upload-rules-title pl-2"><strong>Rules</strong></label>
      </div>
      <!-- Summary error message -->
      <div
        v-if="!getCreateRulesStep.valid"
        class="upload-rules-error-message invalid-section"
      >
      <span>
        <v-icon color="error">mdi-information-outline</v-icon>
        &nbsp;
        <span class="error-text">This step is unfinished.</span>
        &nbsp;
        <router-link
          :to="{ path: `/${RouteNames.CREATE_RULES}` }"
        >Return to this step to finish it</router-link>
      </span>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Enums
import { RouteNames } from '@/enums'
import { CreateRulesIF } from '@/interfaces'

// Mixins
import { DocumentMixin } from '@/mixins'

// Components
import FileUploadPreview from '@/components/common/FileUploadPreview.vue'

@Component({
  components: {
    FileUploadPreview
  }
})
export default class UploadRulesSummary extends Mixins(DocumentMixin) {
  @Prop({ default: false })
  private readonly isSummary: boolean
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

  .upload-rules-title {
    color: $gray9;
  }
}

.upload-rules-error-message {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  color: $app-blue;
}

.v-icon.mdi-information-outline {
  margin-top: -2px;
}
</style>
