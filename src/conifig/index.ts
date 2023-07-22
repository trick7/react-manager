/*
环境配置封装
dev 开发环境
stg 测试环境
prd 生产环境
*/

type ENV = 'stg' | 'prd' | 'dev'
let env: ENV = 'dev'
if (location.host.indexOf('locahost:8080') > -1) {
  env = 'dev'
} else if (location.host === 'driver-stg.marsview.cc') {
  env = 'stg'
} else {
  env = 'prd'
}
const config = {
  dev: {
    baseApi: '/api',
    uploadApi: 'http://api-driver-dev.marsview.cc',
    cdn: 'http://xxx.aliyun.com',
    mock: false,
    mockApi: 'https://www.fastmock.site/mock/5841b82d5672783b6fd62bb2a06aeb1f/api'
  },
  stg: {
    baseApi: '/api',
    uploadApi: 'http://api-driver-stg.marsview.cc',
    cdn: 'http://xxx.aliyun.com',
    mock: false,
    mockApi: 'https://www.fastmock.site/mock/5841b82d5672783b6fd62bb2a06aeb1f/api'
  },
  prd: {
    baseApi: '/api',
    uploadApi: 'http://api-driver.marsview.cc',
    cdn: 'http://xxx.aliyun.com',
    mock: false,
    mockApi: 'https://www.fastmock.site/mock/5841b82d5672783b6fd62bb2a06aeb1f/api'
  }
}
export default {
  env,
  ...config[env]
}
