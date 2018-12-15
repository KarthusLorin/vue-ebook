<template>
  <div class="ebook-reader">
    <div id="read">

    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Epub from 'epubjs'

  global.ePub = Epub

  export default {
    computed: {
      ...mapGetters(['fileName'])
    },
    methods: {
      initEpub () {
        const baseUrl = 'http://192.168.199.138:8081/epub/'
        // 拼接成完整的nginx地址
        const url = `${baseUrl}${this.fileName}.epub`
        // 实例化电子书
        this.book = new Epub(url)
        this.rendition = this.book.renderTo('read', {
          width: innerWidth,
          height: innerHeight,
          // 微信兼容性设置
          method: 'default'
        })
        // 显示
        this.rendition.display()
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
