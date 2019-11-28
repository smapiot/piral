<template>
  <div class="tile">
    <h3>Rendered from Vue</h3>
    <p>
      {{ rows }} rows and {{ columns }} columns
      <extension-component name="smiley"></extension-component>
    </p>
    <button v-on:click="count++">clicked {{ count }} times</button>
  </div>
</template>

<script lang="ts">
export default {
  props: ['rows', 'columns', 'piral'],
  data() {
    return {
      count: 0,
    };
  },
};
</script>
