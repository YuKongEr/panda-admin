<template>
  <section class="main">
   <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view class="router" :key="key"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  min-height: calc(100vh - 84px);
  position: relative;
  overflow: hidden;
}
.main{
    height: 100%;
    background: #f1f4f5;
    padding: 15px;
    box-sizing: border-box;
    overflow-y: scroll;
}
</style>
