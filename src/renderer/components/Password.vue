<template>
  <div class="password-field-row">
    <input :type="showPassword ? 'text' : 'password'" :placeholder="placeholder" :value="value" @input="$emit('input', $event.target.value)">
    <i class="fa" @click="showPassword = !showPassword" :class="{'fa-eye': !showPassword, 'fa-eye-slash': showPassword}" aria-hidden="true"></i>
  </div>
</template>

<script>
export default {
  name: 'Password',
  props: {
    value: String,
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showPassword: false,
    };
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
