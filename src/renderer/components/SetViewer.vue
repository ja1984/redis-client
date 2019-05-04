<template>
  <section class="set-view">
    <div class="set-view__data">
      <table class="table" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th>Row</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            class="data-row"
            :class="{'data-row--selected': row === selectedRow}"
            :key="row.id"
            @click="toggleSelectedRow(row)"
          >
            <td>{{row.id}}</td>
            <td class="ellipsis">
              <div class="ellipsis__content">{{row.value}}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="set-view__preview" v-if="selectedRow !== null">
      <string-viewer :data="selectedRow.value"></string-viewer>
    </div>
  </section>
</template>

<script>
import StringViewer from '@/components/StringViewer';

export default {
  name: 'SetViewer',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    StringViewer,
  },
  data() {
    return {
      page: 0,
      selectedRow: null,
    };
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
.set-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.set-view__preview,
.set-view__data {
  flex: 1;
  overflow-y: auto;
}

.set-view__preview {
  position: relative;
}

.table {
  width: 100%;
}
td,
th {
  padding: 0.5rem;
}
tbody td {
  text-align: center;
}

.data-row {
  cursor: pointer;
}
.data-row:nth-child(even) {
  background: #ccc;
}

.data-row.data-row--selected {
  background: blue;
}

.ellipsis__content {
  max-width: 70vw;
}
.ellipsis__content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
