<template>
   <section class="mt-10">
      <header id="share-structure-header">
        <h2>1. Create Your Authorized Share Structure</h2>
      </header>
     <ListShareStructure />
    </section>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'

// Components
import { ListShareStructure } from '@/components/ShareStructure'

@Component({
  components: { ListShareStructure }
})
export default class CreateShareStructure extends Vue {}
</script>

<style lang="scss" scoped>
</style>
