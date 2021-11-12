<template>
  <div id="destroy-certificate">
    <div v-if="isSummary" id="destroy-certificate-summary">
      <div v-if="getHasCertificateDestroyed" class="d-flex">
        <span>
          <v-icon class="destroy-certificate-success-chk ml-n1 pr-2" color="successCheckmark">mdi-check</v-icon>
        </span>
        <span class="destroy-certificate-summary-description">{{ destroyCertificateDescription }}</span>
      </div>
      <div v-else class="destroy-certificate-summary-description">(Not entered)</div>
    </div>
    <v-card v-else flat class="rounded-4">
      <div class="section-container pt-11" :class="{ 'invalid-section': showErrorSummary }">
        <v-row no-gutters>
          <v-col md="3">
            <label class="destroy-certificate-title">Delete and/or Destroy Certificates</label>
          </v-col>
          <v-col md="9">
            <v-checkbox
              class="destroy-certificate-checkbox mt-0"
              v-model="hasCertificateDestroyed"
              @change="setHasCertificateDestroyed"
            >
              <template slot="label">
                <span class="destroy-certificate-option"
                  v-html="destroyCertificateDescription"
                  :class="{'error-text': showErrorSummary}" />
              </template>
            </v-checkbox>
          </v-col>
        </v-row>
      </div>
    </v-card>
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
  @Getter getHasCertificateDestroyed!: boolean

  // Global setters
  @Action setHasCertificateDestroyed!: ActionBindingIF

  @Prop({ default: false })
  private readonly showErrorSummary: boolean

  @Prop({ default: false })
  private readonly isSummary: boolean

  private hasCertificateDestroyed: boolean = false

  readonly destroyCertificateDescription: string = `Certificates of incorporation, name change, and amalgamation for
    the Cooperative Association will be deleted and/or destroyed after dissolution.`
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.section-container {
  padding: 1.5rem 2rem;
  font-size: 1rem;
  color: $gray7;
}

.destroy-certificate-title {
  font-size: 1rem;
  font-weight: bold;
  color: $gray9;
}

.destroy-certificate-checkbox {
  ::v-deep .v-input__slot {
    align-items: flex-start;
  }
}

.destroy-certificate-option, #destroy-certificate-summary {
  color: $gray7;
  line-height: 1.5rem;
  font-weight: normal;
}
</style>
