<template>
  <div id="add-name-translation">
    <!-- Name Translation form -->
    <v-form v-model="nameTranslationForm">
      <v-text-field
        filled
        persistent-hint
        id="name-translation-input"
        label="Enter Name Translation"
        v-model="nameTranslation"
        :rules="nameTranslationRules"
        @input="nameTranslation = nameTranslation.toUpperCase()"
      />

      <div class="form__btns">
        <v-btn large color="error" id="name-translation-btn-remove"
          :disabled="!editNameTranslation"
          @click="removeTranslation()"
        >
          Remove
        </v-btn>

        <v-btn large color="primary" id="name-translation-btn-done"
          class="form-primary-btn"
          :disabled="!nameTranslationForm"
          @click="addTranslation()"
        >
          Done
        </v-btn>

        <v-btn large id="name-translation-btn-cancel"
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
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
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
