<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
  import { ebookMixin } from '../../utils/mixin'
  import {
    getFontFamily,
    saveFontFamily,
    getFontSize,
    saveFontSize
  } from '../../utils/localStorage'
  import Epub from 'epubjs'

  global.ePub = Epub

  export default {
    mixins: [ebookMixin],
    methods: {
      // 上一页
      prevPage () {
        if (this.rendition) {
          // 翻页
          this.rendition.prev()
          // 隐藏菜单栏
          this.hideTitleAndMenu()
        }
      },
      // 下一页
      nextPage () {
        if (this.rendition) {
          // 翻页
          this.rendition.next()
          // 隐藏菜单栏
          this.hideTitleAndMenu()
        }
      },
      // 显示标题菜单
      toggleTitleAndMenu () {
        // 修改vuex中的是否显示菜单的值
        if (this.menuVisible) {
          // 隐藏设置
          this.setSettingVisible(-1)
          this.setFontFamilyVisible(false)
        }
        // this.$store.dispatch('setMenuVisible', !this.menuVisible)
        this.setMenuVisible(!this.menuVisible)
      },
      // 隐藏标题菜单
      hideTitleAndMenu () {
        // this.$store.dispatch('setMenuVisible', false)
        this.setMenuVisible(false)
        // 同时隐藏设置
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      },
      // 获取字体大小离线缓存并设置字体大小
      initFontSize () {
        let fontSize = getFontSize(this.fileName)
        if (!fontSize) {
          saveFontSize(this.fileName, this.defaultFontSize)
        } else {
          this.rendition.themes.fontSize(fontSize)
          this.setDefaultFontSize(fontSize)
        }
      },
      // 获取字体离线缓存并设置字体
      initFontFamily () {
        let fontFamily = getFontFamily(this.fileName)
        if (!fontFamily) {
          saveFontFamily(this.fileName, this.defaultFontFamily)
        } else {
          this.rendition.themes.font(fontFamily)
          this.setDefaultFontFamily(fontFamily)
        }
      },
      // 初始化电子书
      initEpub () {
        const baseUrl = 'http://192.168.199.138:8081/epub/'
        // 拼接成完整的nginx地址
        const url = `${baseUrl}${this.fileName}.epub`
        // 实例化电子书
        this.book = new Epub(url)
        // 将实例化的电子书对象放入vuex中
        this.setCurrentBook(this.book)
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight
        })
        // 显示
        this.rendition.display().then(() => {
          this.initFontSize()
          this.initFontFamily()
        })
        // 绑定事件
        this.rendition.on('touchstart', event => {
          // 获取手指位置，用于之后计算手势
          this.touchStartX = event.changedTouches[0].clientX
          // 获取时间戳
          this.touchStartTime = event.timeStamp
        })
        this.rendition.on('touchend', event => {
          // 计算手势
          const offsetX = event.changedTouches[0].clientX - this.touchStartX
          // 计算手势停留时间
          const time = event.timeStamp - this.touchStartTime
          if (time < 500 && offsetX > 40) {
            this.prevPage()
          } else if (time < 500 && offsetX < -40) {
            this.nextPage()
          } else {
            this.toggleTitleAndMenu()
          }
          // 禁止默认事件（在最新版本的chrome中不支持在这两个事件中使用这两个方法）
          // event.preventDefault()
          // event.stopPropagation()
          // 通过加上第三个参数{ passive: false }实现相同效果
        }, { passive: false })
        // 添加字体资源
        this.rendition.hooks.content.register(contents => {
          Promise.all([
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
            contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
          ]).then(() => {
            console.log('字体加载完毕')
          })
        })
      }
    },
    mounted () {
      const fileName = this.$route.params.fileName.split('|').join('/')
      // 将电子书名称通过vuex进行保存
      // this.$store.dispatch('setFileName', fileName).then(() => {
      //   this.initEpub()
      // })
      this.setFileName(fileName).then(() => {
        this.initEpub()
      })
    }
  }
</script>

<style lang="scss" scoped>

</style>
