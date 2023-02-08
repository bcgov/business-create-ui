<template>
  <div id="name-translation">
    <ConfirmDialog
      ref="confirmDialog"
      attach="#name-translation"
    />

    <div
      class="section-container"
      :class="{ 'invalid-section': getShowErrors && !isValidNameTranslation }"
    >
      <v-row no-gutters id="name-translation-info">
        <v-col cols="12" sm="3" class="pr-4">
          <label>
            <strong>Name Translation</strong>
          </label>
        </v-col>

        <v-col cols="12" sm="9" class="pt-4 pt-sm-0">
          <v-checkbox
            class="pt-0 mt-0"
            v-model="hasNameTranslation"
            id="name-translation-checkbox"
            @click="confirmNameTranslation()"
            hide-details
          >
            <template v-slot:label>
              <span class="translation-checkbox-label">
                This company uses one or more translations of its name outside of Canada.
              </span>
            </template>
          </v-checkbox>

          <template v-if="hasNameTranslation">
            <p class="mt-4 mb-0">
              <b>Note:</b> Name translations must use the Latin Alphabet (English, French, etc.).
              Names that use other writing systems must spell the name phonetically in English or
              French.
            </p>

            <v-btn
              outlined color="primary"
              class="mt-6"
              @click="isAddingNameTranslation = true"
              :disabled="isAddingNameTranslation"
            >
              <v-icon>mdi-plus</v-icon>
              <span>Add a Name Translation</span>
            </v-btn>

            <!-- Add Name Translation component -->
            <div v-if="isAddingNameTranslation" class="mt-6">
              <AddNameTranslation
                :edit-name-translation="editingNameTranslation"
                @addTranslation="addNameTranslation($event)"
                @cancelTranslation="cancelNameTranslation()"
                @removeTranslation="removeNameTranslation(editIndex)"
              />
            </div>

            <!-- List Name Translation component -->
            <div v-if="getNameTranslations && getNameTranslations.length > 0" class="mt-6">
              <ListNameTranslations
                :isAddingNameTranslation="isAddingNameTranslation"
                :translationsList="getNameTranslations"
                @editTranslation="editNameTranslation($event)"
                @removeTranslation="removeNameTranslation($event)"
              />
            </div>
          </template>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { ConfirmDialog } from '@bcrs-shared-components/confirm-dialog'
import AddNameTranslation from '@/components/common/AddNameTranslation.vue'
import ListNameTranslations from '@/components/common/ListNameTranslations.vue'
import { ActionBindingIF, ConfirmDialogType, NameTranslationIF } from '@/interfaces'
import { GetCorpFullDescription } from '@bcrs-shared-components/corp-type-module'

@Component({
  components: {
    AddNameTranslation,
    ConfirmDialog,
    ListNameTranslations
  }
})
export default class NameRequestInfo extends Vue {
  // Refs
  $refs!: {
    confirmDialog: ConfirmDialogType
  }

  // Local properties
  protected hasNameTranslation = false
  protected isAddingNameTranslation = true
  protected editingNameTranslation = ''
  protected editIndex = -1

  @Action setNameTranslationState!: ActionBindingIF

  @Getter getNameTranslations!: NameTranslationIF[]
  @Getter getShowErrors!: boolean

  /** Whether name translation is valid. */
  get isValidNameTranslation (): boolean {
    return (this.hasNameTranslation ? this.getNameTranslations?.length > 0 : true)
  }

  /**
   * Adds or updates a name translation.
   * @param name The name to add
   */
  protected addNameTranslation (name: string): void {
    const nameTranslations = Object.assign([], this.getNameTranslations)

    // Handle name translation adds or updates
    this.editIndex > -1
      ? nameTranslations[this.editIndex].name = name
      : nameTranslations.push({ name })

    this.setNameTranslationState(nameTranslations)

    // Emit Validation
    this.emitHasNameTranslation()

    this.cancelNameTranslation()
  }

  /**
   * Sets specified name translation to be edited.
   * @param index Index number of the name translation to edit
   */
  protected editNameTranslation (index: number): void {
    const nameTranslations = Object.assign([], this.getNameTranslations)
    this.editingNameTranslation = nameTranslations[index].name
    this.editIndex = index
    this.isAddingNameTranslation = true
  }

  /**
   * Removes a name translation.
   * @param index Index number of the name translation to remove
   */
  protected removeNameTranslation (index: number): void {
    const nameTranslations = Object.assign([], this.getNameTranslations)
    nameTranslations.splice(index, 1)

    this.setNameTranslationState(nameTranslations)

    // Emit Validation
    this.emitHasNameTranslation()

    this.cancelNameTranslation()
  }

  /** Cancels adding or editing of name translation. */
  protected cancelNameTranslation (): void {
    this.isAddingNameTranslation = false
    this.editingNameTranslation = ''
    this.editIndex = -1
  }

  /** Handles name translation checkbox logic. */
  protected confirmNameTranslation (val: boolean) {
    // if user is unchecking the box and there are name translations
    // then prompt whether to delete them all
    if (!this.hasNameTranslation && this.getNameTranslations?.length > 0) {
      // open confirmation dialog and wait for response
      this.$refs.confirmDialog.open(
        'Remove All Name Translations',
        'De-selecting the Name Translation option will remove all name translations.',
        {
          width: '45rem',
          persistent: true,
          yes: 'Remove All Translations',
          no: null,
          cancel: 'Cancel'
        }
      ).then(async (confirm) => {
        if (confirm) {
          this.setNameTranslationState([])
          // clear the checkbox
          this.hasNameTranslation = false
        }
      }).catch(() => {
        // reset the checkbox
        this.hasNameTranslation = true
      })
    }

    // Emit Validation
    this.emitHasNameTranslation()
  }

  @Watch('getNameTranslations', { deep: true, immediate: true })
  private updateNameTranslation (): void {
    if (this.getNameTranslations?.length > 0) {
      this.isAddingNameTranslation = false
      this.hasNameTranslation = true
    }
  }

  @Emit('hasNameTranslation')
  protected emitHasNameTranslation (): boolean {
    return this.isValidNameTranslation
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.translation-checkbox-label {
  margin-top: 1px;
  font-size: $px-14;
  color: $gray9;
}
</style>
