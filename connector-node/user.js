
/**
 * 用户组件
 */


//用户列表
let userList = [
  { name: 'wang' },
  { name: 'xu' },
  { name: 'zhu' },
  { name: 'liu' },
  { name: 'feng' }
]

module.exports = {
  login: (name) => {
    // return !!userList.find(k => k.name === name)
    return true
  }
}

