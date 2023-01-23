<template>
  <v-dialog v-model="dialog" width="45rem" persistent :attach="attach" content-class="filing-survey-dialog">
    <v-card class="px-10 py-6">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="font-weight-bold">Filing Survey</span>
        <v-btn icon large class="dialog-close" @click="no()"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>

      <v-card-text>
        <p>
          Do you want to be part of our continuous improvement process by sharing
          your experience? A two-minute survey will appear in a new tab for you to
          share your filing experience.
        </p>
        <p>
          This information can really help us improve our services.
        </p>

        <p>
          Our <a href="https://www2.gov.bc.ca/gov/content/home/privacy" target="_blank">Privacy Statement</a>
        </p>

        <v-checkbox
          id="dialog-checkbox"
          hide-details
          label="Do not show this message again"
          class="mt-6"
          @change="updateCookie($event)"
        />
      </v-card-text>

      <v-card-actions class="d-flex justify-center">
        <v-btn
          id="dialog-no-button"
          large outlined color="primary"
          class="mr-sm-3 px-8"
          @click="no()"
        >
          <span>NOT RIGHT NOW</span>
        </v-btn>
        <v-btn
          id="dialog-yes-button"
          large color="primary"
          class="ml-sm-3 px-8"
          @click="yes()"
        >
          <span>YES, I'LL PARTICIPATE</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'

@Component({})
export default class FilingSurveyDialog extends Vue {
  /** Prop to display the dialog. */
  @Prop({ default: false }) readonly dialog!: boolean

  /** Prop to provide attachment selector. */
  @Prop({ default: '' }) readonly attach!: string

  // Pass click events to parent.
  @Emit() protected no (): void {}
  @Emit() protected yes (): void {}

  /** Saves a cookie to prevent showing this dialog for a while. */
  protected updateCookie (val: boolean) {
    // *** TODO: save a cookie with an expiry date
    // and maybe delete cookie if not needed?
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.v-dialog {
  .v-card {
    .v-card__title {
      color: $gray9;
      background-color: white;
      font-size: $px-24;
      letter-spacing: -1px;
    }

    .v-card__text {
      color: $gray7;
      padding: 0;
    }
  }
}
</style>
