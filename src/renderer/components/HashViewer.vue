<template>
  <div>
    <table class="table" cellspacing="0" cellpadding="0">
      <thead>
        <tr>
          <th>Row</th>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{row.id}}</td>
          <td>{{row.key}}</td>
          <td>{{row.value}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'HashViewer',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      page: 0,
    };
  },
  computed: {
    rows() {
      const rows = [];
      const page = this.data[this.page + 1];

      if (Array.isArray(page)) {
        let row = 1;
        for (let i = 0; i < page.length; i += 2) {
          rows.push({
            id: row,
            key: page[i],
            value: page[i + 1],
          });
          row += 1;
        }
      }
      return rows;
    },
  },
};
</script>

<style>

</style>
