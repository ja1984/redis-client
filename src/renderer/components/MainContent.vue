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
            </div>
          </div>
        </div>
      </div>
    </header>
    <section class="content__body" v-if="keyObject">
      <pre v-html="dataValue"></pre></section>
  </main>
</template>

<script>
export default {
  name: 'MainContent',
  props: {
    keyObject: {
      type: Object,
    },
    server: {
      type: Object,
    },
  },
  computed: {
    dataValue() {
      try {
        const json = JSON.parse(this.keyObject.data);
        return JSON.stringify(json, null, 2);
      } catch (error) {
        return this.keyObject.data;
      }
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
  background: rgba(255,255,255, .2);
  border-color: rgba(255,255,255, .1);
}

#app.app--theme-dark .content__header__key {
  background: rgba(255,255,255, .1);
  color: #fff;
}

.content__body {
  padding: 1rem;
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
