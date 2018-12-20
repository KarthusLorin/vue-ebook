<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hide">
          <span class="icon-down2"></span>
        </div>
        <span class="ebook-popup-title-text">选择字体</span>
      </div>
      <div class="ebook-popup-list-wrapper">
        <div class="ebook-popup-item" v-for="(item, index) of fontFamilyList" :key="index">
          <div class="ebook-popup-item-text" :class="{'selected': isSelected(item)}">
            {{item.font}}
          </div>
          <div class="ebook-popup-item-check" v-if="isSelected(item)">
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { FONT_FAMILY } from '../../utils/book'
  import { ebookMixin } from '../../utils/mixin'

  export default {
    mixins: [ebookMixin],
    data () {
      return {
        fontFamilyList: FONT_FAMILY
      }
    },
    methods: {
      // 计算字体是否被选中
      isSelected (item) {
        return this.defaultFontFamily === item.font
      },
      hide () {
        this.setFontFamilyVisible(false)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global";

  .ebook-popup-list {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 300;
    width: 100%;
    background: #fff;
    box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, .1);
    .ebook-popup-title {
      position: relative;
      padding: px2rem(15);
      box-sizing: border-box;
      border-bottom: px2rem(1) solid #b8b9bb;
      text-align: center;
      @include center;
      .ebook-popup-title-icon {
        position: absolute;
        left: px2rem(15);
        top: 0;
        height: 100%;
        font-size: px2rem(16);
        font-weight: bold;
        @include center;
      }
      .ebook-popup-title-text {
        font-size: px2rem(14);
        font-weight: bold;
      }
    }
    .ebook-popup-list-wrapper {

      .ebook-popup-item {
        display: flex;
        padding: px2rem(15);
        .ebook-popup-item-text {
          flex: 1;
          font-size: px2rem(14);
          text-align: left;
          &.selected {
            color: #346cb9;
            font-weight: bold;
          }
        }
        .ebook-popup-item-check {
          flex: 1;
          font-size: px2rem(14);
          text-align: right;
          font-weight: bold;
          color: #346cb9;
        }
      }
    }
  }
</style>
