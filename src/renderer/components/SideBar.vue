<template>
  <aside class="sidebar">
    <header>
      <input type="search" class="sidebar__filter" v-model="filter" placeholder="Type to filter keys">
    </header>
    <section class="key-list">
      <div class="databases">
        <div class="key-list__key" v-for="database in databases" :key="database">
          <i class="fas fa-database"></i>{{database}}
        </div>
      </div>
        <key-group :keyGroup="group" v-for="group in groupedKeys.groups" :key="group.key"></key-group>
        <div class="key-list__key" v-for="key in groupedKeys.keys" :key="key"><i class="fas fa-key"></i>{{key}}</div>
        <!-- <div class="key-list__key" v-for="key in groupedKeys.keys" :key="key"><i class="fas fa-key"></i>{{key}}</div> -->
        <!-- <template v-else>
          <div class="key-list__key"><i class="fas fa-key"></i> {{group.name}}</div>
        </template> -->
      <!-- <div class="key-list__list">
        <RecycleScroller class="scroller" :items="filteredKeys" key-field="key" :itemSize="38">
          <div slot-scope="{ item }">
            <div class="key-list__key"><i class="fas fa-key"></i> {{item}}</div>
          </div>
        </RecycleScroller>
      </div> -->
    </section>
    <footer>
      <div class="footer__button">
        <i class="fas fa-cog"></i> Settings
      </div>
    </footer>
  </aside>
</template>

<script>
import KeyGroup from '@/components/KeyGroup';
const Redis = require('ioredis');
const redis = new Redis(6379, '127.0.0.1');
export default {
  name: 'SideBar',
  components: {
    KeyGroup,
  },
  data() {
    return {
      keys: [],
      databases: [],
      filter: '',
      groups: {},
    };
  },
  computed: {
    groupedKeys() {
      const keys = this.filteredKeys.concat().sort((a, b) => a.length - b.length);
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
    filteredKeys() {
      if (this.filter.length === 0) return this.keys;
      return this.keys
        .filter(key => key.toLowerCase().includes(this.filter.toLowerCase()));
    },
  },
  mounted() {
    redis.info().then((res) => {
      console.log(res);
    });

    redis.config('get', 'databases').then((res) => {
      console.log('response from db', res);
      for (let i = 0; i < res[1]; i += 1) {
        redis.select(i).then((res) => {
          if (res === 'OK') {
            this.databases.push(`db${i}`);
          }
        }).catch(console.error);
      }
    });


    // this.loadData(0);
  },
  methods: {
    // groupKeys(keys) {
    //   keys.sort((a, b) => a.length - b.length);
    //   const groups = {};
    //   for (let i = 0; i < keys.length; i += 1) {
    //     const key = keys[i];
    //     const split = key.split(':', 1);

    //     const keyGroup = split[0];
    //     const existingGroup = groups[keyGroup];

    //     if (!existingGroup) {
    //       groups[keyGroup] = {
    //         name: keyGroup,
    //         keys: [key],
    //       };
    //     } else {
    //       existingGroup.keys.push(key);
    //     }
    //   }

    //   this.groups = groups;
    // },
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
  .sidebar {
    width: 30rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #eee;
  }
  #app.dark .sidebar {
    background: rgba(0, 0, 0, 0.1);
  }

  .key-list {
    flex: 1;
    overflow: hidden;
    overflow-y: scroll;
  }

  .key-list__list {
    height: 100%;
  }


  .key-list__key {
    padding: 1rem;
    font-size: 1.4rem;
  }

  .key-list__key {
  cursor: pointer;
}

.key-list__keys {
  padding-left: 1rem;
}

.key-list__key:hover {
  background: rgba(0,0,0, .1);
}

  .footer__button {
    padding: 1.5rem;
    background: rgba(0, 0, 0, .1);
    cursor: pointer;
  }

  .sidebar__filter {
    width: 100%;
    border: none;
    padding: 1.5rem 1rem;
    background: rgba(0,0,0, .1);
    color: #eee;
  }

  .sidebar__filter:active,
  .sidebar__filter:focus {
    outline: none;
  }

  .scroller {
    height: 100%;
  }

  /* .vue-recycle-scroller  {
    height: 100%;
    overflow-y: scroll;
  } */

i {
  margin-right: .5rem;
}

  .vue-recycle-scroller{position:relative}.vue-recycle-scroller.direction-vertical:not(.page-mode){overflow-y:auto}.vue-recycle-scroller.direction-horizontal:not(.page-mode){overflow-x:auto}.vue-recycle-scroller.direction-horizontal{display:flex}.vue-recycle-scroller__slot{flex:auto 0 0}.vue-recycle-scroller__item-wrapper{flex:1;box-sizing:border-box;overflow:hidden;position:relative}.vue-recycle-scroller.ready .vue-recycle-scroller__item-view{position:absolute;top:0;left:0;will-change:transform}.vue-recycle-scroller.direction-vertical .vue-recycle-scroller__item-wrapper{width:100%}.vue-recycle-scroller.direction-horizontal .vue-recycle-scroller__item-wrapper{height:100%}.vue-recycle-scroller.ready.direction-vertical .vue-recycle-scroller__item-view{width:100%}.vue-recycle-scroller.ready.direction-horizontal .vue-recycle-scroller__item-view{height:100%}.resize-observer[data-v-b329ee4c]{position:absolute;top:0;left:0;z-index:-1;width:100%;height:100%;border:none;background-color:transparent;pointer-events:none;display:block;overflow:hidden;opacity:0}.resize-observer[data-v-b329ee4c] object{display:block;position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1}
</style>
