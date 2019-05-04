<template>
  <section class="zset-view">
    <div class="zset-view__data">
      <table class="table" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th>Row</th>
            <th>Value</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="data-row"
            :class="{'data-row--selected': row === selectedRow}"
            v-for="row in rows"
            :key="row.id"
            @click="toggleSelectedRow(row)"
          >
            <td>{{row.id}}</td>
            <td class="ellipsis">
              <div class="ellipsis__content">{{row.value}}</div>
            </td>
            <td>{{row.score}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="zset-view__preview" v-if="selectedRow !== null">
      <string-viewer :data="selectedRow.value"></string-viewer>
    </div>
  </section>
</template>

<script>
import StringViewer from '@/components/StringViewer';

export default {
  name: 'ZSetViewer',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedRow: null,
    };
  },
  components: {
    StringViewer,
  },
  methods: {
    toggleSelectedRow(row) {
      if (this.selectedRow === row) {
        this.selectedRow = null;
      } else {
        this.selectedRow = row;
      }
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

.zset-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.zset-view__preview,
.zset-view__data {
  flex: 1;
  overflow-y: auto;
}

.zset-view__preview {
  position: relative;
}
</style>
