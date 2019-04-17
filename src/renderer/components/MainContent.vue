<template>
  <main class="content">
    <header class="content__header" v-if="keyObject">
      <div class="row row--center-vert row--spaced">
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
          </label></div>
        <div class="column column--wrap">
          <label class="form-label">
            <span class="form-label__text">ttl</span>
            <strong>{{keyObject.ttl}}</strong>
          </label></div>
      </div>
    </header>
    <section class="content__body" v-if="keyObject">{{keyObject.data}}</section>
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
    padding: .8rem;
    background: #fff;
    border: .1rem solid #dfdfdf;
    border-radius: .3rem;
    font-size: 1.2rem;
  }
  .content__header {
    padding: 1rem;
    border-bottom: .1rem solid #ddd;
    background: #f9f9f9;
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
    border-radius: .3rem;
    padding: .5rem 1rem;
    background: #2196F3;
    color: #fff;
    text-transform: uppercase;
    font-size: 1rem;
  }
</style>
