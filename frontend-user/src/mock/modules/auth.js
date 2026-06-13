import Mock from 'mockjs'

// 模拟用户数据库
const users = [
  { id: 1, username: 'demo', password: '123456', phone: '13800001111', avatar: '' },
  { id: 2, username: 'test', password: '123456', phone: '13800002222', avatar: '' }
]

// 登录
Mock.mock(/\/api\/auth\/login/, 'post', (options) => {
  const { username, password } = JSON.parse(options.body)
  const user = users.find(u => u.username === username && u.password === password)
  if (user) {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: Mock.mock('@guid'),
        userInfo: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
        }
      }
    }
  }
  return { code: 401, message: '用户名或密码错误', data: null }
})

// 注册
Mock.mock(/\/api\/auth\/register/, 'post', (options) => {
  const { username, password, phone } = JSON.parse(options.body)
  if (users.find(u => u.username === username)) {
    return { code: 400, message: '用户名已存在', data: null }
  }
  const newUser = {
    id: users.length + 1,
    username,
    password,
    phone,
    avatar: ''
  }
  users.push(newUser)
  return { code: 200, message: '注册成功', data: null }
})
