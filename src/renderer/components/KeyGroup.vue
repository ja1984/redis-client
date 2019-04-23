<template>
  <div class="key-list__group">
    <div class="key-list__key" @click="open = !open">
      <div class="row row--center-vert">
        <div class="column">
          <i class="far" :class="{'fa-folder': !open, 'fa-folder-open': open}"></i>
          {{keyGroup.name}}
        </div>
        <div class="column column--wrap">
          <span class="key-list__group__entries">{{keyGroup.keys.length}}</span></div>
      </div>
    </div>
    <div class="key-list__keys" v-if="open">
      <key-group :keyGroup="group" :delimiter="delimiter" v-for="group in groupedKeys.groups" :selectedFullKey="selectedFullKey" @loadKey="loadKey" :key="group.key"></key-group>
      <div class="key-list__key" @click="loadKey(key.fullKey)" :class="{'key-list__key--selected': key.fullKey === selectedFullKey}" v-for="key in groupedKeys.keys" :key="key.fullKey"><i class="fas fa-key"></i>{{key.name}}</div>
    </div>
  </div>
</template>

<script>
import KeyGroup from '@/components/KeyGroup';

export default {
  name: 'KeyGroup',
  data() {
    return {
      open: false,
    };
  },
  components: {
    KeyGroup,
  },
  props: {
    keyGroup: {
      type: Object,
    },
    delimiter: {
      type: String,
      default: '',
    },
    keys: {
      type: Array,
      default: () => [],
    },
    selectedFullKey: {
      type: String,
      default: '',
    },
  },
  methods: {
    loadKey(key) {
      this.$emit('loadKey', key);
    },
  },
  computed: {
    groupedKeys() {
      // const keys = this.keyGroup.keys.concat().sort((a, b) => a.length - b.length);
      const keys = this.keyGroup.keys.concat();
      const groups = {};
      const singleKeys = [];
      const regEx = new RegExp(`(?:${this.delimiter})(.+)?`);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];

        // const split = key.split(/:(.+)?/);
        const split = key.name.split(regEx);
        // const split = key.name.split(`/(?:${':|_'})(.+)?/`);

        if (split.length === 1) {
          singleKeys.push(Object.freeze({ name: split[0], fullKey: key.fullKey }));
        } else {
          const keyGroup = split[0];
          const keyName = split.length > 1 ? split[1] : key;
          const existingGroup = groups[keyGroup];

          if (!existingGroup) {
            groups[keyGroup] = {
              name: keyGroup,
              keys: [Object.freeze({ name: keyName, fullKey: key.fullKey })],
            };
          } else {
            existingGroup.keys.push(Object.freeze({ name: keyName, fullKey: key.fullKey }));
            // existingGroup.keys.push(key);
          }
        }
      }
      return { groups, keys: singleKeys };
    },
  },
};
</script>

<style>
.key-list__group__entries {
  display: block;
  font-weight: bold;

  border-radius: .3rem;
  padding: .5rem 1rem;
  background: #2196F3;
  color: #fff;
  text-transform: uppercase;
  font-size: 1rem;

}

#app.app--theme-dark .key-list__group__entries {
  color: #282d3a;
  background:rgba(255,255,255, .9);
} 
</style>
