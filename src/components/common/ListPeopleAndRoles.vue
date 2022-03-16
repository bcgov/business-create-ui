<template>
  <div id="list-people-roles">
    <ConfirmRemoveDialog
      :dialog="dialog"
      attach="#list-people-roles"
      @confirm="emitRemovePerson(activeIndex)"
      @exit="dialog = false"
    />

    <section :class="{ 'invalid-section': showErrorSummary }">
      <!-- Summary Warning -->
      <div v-if="isSummary && showErrorSummary" class="people-roles-invalid-message">
        <span>
          <v-icon color="error">mdi-information-outline</v-icon>
          <span class="error-text mx-1">This step is unfinished.</span>
          <router-link v-if="isIncorporationFiling"
            id="router-link"
            :to="{ path: `/${RouteNames.INCORPORATION_PEOPLE_ROLES}` }"
          >Return to this step to finish it</router-link>
          <router-link v-if="isRegistrationFiling"
            id="router-link"
            :to="{ path: `/${RouteNames.REGISTRATION_PEOPLE_ROLES}` }"
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
          <v-col v-if="!isSummary" />
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
            <v-tooltip
              top
              :disabled="formatName(orgPerson).length < 25"
              content-class="top-tooltip"
              transition="fade-transition"
            >
              <template v-slot:activator="{ on }">
                <span v-on="on" class="people-roles-title ml-2">{{ formatName(orgPerson) }}</span>
              </template>
              <span>{{ formatName(orgPerson) }}</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <MailingAddress class="peoples-roles-mailing-address" :address="orgPerson.mailingAddress" />
          </v-col>
          <v-col>
            <p v-if="isSame(orgPerson.mailingAddress, orgPerson.deliveryAddress)"
              class="peoples-roles-delivery-address">Same as Mailing Address
            </p>
            <DeliveryAddress v-else class="peoples-roles-delivery-address" :address="orgPerson.deliveryAddress" />
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
          <v-col v-if="!isSummary">
            <div class="actions float-right">
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
                    <v-btn
                      text
                      small
                      v-on="on"
                      color="primary"
                      class="more-actions-btn"
                    >
                      <v-icon>mdi-menu-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list class="more-actions-list">
                    <v-list-item @click="confirmRemove(index)">
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
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Emit } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import ConfirmRemoveDialog from '@/dialogs/ConfirmRemoveDialog.vue'
import { CommonMixin } from '@/mixins'

// Interfaces & enums
import { OrgPersonIF, PeopleAndRoleIF } from '@/interfaces'
import { PartyTypes, RouteNames } from '@/enums'

/**
 * This is a sub-component of PeopleAndRoles and
 * also used for Incorporation and Registration summaries.
 */
@Component({
  components: {
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress,
    ConfirmRemoveDialog
  }
})
export default class ListPeopleAndRoles extends Mixins(CommonMixin) {
  @Prop({ default: false })
  readonly isSummary: boolean

  @Getter isIncorporationFiling!: boolean
  @Getter isRegistrationFiling!: boolean
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF

  // Enum for template
  readonly RouteNames = RouteNames

  // Local properties
  private readonly tableHeaders: Array<string> = ['Name', 'Mailing Address', 'Delivery Address', 'Roles']
  private dialog: boolean = false
  private activeIndex: number

  get personList (): Array<OrgPersonIF> {
    return this.getAddPeopleAndRoleStep.orgPeople
  }

  get showErrorSummary (): boolean {
    return !this.getAddPeopleAndRoleStep.valid
  }

  /** Returns true officer is a person. */
  private isPerson (orgPerson: any): boolean {
    return (orgPerson.officer?.partyType === PartyTypes.PERSON)
  }

  /** Returns true if officer is an organization (corporation/firm). */
  private isOrg (orgPerson: any): boolean {
    return (orgPerson.officer?.partyType === PartyTypes.ORGANIZATION)
  }

  /**
   * Determine if Corporation/Firm or Person.
   * @param filing The filing body which contains the name/title.
   * @returns The appropriate Corporation or Person name.
   */
  private formatName (filing: any): string {
    return filing?.officer?.organizationName ? filing?.officer?.organizationName
      : `${filing.officer.firstName} ${filing.officer.middleName || ''} ${filing.officer.lastName}`
  }

  /**
   * Identify and confirm the removal of a person/org through dialog.
   * @param index The active index which is subject to removal.
   */
  confirmRemove (index: number): void {
    this.activeIndex = index
    this.dialog = true
  }

  /**
   * Emit an index and event to the parent to handle removal.
   * @param index The active index which is subject to removal.
   */
  @Emit('removePerson')
  private emitRemovePerson (activeIndex: number): void {
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

.people-roles-invalid-message {
  padding: 1.25rem;
  color: $app-red;
}

.people-roles-header {
  padding: 1.5rem 1.25rem 0.5rem 1.25rem;
  font-size: $px-14;
  color: $gray9;
  font-weight: bold;
}

.people-roles-title {
  font-weight: bold;
  color: $gray9;
}

.people-roles-content {
  margin-top: 0.5rem;
  padding: 0.5rem 0.5rem 0.5rem 1.25rem;
  border-top: 1px solid $gray1;
  font-size: $px-14;
  color: $gray7;

  .actions {
    .edit-action {
      border-right: 1px solid $gray1;
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

// move icons up a bit to line up with text
.v-icon {
  &.mdi-information-outline,
  &.mdi-account,
  &.mdi-domain,
  &.mdi-delete {
    margin-top: -2px;
  }
}
</style>
