<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Epub from 'epubjs'

  global.ePub = Epub

  export default {
    computed: {
      ...mapGetters([
        'fileName',
        'menuVisible'
      ])
    },
    methods: {
      // 上一页
      prevPage () {
        if (this.rendition) {
          // 翻页
          this.rendition.prev()
        }
      },
      // 下一页
      nextPage () {
        if (this.rendition) {
          // 翻页
          this.rendition.next()
        }
      },
      // 显示标题菜单
      toggleTitleAndMenu () {
        // 修改vuex中的是否显示菜单的值
        this.$store.dispatch('setMenuVisible', !this.menuVisible)
      },
      // 初始化电子书
      initEpub () {
        const baseUrl = 'http://192.168.199.138:8081/epub/'
        // 拼接成完整的nginx地址
        const url = `${baseUrl}${this.fileName}.epub`
        // 实例化电子书
        this.book = new Epub(url)
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight
        })
        // 显示
        this.rendition.display()
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
      }
    },
    mounted () {
      const fileName = this.$route.params.fileName.split('|').join('/')
      // 将电子书名称通过vuex进行保存
      this.$store.dispatch('setFileName', fileName).then(() => {
        this.initEpub()
      })
    }
  }
</script>

<style lang="scss" scoped>

</style>
