<template>
  <div class="d-none" />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { AmalgamationMixin, DateMixin, FilingTemplateMixin } from '@/mixins'

@Component({})
export default class MixinTester extends Mixins(AmalgamationMixin, DateMixin, FilingTemplateMixin) {}
</script>

<style>
</style>
