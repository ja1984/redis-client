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
      <key-group :keyGroup="group" v-for="group in groupedKeys.groups" :key="group.key"></key-group>
      <div class="key-list__key" v-for="key in groupedKeys.keys" :key="key"><i class="fas fa-key"></i>{{key}}</div>
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
    keys: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    groupedKeys() {
      // const keys = this.keyGroup.keys.concat().sort((a, b) => a.length - b.length);
      const keys = this.keyGroup.keys.concat();
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
};
</script>

<style>
.key-list__group__entries {
  background: #aaa;
  color: #F4F7FA;
  font-size: 1rem;
  padding: .2rem .7rem;
  border-radius: 10rem;
  font-weight: bold;
}

#app.dark .key-list__group__entries {
  color: #282d3a;
  background:rgba(255,255,255, .9);
} 
</style>
