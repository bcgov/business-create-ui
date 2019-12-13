<template>
  <div class="stateExample">
    <h1>This is an about page that contains an example for state</h1>
    <ul>
      <li>{{ stateText }}</li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

@Component
export default class Testing extends Vue {
  // This is a value passed into the component from the store
  @State stateText: string | undefined
}
</script>
