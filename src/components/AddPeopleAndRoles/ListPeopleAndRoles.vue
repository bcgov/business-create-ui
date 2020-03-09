<template>
  <div id="people-roles-list">

      <!-- List Headers -->
      <v-row class="people-roles-header list-item__subtitle" no-gutters>
        <v-col v-for="(title, index) in headers" :key="index">
          <span>{{title}}</span>
        </v-col>
        <v-col sm="1"></v-col>
      </v-row>

      <!-- List Content -->
      <v-row
        class="people-roles-content list-item__subtitle"
        v-for="(person, index) in personList"
        :key="index"
        no-gutters>
        <v-col>
        <span><strong>{{person.firstName}} {{person.middleName}} {{person.lastName}}</strong></span>
        </v-col>
        <v-col>
          <base-address :address="person.address.mailingAddress" />
        </v-col>
        <v-col>
          <base-address :address="person.address.deliveryAddress" />
        </v-col>
        <v-col>
          <v-col v-for="(role, index) in person.roles" :key="index" class="col-roles">
            <span>{{role}}</span>
          </v-col>
        </v-col>
        <v-col sm="1">
          <!-- Edit menu -->
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
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </span>
          </div>
        </v-col>
      </v-row>

  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { State } from 'vuex-class'

// Components
import BaseAddress from 'sbc-common-components/src/components/BaseAddress.vue'

// Interfaces
import { OrgPersonIF } from '@/interfaces'

// Enums
import { EntityTypes } from '@/enums'

@Component({
  components: {
    BaseAddress
  }
})
export default class ListPeopleAndRoles extends Vue {
  @Prop({ default: '' })
  private personList: Array<OrgPersonIF>

  private headers = ['Name', 'Mailing Address', 'Delivery Address', 'Roles']

  private doSomething (id: number): void {
    this.emitPersonInfo(id)
  }

  @Emit('editPerson')
  private emitPersonInfo (index: number): void { }
}
</script>

<style lang="scss" scoped>
#people-roles-list {
  padding: 0!important;
}

.people-roles-header {
  font-size: 12px;
}

.people-roles-content {
  margin-top: .5rem;
  padding-top: .5rem;
  border-top: 1px solid #d1d1d1;
  font-size: 14px;

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
