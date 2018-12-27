<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{getReadTimeText()}}</span>
          <div class="icon-forward"></div>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection">
            <span class="icon-back"></span>
          </div>
          <input class="progress"
                 type="range"
                 max="100"
                 min="0"
                 step="1"
                 @change="onProgressChange($event.target.value)"
                 @input="onProgressInput($event.target.value)"
                 :value="progress"
                 :disabled="!bookAvailable"
                 ref="progress">
          <div class="progress-icon-wrapper" @click="nextSection">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{getSectionName}}</span>
          <span>({{bookAvailable ? progress + '%' : '加载中...'}})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import { getReadTime } from '../../utils/localStorage'

  export default {
    mixins: [ebookMixin],
    computed: {
      getSectionName () {
        if (this.section) {
          const sectionInfo = this.currentBook.section(this.section)
          if (sectionInfo && sectionInfo.href) {
            return this.currentBook.navigation.get(sectionInfo.href).label
          }
        }
        return ''
      }
    },
    methods: {
      onProgressChange (progress) {
        this.setProgress(progress).then(() => {
          // 展示progress
          this.displayProgress()
        })
      },
      onProgressInput (progress) {
        // 拖动时，进度发生变化
        this.setProgress(progress)
      },
      displayProgress () {
        // 获取定位符
        const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
        // 定位到所需的位置
        this.display(cfi)
      },
      // 前一章节
      prevSection () {
        if (this.section > 0 && this.bookAvailable) {
          this.setSection(this.section - 1).then(() => {
            // 跳转到上一章
            this.displaySection()
          })
        }
      },
      // 后一章节
      nextSection () {
        if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
          this.setSection(this.section + 1).then(() => {
            // 跳转到下一章节
            this.displaySection()
          })
        }
      },
      // 显示某一章节
      displaySection () {
        const sectionInfo = this.currentBook.section(this.section)
        if (sectionInfo && sectionInfo.href) {
          this.display(sectionInfo.href)
        }
      },
      getReadTimeText () {
        return this.$t('book.haveRead').replace('$1', this.getReadTimeByMinute(this.fileName))
      },
      getReadTimeByMinute () {
        const readTime = getReadTime(this.fileName)
        if (!readTime) {
          return 0
        } else {
          // 不足一分钟，当做1分钟看
          return Math.ceil(readTime / 60)
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import '../../assets/styles/global';

  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 101;
    width: 100%;
    height: px2rem(90);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      .read-time-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: px2rem(40);
        font-size: px2rem(12);
        @include center;
      }
      .progress-wrapper {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .progress-icon-wrapper {
          font-size: px2rem(20);
        }
        .progress {
          width: 100%;
          -webkit-appearance: none;
          height: px2rem(2);
          margin: 0 px2rem(10);
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: white;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
            border: px2rem(1) solid #ddd;
          }
        }
      }
      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: px2rem(10);
        width: 100%;
        color: #333;
        font-size: px2rem(12);
        padding: 0 px2rem(15);
        box-sizing: border-box;
        @include center;
        .progress-section-text {
          @include ellipsis;
        }
      }
    }
  }

</style>
