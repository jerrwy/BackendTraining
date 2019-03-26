
/**
 * 状态组件
 */


 /**
  * 状态数据
  *
  * serverIp
  * connectId
  * username
  */
 let stateList = []

 module.exports = {
  registerState: (state) => {
    stateList.push(state)
  },

  delStateByUserName: (name) => {
    stateList = stateList.filter(k => k.username !== name)
  },

  checkUserState: (name) => {
    return stateList.find(k => k.username === name)
  },

  checkConnectState: (connectId) => {
    return stateList.find(k => k.connectId === connectId)
  },

  logState: () => {
    console.log(stateList)
  }
 }
