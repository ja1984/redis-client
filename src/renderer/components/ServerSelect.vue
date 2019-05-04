<template>
  <transition name="modal">
    <div class="server-select" v-if="show">
      <div class="server-select__modal">
        <header class="server-select__modal__header">
          <h2 class="server-select__modal__header__title">Select server</h2>
        </header>
        <section class="server-select__modal__body">
          <div class="servers">
            <div
              class="servers__server row row--spaced"
              v-for="server in servers"
              :key="server.id"
              @click="selectServer(server)"
              :class="{'servers__server--selected': server === selectedServer}"
            >
              <div class="column">
                {{server.name}}
                <div class="row">
                  <div class="column">
                    <span class="server-url">{{server.host}}:{{server.port}}</span>
                  </div>
                  <div class="column column--wrap">
                    <span class="server-url">{{server.lastConnect}}</span>
                  </div>
                </div>
              </div>
              <div class="column column--wrap">
                <button class="button button--primary servers__server__button" @click.stop="edit(server)">
                  <i class="fas fa-fw fa-wrench"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
        <footer class="server-select__modal__footer">
          <div class="row">
            <div class="column">
              <button
                class="button button--transparent"
                @click="showServerEditor = true"
              >New connection</button>
            </div>
            <div class="column column--wrap">
              <i class="fas fa-circle-notch fa-spin" v-if="loading"></i>
              <button
                :disabled="selectedServer === null || loading"
                @click="selectServer(selectedServer)"
                class="button button--primary"
              >Connect</button>
            </div>
          </div>
          <div class="row" v-if="err">
            <div class="column server-editor__error">
              {{err}}
            </div>
          </div>
        </footer>
        <server-editor
          :show="showServerEditor"
          :server-to-edit="serverToEdit"
          @cancel="showServerEditor = false"
          @serverAdded="serverAdded"
        ></server-editor>
      </div>
    </div>
  </transition>
</template>

<script>
import ServerEditor from '@/components/ServerEditor';
const Redis = require('ioredis');
export default {
  name: 'ServerSelect',
  components: {
    ServerEditor,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    redis: {
      type: Object,
    },
  },
  mounted() {
    this.loadServers();
  },
  data() {
    return {
      showServerEditor: false,
      servers: [],
      selectedServer: null,
      loading: false,
      serverToEdit: null,
      err: null,
    };
  },
  methods: {
    edit(server) {
      this.serverToEdit = server;
      this.showServerEditor = true;
    },
    serverAdded() {
      this.loadServers();
      this.showServerEditor = false;
    },
    loadServers() {
      const servers = JSON.parse(localStorage.getItem('servers'));
      if (servers) {
        this.servers = servers;
      }
    },
    selectServer(server) {
      this.err = null;
      if (server === this.selectedServer) {
        const redis = new Redis({
          lazyConnect: true,
          port: server.port,
          host: server.host,
          maxRetriesPerRequest: 1,
        });
        redis.on('error', (err) => {
          this.err = err;
          redis.disconnect();
        });
        this.loading = true;
        redis.ping().then(() => {
          this.loading = false;
          server.lastConnect = new Date();
          localStorage.setItem('servers', JSON.stringify(this.servers));
          this.$emit('selectServer', server);
        }).catch((err) => {
          this.loading = false;
          console.log(err);
          redis.disconnect();
        });

        // .then((res) => {
        //   console.log(res);
        // }).catch((err) => {
        //   console.log(err);
        // });

        // this.$emit('selectServer', server);
        return;
      }

      this.selectedServer = server;
    },

  },
};
</script>

<style>
.server-select {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all ease 0.3s;
  opacity: 1;
}

.server-editor__error {
  color: red;
}

.server-select__modal {
  background: #fff;
  border-radius: 0.7rem;
  box-shadow: 0px 7px 10px -2px rgba(127, 127, 127, 0.25);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 65rem;
}

.server-select__modal__body {
  flex: 1;
}

.server-select__modal__header__title {
  margin: 0;
  padding-bottom: 0.7rem;
  border-bottom: 0.1rem solid #eee;
}

#app.app--theme-dark .server-select__modal{
  color: #eee;
  background-color: #232834;
  box-shadow: none;
}
#app.app--theme-dark .server-select__modal__header__title{

}

.server-select__modal__footer {
  padding-top: 1.5rem;
}

.server-select__modal__body {
  margin-top: 1rem;
}

.servers__server {
  padding: 1rem;
  cursor: pointer;
  transition: all ease 0.3s;
  border-radius: 0.3rem;
}

.servers__server:hover {
  background: #fafafa;
}

.servers__server.servers__server--selected {
  background: #fafafa;
}

.server-url {
  font-size: 1rem;
  padding-top: 0.3rem;
  display: block;
  color: #888;
}

.servers__server__button {
  opacity: .10;
}



.servers__server:hover .servers__server__button {
  opacity: .5;
}

.servers__server:hover .servers__server__button:hover {
  opacity: 1;
}



</style>
