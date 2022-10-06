<template>
  <div class="d-none" />
</template>

<script lang="ts">
// Libraries
import { Component, Mixins } from 'vue-property-decorator'

// Mixins
import { DateMixin, FilingTemplateMixin } from '@/mixins'

@Component({})
export default class MixinTester extends Mixins(
  DateMixin,
  FilingTemplateMixin
) {}
</script>

<style>
</style>
