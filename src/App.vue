<template>
  <div id="app">
    <span class="text">ABCDEFG</span>
    <router-view/>
  </div>
</template>

<script>

  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters(['test'])
    },
    mounted () {
      this.$store.dispatch('setTest', 10).then(() => {
        console.log(this.test)
      })
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const html = document.querySelector('html')
    let fontSize = window.innerWidth / 10
    fontSize = fontSize > 50 ? 50 : fontSize
    html.style.fontSize = fontSize + 'px'
  })

</script>

<style lang="scss" scoped>
  @import "./assets/styles/global.scss";

  .text {
    font-family: "Days One";
    font-size: px2rem(20);
    color: orange;
  }
</style>
