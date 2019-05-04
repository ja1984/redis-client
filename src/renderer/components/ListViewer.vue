<template>
  <div>
    <table class="table" cellspacing="0" cellpadding="0">
      <thead>
        <tr>
          <th>Row</th>
          <th>Item</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row,index) in data" :key="index + '-' + row">
          <td>{{index + 1}}</td>
          <td>{{row}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ListViewer',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style>

</style>
