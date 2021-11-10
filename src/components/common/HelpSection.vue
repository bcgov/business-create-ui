<template>
  <div v-if="helpSection" class="mt-5">
    <span class="help-btn" @click="helpToggle = !helpToggle">
      <v-icon color="primary" class="pr-1">mdi-help-circle-outline</v-icon>
      <span v-if="!helpToggle">Help with {{ helpTitle }}</span>
      <span v-else>Hide Help</span>
    </span>
    <section v-show="helpToggle" class="help-section">
      <header class="help-header">
        <h2>Help with {{ helpTitle }}</h2>
      </header>
      <ul class="px-0">
        <li
          v-for="(item, index) in helpSection.helpText"
          class="py-3"
          :key="index"
        >
          {{item}}
        </li>
      </ul>
      <u class="help-btn" @click="helpToggle = !helpToggle"><small>Hide Help</small></u>
    </section>
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Prop, Vue } from 'vue-property-decorator'
import { HelpSectionIF } from '@/interfaces'

@Component({})
export default class HelpSection extends Vue {
  @Prop({ default: {} })
  private readonly helpSection: HelpSectionIF

  @Prop({ default: 'Not Available' })
  private readonly helpTitle: string

  private helpToggle = false
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';
ul {
  list-style: none;
  color: $gray7;
}

.help-btn {
  cursor: pointer;
  color: $app-blue;
  vertical-align: middle;
}

.help-section {
  margin: 1.5rem 0;
  border-top: 1px dashed $gray6;
  border-bottom: 1px dashed $gray6;
  padding: 1rem 0;

  .help-header {
    display: flex;
    justify-content: center;
  }

  h2, h4 {
    padding: 1rem 0;
  }

  u {
    display: flex;
    direction: rtl;
  }

  a {
    text-decoration: none;
  }
}
</style>
