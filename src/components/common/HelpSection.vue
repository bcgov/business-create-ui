<template>
  <div class="help-section-component">
    <div class="help-btn" @click="helpToggle = !helpToggle">
      <v-icon color="primary">mdi-help-circle-outline</v-icon>
      <span v-if="!helpToggle" class="pl-2">{{ header }}</span>
      <span v-else class="pl-2">Hide Help</span>
    </div>

    <v-expand-transition>
      <section v-if="helpToggle" class="help-section">
        <header class="help-header">
          <h2 class="py-4 px-0">{{ header }}</h2>
        </header>

        <p v-for="(item, index) in items" :key="index" class="my-4" v-html="item" />

        <div class="help-btn bottom" @click="helpToggle = !helpToggle">Hide Help</div>
      </section>
    </v-expand-transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { HelpSectionIF } from '@/interfaces'

@Component({})
export default class HelpSection extends Vue {
  @Prop({ default: () => {} }) readonly helpSection!: HelpSectionIF

  protected helpToggle = false

  get header (): string {
    return this.helpSection?.header || 'this section'
  }

  get items (): string[] {
    return this.helpSection?.helpText || []
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.help-btn {
  cursor: pointer;
  color: $app-blue;
  vertical-align: middle;
}

.v-icon {
  margin-top: -3px;
}

.help-section {
  border-top: 1px dashed $gray6;
  border-bottom: 1px dashed $gray6;
  margin: 1.5rem 0;
  padding: 1rem 0;
}

.help-header {
  display: flex;
  justify-content: center;
}

.help-btn.bottom {
  font-size: $px-13;
  text-decoration: underline;
  display: flex;
  direction: rtl;
}
</style>
