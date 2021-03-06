<template>
  <div>
    <div class="row row--center-vert database__listitem" @click="loadKeys">
      <div class="column column">
        <i class="fas fa-database"></i>
        {{database.name}}
        <i class="fas fa-circle-notch fa-spin" v-if="loading"></i>
      </div>
      <div class="column column--wrap">
        <span
          class="key-list__group__entries"
          :class="{'key-list__group__entries--dimmed': numberOfKeys === 0}"
        >{{numberOfKeys}}</span>
      </div>
    </div>
    <div v-show="showKeys">
      <key-group
        :keyGroup="group"
        :delimiter="server.delimiter"
        :selectedFullKey="selectedFullKey"
        v-for="group in groupedKeys.groups"
        @loadKey="loadKey"
        @deleteKey="deleteKey"
        :key="group.key"
      ></key-group>
      <div
        class="key-list__key"
        v-for="key in groupedKeys.keys"
        :class="{'key-list__key--selected': key.fullKey === selectedFullKey}"
        @click="loadKey(key.fullKey)"
        :key="key.fullKey"
      >
        <span>
          <i class="fas fa-key"></i>
          {{key.name}}
        </span>
        <button @click.stop="deleteKey({key: key.fullKey, redis})">Del</button>
        <!-- eslint-disable-line -->
      </div>
      <strong
        class="empty-result-warning"
        v-if="this.filteredKeys.length === 0 && this.keys.length > 0"
      >
        <i class="fas fa-exclamation-triangle"></i> No keys found
      </strong>
    </div>
  </div>
</template>

<script>
import KeyGroup from '@/components/KeyGroup';

const Redis = require('ioredis');
const { dialog } = require('electron').remote;


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
    // redis: {
    //   type: Object,
    // },
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
      redis: null,
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
    deleteKey(key) {
      const options = {
        type: 'info',
        buttons: ['Cancel', 'OK'],
        defaultId: 2,
        title: 'Confirm',
        message: 'Do you want to do this?',
        detail: `Are you sure you want to delete ${key}?`,
      };
      dialog.showMessageBox(null, options, (call) => {
        if (call === 1) {
          const keyIndex = this.keys.findIndex(x => x === key);
          if (keyIndex === -1) return;
          this.redis.del(key).then((res) => {
            if (res === 1) {
              this.keys.splice(keyIndex, 1);
            }
          });
        }
      });
    },
    loadKey(key) {
      this.$emit('loadKey', { key, redis: this.redis });
    },
    loadKeys() {
      if (this.redis === null) {
        console.log('load', this.database.id);
        this.redis = new Redis(this.server.port, this.server.host, {
          db: this.database.id,
        });
      }

      if (this.loaded) {
        this.showKeys = !this.showKeys;
      }
      if (this.loaded) return;
      this.redis.select(this.database.id).then((res) => {
        if (res === 'OK') {
          this.loadData(0);
        }
      });
    },
    loadData(start) {
      this.loading = true;
      this.redis.scan(start, 'MATCH', '*', 'COUNT', 10000).then((res) => {
        // console.log(res, res[0], res[1]);
        this.keys.push(...res[1]);
        if (res[0] > 0) {
          this.loadData(res[0]);
        } else {
          this.showKeys = true;
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
  transition: all ease 0.3s;
}

.database__listitem:hover {
  background: rgba(127, 127, 127, 0.1);
}

.empty-result-warning {
  text-align: center;
  padding: 0.5rem 0;
  display: block;
}
</style>
