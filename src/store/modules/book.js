const book = {
  state: {
    // 打开的电子书名称
    fileName: '',
    // 是否显示菜单栏
    menuVisible: false
  },
  mutations: {
    'SET_FILENAME': (state, fileName) => {
      state.fileName = fileName
    },
    'SET_MENUVISIBLE': (state, menuVisible) => {
      state.menuVisible = menuVisible
    }
  }
}

export default book
