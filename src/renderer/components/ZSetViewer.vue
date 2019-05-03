<template>
  <div>
    <table class="table" cellspacing="0" cellpadding="0">
      <thead>
        <tr>
          <th>Row</th>
          <th>Value</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td>{{row.id}}</td>
          <td>{{row.value}}</td>
          <td>{{row.score}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ZSetViewer',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    rows() {
      const rows = [];
      let row = 1;
      for (let i = 0; i < this.data.length; i += 2) {
        rows.push({
          id: row,
          value: this.data[i],
          score: this.data[i + 1],
        });
        row += 1;
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
