<template>
    <div
    >
      <div
        class="row row--center-vert database__listitem" @click="loadKeys"
      >
        <div class="column column">
          <i class="fas fa-database"></i>
          {{database.name}}
        </div>
        <div class="column column--wrap">
          <span class="key-list__group__entries" :class="{'key-list__group__entries--dimmed': numberOfKeys === 0}">{{numberOfKeys}}</span>
        </div>
      </div>
      <div v-show="showKeys">
        <key-group :keyGroup="group" v-for="group in groupedKeys.groups" @loadKey="loadKey" :key="group.key"></key-group>
        <div class="key-list__key" v-for="key in groupedKeys.keys" @click="loadKey(key)" :key="key"><i class="fas fa-key"></i>{{key}}</div>
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
    numberOfKeys() {
      if (this.keys.length > 0 && !this.loading) return this.keys.length;
      return this.database.keys;
    },
    groupedKeys() {
      const keys = this.keys.concat().sort((a, b) => a.length - b.length);
      const groups = {};
      const singleKeys = [];
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const split = key.split(/:(.+)?/);
        if (split.length === 1) {
          singleKeys.push(split[0]);
        } else {
          const keyGroup = split[0];
          const keyName = split.length > 1 ? split[1] : key;
          const existingGroup = groups[keyGroup];

          if (!existingGroup) {
            groups[keyGroup] = {
              name: keyGroup,
              keys: [keyName],
            };
          } else {
            existingGroup.keys.push(keyName);
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
      this.redis.select(this.database.id).then((res) => {
        if (res === 'OK') {
          this.loadData(0);
          this.open = true;
        }
      });
    },
    loadData(start) {
      this.loading = true;
      this.redis.scan(start, 'MATCH', '*', 'COUNT', 1000).then((res) => {
        // console.log(res, res[0], res[1]);
        this.keys.push(...res[1]);
        if (res[0] > 0) {
          this.loadData(res[0]);
        } else {
          this.loading = false;
          this.loaded = true;
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
