<template>
  <div class="d-none" />
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { DateMixin, FilingTemplateMixin } from '@/mixins'

@Component({
  mixins: [
    DateMixin,
    FilingTemplateMixin
  ]
})
export default class MixinTester extends Vue {}
</script>

<style>
</style>
