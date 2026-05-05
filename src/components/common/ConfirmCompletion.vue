<template>
  <section
    id="confirm-completion-section"
  >
    <header>
      <slot name="header" />
      <p class="mt-4">
        The following information must be completed and confirmed before submitting this filing.
      </p>
    </header>

    <v-card
      flat
      class="mt-6 py-8 px-6 prevent-red-title"
      :class="{ 'invalid-section': invalidSection }"
    >
      <v-form
        lazy-validation
        @submit.prevent
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="3"
          >
            <label class="title-label">
              Confirm Completion
            </label>
            <p
              v-if="invalidSection && !getConfirmCompletionState.confirmed"
              class="error-text"
              :style="{ 'line-height': '1.2rem' }"
            >
              Check this box to continue
            </p>
          </v-col>
          <v-col
            cols="12"
            sm="9"
          >
            <v-row class="no-gutters">
              <slot name="above-checkbox" />
            </v-row>
            <v-row class="no-gutters pa-5 gray-background">
              <v-checkbox
                v-model="getConfirmCompletionState.confirmed"
                hide-details
                class="mt-0 pt-0"
                :class="{ 'error-text': invalidSection }"
              >
                <template #label>
                  <p class="ma-0 stmt-text">
                    <slot name="default" />
                  </p>
                </template>
              </v-checkbox>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { ConfirmCompletionIF } from '@/interfaces'

@Component({})
export default class ConfirmCompletion extends Vue {
  @Getter(useStore) getConfirmCompletionState!: ConfirmCompletionIF

  @Prop({ default: false }) readonly invalidSection!: boolean
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/theme.scss";

.stmt-text {
  display: inline;
  color: $gray7;
  font-weight: normal;
  line-height: 1.2rem;
}

.title-label {
  font-weight: bold;
  color: $gray9;
  line-height: 1.2rem;
}

// align checkbox with top of its label
:deep(.v-input--checkbox .v-input__slot) {
  align-items: flex-start;
}

// checkbox on error styling
:deep(.v-input--checkbox.error-text .v-input__control .v-input__slot .v-input--selection-controls__input i) {
  color: $app-red;
}
</style>
