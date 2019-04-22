<template>
  <div class="password-field-row">
    <input type="text" :value="value" @input="$emit('input', $event.target.value)">
  </div>
</template>

<script>
export default {
  name: 'NamespaceSeparatorEditor',
  props: {
    value: String,
  },
  computed: {
    testKey() {
      return 'key';
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
