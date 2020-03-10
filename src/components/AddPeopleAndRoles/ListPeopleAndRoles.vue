<template>
  <div id="people-roles-list">
    <v-card flat>
      <!-- Summary Header -->
      <div class="people-roles-summary-header" v-if="isSummary">
        <v-icon>mdi-account</v-icon>
        <label class="people-roles-title"><strong>People and Roles</strong></label>
      </div>

      <!-- Summary Warning -->
      <div v-if="isSummary && true" class="defineCompanyStepErrorMessage">
      <span>
        <v-icon color="#1976d2">mdi-information-outline</v-icon>
        This step is not complete.
        <router-link :to="{ path: '/add-people-roles', query: { showErrors: true } }">
          Return to this step to complete it.
        </router-link>
      </span>
      </div>

      <!-- List Headers -->
      <v-row class="people-roles-header list-item__subtitle" no-gutters>
        <v-col v-for="(title, index) in tableHeaders" :key="index">
          <span>{{title}}</span>
        </v-col>
        <!-- Spacer Column -->
        <v-col sm="1" v-if="!isSummary"></v-col>
      </v-row>

      <!-- List Content -->
      <v-row
        class="people-roles-content"
        :class="{ 'list-item__subtitle': !isSummary }"
        v-for="(person, index) in personList"
        :key="index"
        no-gutters>
        <v-col class="text-truncate">
          <v-tooltip top :disabled="formatName(person).length < 25" color="primary">
            <template v-slot:activator="{ on }">
              <span v-on="on" class="people-roles-title"><strong>{{formatName(person)}}</strong></span>
            </template>
            <span>{{formatName(person)}}</span>
          </v-tooltip>
        </v-col>
        <v-col>
          <base-address :address="person.address.mailingAddress" />
        </v-col>
        <v-col>
          <p v-if="isSame(person.address.mailingAddress, person.address.deliveryAddress)">Same as Mailing Address</p>
          <base-address v-else :address="person.address.deliveryAddress"/>
        </v-col>
        <v-col>
          <v-col v-for="(role, index) in person.roles" :key="index" class="col-roles">
            <span>{{role}}</span>
          </v-col>
        </v-col>

        <!-- Actions Column -->
        <v-col sm="1" v-if="!isSummary">
          <div class="actions">
            <span class="edit-action">
              <v-btn small text color="primary" :disabled="false"
                :id="'person-' + person.id + '-change-btn'"
                @click="doSomething(person.id)"
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
                  <v-list-item @click="doSomething(person.id)">
                    <v-list-item-title><v-icon>mdi-delete</v-icon>Remove</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </span>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Mixins } from 'vue-property-decorator'

// Components
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'

// Mixins
import CommonMixin from '@/mixins/common-mixin'

// Interfaces
import { OrgPersonIF } from '@/interfaces'

@Component({
  components: {
    BaseAddress
  }
})
export default class ListPeopleAndRoles extends Mixins(CommonMixin) {
  // Store Properties
  @Prop({ default: '' })
  private personList: Array<OrgPersonIF>

  @Prop({ default: false })
  private isSummary: boolean

  // Local Properties
  private tableHeaders: Array<string> = ['Name', 'Mailing Address', 'Delivery Address', 'Roles']

  /**
   * Return the appropriate Corporation or filers name
   * @param filing The filing body
   */
  private formatName (filing: any): string {
    return filing.orgName ? filing.orgName
      : `${filing.firstName} ${filing.middleName || ''} ${filing.lastName}`
  }

  private doSomething (id: number): void {
    console.log('Doing Something with' + id)
  }
}
</script>

<style lang="scss" scoped>
#people-roles-list {
  margin-top: 1rem;
}

.people-roles-summary-header {
  display: flex;
  background-color: rgba(1, 51, 102, 0.15);
  padding: 1.25rem;
}

.defineCompanyStepErrorMessage {
  padding-top: 1.25rem;
  padding-left: 1.25rem;
  font-weight: bold;
  color: #1976d2;
}

.people-roles-header {
  padding: .5rem 1.25rem .5rem 1.25rem;
  font-size: 12px;
  margin-top: 1rem;
}

.people-roles-content {
  margin-top: .5rem;
  padding: .5rem 1.25rem .5rem 1.25rem;
  border-top: 1px solid #d1d1d1;
  font-size: 14px;

  .people-roles-title {
    color: #474747;
  }

  .actions {
    position: absolute;
    right: 0;

    .edit-action {
      border-right: 1px solid #d1d1d1;
    }

    .v-btn {
      min-width: 1rem;
    }

    .v-btn + .v-btn {
      margin-left: 0.5rem;
    }
  }
}

.col {
  padding: .25rem;

  .col-roles {
    padding: 0rem!important;
  }
}

</style>
