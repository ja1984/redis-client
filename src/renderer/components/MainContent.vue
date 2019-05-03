<template>
  <main class="content">
    <header class="content__header">
      <div class="row row--center-vert row--spaced">
        <div class="column">
          <template v-if="keyObject">
            <div class="row row--center-vert">
              <div class="column column--wrap">
                <label class="form-label">
                  <span class="form-label__text">&nbsp;</span>
                  <span class="key-type">{{keyObject.type}}</span>
                </label>
              </div>
              <div class="column">
                <label class="form-label">
                  <span class="form-label__text">Key</span>
                  <input type="text" v-model="keyObject.key" readonly class="content__header__key">
                </label>
              </div>
              <div class="column column--wrap">
                <label class="form-label">
                  <span class="form-label__text">ttl</span>
                  <strong>{{keyObject.ttl}}</strong>
                </label>
              </div>
            </div>
          </template>
        </div>
        <div class="column column--wrap">
          <div class="toolbar">
            <div class="row">
              <div class="column column--wrap">
                <button class="toolbar__button">
                  <i class="fas fa-fw toolbar__button__icon fa-cog"></i>
                </button>
              </div>
              <div class="column column--wrap">
                <button class="toolbar__button">
                  <i class="fas fa-fw toolbar__button__icon fa-ellipsis-v"></i>
                </button>
              </div>
              <div class="column column--wrap">
                <button class="toolbar__button">
                  <span class="fa-stack fa-2x">
                    <i class="fas fa-fw toolbar__button__icon fa-database fa-stack-2x"></i>
                    
                    <i class="far fa-times-circle fa-stack-1x"></i>
                  </span>
                  
                  
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <section class="content__body" v-if="keyObject">
      <pre v-if="keyObject.type === 'string'" v-html="dataValue"></pre>
      <z-set-viewer v-if="keyObject.type === 'zset'" :data="keyObject.data"></z-set-viewer>
      <set-viewer v-if="keyObject.type === 'set'" :data="keyObject.data"></set-viewer>
    </section>
    <footer class="content__footer" v-if="keyObject">{{ size }}</footer>
  </main>
</template>

<script>
import ZSetViewer from '@/components/ZSetViewer';
import SetViewer from '@/components/SetViewer';
export default {
  name: 'MainContent',
  components: {
    ZSetViewer,
    SetViewer,
  },
  props: {
    keyObject: {
      type: Object,
    },
    server: {
      type: Object,
    },
  },
  methods: {
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return '0 Bytes';

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`; //eslint-disable-line
    },
  },
  computed: {
    isJson() {
      try {
        const json = JSON.parse(this.keyObject.data); //eslint-disable-line
        return true;
      } catch (error) {
        return false;
      }
    },
    dataValue() {
      try {
        const json = JSON.parse(this.keyObject.data);
        return JSON.stringify(json, null, 2);
      } catch (error) {
        console.log(error);
        return this.keyObject.data;
      }
    },
    size() {
      return this.formatBytes(new Blob([this.keyObject.data]).size);
    },
  },
};
</script>

<style>
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.content__header__key {
  width: 100%;
  border: none;
  padding: 0.8rem;
  background: #fff;
  border: 0.1rem solid #dfdfdf;
  border-radius: 0.3rem;
  font-size: 1.2rem;
}
.content__header {
  padding: 1rem;
  border-bottom: 0.1rem solid #ddd;
  background: #f9f9f9;
}

#app.app--theme-dark .content__header {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.1);
}

#app.app--theme-dark .content__header__key {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.content__body {
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
}

.content__footer {
  border-top: 0.1rem solid #ddd;
  background: #f9f9f9;
}

pre {
  margin: 0;
  height: 100%;
  overflow-y: auto;
}

.form-label__text {
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: normal;
  display: block;
}

.key-type {
  border-radius: 0.3rem;
  padding: 0.5rem 1rem;
  background: #2196f3;
  color: #fff;
  text-transform: uppercase;
  font-size: 1rem;
}

.toolbar__button {
  background: transparent;
  border: none;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.toolbar__button__icon {
  font-size: 2.5rem;
  color: #333;
}
</style>
