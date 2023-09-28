<template>
  <div class="d-none" />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-facing-decorator'
import { DateMixin, FilingTemplateMixin } from '@/mixins'

@Component({})
export default class MixinTester extends Mixins(DateMixin, FilingTemplateMixin) {}
</script>

<style>
</style>
