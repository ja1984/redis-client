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
              class="servers__server"
              v-for="server in servers"
              :key="server.id"
              @click="selectServer(server)"
              :class="{'servers__server--selected': server === selectedServer}"
            >
              {{server.name}}
              <span class="server-url">{{server.url}}:{{server.url}}</span>
            </div>
          </div>
        </section>
        <footer class="server-select__modal__footer">
          <button :disabled="selectedServer === null" @click="selectServer(selectedServer)">ok</button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ServerSelect',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      servers: [{
        id: 0,
        name: 'Localhost',
        url: '127.0.0.1',
        port: 6379,
      }],
      selectedServer: null,
    };
  },
  methods: {
    selectServer(server) {
      if (server === this.selectedServer) {
        this.$emit('selectServer', server);
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
  transition: all ease .3s;
  opacity: 1;
}

.server-select__modal {
  background: #fff;
  border-radius: 0.7rem;
  box-shadow: 0px 7px 10px -2px rgba(127, 127, 127, 0.25);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 600px;
}

.server-select__modal__body {
  flex: 1;
}

.server-select__modal__header__title {
  margin: 0;
  padding-bottom: 0.7rem;
  border-bottom: 0.1rem solid #eee;
}

.server-select__modal__footer {
  padding-top: 1.5rem;
  text-align: center;
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

</style>
