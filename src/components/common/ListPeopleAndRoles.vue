<template>
  <div id="list-people-roles">
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
          <router-link v-if="isFullRestorationFiling || isLimitedRestorationFiling"
            id="router-link"
            :to="{ path: `/${RouteNames.RESTORATION_APPLICANT_INFORMATION}` }"
          >Return to this step to finish it</router-link>
        </span>
      </div>

      <!-- List Display Section -->
      <div id="people-roles-list" v-if="personList.length > 0">
        <!-- List Headers -->
        <v-row class="people-roles-header" no-gutters>
          <v-col v-for="(title, index) in tableHeaders" :key="index">
            <span>{{ title }}</span>
          </v-col>
          <v-col v-if="!isSummary" class="actions-width" />
        </v-row>

        <!-- List Content -->
        <v-row
          class="people-roles-content"
          v-for="(orgPerson, index) in personList"
          :key="index"
          no-gutters
        >
          <v-col class="name-column d-flex text-break">
            <div class="pr-2">
              <v-icon color="gray9" v-if="isPerson(orgPerson)">mdi-account</v-icon>
              <v-icon color="gray9" v-if="isOrg(orgPerson)">mdi-domain</v-icon>
            </div>
            <div>
              <span class="name" :class="{'text-uppercase':isOrg(orgPerson)}"
                >{{ formatName(orgPerson) }}</span>

              <template v-if="isRegistrationFiling">
                <div v-if="officerEmail(orgPerson)">
                  <p class="email">{{ officerEmail(orgPerson) }}</p>
                </div>

                <div v-if="officerBusinessNumber(orgPerson)" class="mt-2 business-number">
                  <p>Business Number:</p>
                  <p>{{ officerBusinessNumber(orgPerson) }}</p>
                </div>
              </template>
            </div>
          </v-col>

          <v-col class="mailing-address-column">
            <MailingAddress :address="orgPerson.mailingAddress" />
          </v-col>

          <v-col class="delivery-address-column" v-if="showDeliveryAddressColumn">
            <template v-if="isDirector(orgPerson) || isProprietor(orgPerson) || isPartner(orgPerson)">
              <p v-if="isSame(orgPerson.mailingAddress, orgPerson.deliveryAddress)">
                Same as Mailing Address
              </p>
              <DeliveryAddress v-else :address="orgPerson.deliveryAddress" />
            </template>
          </v-col>

          <v-col class="roles-column" v-if="showRolesColumn">
            <p v-for="(role, index) in orgPerson.roles" :key="index">
              {{ role.roleType }}
            </p>
          </v-col>

          <v-col class="email-column" v-if="showEmailColumn">
            <p>{{ orgPerson.officer.email }}</p>
          </v-col>

          <v-col v-if="!isSummary" class="actions-column" :class="{'disabled':disabled}">
            <div class="float-right">
              <span class="edit-action">
                <v-btn text color="primary"
                  :id="`officer-${index}-change-btn`"
                  :tabindex="disabled ? -1 : 0"
                  @click="disabled ? null : emitPersonInfo(index)"
                >
                  <v-icon small>mdi-pencil</v-icon>
                  <span>Edit</span>
                </v-btn>
              </span>

              <!-- More Actions menu -->
              <span>
                <v-menu offset-y left :disabled="disabled">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      small
                      v-on="on"
                      color="primary"
                      class="more-actions-btn"
                      :tabindex="disabled ? -1 : 0"
                    >
                      <v-icon>mdi-menu-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list class="more-actions-list">
                    <v-list-item @click="emitRemovePerson(index)">
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
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { CommonMixin } from '@/mixins'
import { OrgPersonIF, PeopleAndRoleIF } from '@/interfaces'
import { PartyTypes, RoleTypes, RouteNames } from '@/enums'

/**
 * This is a sub-component of PeopleAndRoles and
 * also used for Incorporation and Registration summaries.
 */
@Component({
  components: {
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress
  },
  mixins: [
    CommonMixin
  ]
})
export default class ListPeopleAndRoles extends Vue {
  @Prop({ default: false }) readonly isSummary!: boolean
  @Prop({ default: false }) readonly disabled!: boolean
  @Prop({ default: true }) readonly showDeliveryAddressColumn!: boolean
  @Prop({ default: true }) readonly showRolesColumn!: boolean
  @Prop({ default: false }) readonly showEmailColumn!: boolean

  @Getter isIncorporationFiling!: boolean
  @Getter isRegistrationFiling!: boolean
  @Getter isFullRestorationFiling!: boolean
  @Getter isLimitedRestorationFiling!: boolean
  @Getter getAddPeopleAndRoleStep!: PeopleAndRoleIF
  @Getter getShowErrors!: boolean

  // Enum for template
  readonly RouteNames = RouteNames

  // Local properties
  protected activeIndex: number // is NaN for new org/person

  get tableHeaders (): Array<string> {
    const headers = ['Name', 'Mailing Address']
    if (this.showDeliveryAddressColumn) headers.push('Delivery Address')
    if (this.showRolesColumn) headers.push('Roles')
    if (this.showEmailColumn) headers.push('Email Address')
    return headers
  }

  /** The person list. */
  get personList (): Array<OrgPersonIF> {
    return this.getAddPeopleAndRoleStep.orgPeople
  }

  /** True if error summary should be shown. */
  get showErrorSummary (): boolean {
    return (this.getShowErrors && !this.getAddPeopleAndRoleStep.valid)
  }

  /** Returns true if org-person is a person. */
  protected isPerson (orgPerson: OrgPersonIF): boolean {
    return (orgPerson.officer?.partyType === PartyTypes.PERSON)
  }

  /** Returns true if org-person is an organization (corporation/firm). */
  protected isOrg (orgPerson: OrgPersonIF): boolean {
    return (orgPerson.officer?.partyType === PartyTypes.ORGANIZATION)
  }

  /** Returns true if specified org/person is a director. */
  protected isDirector (orgPerson: OrgPersonIF): boolean {
    return orgPerson?.roles.some(role => role.roleType === RoleTypes.DIRECTOR)
  }

  /** Returns true if specified org/person is a proprietor. */
  public isProprietor (orgPerson: OrgPersonIF): boolean {
    return orgPerson?.roles.some(role => role.roleType === RoleTypes.PROPRIETOR)
  }

  /** Returns true if specified org/person is a partner. */
  public isPartner (orgPerson: OrgPersonIF): boolean {
    return orgPerson?.roles.some(role => role.roleType === RoleTypes.PARTNER)
  }

  /** Formats the org-person's name. */
  protected formatName (orgPerson: OrgPersonIF): string {
    return orgPerson?.officer?.organizationName
      ? orgPerson?.officer?.organizationName
      : `${orgPerson.officer.firstName} ${orgPerson.officer.middleName || ''} ${orgPerson.officer.lastName}`
  }

  protected officerEmail (orgPerson: OrgPersonIF): string {
    return orgPerson.officer?.email
  }

  protected officerBusinessNumber (orgPerson: OrgPersonIF): string {
    return orgPerson.officer?.businessNumber
  }

  /**
   * Emit an index and event to the parent to handle removal.
   * @param index The active index which is subject to removal.
   */
  @Emit('removePerson')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected emitRemovePerson (index: number): void {}

  /**
   * Emit an index and event to the parent to handle editing.
   * @param index The active index which is subject to change.
   */
  @Emit('editPerson')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected emitPersonInfo (index: number): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// gutter so content doesn't run into next column
.col:not(:last-of-type) {
  padding-right: 0.5rem;
}

.people-roles-invalid-message {
  padding: 1.25rem;
  color: $app-red;
}

#people-roles-list {
  padding: 1rem;
  font-size: $px-14;
  color: $gray7;

  p {
    font-size: $px-14;
  }
}

.people-roles-header {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;

  span {
    color: $gray9;
    font-weight: bold;
  }
}

.people-roles-content {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid $gray1;

  p {
    margin-bottom: 0;
  }

  .name-column .name {
    color: $gray9;
    font-weight: bold;
  }

  .actions-column {
    @extend .actions-width;
    margin-top: -8px;

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

  // make action buttons look disabled without using disabled property
  // so that we keep their orirginal colours
  .actions-column.disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}

// fixed width for actions column
.actions-width {
  min-width: 110px;
  max-width: 110px;
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
