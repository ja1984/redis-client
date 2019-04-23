<template>
    <div
    >
      <div
        class="row row--center-vert database__listitem" @click="loadKeys"
      >
        <div class="column column">
          <i class="fas fa-database"></i>
          {{database.name}} <i class="fas fa-circle-notch fa-spin" v-if="loading"></i>
        </div>
        <div class="column column--wrap">
          <span class="key-list__group__entries" :class="{'key-list__group__entries--dimmed': numberOfKeys === 0}">{{numberOfKeys}}</span>
        </div>
      </div>
      <div v-show="showKeys">
        <key-group :keyGroup="group" :delimiter="server.delimiter" :selectedFullKey="selectedFullKey" v-for="group in groupedKeys.groups" @loadKey="loadKey" :key="group.key"></key-group>
        <div class="key-list__key" v-for="key in groupedKeys.keys" :class="{'key-list__key--selected': key.fullKey === selectedFullKey}" @click="loadKey(key.fullKey)" :key="key.fullKey"><i class="fas fa-key"></i>{{key.name}}</div>
      </div>
      </div>
    </div>
</template>

<script>
import KeyGroup from '@/components/KeyGroup';

export default {
  name: 'DataBaseListItem',
  components: {
    KeyGroup,
  },
  props: {
    database: {
      type: Object,
      open: false,
    },
    redis: {
      type: Object,
    },
    server: {
      type: Object,
    },
    filter: {
      type: String,
      default: '',
    },
    selectedFullKey: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      keys: [],
      loading: false,
      loaded: false,
      showKeys: false,
    };
  },
  computed: {
    filteredKeys() {
      if (this.filter.length === 0) return this.keys;
      return this.keys
        .filter(key => key.toLowerCase().includes(this.filter.toLowerCase()));
    },
    numberOfKeys() {
      if (this.filteredKeys.length > 0 && !this.loading) return this.keys.length;
      return this.database.keys;
    },
    groupedKeys() {
      const keys = this.filteredKeys.concat().sort();
      const groups = {};
      const singleKeys = [];
      const regEx = new RegExp(`(?:${this.server.delimiter})(.+)?`);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        // const split = key.split(/:(.+)?/);
        // const split = key.split(/(?::|_)(.+)?/);
        // console.log(regEx);
        const split = key.split(regEx);
        if (split.length === 1) {
          singleKeys.push(Object.freeze({ name: split[0], fullKey: key }));
          // singleKeys.push(split[0]);
        } else {
          const keyGroup = split[0];
          const keyName = split.length > 1 ? split[1] : key;
          const existingGroup = groups[keyGroup];

          if (!existingGroup) {
            groups[keyGroup] = {
              name: keyGroup,
              keys: [Object.freeze({ name: keyName, fullKey: key })],
            };
          } else {
            existingGroup.keys.push(Object.freeze({ name: keyName, fullKey: key }));
          }
        }
      }
      return { groups, keys: singleKeys };
    },
  },
  methods: {
    loadKey(key) {
      this.$emit('loadKey', key);
    },
    loadKeys() {
      this.showKeys = !this.showKeys;
      if (this.loaded) return;
      console.log('dataabaseid', this.database.id);
      this.redis.select(this.database.id).then((res) => {
        console.log('loadKeys', res);
        if (res === 'OK') {
          this.loadData(0);
          this.open = true;
        }
      });
    },
    loadData(start) {
      this.loading = true;
      const keys = [];
      this.redis.scan(start, 'MATCH', '*', 'COUNT', 10000).then((res) => {
        // console.log(res, res[0], res[1]);
        this.keys.push(...res[1]);
        if (res[0] > 0) {
          this.loadData(res[0]);
        } else {
          this.loading = false;
          this.loaded = true;
          console.log(keys);
        }
      });
    },
  },
};
</script>

<style>

.database__listitem {
  padding: 1rem;
  cursor: pointer;
  transition: all ease .3s;
}

.database__listitem:hover {
  background: rgba(127,127,127, .1);
}
</style>
