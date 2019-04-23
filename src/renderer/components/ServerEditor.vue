<template>
  <transition name="modal">
    <div class="server-editor" v-if="show">
      <div class="server-editor__modal">
        <header class="server-editor__modal__header">
          <h2 class="server-editor__modal__header__title">New connection</h2>
        </header>
        <section class="server-editor__modal__body">
          <form>
            <div class="form-field">
              <div class="row row--spaced">
                <div class="column">
                  <label class="form-label">
                    <span class="form-label__text">Name</span>
                    <input
                      type="text"
                      v-model="name"
                      @input="nameEdited = true"
                      placeholder="Connetion name"
                    >
                  </label>
                </div>
                <div class="column column--wrap">
                  <label class="form-label">
                    <span class="form-label__text">Enviroment</span>
                    <select class="short-width" v-model="enviroment">
                      <option>Production</option>
                      <option>Staging</option>
                      <option>Test</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
            <div class="form-field">
              <div class="row row--spaced">
                <div class="column">
                  <label class="form-label">
                    <span class="form-label__text">Host</span>
                    <input type="text" v-model="host" placeholder="Host">
                  </label>
                </div>
                <div class="column column--wrap">
                  <label class="form-label">
                    <span class="form-label__text">Port</span>
                    <input type="number" class="short-width" v-model="port" placeholder="Connetion name">
                  </label>
                </div>
              </div>
            </div>
            <div class="form-field">
              <label class="form-label">
                <span class="form-label__text">Auth</span>
                <password
                  v-model="auth"
                  placeholder="(Optional) redis-server authentication password"
                ></password>
              </label>
            </div>
            <div class="form-field">
              <label class="form-label">
                <span class="form-label__text">Namespace separator</span>
                <input
                type="text"
                  v-model="delimiter"
                  placeholder="Namespace separator"
                >
              </label>
            </div>
          </form>
        </section>
        <footer class="server-editor__footer">
          <div class="row">
            <div class="column">
              <button class="button" :disabled="!canSave" @click="testConnection">
                <i class="fas fa-plug"></i> Test connection
              </button>
            </div>
            <div class="column column--wrap">
              <button class="button button--transparent" @click="$emit('cancel')">Cancel</button>
              <button class="button button--primary" :disabled="!canSave" @click="save">Ok</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
import Password from '@/components/Password';
const Redis = require('ioredis');
const { dialog } = require('electron').remote;

export default {
  name: 'ServerEditor',
  components: {
    Password,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    serverToEdit: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      id: null,
      enviroment: null,
      name: '',
      delimiter: ':',
      host: '127.0.0.1',
      port: 6379,
      auth: '',
      nameEdited: false,
    };
  },
  methods: {
    save() {
      const servers = JSON.parse(localStorage.getItem('servers')) || [];
      const isEdit = this.id !== null;

      if (!isEdit) {
        const newServer = {
          id: Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36),
          name: this.name,
          host: this.host,
          port: this.port,
          enviroment: this.enviroment,
          delimiter: this.delimiter,
          lastConnect: null,
        };
        servers.push(newServer);
        localStorage.setItem('servers', JSON.stringify(servers));
      } else {
        const oldServer = servers.find(x => x.id === this.id);
        oldServer.name = this.name;
        oldServer.host = this.host;
        oldServer.port = this.port;
        oldServer.enviroment = this.enviroment;
        oldServer.delimiter = this.delimiter;
        localStorage.setItem('servers', JSON.stringify(servers));
      }

      this.$emit('serverAdded');
    },
    testConnection() {
      const redis = new Redis({
        lazyConnect: true,
        port: this.port,
        host: this.host,
        maxRetriesPerRequest: 1,
      });
      redis.on('error', () => {
        alert('Could not connect');
        redis.disconnect();
      });

      redis.ping().then(() => {
        const options = {
          type: 'info',
          buttons: ['OK'],
          defaultId: 2,
          title: 'Question',
          message: 'Do you want to do this?',
          detail: 'It does not really matter',
        };
        dialog.showMessageBox(null, options);
      }).catch((err) => {
        console.log(err);
        redis.disconnect();
      });
    },
  },
  computed: {
    canSave() {
      if (this.host.length === 0) return false;
      if (this.port.length === 0) return false;

      return true;
    },
  },
  watch: {
    host() {
      if (this.nameEdited) return;
      this.name = this.host;
    },
    serverToEdit(server) {
      this.name = server.name;
      this.host = server.host;
      this.port = server.port;
      this.delimiter = server.delimiter;
      this.auth = server.auth;
      this.id = server.id;
      this.enviroment = server.enviroment;
    },
  },
};
</script>

<style>
.form-field {
  margin-bottom: 1rem;
}

.server-editor {
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

.server-editor__modal {
  background: #fff;
  border-radius: 0.7rem;
  box-shadow: 0px 7px 10px -2px rgba(127, 127, 127, 0.25);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 65rem;
}

.server-editor__modal__header__title {
  margin: 0;
  padding-bottom: 0.7rem;
  border-bottom: 0.1rem solid #eee;
}

#app.app--theme-dark .server-editor__modal{
  color: #eee;
  background-color: #232834;
  box-shadow: none;
}

#app.app--theme-dark .server-editor__modal__header__title{

}

.server-editor__modal__body {
  margin: 1rem 0;
}
</style>
