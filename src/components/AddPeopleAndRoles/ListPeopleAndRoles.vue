<template>
  <v-card flat id="people-roles">

    <ConfirmRemoveDialog
      :dialog="dialog"
      attach="#people-roles"
      @confirm="emitRemovePerson(personId)"
      @exit="dialog = false"
    />

    <!-- Summary Section -->
    <div id="people-roles-summary" v-if="isSummary">
      <!-- Summary Header -->
      <div class="people-roles-summary-header" >
        <v-icon>mdi-account</v-icon>
        <label class="people-roles-title"><strong>People and Roles</strong></label>
      </div>

      <!-- Summary Warning -->
      <div v-if="showErrorSummary" class="people-roles-invalid-message">
        <span>
          <v-icon color="#1976d2">mdi-information-outline</v-icon>
          This step is not complete.
          <router-link id="router-link" :to="{ path: '/add-people-roles', query: { showErrors: true } }">
            Return to this step to complete it.
          </router-link>
        </span>
      </div>
    </div>

    <!-- List Display Section -->
    <div id="people-roles-list">
      <!-- List Headers -->
      <v-row class="people-roles-header list-item__subtitle" no-gutters>
        <v-col v-for="(title, index) in tableHeaders" :key="index">
          <span>{{title}}</span>
        </v-col>
        <!-- Spacer Column For Actions -->
        <v-col sm="1" v-if="!isSummary"></v-col>
      </v-row>

      <!-- List Content -->
      <v-row
        class="people-roles-content"
        :class="{ 'list-item__subtitle': !isSummary }"
        v-for="(officer, index) in personList"
        :key="index"
        no-gutters>
        <v-col class="text-truncate">
          <v-tooltip top :disabled="formatName(officer).length < 25" color="primary">
            <template v-slot:activator="{ on }">
              <span v-on="on" class="people-roles-title"><strong>{{formatName(officer)}}</strong></span>
            </template>
            <span>{{formatName(officer)}}</span>
          </v-tooltip>
        </v-col>
        <v-col>
          <base-address class="peoples-roles-mailing-address" :address="officer.mailingAddress" />
        </v-col>
        <v-col>
          <p v-if="isSame(officer.mailingAddress, officer.deliveryAddress)"
            class="peoples-roles-delivery-address">Same as Mailing Address
          </p>
          <base-address v-else class="peoples-roles-delivery-address" :address="officer.deliveryAddress"/>
        </v-col>
        <v-col>
          <div v-if="officer.roles.length>0">
            <v-col v-for="(role, index) in officer.roles" :key="index" class="col-roles">
              <span>{{role.roleType}}</span>
            </v-col>
          </div>
          <div v-else>
            <v-icon color="$BCgovGold9" small>mdi-alert</v-icon>
            <span class="warning-text">Add Role</span>
          </div>
        </v-col>

        <!-- Actions Column -->
        <v-col sm="1" v-if="!isSummary">
          <div class="actions">
            <span class="edit-action">
              <v-btn small text color="primary"
                :id="'officer-' + officer.id + '-change-btn'"
                @click="emitPersonInfo(index)"
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
                  <v-list-item @click="confirmRemove(index)">
                    <v-list-item-title><v-icon>mdi-delete</v-icon>Remove</v-list-item-title>
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
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'

// Dialogs
import { ConfirmRemoveDialog } from '@/components/dialogs'

// Mixins
import { CommonMixin, EntityFilterMixin } from '@/mixins'

// Interfaces
import { OrgPersonIF } from '@/interfaces'

@Component({
  components: {
    BaseAddress,
    ConfirmRemoveDialog
  }
})
export default class ListPeopleAndRoles extends Mixins(CommonMixin, EntityFilterMixin) {
  // Store Properties
  @Prop({ default: () => [] })
  private personList: Array<OrgPersonIF>

  @Prop({ default: false })
  private showErrorSummary: boolean

  @Prop({ default: false })
  private isSummary: boolean

  // Local Properties
  readonly tableHeaders: Array<string> = ['Name', 'Mailing Address', 'Delivery Address', 'Roles']
  private dialog: boolean = false
  private personId: number

  /**
   * Determine if Corporation/Firm or Person.
   * @param filing The filing body which contains the name/title.
   * @returns The appropriate Corporation or Person name.
   */
  private formatName (filing: any): string {
    return filing?.officer?.orgName ? filing?.officer?.orgName
      : `${filing.officer.firstName} ${filing.officer.middleName || ''} ${filing.officer.lastName}`
  }

  /**
   * Identify and confirm the removal of a person/org through dialog.
   * @param index The active index which is subject to removal.
   */
  confirmRemove (index: number): void {
    this.personId = index
    this.dialog = true
  }

  /**
   * Emit an index and event to the parent to handle removal.
   * @param index The active index which is subject to removal.
   */
  @Emit('removePerson')
  private emitRemovePerson (index: number): void {
    this.dialog = false
  }

  /**
   * Emit an index and event to the parent to handle editing.
   * @param index The active index which is subject to change.
   */
  @Emit('editPerson')
  private emitPersonInfo (index: number): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

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

.people-roles-content {
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
