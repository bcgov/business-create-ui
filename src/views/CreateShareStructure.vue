<template>
   <section class="mt-10">
      <header id="share-structure-header">
        <h2>1. Create Your Authorized Share Structure</h2>
      </header>
     <ListShareClass
       :shareClasses="shareClasses" />
    </section>
</template>

<script lang="ts">
// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

// Components
import { ListShareClass } from '@/components/CreateShareStructure'

@Component({
  components: { ListShareClass }
})
export default class CreateShareStructure extends Vue {
    // State
    @State(state => state.stateModel.createShareStructureStep.shareClasses)
    readonly shareClasses: any[]
}
</script>

<style lang="scss" scoped>
</style>
