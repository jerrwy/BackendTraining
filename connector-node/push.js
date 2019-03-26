/**
 * push组件
 */


 /**
  * 历史消息
  *
  * id
  * from
  * to
  * type
  * content
  * datetime
  *
  */
 let pushList = []


 module.exports = {
    save2db: (push) => {
      push.id = pushList.length + 1
      pushList.push(push)
      return push
    },

    pollMsg: (name, lastId) => {
      return pushList.filter(k => k.name === name && k.id > lastId)
    },

    logPushHistory: () => {
      console.log(pushList)
    }
 }
