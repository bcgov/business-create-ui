<template>
  <div class="d-none" />
</template>

<script lang="ts">
import { Component, mixins } from 'vue-facing-decorator'
import { DateMixin, FilingTemplateMixin } from '@/mixins'

@Component({})
export default class MixinTester extends mixins(DateMixin, FilingTemplateMixin) {}
</script>

<style>
</style>
