<template>
  <div>
      Display List of People Here
  </div>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

// Interfaces
import { OrgPersonIF, BaseAddressObjIF } from '@/interfaces'

// Enums
import { EntityTypes } from '@/enums'

@Component
export default class ListPeopleAndRoles extends Vue {}
</script>

<style lang="scss" scoped>
</style>
