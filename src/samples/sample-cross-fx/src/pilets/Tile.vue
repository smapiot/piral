<template>
  <div class="tile">
    <h3>Rendered from Vue</h3>
    <p>
      {{ rows }} rows and {{ columns }} columns
      <extension-component name="smiley"></extension-component>
    </p>
    <button v-on:click="count++">clicked {{ count }} times</button>
    <p>
      <a href="/demo" v-on:click.prevent="toDemo">Use router from Vue</a>
    </p>
  </div>
</template>

<script lang="ts">
export default {
  inject: ['router'],
  props: ['rows', 'columns', 'piral'],
  methods: {
    toDemo() {
      (this as any).router.history.push('/demo');
    },
  },
  data() {
    return {
      count: 0,
    };
  },
};
</script>
