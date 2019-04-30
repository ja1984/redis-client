<template>
  <div class="namespace-separator-editor">
    <input type="text" :value="value" :placeholder="placeholder" @input="$emit('input', $event.target.value)">
    <div class="namespace-separator-editor__preview" v-html="testKey">
    </div>
  </div>
</template>

<script>
import KeyGroup from '@/components/KeyGroup';

export default {
  name: 'NamespaceSeparatorEditor',
  components: {
    KeyGroup,
  },
  props: {
    value: String,
    placeholder: {
      Type: String,
      default: '',
    },
  },
  computed: {
    testKey() {
      const delimiters = this.value.split('|');
      let key = '';
      delimiters.forEach((del) => {
        key += `<strong>key${del}</strong>`;
      });
      key += 'key';
      return key;
    },
  },
};
</script>

<style scoped>
.password-field-row {
  position: relative;
}

i {
  position: absolute;
  padding: 5px;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #dfdfdf;
  transition: all ease 0.3s;
}

.form-row:hover a {
    color: #acacac;
}

input {
  padding-right: 45px;
}
</style>
