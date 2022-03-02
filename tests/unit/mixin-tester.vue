<template>
  <div class="d-none" />
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'

// Mixins
import { DateMixin, EnumMixin, FilingTemplateMixin } from '@/mixins'

@Component({})
export default class MixinTester extends Mixins(
  DateMixin,
  EnumMixin,
  FilingTemplateMixin
) {}
</script>

<style>
</style>
