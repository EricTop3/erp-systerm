
  // 导入jquery
  import $ from 'jquery'
  import Vue from 'vue'
  import ErrorTip from '../../src/components/common/ErrorTip'
  import {erpRequestUrl} from '../../config/requestUrl'
  // 请求服务器路径

  export var requestUrl = erpRequestUrl

  //  请求服务器路径真实接口
  export var requestSystemUrl = erpRequestUrl
  var token =  window.localStorage.getItem('token')
  export var storeName = window.localStorage.getItem('storeName')
  export var storeAccount = window.localStorage.getItem('storeAccount')
  export var storeInfo = window.localStorage.getItem('storeInfo')
  export var systermName = window.localStorage.getItem('systermName')
  export var systermAccount = window.localStorage.getItem('systermAccount')
  export var systermAuthority = window.localStorage.getItem('systermAuthority')
  export var storeAuthority = window.localStorage.getItem('storeAuthority')
  //后台0,1状态没完成状态的展示方式
  export function changeStatus(origindata) {
    if(!(origindata instanceof Array)){
      if(origindata.checked!=undefined){
        if (origindata.checked === 0) {
          origindata.checked = '未审核'
        } else if (origindata.checked === 1) {
          origindata.checked = '已审核'
        }
      }
      if(origindata.total_sum!=undefined){
        origindata.total_sum = (Number(origindata.total_sum) * 0.01).toFixed(2)
      }
    }else{
      $.each(origindata, function (index, val) {
        if (val.checked !== undefined) {
          if (val.checked === 0) {
            val.checked = '未审核'
          } else if (val.checked === 1) {
            val.checked = '已审核'
          }
        }
        if(val.total_sum!=undefined){
          val.total_sum = (Number(val.total_sum) * 0.01).toFixed(2)
        }
      })
    }
  }
  // 后台0,1状态展示
  export function exchangeData(origindata) {
    if(!(origindata instanceof Array)){
      if(origindata.checked!=undefined){
        if (origindata.checked === 1) {
          origindata.checked = '未审核'
        } else if (origindata.checked === 2) {
          origindata.checked = '已审核'
        } else if (origindata.checked === 3){
          origindata.checked = '已完成'
        }
      }
      if(origindata.total_sum!=undefined){
        origindata.total_sum = (Number(origindata.total_sum) * 0.01).toFixed(2)
      }
    }else{
      $.each(origindata, function (index, val) {
        if (val.checked !== undefined) {
          if (val.checked === 1) {
            val.checked = '未审核'
          } else if (val.checked === 2) {
            val.checked = '已审核'
          } else if(val.checked === 3){
            val.checked = '已完成'
          }
        }
        if (val.receipt_status !== undefined) {
          if (val.receipt_status === 0) {
            val.receipt_status = '未处理'
          } else {
            val.receipt_status = '已处理'
          }
        }
        if (val.status !== undefined) {
          if (val.status === 0) {
            val.status = '关闭'
          } else {
            val.status = '开启'
          }
        }
        if (val.product_type !== undefined) {
          switch (val.product_type) {
            case 1:
              val.product_type ="工厂产成品"
              break
            case 2:
              val.product_type =" 原材料"
              break
            case 3:
              val.product_type =" 门店产成品"
              break
          }
          switch (val.sell_type){
            case 1:
              val.sell_type = '可议价商品'
              break
            case 2:
              val.sell_type = '特价商品'
              break
            case 3:
              val.sell_type = '非议价商品'
              break
            case 4:
              val.sell_type = '非卖品'
              break
          }
          switch (val.sell_status){
            case 0:
              val.sell_status = '下架中'
              break
            case 1:
              val.sell_status = '上架中'
              break
          }
        }
        if(val.total_sum!=undefined){
          val.total_sum = (Number(val.total_sum) * 0.01).toFixed(2)
        }
      })
    }
  }
  // 引用原始数据和添加商品之间相互转换
  export function detailGoodsInfo (list,type) {
    $.each(list,function(index,val){
      val.item_code = val.code ? val.code : val.item_code
      val.item_name = val.name ? val.name : val.item_name
      val.unit_name = val.production_unit_name ? val.production_unit_name : val.unit_name
      val.unit_specification = val.specification_unit ? val.specification_unit : val.unit_specification
      val.stock = val.stock
      val.required_amount = 0
      val.refence_number = ''
      val.reference_type =  type
    })
  }
  // 导出token,门店账号,系统账号
  export { token}
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
        if(err.status === 401){
          window.location.href = '?#!/admin/login'
        }
      })
  }
  // 删除按钮请求方法
  export function deleteRequest (url,callback) {
    var cur = new Vue()
    cur.$http({
        url: url,
        method: 'delete',
        headers: {'X-Overpowered-Token': token}
      })
      .then(function (response) {
        callback && callback(response)
      }, function (err) {
        console.log(err)
      })
  }
  // 审核按钮请求方法
  export function checkRequest (url,callback,error) {
    var cur = new Vue()
    cur.$http({
        url: url,
        method: 'put',
        headers: {'X-Overpowered-Token': token}
      })
      .then(function (response) {
        callback && callback(response)
      }, function (err) {
        error && error(err)
        console.log(err)
      })
  }
  // 完成按钮请求方法
  export function finishRequest (url,callback,error) {
    var cur = new Vue()
    cur.$http({
        url:  url,
        method: 'put',
        headers: {'X-Overpowered-Token': token}
      })
      .then(function (response) {
        callback && callback(response)
      }, function (err) {
        console.log(err)
        error  &&  error()
      })
  }
  // 后端获取数据的方法
  export function  getDataFromApi(url, data, callback,error) {
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
        if(err.status === 401){
          window.location.href = '?#!/admin/login'
        }
        if(err.status === 403){
          window.history.back()
          window.alert("你没得权限操作")
        }
        error && error(err)
      })
  }
  // 前端获取数据的方法
  export function  getDataFromSiteApi(url, data, callback,error) {
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
        if(err.status === 401){
          window.location.href = '?#!/site/login'
        }
        if(err.status === 403){
          window.history.back()
          window.alert("你没得权限操作")
          console.log(ErrorTip)
        }
        error && error(err)
      })
  }
  //  post提交数据的方法
  export function  postDataToApi (url, data, callback, error) {
    var cur = new Vue()
    cur.$http({
        url: url,
        method: 'post',
        data: data,
        headers: {'X-Overpowered-Token': token}
      })
      .then(function (response) {
        callback && callback(response)
      }, function (err) {
        console.log(err)
        error && error(err)
      })
  }
  // 前台post提交方法
  export function  postSiteDataToApi (url, data, callback, error) {
    var cur = new Vue()
    cur.$http({
        url: url,
        method: 'post',
        data: data,
        headers: {'X-Overpowered-Token': token}
      })
      .then(function (response) {
        callback && callback(response)
      }, function (err) {
        console.log(err)
        error && error(err)
      })
  }
  //  put提交数据的方法
  export function  putDataToApi (url, data, callback, callbackErr) {
    var cur = new Vue()
    cur.$http({
        url: url,
        method: 'put',
        headers: {'X-Overpowered-Token': token},
        data: data
      })
      .then(function (response) {
        callback && callback(response)
      }, function (err) {
        callbackErr && callbackErr(err)
        console.log(err)
      })
  }
  //  对象为null的方法
  export function  detailNull (val) {
    for(var key in val){
      if(val[key]==null){
        val[key] = ''
      }
    }
  }
  // 前后台错误代码验证方法
  export function error(err) {
    if (err.status === 401) {
      if(window.location.href.indexOf('admin')>=0){
        window.location.href = '/#!/admin/login'
      }else{
        window.location.href = '/#!/site/login'
      }
    }
    // if (err.data.code == '100000') {
    //   //请求失败，参数存在错误或请求格式存在问题
    // }
    // if (err.data.code == '100001') {
    //   alert('请求方法不符合对应的资源或该方法被拒绝')
    //   //请求方法不符合对应的资源或该方法被拒绝
    // }
    // if (err.data.code == '100008') {
    //   //请求中提供的实体超出限制，请检查上传数据的长度，进行必要的压缩
    // }
    // if (err.data.code == '110003') {
    //   //被拒绝的请求，该操作未授权
    // }
    // if (err.data.code == '120000') {
    //   //请求的资源未找到
    // }
    // if (err.data.code == '900000') {
    //   //服务器遇到未知错误
    // }
    // if (err.data.code == '900001') {
    //   //服务器正在维护，暂时无法提供支持
    // }
  }
  // 后台登录方法
  export function adminLogin(loginUrl,data, callback){
    token = null
    var cur = new Vue()
    var authorityModule = {
      setting: [],
      purchase: [],
      stock: [],
      product: [],
      retail: [],
      member: []
    }
    var curRouter = []
    cur.$http.post(loginUrl,data).then(function(response){
      var curtoken = response.headers('X-Overpowered-Token-Set')
      window.localStorage.setItem('token', curtoken)
      token =  window.localStorage.getItem('token')
      getDataFromApi(requestSystemUrl + '/backend-system/auth/info',{},function(response){
        window.localStorage.setItem('systermAccount', response.data.body.account)
        window.localStorage.setItem('systermName', response.data.body.name)
        window.localStorage.setItem('systermAuthority',JSON.stringify(response.data.body.permissions))
        systermName = window.localStorage.getItem('systermName')
        systermAccount = window.localStorage.getItem('systermAccount')
        systermAuthority = window.localStorage.getItem('systermAuthority')
        //         商品设置权限
        if(systermAuthority.indexOf('goods-setting-list')>-1){
          authorityModule.setting.push('commodity')
        }
        if(systermAuthority.indexOf('goods-category-list')>-1){
          authorityModule.setting.push('category')
        }
        if(systermAuthority.indexOf('discount-setting-list')>-1){
          authorityModule.setting.push('coupon')
        }
        if(systermAuthority.indexOf('cooperation-setting-list')>-1){
          authorityModule.setting.push('partner')
        }
        if(systermAuthority.indexOf('store-account-list')>-1){
          authorityModule.setting.push('userAccount')
        }
        if(systermAuthority.indexOf('manage-account-list')>-1){
          authorityModule.setting.push('adminAccount')
        }
//        采购权限处理
        if(systermAuthority.indexOf('purchase-order-list')>-1){
          authorityModule.purchase.push('order')
        }
        if(systermAuthority.indexOf('purchase-receipt-list')>-1){
          authorityModule.purchase.push('delivery')
        }
//         库存权限处理
        if(systermAuthority.indexOf("stock-look-list")>-1){
          authorityModule.stock.push('query')
        }
        if(systermAuthority.indexOf("stock-check-list")>-1){
          authorityModule.stock.push('inventory')
        }
        if(systermAuthority.indexOf("stock-difference-list")>-1){
          authorityModule.stock.push('difference')
        }
        if(systermAuthority.indexOf("distribution-out-list")>-1){
          authorityModule.stock.push('dispatching')
        }
        if(systermAuthority.indexOf("sale-out-list")>-1){
          authorityModule.stock.push('sale')
        }
        if(systermAuthority.indexOf("produce-out-list")>-1){
          authorityModule.stock.push('production')
        }
        if(systermAuthority.indexOf("requisition-total-list")>-1){
          authorityModule.stock.push('apply')
        }
//      生产权限处理
        if(systermAuthority.indexOf('factory-produce-list') > -1){
          authorityModule.product.push('factoryProduction')
        }
        if(systermAuthority.indexOf('outsource-produce-list') > -1){
          authorityModule.product.push('delegationCreat')
        }
        if(systermAuthority.indexOf('pick-total-list') > -1){
          authorityModule.product.push('getSupplies')
        }
        if(systermAuthority.indexOf('factory-produce-in-list') > -1){
          authorityModule.product.push('factoryInstock')
        }
        if(systermAuthority.indexOf('outsource-produce-in-list') > -1){
          authorityModule.product.push('delegationInstock')
        }
        if(systermAuthority.indexOf('produce-appointment-list') > -1){
          authorityModule.product.push('creatOrder')
        }
//        零售权限
        if(systermAuthority.indexOf('settlement-total-list')>-1){
          authorityModule.retail.push('statistics')
        }
        if(systermAuthority.indexOf('settlement-administration-list')>-1){
          authorityModule.retail.push('manage')
        }
        //大类权限
        if(systermAuthority.indexOf('setting')>-1){
          curRouter.push('setting/'+ authorityModule.setting[0])
        }
        if(systermAuthority.indexOf('purchase')>-1){
          curRouter.push('purchase/'+  authorityModule.purchase[0])
        }
        if(systermAuthority.indexOf('warehouse')>-1) {
          curRouter.push('instock/' +  authorityModule.stock[0])
        }
        if(systermAuthority.indexOf('production')>-1){
          curRouter.push('production/'+  authorityModule.product[0])
        }
        if(systermAuthority.indexOf('sale')>-1){
          curRouter.push('retail/'+  authorityModule.retail[0])
        }
        if(systermAuthority.indexOf('member')>-1) {
          curRouter.push('member')
        }
        if(curRouter.length===0){
          window.alert("你没有任何权限访问")
          window.location.href = '#!/admin/login'
        }else {
          window.location.href = '#!/admin/' + curRouter[0]
        }
      })
    },function(err){
      callback && callback(err)
      console.log(err)
    })
  }
  //前台登录方法
  export function siteLogin(loginUrl,data,callback){
    token = null
    var cur = new Vue()
    cur.$http.post(loginUrl,data).then(function(response){
      var curtoken = response.headers('X-Overpowered-Token-Set')
      window.localStorage.setItem('token', curtoken)
      token =  window.localStorage.getItem('token')
      getDataFromSiteApi(requestSystemUrl + '/front-system/auth/info',{},function(response){
        window.localStorage.setItem('storeName', response.data.body.name)
        window.localStorage.setItem('storeAccount', response.data.body.account)
        window.localStorage.setItem('storeInfo', response.data.body.store_name)
        window.localStorage.setItem('storeAuthority', response.data.body.level)
        storeName = window.localStorage.getItem('storeName')
        storeAccount = window.localStorage.getItem('storeAccount')
        storeInfo = window.localStorage.getItem('storeInfo')
        storeAuthority = window.localStorage.getItem('storeAuthority')
        if(storeAuthority.indexOf('0') > -1){
          window.location.href = '#!/site/billing'
        } else{
          window.location.href = '#!/site/order'
        }
      })
    },function(err){
      callback && callback(err)
      console.log(err)
    })
  }
  //  获取当前时间点的函数
  export function getTimeOnNow() {
    var time = new Date()
    var currentTime = ''
    var year = detailTime(time.getFullYear())
    var month = detailTime(time.getMonth() + 1)
    var date  = detailTime(time.getDate())
    var hour =  detailTime(time.getHours())
    var mimute = detailTime(time.getMinutes())
    var second = detailTime(time.getSeconds())
    currentTime = year + '-' + month + '-' + date + ' ' + hour + ':' + mimute + ':' + second
    return currentTime
  }
  // 处理数字小于十的问题
  function detailTime (value) {
    if(value < 10) {
      value = Number('0'+ value)
    }else{
      value = value
    }
    return value
  }
  export var currentTime = getTimeOnNow()
