<template>
  <div id="destroy-certificate">
    <!-- EDIT SECTION -->
    <template v-if="!isSummary">
      <v-row no-gutters class="edit-section">
        <v-col cols="12" sm="3" class="pr-4">
          <label class="destroy-certificate-title title-label">
            Delete and/or Destroy Certificates
          </label>
        </v-col>

        <v-col cols="12" sm="9">
          <v-checkbox
            class="destroy-certificate-checkbox ma-0 pa-0"
            v-model="hasCertificateDestroyed"
            @change="setHasCertificateDestroyed"
            hide-details
          >
            <template slot="label">
              <span class="destroy-certificate-option"
                v-html="destroyCertificateDescription"
                :class="{'error-text': showErrorSummary}" />
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
    </template>

    <!-- SUMMARY SECTION-->
    <template v-else>
      <v-row no-gutters class="summary-section">
        <v-col cols="12" sm="3" class="inner-col-1 pr-4 pb-4">
          <label class="summary-section-title">Delete and/or Destroy Certificates</label>
        </v-col>

        <v-col cols="12" sm="9" class="inner-col-2">
          <div v-if="getDissolutionHasCertificateDestroyed" class="d-flex">
            <span>
              <v-icon class="ml-n1 pr-2" color="successCheckmark">mdi-check</v-icon>
            </span>
            <span class="destroy-certificate-summary-description">{{ destroyCertificateDescription }}</span>
          </div>
          <div v-else class="destroy-certificate-summary-description">(Not entered)</div>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import { ActionBindingIF } from '@/interfaces'

@Component
export default class DestroyCertificate extends Vue {
  // Global getters
  @Getter getDissolutionHasCertificateDestroyed!: boolean

  // Global setters
  @Action setHasCertificateDestroyed!: ActionBindingIF

  @Prop({ default: false })
  readonly showErrorSummary: boolean

  @Prop({ default: false })
  readonly isSummary: boolean

  private hasCertificateDestroyed: boolean = false

  readonly destroyCertificateDescription: string = `Certificates of incorporation, name change, and amalgamation for
    the Cooperative Association will be deleted and/or destroyed after dissolution.`
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.edit-section {
  font-size: $px-16;
  color: $gray7;
}

.destroy-certificate-title,
.summary-section-title {
  font-weight: bold;
  color: $gray9;
}

.destroy-certificate-checkbox {
  ::v-deep .v-input__slot {
    align-items: flex-start;
  }
}

.destroy-certificate-option {
  color: $gray7;
  line-height: 1.5rem;
  font-weight: normal;
}

.destroy-certificate-summary-description {
  color: $gray7;
}

.summary-section {
  font-size: $px-16;
}

.inner-col-1 {
  // adjustment to make this inner container column the same width as the outer columns
  // ie, decrease width by 1/2 container margin + padding
  flex: 0 0 calc(25% - 1rem);
}

.inner-col-2 {
  // adjustment to make this inner container column the same width as the outer columns
  // ie, increase width by 1/2 container margin + padding
  flex: 0 0 calc(75% + 1rem);
  max-width: calc(75% + 1rem);
}
</style>
