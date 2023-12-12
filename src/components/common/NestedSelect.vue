<template>
  <v-select
    class="nested-select"
    filled
    item-value="[group,value]"
    return-object
    :error-messages="errorMessages"
    :items="items"
    :label="label"
    :menu-props="menuProps"
    :value="value"
    @change="emitChangeEvent($event)"
  >
    <!-- FUTURE: use "selection" slot to format the selected item -->
    <!-- <template #selection="{ item }">
      <div class="font-weight-bold text-truncate">{{ item.text }}</div>
      <div class="text-subtitle-1">{{ item.subtext }}</div>
    </template> -->

    <template #item="{ item }">
      <v-list-item
        v-if="item.isHeader"
        class="group-header border-top mx-4 py-4"
        @click.stop="toggleActionGroup(item.group)"
      >
        <div class="d-flex justify-space-between align-center">
          <div>
            <v-icon
              v-if="item.icon"
              color="primary"
              class="mr-2"
            >
              {{ item.icon }}
            </v-icon>
            <span
              class="mb-0 mr-4 font-weight-bold"
              :class="{'app-blue': item.group === activeActionGroup}"
            >
              {{ item.text }}
            </span>
          </div>
          <v-icon color="primary">
            {{ item.group === activeActionGroup ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
        </div>
      </v-list-item>

      <!-- render but conditionally hide disabled list items, so that the v-select
      continues to display the current selection even when a different group is active -->
      <v-list-item-content
        v-else
        class="group-item mx-4 pl-4 py-4"
        :class="{ 'hide-me': item.disabled, 'border-top': item.separator }"
      >
        <template v-if="!item.subtext">
          <div class="font-size-16">
            {{ item.text }}
          </div>
        </template>
        <template v-else>
          <div class="font-size-16 font-weight-bold">
            {{ item.text }}
          </div>
          <div class="font-size-14">
            {{ item.subtext }}
          </div>
        </template>
      </v-list-item-content>
    </template>
  </v-select>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Prop } from 'vue-property-decorator'

@Component({})
export default class NestedSelect extends Vue {
  // props
  @Prop({ default: 'Select an item' }) readonly label!: string
  @Prop() readonly menuItems!: Array<any>
  @Prop() readonly errorMessages!: string
  @Prop({ default: null }) readonly value!: any
  @Prop() readonly maxHeight!: string

  // variables
  activeActionGroup = NaN

  // computed
  get items (): Array<any> {
    return this.menuItems.filter(item => {
      // always include header items
      if (item.isHeader) return true

      // include but disable items not in active group
      // (they will be hidden via CSS)
      item['disabled'] = (item.group !== this.activeActionGroup)
      return true
    })
  }

  get menuProps (): any {
    // specify maxHeight only if it's set, otherwise the v-menu doesn't show all items
    // ("maxHeight: auto" doesn't work either)
    if (this.maxHeight) return { bottom: true, offsetY: true, maxHeight: this.maxHeight }
    return { bottom: true, offsetY: true }
  }

  // methods
  toggleActionGroup (group: number): void {
    // if current group is active, deactivate it, otherwise activate it
    this.activeActionGroup = (this.activeActionGroup === group) ? NaN : group
  }

  @Emit('change')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  emitChangeEvent (item: any): void {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

// remove v-select-list top/bottom padding
.v-select-list {
  padding: 0;
}

// set content colour when hovering over list items
.v-list-item:hover .v-list-item__content,
.list-item:hover {
  color: $app-blue !important;
}

// set top border
.border-top {
  border-top: 1px solid $gray3;
}

.group-header {
  color: $gray9;
}

.group-item {
  color: $gray7;
}

// remove v-list-item clickable padding
::v-deep .v-list-item:has(.group-header),
::v-deep .v-list-item:has(.group-item) {
  padding: 0;
}

// hide disabled list items
::v-deep .v-list-item:has(.v-list-item__content.hide-me) {
  display: none;
}
// Removes empty spaces on nested select when the list is collapsed
::v-deep .v-list-item {
  min-height: auto;
  display: list-item;
  list-style:none;
}
// Hide and remove space for disabled list items and makes the nested select work for firefox
.v-list-item.v-list-item--disabled.theme--light .v-list-item__content.hide-me {
  display: none;
}
</style>
