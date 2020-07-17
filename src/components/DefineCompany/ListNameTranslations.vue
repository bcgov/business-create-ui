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
        class="names-translation-content"
        v-for="(translation, index) in translationsList"
        :key="`name_translation_${index}`"
        no-gutters>
        <v-col class="text-truncate">
         <span class="name-title">{{translation}}</span>
        </v-col>

        <!-- Actions Column -->
        <v-col>
          <div class="actions">
            <span class="edit-action">
              <v-btn
                small
                text
                color="primary"
                :disabled="isAddingNameTranslation"
                @click="emitNameEdit(index)">
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
                    class="actions__more-actions__btn"
                    :disabled="isAddingNameTranslation">
                    <v-icon>mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list class="actions__more-actions">
                  <v-list-item  @click="emitRemoveName(index)">
                    <v-list-item-title color="primary"><v-icon>mdi-delete</v-icon>Remove</v-list-item-title>
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
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'

@Component({})
export default class ListNameTranslations extends Vue {
  @Prop({ default: () => [] })
  private translationsList: Array<string>

  @Prop({ default: false })
  private isAddingNameTranslation: boolean

  /**
   * Emit an index and event to the parent to handle editing.
   * @param index The active index which is subject to change.
   */
  @Emit('editNameTranslation')
  private emitNameEdit (index: number): void {}

  /**
   * Emit an index and event to the parent to handle removal.
   * @param index The active index which is subject to removal.
   */
  @Emit('removeNameTranslation')
  private emitRemoveName (index: number): void {}
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/theme.scss';

  #name-translations-list {
    .name-translation-title {
      display: flex;
      background-color: $BCgovBlue5O;
      padding: .5rem 1.25rem .5rem 1.25rem;
      font-size: 0.875rem;
      margin-top: 1rem;
    }

    .names-translation-content {
      padding: .5rem 1.25rem .5rem 1.25rem;
      border-top: 1px solid $gray1;
      font-size: 0.875rem;

      .name-title {
        color: $gray7;
      }

      .actions {
        position: absolute;
        right: 0;

        .edit-action {
          border-right: 1px solid $gray1;
        }

        .v-btn {
          min-width: .5rem;
        }

        .v-btn + .v-btn {
          margin-left: 0.5rem;
        }
      }
    }
  }
</style>
