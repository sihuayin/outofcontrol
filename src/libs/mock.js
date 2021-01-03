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
      'name': 'dingidng',
      'role': 'yisheng'
    }
  }
})

Mock.mock(/\/specialists/, 'get', function() {
  return {
    success: true,
    message: '',
    data: {
      page: 1,
      pageSize: 10,
      total: 100,
      data: [{
        id: 1,
        type: 'one',
        date: '2020-12-22'
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
        role: 'zhuanjia'
      }, {
        id: 2,
        name: 'ddd',
        role: 'yisheng'
      }],
      room: {
        id: 1,
        type: 'some',
        time: ''
      }
    }
  }
})

Mock.mock(/\/docter\/datings/, 'get', function() {
  return {
    success: true,
    message: '',
    data: {
      page: 1,
      pageSize: 10,
      total: 100,
      data: [{
        id: 1,
        title: '测试',
        status: 0,
        date: '2020-12-22'
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
