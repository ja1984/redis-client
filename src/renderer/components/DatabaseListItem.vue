<template>
    <div
    >
      <div
        class="row row--center-vert database__listitem" @click="loadKeys"
        :class="{'database__listitem--dimmed': database.keys === 0 && keys.length === 0}"
      >
        <div class="column column">
          <i class="fas fa-database"></i>
          {{database.name}}
        </div>
        <div class="column column--wrap">
          <span class="key-list__group__entries">{{keys.length}}</span>
        </div>
      </div>
      <div>
        <key-group :keyGroup="group" v-for="group in groupedKeys.groups" @loadKey="loadKey" :key="group.key"></key-group>
        <div class="key-list__key" v-for="key in groupedKeys.keys" @click="loadKey(key)" :key="key"><i class="fas fa-key"></i>{{key}}</div>
      </div>
    </div>
</template>

<script>
import KeyGroup from '@/components/KeyGroup';
const Redis = require('ioredis');
const redis = new Redis(6379, '127.0.0.1');

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
  },
  data() {
    return {
      keys: [],
    };
  },
  computed: {
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
      redis.select(this.database.id).then((res) => {
        if (res === 'OK') {
          this.loadData(0);
          this.open = true;
        }
      });
    },
    loadData(start) {
      redis.scan(start, 'MATCH', '*', 'COUNT', 1000).then((res) => {
        // console.log(res, res[0], res[1]);
        this.keys.push(...res[1]);
        if (res[0] > 0) {
          this.loadData(res[0]);
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
