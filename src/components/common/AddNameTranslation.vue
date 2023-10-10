<template>
  <div id="add-name-translation">
    <!-- Name Translation form -->
    <v-form v-model="nameTranslationForm">
      <v-text-field
        id="name-translation-input"
        v-model="nameTranslation"
        variant="filled"
        persistent-hint
        label="Enter Name Translation"
        :rules="nameTranslationRules"
        @update:modelValue="nameTranslation = nameTranslation.toUpperCase()"
      />

      <div class="form__btns">
        <v-btn
          id="name-translation-btn-remove"
          size="large"
          color="error"
          :disabled="!editNameTranslation"
          @click="removeTranslation()"
        >
          Remove
        </v-btn>

        <v-btn
          id="name-translation-btn-done"
          size="large"
          color="primary"
          class="form-primary-btn"
          :disabled="!nameTranslationForm"
          @click="addTranslation()"
        >
          Done
        </v-btn>

        <v-btn
          id="name-translation-btn-cancel"
          size="large"
          @click="cancelTranslation()"
        >
          Cancel
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Emit, Prop, Vue } from 'vue-facing-decorator'
import { VuetifyRuleFunction } from '@/types'

@Component({})
export default class AddNameTranslation extends Vue {
  @Prop({ default: '' }) readonly editNameTranslation!: string

  // Local properties
  nameTranslationForm = false
  nameTranslation = ''

  // Validation rules
  readonly nameTranslationRules: Array<VuetifyRuleFunction> = [
    v => !!v || 'A name translation is required', // is not empty
    v => /^[A-Za-zÀ-ÿ_@./#’&+-]+(?: [A-Za-zÀ-ÿ_@./#’&+-]+)*$/.test(v) || 'Invalid character', // English, French and single spaces
    v => (!v || v.length <= 50) || 'Cannot exceed 50 characters' // maximum character count
  ]

  /** Called when component is mounted. */
  mounted (): void {
    // Editing an existing name translation
    if (this.editNameTranslation) this.nameTranslation = this.editNameTranslation
  }

  // Events
  @Emit('addTranslation')
  addTranslation (): string {
    return this.nameTranslation
  }

  @Emit('cancelTranslation')
  cancelTranslation (): void {}

  @Emit('removeTranslation')
  removeTranslation (): void {}
}
</script>

<style lang="scss" scoped>
// un-bold the text field label
.v-text-field :deep(.v-label) {
  font-weight: normal;
}
</style>
