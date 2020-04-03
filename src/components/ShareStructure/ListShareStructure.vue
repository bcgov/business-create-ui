<template>
  <v-card flat id="share-structure">
    <v-data-table
      :headers="headers"
      :items="shares"
      :disable-pagination="true"
      :disable-sort="true"
      :hide-default-footer="true"
    >
      <template v-slot:item="row">
          <tr :key="row.item.id">
            <td>{{row.item.name}}</td>
            <td>{{row.item.maxShares}}</td>
            <td>{{row.item.parVal}}</td>
            <td>{{row.item.currency}}</td>
            <td>{{row.item.rightsOrRestrict}}</td>
            <td>
              <div class="actions">
                <span class="edit-action">
                <v-btn small text color="primary"
                       :id="'officer-' + 0 + '-change-btn'"
                       @click="emitPersonInfo(index)"
                >
                  <v-icon small>mdi-pencil</v-icon>
                  <span>Edit</span>
                </v-btn>
              </span>
                <span>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on }">
                      <v-btn text small color="primary" class="actions__more-actions__btn" v-on="on">
                        <v-icon>mdi-menu-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list class="actions__more-actions">
                      <v-list-item @click="onButtonClick(row.item.name)">
                        <v-list-item-title><v-icon>mdi-delete</v-icon>Remove</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </span>
              </div>
            </td>
          </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'

import draggable from 'vuedraggable'
import Sortable from 'sortablejs'

// Components

// Dialogs

// Mixins

// Interfaces

@Component({
  components: {
    draggable
  }
})
export default class ListShareStructure extends Vue {
    private singleSelect: boolean = false
    private selected: Array<any> = []
    private headers: Array<any> = [
      {
        text: 'Name of Share Class or Series',
        align: 'start',
        sortable: false,
        value: 'name'
      },
      { text: 'Maximum Number of Shares', value: 'maxShares' },
      { text: 'Par Value', value: 'parVal' },
      { text: 'Currency', value: 'currency' },
      { text: 'Special Rights or Restrictions', value: 'rightsOrRestrict' },
      { text: '', value: 'actions' }
    ]

    private shares: Array<any> = [
      {
        id: 1,
        name: 'Common Shares',
        maxShares: '10, 000',
        parVal: '$1.00',
        currency: 'Canadian Dollar ($CDN)',
        rightsOrRestrict: 'Yes'
      },
      {
        id: 2,
        name: 'Non-voting Shares',
        maxShares: '1000',
        parVal: 'No Par Value',
        currency: '',
        rightsOrRestrict: 'No'
      }
    ]

    private onButtonClick (item) {
      console.log('click on ' + item)
    }

    mounted () {
      let table: any = document.querySelector('.data-table tbody')
      const _self = this
      console.log('Mounted')
      console.log(table)
      Sortable.create(table, {
        handle: '.handle', // Use handle so user can select text
        onEnd ({ newIndex, oldIndex }) {
          console.log('End Handle')
          const rowSelected = _self.shares.splice(oldIndex, 1)[0] // Get the selected row and remove it
          _self.shares.splice(newIndex, 0, rowSelected) // Move it to the new index
        }
      })
    }

  readonly exampleData = {
    shareClasses: [
      {
        id: 1,
        name: 'Share Class 1',
        priority: 1,
        hasMaximumShares: true,
        maxNumberOfShares: 100,
        hasParValue: true,
        parValue: 10,
        currency: 'CAD',
        hasRightsOrRestrictions: false,
        series: [
          {
            id: 1,
            name: 'Share Series 1',
            priority: 1,
            hasMaximumShares: true,
            maxNumberOfShares: 50,
            hasRightsOrRestrictions: false
          },
          {
            id: 2,
            name: 'Share Series 2',
            priority: 2,
            hasMaximumShares: true,
            maxNumberOfShares: 100,
            hasRightsOrRestrictions: false
          },
          {
            id: 3,
            name: 'Share Series 2',
            priority: 2,
            hasMaximumShares: true,
            maxNumberOfShares: 100,
            hasRightsOrRestrictions: false
          }
        ]
      },
      {
        id: 2,
        name: 'Share Class 2',
        priority: 1,
        hasMaximumShares: false,
        maxNumberOfShares: null,
        hasParValue: false,
        parValue: null,
        currency: null,
        hasRightsOrRestrictions: true,
        series: []
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/theme.scss';

  .actions {
    display: flex;

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

</style>
