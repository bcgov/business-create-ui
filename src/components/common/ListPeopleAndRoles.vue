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
          <v-col class="name-column d-flex">
            <div class="pr-2">
              <v-icon v-if="isPerson(orgPerson)">mdi-account</v-icon>
              <v-icon v-if="isOrg(orgPerson)">mdi-domain</v-icon>
            </div>
            <div>
              <span class="name">{{ formatName(orgPerson) }}</span>

              <div v-if="officerEmail(orgPerson)" class="text-wrap">
                <p>{{ officerEmail(orgPerson) }}</p>
              </div>

              <div v-if="officerIncorpNumber(orgPerson)" class="text-wrap mt-2">
                <p>Incorporation Number:</p>
                <p>{{ officerIncorpNumber(orgPerson) }}</p>
              </div>

              <div v-if="officerBusinessNumber(orgPerson)" class="text-wrap mt-2">
                <p>Business Number:</p>
                <p>{{ officerBusinessNumber(orgPerson) }}</p>
              </div>
            </div>
          </v-col>

          <v-col class="mailing-address-column">
            <MailingAddress :address="orgPerson.mailingAddress" />
          </v-col>

          <v-col class="delivery-address-column">
            <p v-if="isSame(orgPerson.mailingAddress, orgPerson.deliveryAddress)">
              Same as Mailing Address
            </p>
            <DeliveryAddress v-else :address="orgPerson.deliveryAddress" />
          </v-col>

          <v-col class="roles-column">
            <p v-for="(role, index) in orgPerson.roles" :key="index">
              {{ role.roleType }}
            </p>
          </v-col>

          <v-col v-if="!isSummary" class="actions-column">
            <div class="float-right">
              <span class="edit-action">
                <v-btn small text color="primary"
                  :id="`officer-${index}-change-btn`"
                  @click="emitPersonInfo(index)"
                >
                  <v-icon small>mdi-pencil</v-icon>
                  <span>Edit</span>
                </v-btn>
              </span>

              <!-- More Actions menu -->
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
import { Component, Prop, Mixins, Emit } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'
import { CommonMixin } from '@/mixins'
import { OrgPersonIF, PeopleAndRoleIF } from '@/interfaces'
import { PartyTypes, RouteNames } from '@/enums'

/**
 * This is a sub-component of PeopleAndRoles and
 * also used for Incorporation and Registration summaries.
 */
@Component({
  components: {
    DeliveryAddress: BaseAddress,
    MailingAddress: BaseAddress
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
  private activeIndex: number

  get personList (): Array<OrgPersonIF> {
    return this.getAddPeopleAndRoleStep.orgPeople
  }

  get showErrorSummary (): boolean {
    return !this.getAddPeopleAndRoleStep.valid
  }

  /** Returns true if org-person is a person. */
  protected isPerson (orgPerson: OrgPersonIF): boolean {
    return (orgPerson.officer?.partyType === PartyTypes.PERSON)
  }

  /** Returns true if org-person is an organization (corporation/firm). */
  protected isOrg (orgPerson: OrgPersonIF): boolean {
    return (orgPerson.officer?.partyType === PartyTypes.ORGANIZATION)
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

  protected officerIncorpNumber (orgPerson: OrgPersonIF): string {
    return orgPerson.officer?.incorpNumber
  }

  protected officerBusinessNumber (orgPerson: OrgPersonIF): string {
    return orgPerson.officer?.businessNumber
  }

  /**
   * Emit an index and event to the parent to handle removal.
   * @param index The active index which is subject to removal.
   */
  @Emit('removePerson')
  protected emitRemovePerson (index: number): void {}

  /**
   * Emit an index and event to the parent to handle editing.
   * @param index The active index which is subject to change.
   */
  @Emit('editPerson')
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

// fixed width for actions column
.actions-width {
  min-width: 100px;
  max-width: 100px;
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

// italicize delivery instructions and remove top margin
::v-deep .base-address .address-block .delivery-instructions {
  font-size: $px-14;
  font-style: italic;
  margin-top: 0.5rem !important;
}
</style>
