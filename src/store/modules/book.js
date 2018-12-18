const book = {
  state: {
    // 打开的电子书名称
    fileName: '',
    // 是否显示菜单栏
    menuVisible: false,
    // -1:不显示,0:字号,1:主题,2:进度,3:目录
    settingVisible: -1,
    // 字号
    defaultFontSize: 16
  },
  mutations: {
    'SET_FILENAME': (state, fileName) => {
      state.fileName = fileName
    },
    'SET_MENUVISIBLE': (state, menuVisible) => {
      state.menuVisible = menuVisible
    },
    'SET_SETTINGVISIBLE': (state, settingVisible) => {
      state.settingVisible = settingVisible
    },
    'SET_DEFAULT_FONT_SIZE': (state, defaultFontSize) => {
      state.defaultFontSize = defaultFontSize
    }
  }
}

export default book
