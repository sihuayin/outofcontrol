import Mock from 'mockjs'

Mock.mock(/\/login/, 'get', function() {
  return {
    'user': {
      'name': '@cname',
      'id': 88
    }
  }
})

Mock.mock(/\/login/, 'post', function() {
  return {
    success: true,
    message: '',
    data: {
      'id': 1,
      'token': 'sxx',
      'name': 'dingiqqdng',
      'role': 'yisheng',
      'roleid': 8
    }
  }
})

Mock.mock(/\/specialist\/1\/datings/, 'get', function() {
  return {
    success: true,
    message: '',
    data: [{
      id: 1,
      title: '测试',
      participated: 0,
      date: '2021-01-08'
    }, {
      id: 2,
      type: 'two',
      date: '2020-12-23'
    }, {
      id: 3,
      type: 'only',
      date: '2020-12-24'
    }]
  }
})

Mock.mock(/\/specialist\/1\/join/, 'post', function() {
  return {
    success: true,
    message: '',
    data: {
      members: [{
        id: 1,
        name: 'test',
        role: 'zhuanjia',
        roleId: 8
      }, {
        id: 2,
        name: 'ddd',
        role: 'yisheng',
        roleId: 4
      }],
      room: {
        id: 2,
        type: 'one',
        time: '',
        roleId: 4
      }
    }
  }
})

Mock.mock(/\/doctor\/datings/, 'get', function() {
  return {
    success: true,
    message: '',
    data: {
      page: 1,
      pageSize: 10,
      total: 100,
      data: [{
        meetingid: 1,
        title: '测试',
        participated: 0,
        enddttm: '2021-01-10'
      }, {
        id: 2,
        title: '测试1',
        status: 1,
        date: '2020-12-23'
      }, {
        id: 3,
        title: '测试2',
        status: 3,
        date: '2020-12-24'
      }]
    }
  }
})

Mock.mock(/\/rmt\/api\/docter\/one/, 'post', function() {
  return {
    success: true,
    message: '',
    data: {
    }
  }
})