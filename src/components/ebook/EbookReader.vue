<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
  import Epub from 'epubjs'
  import { ebookMixin } from '../../utils/mixin'
  import {
    getFontFamily,
    saveFontFamily,
    getFontSize,
    saveFontSize,
    getTheme,
    saveTheme
  } from '../../utils/localStorage'

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
      // 获取主题离线缓存并设置主题
      initTheme () {
        // 获取离线主题
        let defaultTheme = getTheme(this.fileName)
        if (!defaultTheme) {
          defaultTheme = this.themeList[0].name
          // 离线存储主题
          saveTheme(this.fileName, defaultTheme)
        }
        this.setDefaultTheme(defaultTheme)
        this.themeList.forEach(theme => {
          // 注册主题
          this.rendition.themes.register(theme.name, theme.style)
        })
        // 设置离线主题
        this.rendition.themes.select(defaultTheme)
      },
      // 渲染初始化
      initRendition () {
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight
        })
        // 显示
        this.rendition.display().then(() => {
          // 显示后和显示前初始化字体和大小效果一样，所以卸载显示后的promise中
          this.initTheme()
          this.initFontSize()
          this.initFontFamily()
          this.initGlobalStyle()
        })
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
      },
      // 初始化手势
      initGesture () {
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
      },
      // 初始化电子书
      initEpub () {
        const baseUrl = `${process.env.VUE_APP_RES_URL}/epub/`
        // 拼接成完整的nginx地址
        const url = `${baseUrl}${this.fileName}.epub`
        // 实例化电子书
        this.book = new Epub(url)
        // 将实例化的电子书对象放入vuex中
        this.setCurrentBook(this.book)
        // 渲染初始化
        this.initRendition()
        // 初始化手势
        this.initGesture()
        // 分页算法
        this.book.ready.then(() => {
          return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
        }).then(locations => {
          // 完成分页后，允许拖动
          this.setBookAvailable(true)
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
