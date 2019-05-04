<template>
  <section class="string-viewer">
    <vue-json-pretty v-if="dataType === 'json'" :data="getJson"></vue-json-pretty>
    <pre v-if="dataType === 'string'" v-html="data"></pre>
  </section>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty';

export default {
  name: 'StringViewer',
  props: {
    data: {
      type: String,
      default: '',
    },
  },
  components: {
    VueJsonPretty,
  },
  computed: {
    dataType() {
      return this.isJson ? 'json' : 'string';
    },
    isJson() {
      try {
        const json = JSON.parse(this.data); //eslint-disable-line
        return true;
      } catch (error) {
        return false;
      }
    },
    getJson() {
      try {
        return JSON.parse(this.data);
      } catch (error) {
        console.log(error);
        return this.data;
      }
    },
  },
};
</script>

<style>

</style>
