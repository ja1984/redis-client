<template>
  <main class="content">
    <header class="content__header">a</header>
    <section class="content__body">a</section>
  </main>
</template>

<script>
export default {
  name: 'MainContent',
};
</script>

<style>
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .content__header {
    padding: 1rem;
    border-bottom: .1rem solid #ddd;
  }

  .content__body {
    padding: 1rem;
  }
</style>
