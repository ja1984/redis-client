<template>
  <div id="app" class="dark">
    <side-bar></side-bar>
    <main-content></main-content>
  </div>
</template>

<script>
import SideBar from '@/components/SideBar';
import MainContent from '@/components/MainContent';
// const Redis = require('ioredis');
// const redis = new Redis(6379, '127.0.0.1');
export default {
  name: 'redis-client',
  components: {
    MainContent,
    SideBar,
  },
  mounted() {
    // console.log(redis);

    // Add testdata for redis
    // for (let i = 0; i < 1000; i += 1) {
    //   redis.set(`a:key2:a:${i}`, 'testdata');
    // }
    // for (let i = 0; i < 1000; i += 1) {
    //   redis.set(`b:c:d:e:${i}`, 'testdata');
    // }
    // for (let i = 0; i < 2000; i += 1) {
    //   redis.set(`c:${i}`, 'testdata');
    // }
    // for (let i = 0; i < 4000; i += 1) {
    //   redis.set(`d:${i}`, 'testdata');
    // }

    // redis.scan(cursor, 'MATCH', pattern, 'COUNT', fetchCount, (err, res) => {

    // // redis.get('wordpress-api:Production:chancehill.com:getlanguages').then((res) => {
    // //   console.log(res);
    // // });
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

html {
  font-size: 62.5%;
}

body, input {
  font-size: 1.6rem;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
}

#app {
  height: 100%;
  width: 100%;
  display: flex;
  background: #fff;
  color: #333;
}

#app.dark {
  background: #282d3a;
  color: #eee;
}

.row {
  display: flex;
}

.row.row--center-vert {
  justify-content: center;
}

.column {
  flex: 1;
}

.column.column--wrap {
  flex: none;
}
  /* CSS */
</style>
