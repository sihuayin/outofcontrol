import storage from './storage'

export const USER_STORAGE = 'USER_'
class Auth {
  constructor() {
    this.id = 0
    this.name = ''
    this.token = ''
    this.role = ''
    this.roleId = 0

    this.init()
  }

  init() {
    const userString = storage.get(USER_STORAGE + 'info')
    if (userString) {
      try {
        const user = JSON.parse(userString)
        this.id = user.id
        this.name = user.name
        this.token = user.token
        this.role = user.role
        this.roleId = user.roleId
      } catch(err) {
        console.log('解析json文件错误!', err)
      }
    }
  }

  login(user) {
    this.id = user.id
    this.name = user.name
    this.token = user.token
    this.role = user.role
    this.roleId = user.roleId
    storage.set(USER_STORAGE + 'info', this.toJson())
  }

  logout() {
    this.id = 0
    this.name = ''
    this.token = ''
    this.role = ''
    this.roleId = 0
    storage.set(USER_STORAGE + 'info', this.toJson())
  }

  toJson() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      token: this.token,
      role: this.role,
      roleId: this.roleId
    })
  }

  loggedIn() {
    return this.token !== ''
  }

  isYisheng() {
    return this.roleId === 4
  }

  isZhuanjia() {
    return this.roleId === 8
  }
}

export default new Auth