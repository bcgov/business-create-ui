<template>
  <div id="name-translations">
    <ConfirmDialog
      ref="confirmDialog"
      attach="#name-translations"
    />

    <div
      class="section-container"
      :class="{ 'invalid-section': getShowErrors && !nameTranslationsValid }"
    >
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="3"
          class="pr-4"
        >
          <label :class="{ 'error-text': getShowErrors && !nameTranslationsValid }">
            <strong>Name Translation</strong>
          </label>
        </v-col>

        <v-col
          cols="12"
          sm="9"
          class="pt-4 pt-sm-0"
        >
          <v-checkbox
            id="name-translation-checkbox"
            v-model="checkbox"
            class="pt-0 mt-0"
            hide-details
            @click="onCheckboxClick()"
          >
            <template #label>
              <span class="checkbox-label">
                This company uses one or more translations of its name outside of Canada.
              </span>
            </template>
          </v-checkbox>

          <template v-if="checkbox">
            <p class="mt-4 mb-0">
              <b>Note:</b> Name translations must use the Latin Alphabet (English, French, etc.).
              Names that use other writing systems must spell the name phonetically in English or
              French.
            </p>

            <v-btn
              outlined
              color="primary"
              class="mt-6"
              :disabled="isAddingNameTranslation"
              @click="isAddingNameTranslation = true"
            >
              <v-icon>mdi-plus</v-icon>
              <span>Add a Name Translation</span>
            </v-btn>

            <!-- Add/Edit Name Translation -->
            <v-expand-transition>
              <div
                v-if="isAddingNameTranslation"
                class="mt-6"
              >
                <AddNameTranslation
                  :edit-name-translation="editingNameTranslation"
                  @addTranslation="addNameTranslation($event)"
                  @cancelTranslation="cancelNameTranslation()"
                  @removeTranslation="removeNameTranslation(editIndex)"
                />
              </div>
            </v-expand-transition>

            <!-- List Name Translation -->
            <v-expand-transition>
              <div
                v-if="getNameTranslations.length > 0"
                class="mt-6"
              >
                <ListNameTranslations
                  :isAddingNameTranslation="isAddingNameTranslation"
                  :translationsList="getNameTranslations"
                  @editTranslation="editNameTranslation($event)"
                  @removeTranslation="removeNameTranslation($event)"
                />
              </div>
            </v-expand-transition>
          </template>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'pinia-class'
import { useStore } from '@/store/store'
import { ConfirmDialog } from '@bcrs-shared-components/confirm-dialog'
import AddNameTranslation from '@/components/common/AddNameTranslation.vue'
import ListNameTranslations from '@/components/common/ListNameTranslations.vue'
import { ActionBindingIF, ConfirmDialogType, NameTranslationIF } from '@/interfaces'

@Component({
  components: {
    AddNameTranslation,
    ConfirmDialog,
    ListNameTranslations
  }
})
export default class NameTranslations extends Vue {
  // Refs
  $refs!: {
    confirmDialog: ConfirmDialogType
  }

  // Local properties
  checkbox = false
  isAddingNameTranslation = false
  editingNameTranslation = ''
  editIndex = -1

  @Action(useStore) setNameTranslations!: ActionBindingIF
  @Action(useStore) setNameTranslationsValid!: ActionBindingIF

  @Getter(useStore) getNameTranslations!: NameTranslationIF[]
  @Getter(useStore) getShowErrors!: boolean

  /** Whether this component is valid. */
  get nameTranslationsValid (): boolean {
    // valid if checkbox is not checked
    if (!this.checkbox) return true
    // valid if there are name translations and the add panel is not open
    if (this.getNameTranslations.length > 0 && !this.isAddingNameTranslation) return true
    // otherwise invalid
    return false
  }

  /**
   * Adds or updates a name translation.
   * @param name the name to add
   */
  addNameTranslation (name: string): void {
    // make a copy (to trigger update)
    const nameTranslations = [ ...this.getNameTranslations ]

    // edit or add name
    this.editIndex > -1
      ? nameTranslations[this.editIndex].name = name
      : nameTranslations.push({ name })

    this.setNameTranslations(nameTranslations)
    this.cancelNameTranslation()
  }

  /**
   * Sets specified name translation to be edited.
   * @param index the index number of the name to edit
   */
  editNameTranslation (index: number): void {
    this.isAddingNameTranslation = true
    this.editingNameTranslation = this.getNameTranslations[index].name
    this.editIndex = index
  }

  /** Cancels adding or editing of the current name translation. */
  cancelNameTranslation (): void {
    this.isAddingNameTranslation = false
    this.editingNameTranslation = ''
    this.editIndex = -1
  }

  /**
   * Removes a name translation.
   * @param index the index number of the name to remove
   */
  removeNameTranslation (index: number): void {
    // make a copy (to trigger update)
    const nameTranslations = [ ...this.getNameTranslations ]
    nameTranslations.splice(index, 1)

    this.setNameTranslations(nameTranslations)
    this.cancelNameTranslation()
  }

  /**
   * Handles name translations checkbox logic.
   */
  onCheckboxClick () {
    // if user is unchecking the box and there are name translations
    // then prompt whether to delete them all
    if (!this.checkbox && this.getNameTranslations.length > 0) {
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
          this.setNameTranslations([])
          this.cancelNameTranslation()
          // clear the checkbox
          this.checkbox = false
        }
      }).catch(() => {
        // reset the checkbox
        this.checkbox = true
      })
    }
  }

  /**
   * Initially and when name translations list changes, opens the component.
   */
  @Watch('getNameTranslations', { deep: true, immediate: true })
  private updateNameTranslation (): void {
    if (this.getNameTranslations.length > 0) {
      this.checkbox = true
    }
  }

  /**
   * When component validity changes, updates the store.
   */
  @Watch('nameTranslationsValid', { immediate: true })
  private onNameTranslationsValid (val: boolean): void {
    this.setNameTranslationsValid(val)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.checkbox-label {
  margin-top: 1px;
  font-size: $px-14;
  color: $gray9;
}

p {
  font-size: $px-14;
}
</style>
