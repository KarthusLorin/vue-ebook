<template>
  <transition name="fade">
    <div class="slide-content-wrapper" v-show="menuVisible && settingVisible === 3">
      <transition name="slide-right">
        <div class="content" v-if="settingVisible === 3">
          <div class="content-page-wrapper">
            <div class="content-page"></div>
            <div class="content-page-tab"></div>
          </div>
        </div>
      </transition>
      <div class="content-bg" @click="hideTitleAndMenu"></div>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'

  export default {
    mixins: [ebookMixin]
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";
  .slide-content-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 300;
    display: flex;
    width: 100%;
    height: 100%;
    .content {
      flex: 0 0 85%;
      width: 85%;
      height: 100%;
      .content-page-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        .content-page {
          flex: 1;
          width: 100%;
          overflow: hidden;
        }
        .content-page-tab {
          flex: 0 0 px2rem(48);

        }
      }
    }
    .content-bg {
      flex: 0 0 15%;
      width: 15%;
      height: 100%;
    }
  }
</style>
