<template>
  <div class="tile">
    <h3>Rendered from Vue</h3>
    <p>{{ rows }} rows and {{ columns }} columns</p>
    <button v-on:click="count++">clicked {{ count }} times</button>
  </div>
</template>

<script lang="ts">
export default {
  props: ['rows', 'columns'],
  data() {
    return {
      count: 0,
    };
  },
};
</script>
