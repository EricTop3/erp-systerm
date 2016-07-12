// 导入Vue
import Vue from 'vue'
// 请求服务器路径
export var requestUrl = 'http://192.168.1.150:1401/mock/v1'
// token值
export var token = window.localStorage.getItem('token')
// 所有页面搜索方法
export function searchRequest (url, data, callback) {
  var cur = new Vue()
  cur.$http({
    url: url,
    method: 'get',
    data: data,
    headers: {'X-Overpowered-Token': token}
  })
  .then(function (response) {
    callback && callback(response)
  }, function (err) {
    console.log(err)
  })
}
