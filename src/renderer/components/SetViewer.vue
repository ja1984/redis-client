<template>
  <div>
    <table class="table" cellspacing="0" cellpadding="0">
      <thead>
        <tr>
          <th>Row</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{row.id}}</td>
          <td>{{row.value}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'SetViewer',
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
      for (let i = 0; i < page.length; i += 1) {
        rows.push({
          id: (i + 1),
          value: page[i],
        });
      }
      return rows;
    },
  },
};
</script>

<style>

.table {
  width: 100%;
}
td, th {
  padding: .5rem;
}
tbody td {
  text-align: center;
}

 thead tr {
   background: #ccc;
 }

 tbody tr:nth-child(even) {
   background: red;
 }
</style>
