<template>
  <div class="key-list__group">
    <div class="key-list__key" @click="open = !open">
      <div class="row row--center-vert">
        <div class="column">
          <i class="far" :class="{'fa-folder': !open, 'fa-folder-open': open}"></i>
          {{keyGroup.name}}
        </div>
        <div class="column column--wrap">
          <span class="key-list__group__entries">{{keyGroup.keys.length}}</span>
        </div>
      </div>
      <div class="key-list__key__toolbar">
        <button @click.stop="addKeyToGroup"><i class="fas fa-plus-circle"></i></button>
        <button @click.stop="removeGroup"><i class="far fa-trash-alt"></i></button>
      </div>
    </div>
    <div class="key-list__keys" v-if="open">
      <key-group
        :keyGroup="group"
        :delimiter="delimiter"
        v-for="group in groupedKeys.groups"
        :selectedFullKey="selectedFullKey"
        @loadKey="loadKey"
        @deleteKey="deleteKey"
        :key="group.key"
      ></key-group>
      <div
        class="key-list__key"
        @click="loadKey(key.fullKey)"
        :class="{'key-list__key--selected': key.fullKey === selectedFullKey}"
        v-for="(key) in singleKeysToShow"
        :key="key.fullKey"
      >
        <i class="fas fa-key"></i>
        {{key.name}}
        <button @click.stop="deleteKey(key.fullKey)">Del</button>
      </div>

      <!-- <virtual-list :size="40" :remain="10">
            <div class="key-list__key" @click="loadKey(key.fullKey)" :class="{'key-list__key--selected': key.fullKey === selectedFullKey}" v-for="key in groupedKeys.keys" :key="key.fullKey"><i class="fas fa-key"></i>{{key.name}}</div>
      </virtual-list>-->
      <template v-if="this.groupedKeys.keys.length > 1000">
      <div>
        <button class="button button-primary" @click="page += 1">Show more keys</button>
      </div>
      <div class="limiter" ref="limiter"></div>
      </template>
    </div>
  </div>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list';
import KeyGroup from '@/components/KeyGroup';
import { setTimeout } from 'timers';

export default {
  name: 'KeyGroup',
  data() {
    return {
      open: false,
      page: 1,
      keysToShow: [],
    };
  },
  components: {
    KeyGroup,
    VirtualList,
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
  mounted() {

  },
  methods: {
    addKeyToGroup() {
      console.log(this.keyGroup);
    },
    removeGroup() {
      console.log(this.keyGroup);
    },
    deleteKey(key) {
      this.$emit('deleteKey', key);
    },
    loadKey(key) {
      this.$emit('loadKey', key);
    },
    scroll() {
      console.log(this.$refs.limiter, this.$refs.limiter.getBoundingClientRect().top);
      // console.log(this.$refs.limiter.)
    },
    addLazyScroll() {
      this.$nextTick(() => {
        console.log('nextTick', this.page);
        if (this.page < 50) {
          this.page += 1;
        }
      });
      this.page += 1;
      // setTimeout(() => {
      //   if (this.page < 50) {
      //     this.addLazyScroll();
      //     this.page += 1;
      //   }
      // }, 100);
      // document.querySelector('.key-list').addEventListener('scroll', this.scroll, false);
    },
  },
  computed: {
    singleKeysToShow() {
      return this.groupedKeys.keys.slice(0, (this.page * 1000));
    },
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

      if (singleKeys.length > 999) {
        // const observer = new IntersectionObserver((changes) => {
        //   if (changes[0].isIntersecting) {
        //     console.log('show more', this.page);
        //     this.page += 1;
        //   }
        // }, {
        //   threshold: [0],
        //   // 🆕 Track the actual visibility of the element
        //   trackVisibility: true,
        //   // 🆕 Set a minimum delay between notifications
        //   delay: 100,
        // });

        // Require that the entire iframe be visible.
        setTimeout(() => {
          // this.addLazyScroll();
          // observer.observe(this.$refs.limiter);
        }, 200);
      }

      return { groups, keys: singleKeys };
    },
  },
};
</script>

<style>
.key-list__keys {
  position: relative;
}
.key-list__group__entries {
  display: block;
  font-weight: bold;

  border-radius: 0.3rem;
  padding: 0.5rem 1rem;
  background: #2196f3;
  color: #fff;
  text-transform: uppercase;
  font-size: 1rem;
}

#app.app--theme-dark .key-list__group__entries {
  color: #282d3a;
  background: rgba(255, 255, 255, 0.9);
}

.limiter {
  height: 5px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: red;
}
.key-list__key {
  position: relative;
  overflow: hidden;
}

.key-list__key:hover .key-list__key__toolbar {
    transform: translateX(0);
  }

.key-list__key__toolbar {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  transform: translateX(100%);
  opacity: .5;
  transition: all ease .3s;
      background: #ccc;
    padding: .5rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

.key-list__key__toolbar:hover {
  opacity: 1;
}
</style>
