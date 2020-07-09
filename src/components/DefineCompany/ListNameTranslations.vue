<template>
  <v-card flat id="name-translations-list">

<!--    <ConfirmRemoveDialog-->
<!--      :dialog="dialog"-->
<!--      attach="#list-name-translations"-->
<!--      @confirm="emitRemovePerson(personId)"-->
<!--      @exit="dialog = false"-->
<!--    />-->

    <!-- Summary Section -->
<!--    <div id="people-roles-summary" v-if="isSummary">-->
<!--      &lt;!&ndash; Summary Header &ndash;&gt;-->
<!--      <div class="people-roles-summary-header" >-->
<!--        <v-icon>mdi-account</v-icon>-->
<!--        <label class="people-roles-title"><strong>People and Roles</strong></label>-->
<!--      </div>-->

<!--      &lt;!&ndash; Summary Warning &ndash;&gt;-->
<!--      <div v-if="showErrorSummary" class="people-roles-invalid-message">-->
<!--        <span>-->
<!--          <v-icon color="blue darken-2">mdi-information-outline</v-icon>-->
<!--          This step is not complete.-->
<!--          <router-link id="router-link" :to="{ path: '/add-people-roles', query: { showErrors: true } }">-->
<!--            Return to this step to complete it.-->
<!--          </router-link>-->
<!--        </span>-->
<!--      </div>-->
<!--    </div>-->

    <!-- List Display Section -->
    <div id="name-translations-header">
      <!-- List Headers -->
      <v-row class="name-translation-title people-roles-header list-item__subtitle" no-gutters>
        <v-col>
          <h3>Name Translations:</h3>
        </v-col>
      </v-row>

      <!-- List Content -->
      <v-row
        class="names-translation-content"
        v-for="(translation, index) in translationsList"
        :key="index"
        no-gutters>
        <v-col class="text-truncate">
         <span class="name-title">{{translation}}</span>
        </v-col>

        <!-- Actions Column -->
        <v-col>
          <div class="actions">
            <span class="edit-action">
              <v-btn small text color="primary"
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
                  <v-btn text small color="primary" class="actions__more-actions__btn" v-on="on">
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
    </div>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Mixins, Emit } from 'vue-property-decorator'

// Components

// Dialogs
import { ConfirmRemoveDialog } from '@/components/dialogs'

// Mixins
import { CommonMixin, EntityFilterMixin } from '@/mixins'

@Component({
  components: {
    ConfirmRemoveDialog
  }
})
export default class ListNameTranslations extends Mixins(CommonMixin, EntityFilterMixin) {
  @Prop({ default: () => [] })
  private translationsList: Array<string>

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
    }

    .names-translation-content {
      margin-top: .5rem;
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

  #people-roles {
    margin-top: 1rem;
  }

  .people-roles-summary-header {
    display: flex;
    background-color: $BCgovBlue5O;
    padding: 1.25rem;

    .people-roles-title {
      padding-left: .5rem;
    }

  }

  .people-roles-invalid-message {
    padding: 1.25rem;
    font-weight: bold;
    color: $BCgovABlue2;
  }

  .people-roles-header {
    padding: .5rem 1.25rem .5rem 1.25rem;
    font-size: 0.875rem;
    margin-top: 1rem;
  }

  .names-translation-content {
    margin-top: .5rem;
    padding: .5rem 1.25rem .5rem 1.25rem;
    border-top: 1px solid $gray1;
    font-size: 0.875rem;

    .people-roles-title {
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

  .v-list-item {
    min-height: 0;
    padding: 0 1rem 0 .5rem;
  }

  .col {
    padding: .25rem;

    .col-roles {
      padding: 0!important;
    }
  }

  .warning-text {
    position: relative;
    top: 2px;
    left: 2px;
    color: $BCgovGold9
  }

</style>
