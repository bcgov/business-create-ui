<template>
  <v-card flat id="share-structure">
    <v-data-table
      :headers="headers"
      :items="shareClasses"
      :disable-pagination="true"
      :disable-sort="true"
      :hide-default-footer="true"
    >
      <template v-slot:item="row" class="share-data-table">
        <tr :key="row.item.id" class="class-row" :class="{ 'class-row-has-series': row.item.series.length}">
          <td class="list-item__title">{{row.item.name}}</td>
          <td>{{row.item.maxNumberOfShares}}</td>
          <td>{{row.item.parValue ? `$${row.item.parValue}.00` : 'No Par Value'}}</td>
          <td>{{row.item.currency}}</td>
          <td>{{row.item.hasRightsOrRestrictions ? 'Yes' : 'No'}}</td>
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
                  <v-list class="more-actions">
                    <v-list-item class="actions-dropdown_item" v-show="true">
                      <v-list-item-subtitle><v-icon>mdi-playlist-plus</v-icon> Add Series</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item
                      class="actions-dropdown_item"
                      :class="{ 'item-disabled': isMoveDisabled(row.item, 'up') }"
                      @click="movePriority(row.item, 'up')"
                      :disabled="isMoveDisabled(row.item, 'up')"
                    >
                      <v-list-item-subtitle><v-icon>mdi-arrow-up</v-icon> Move Up</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item
                      class="actions-dropdown_item"
                      :class="{ 'item-disabled': isMoveDisabled(row.item, 'down') }"
                      @click="movePriority(row.item, 'down')"
                      :disabled="isMoveDisabled(row.item, 'down')"
                    >
                      <v-list-item-subtitle><v-icon>mdi-arrow-down</v-icon> Move Down</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item class="actions-dropdown_item" @click="onButtonClick(row.item)">
                      <v-list-item-subtitle><v-icon>mdi-delete</v-icon> Remove</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </span>
            </div>
          </td>
        </tr>
        <tr v-for="(seriesItem, index) in row.item.series" :key="`Series: ${seriesItem.id}`"
            class="series-row"
            :class="{ 'series-row-last': index === row.item.series.length - 1}"
        >
          <td class="series-name"><span>{{seriesItem.name}}</span></td>
          <td>{{seriesItem.maxNumberOfShares}}</td>
          <td>{{row.item.parValue ? `$${row.item.parValue}.00` : 'No Par Value'}}</td>
          <td>{{row.item.currency}}</td>
          <td>{{seriesItem.hasRightsOrRestrictions ? 'Yes' : 'No'}}</td>
          <td>
            <!--            <div class="actions">-->
            <!--                <span class="edit-action">-->
            <!--                <v-btn small text color="primary"-->
            <!--                       :id="'officer-' + 0 + '-change-btn'"-->
            <!--                       @click="emitPersonInfo(index)"-->
            <!--                >-->
            <!--                  <v-icon small>mdi-pencil</v-icon>-->
            <!--                  <span>Edit</span>-->
            <!--                </v-btn>-->
            <!--              </span>-->
            <!--              <span>-->
            <!--                  <v-menu offset-y>-->
            <!--                    <template v-slot:activator="{ on }">-->
            <!--                      <v-btn text small color="primary" class="actions__more-actions__btn" v-on="on">-->
            <!--                        <v-icon>mdi-menu-down</v-icon>-->
            <!--                      </v-btn>-->
            <!--                    </template>-->
            <!--                    <v-list class="more-actions">-->
            <!--                      <v-list-item-->
            <!--                        class="actions-dropdown_item"-->
            <!--                        :class="{ 'item-disabled': isMoveDisabled(seriesItem, 'up') }"-->
            <!--                        @click="movePriority(seriesItem, 'up')"-->
            <!--                        :disabled="isMoveDisabled(seriesItem, 'up')"-->
            <!--                      >-->
            <!--                        <v-list-item-subtitle><v-icon>mdi-arrow-up</v-icon> Move Up</v-list-item-subtitle>-->
            <!--                      </v-list-item>-->
            <!--                      <v-list-item-->
            <!--                        class="actions-dropdown_item"-->
            <!--                        :class="{ 'item-disabled': isMoveDisabled(seriesItem, 'down') }"-->
            <!--                        @click="movePriority(seriesItem, 'down')"-->
            <!--                        :disabled="isMoveDisabled(seriesItem, 'down')"-->
            <!--                      >-->
            <!--                        <v-list-item-subtitle><v-icon>mdi-arrow-down</v-icon> Move Down</v-list-item-subtitle>-->
            <!--                      </v-list-item>-->
            <!--                      <v-list-item class="actions-dropdown_item" @click="onButtonClick(row.item)">-->
            <!--                        <v-list-item-subtitle><v-icon>mdi-delete</v-icon> Remove</v-list-item-subtitle>-->
            <!--                      </v-list-item>-->
            <!--                    </v-list>-->
            <!--                  </v-menu>-->
            <!--                </span>-->
            <!--            </div>-->
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Vue } from 'vue-property-decorator'
import 'array.prototype.move'

// Components

// Dialogs

// Mixins

// Interfaces

    @Component({})
export default class ListShareClass extends Vue {
  @Prop({ default: () => [] })
  private shareClasses: any

  private singleSelect: boolean = false
  private selected: Array<any> = []
  private headers: Array<any> = [
    {
      text: 'Name of Share Class or Series',
      align: 'start',
      sortable: false,
      value: 'name'
    },
    { text: 'Maximum Number of Shares', value: 'maxNumberOfShares' },
    { text: 'Par Value', value: 'parValue' },
    { text: 'Currency', value: 'currency' },
    { text: 'Special Rights or Restrictions', value: 'hasRightsOrRestrictions' },
    { text: '', value: 'actions' }
  ]

  private onButtonClick (item) {
    console.log(item)
  }

  /**
   * Adjust the priority of the list share class
   * @param item The base list item
   * @param direction The direction of the move
   */
  private movePriority (item: any, direction: string): void {
    const indexFrom = this.shareClasses.findIndex(classItem => classItem.id === item.id)
    const indexTo = direction === 'up' ? indexFrom - 1 : indexFrom + 1

    this.shareClasses[indexFrom].priority = indexTo
    this.shareClasses[indexTo].priority = indexFrom

    this.shareClasses.move(indexFrom, indexTo)
  }

  /**
   * Determine if the move up / move down is enabled
   * @param item The base list item
   * @param direction The direction of the move
   * @returns A boolean indicating if a move is enabled
   */
  private isMoveDisabled (item: any, direction: string): boolean {
    const index = this.shareClasses.findIndex(classItem => classItem.id === item.id)
    const arrBoundry = this.shareClasses.length - 1

    switch (direction) {
      case 'up':
        if (index === 0) return true
        break
      case 'down':
        if (index === arrBoundry) return true
        break
      default:
        return false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/theme.scss';

  .class-row td:not(:first-child) {
    color: $gray6;
  }

  .class-row-has-series td {
    border-bottom: none!important;
  }

  .series-row {
    .series-name {
      padding-left: 2rem;
    }

    td {
      border-bottom: none!important;
    }

    td:not(:first-child){
      color: $gray6;
    }
  }

  .series-row-last td {
    border-bottom: thin solid rgba(0, 0, 0, 0.12)!important;
  }

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

  .more-actions {
    padding: 2px 0;

    .item-disabled {
      opacity: .5;
    }

    .actions-dropdown_item {
      min-height: 0!important;
      margin: 1rem 0;
    }
  }
</style>
