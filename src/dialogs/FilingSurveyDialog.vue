<template>
  <v-dialog
    v-model="dialog"
    width="45rem"
    persistent
    :attach="attach"
    content-class="filing-survey-dialog"
  >
    <v-card class="px-10 py-6">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="font-weight-bold">Tell Us About Your Experience Today</span>
        <v-btn
          icon
          large
          color="primary"
          class="dialog-close"
          @click="no()"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <p>
          Do you want to help us improve by sharing your experience today? A two-minute
          survey will appear in a new tab for you to fill out after your visit.
        </p>

        <p>
          Our <a
            href="https://www2.gov.bc.ca/gov/content/home/privacy"
            target="_blank"
          >Privacy Statement</a>
        </p>

        <v-checkbox
          hide-details
          label="Do not show this message again"
          class="dialog-checkbox mt-6"
          @change="doNotShow($event)"
        />
      </v-card-text>

      <v-card-actions class="d-flex justify-center">
        <v-btn
          id="dialog-no-button"
          large
          outlined
          color="primary"
          class="mr-sm-3 px-8"
          @click="no()"
        >
          <span>Not Right Now</span>
        </v-btn>
        <v-btn
          id="dialog-yes-button"
          large
          color="primary"
          class="ml-sm-3 px-8"
          @click="yes()"
        >
          <span>Yes, I'll Participate</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class FilingSurveyDialog extends Vue {
  /** Prop to display the dialog. */
  @Prop({ default: false }) readonly dialog!: boolean

  /** Prop to provide attachment selector. */
  @Prop({ default: '' }) readonly attach!: string

  // Pass events to parent.
  @Emit() no (): void {}
  @Emit() yes (): void {}
  @Emit('doNotShow') doNotShow (val: boolean): void {}
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
