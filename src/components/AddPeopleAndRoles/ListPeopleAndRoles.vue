<template>
  <v-card flat id="people-roles" class="rounded-0">
    <ConfirmRemoveDialog
      :dialog="dialog"
      attach="#people-roles"
      @confirm="emitRemovePerson(personId)"
      @exit="dialog = false"
    />

    <!-- Summary Header -->
    <div class="people-roles-summary-header" v-if="isSummary">
      <v-icon color="appDkBlue">mdi-account-multiple-plus</v-icon>
      <label class="people-roles-title pl-2"><strong>People and Roles</strong></label>
    </div>

    <div :class="{ 'invalid-section': showErrorSummary }">
      <!-- Summary Warning -->
      <div v-if="isSummary && showErrorSummary" class="people-roles-invalid-message">
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          &nbsp;
          <span class="error-text">This step is unfinished.</span>
          &nbsp;
          <router-link
            id="router-link"
            :to="{ path: `/${RouteNames.ADD_PEOPLE_AND_ROLES}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>

      <!-- List Display Section -->
      <div id="people-roles-list">
        <!-- List Headers -->
        <v-row class="people-roles-header" no-gutters>
          <v-col v-for="(title, index) in tableHeaders" :key="index">
            <span>{{ title }}</span>
          </v-col>
          <!-- Spacer Column For Actions -->
          <v-col sm="1" v-if="!isSummary"></v-col>
        </v-row>

        <!-- List Content -->
        <v-row
          class="people-roles-content"
          v-for="(orgPerson, index) in personList"
          :key="index"
          no-gutters
        >
          <v-col class="text-truncate">
            <v-icon color="gray9" v-if="isPerson(orgPerson)">mdi-account</v-icon>
            <v-icon color="gray9" v-if="isOrg(orgPerson)">mdi-domain</v-icon>
            <v-tooltip top :disabled="formatName(orgPerson).length < 25" color="primary">
              <template v-slot:activator="{ on }">
                <span v-on="on" class="people-roles-title ml-2"><strong>{{ formatName(orgPerson) }}</strong></span>
              </template>
              <span>{{ formatName(orgPerson) }}</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <base-address class="peoples-roles-mailing-address" :address="orgPerson.mailingAddress" />
          </v-col>
          <v-col>
            <p v-if="isSame(orgPerson.mailingAddress, orgPerson.deliveryAddress)"
              class="peoples-roles-delivery-address">Same as Mailing Address
            </p>
            <base-address v-else class="peoples-roles-delivery-address" :address="orgPerson.deliveryAddress" />
          </v-col>
          <v-col>
            <div v-if="orgPerson.roles.length > 0">
              <v-col v-for="(role, index) in orgPerson.roles" :key="index" class="col-roles">
                <span>{{ role.roleType }}</span>
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
                  :id="`officer-${index}-change-btn`"
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

// Interfaces & enums
import { OrgPersonIF } from '@/interfaces'
import { IncorporatorTypes, RouteNames } from '@/enums'

@Component({
  components: {
    BaseAddress,
    ConfirmRemoveDialog
  }
})
export default class ListPeopleAndRoles extends Mixins(CommonMixin, EntityFilterMixin) {
  @Prop({ default: () => [] })
  private readonly personList: Array<OrgPersonIF>

  @Prop({ default: false })
  private readonly showErrorSummary: boolean

  @Prop({ default: false })
  private readonly isSummary: boolean

  // Enum for template
  readonly RouteNames = RouteNames

  // Local properties
  private readonly tableHeaders: Array<string> = ['Name', 'Mailing Address', 'Delivery Address', 'Roles']
  private dialog: boolean = false
  private personId: number

  /** Returns true officer is a person. */
  private isPerson (orgPerson: any): boolean {
    return (orgPerson.officer?.partyType === IncorporatorTypes.PERSON)
  }

  /** Returns true if officer is an organization (corporation/firm). */
  private isOrg (orgPerson: any): boolean {
    return (orgPerson.officer?.partyType === IncorporatorTypes.CORPORATION)
  }

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
}

.people-roles-invalid-message {
  padding: 1.25rem;
  color: $app-red;
}

.people-roles-header {
  padding: 1.5rem 1.25rem 0.5rem 1.25rem;
  font-size: 0.875rem;
  color: $gray9;
  font-weight: bold;
}

.people-roles-title {
  color: $gray9;
}

.people-roles-content {
  margin-top: 0.5rem;
  padding: 0.5rem 1.25rem 0.5rem 1.25rem;
  border-top: 1px solid $gray1;
  font-size: 0.875rem;
  color: $gray7;

  .actions {
    position: absolute;
    right: 0;

    .edit-action {
      border-right: 1px solid $gray1;
    }

    .v-btn {
      min-width: 0.5rem;
    }

    .v-btn + .v-btn {
      margin-left: 0.5rem;
    }
  }
}

.v-list-item {
  min-height: 0;
  padding: 0 1rem 0 0.5rem;
}

.col {
  padding: 0.25rem;

  .col-roles {
    padding: 0 !important;
  }
}

.warning-text {
  position: relative;
  top: 2px;
  left: 2px;
  color: $BCgovGold9;
}

.v-icon {
  &.mdi-information-outline,
  &.mdi-account,
  &.mdi-domain {
    margin-top: -2px;
  }
}
</style>
