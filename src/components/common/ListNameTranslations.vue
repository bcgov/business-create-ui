<template>
  <v-card flat id="name-translations-list">
    <!-- List Headers -->
    <v-row class="name-translation-title list-item__subtitle" no-gutters>
      <v-col>
        <h3>Name Translations:</h3>
      </v-col>
    </v-row>

    <!-- List Content -->
    <v-row
      class="names-translation-content gray-background"
      v-for="(translation, index) in translationsList"
      :key="`name_translation_${index}`"
      no-gutters
    >
      <v-col class="text-truncate">
        <span class="name-title">{{translation.name}}</span>
      </v-col>

      <!-- Actions Column -->
      <v-col>
        <div class="actions mt-n1 float-right">
          <span class="edit-action">
            <v-btn
              small
              text
              color="primary"
              :disabled="isAddingNameTranslation"
              @click="emitNameEdit(index)"
            >
                <v-icon small>mdi-pencil</v-icon>
                <span>Edit</span>
            </v-btn>
          </span>
          <!-- more actions menu -->
          <span>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  small
                  v-on="on"
                  color="primary"
                  class="more-actions-btn"
                  :disabled="isAddingNameTranslation"
                >
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list class="more-actions-list">
                <v-list-item @click="emitRemoveName(index)">
                  <v-list-item-title>
                    <v-icon small color="primary">mdi-delete</v-icon>
                    <span class="ml-2">Remove</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </span>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
// Libraries
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'

// Interfaces
import { NameTranslationIF } from '@/interfaces'

@Component({})
export default class ListNameTranslations extends Vue {
  @Prop({ default: () => [] }) readonly translationsList!: NameTranslationIF[]
  @Prop({ default: false }) readonly isAddingNameTranslation!: boolean

  /**
   * Emit an index and event to the parent to handle editing.
   * @param index The active index which is subject to change.
   */
  @Emit('editNameTranslation')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitNameEdit (index: number): void {}

  /**
   * Emit an index and event to the parent to handle removal.
   * @param index The active index which is subject to removal.
   */
  @Emit('removeNameTranslation')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private emitRemoveName (index: number): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.name-translation-title {
  display: flex;
  background-color: $BCgovBlue5O;
  padding: 0.5rem 1.25rem;
  font-size: $px-14;
}

.names-translation-content {
  padding: 0.5rem 1.25rem;
  border-top: 1px solid $gray1;
  font-size: $px-14;

  .name-title {
    color: $gray7;
  }

  .actions {
    .edit-action {
      border-right: 1px solid $gray2;
    }

    .v-btn + .v-btn {
      margin-left: 0.5rem;
    }

    .more-actions-btn {
      padding: 0;
      min-width: 28px;
    }
  }
}

// style the more actions buttons
.v-list-item {
  min-height: 0;
  padding: 0.5rem 1rem;

  .v-list-item__title {
    font-size: $px-14;
    color: $app-blue;
  }
}

// move icon up a bit to line up with text
.v-icon.mdi-delete {
  margin-top: -2px;
}
</style>
