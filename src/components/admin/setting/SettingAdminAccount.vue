<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <left-setting></left-setting>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：设置首页</li>
          <li class="active">系统账号</li>
        </ol>
        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>员工名</label>
              <input type="text" class="form-control" placeholder="请输入员工名" v-model="searchData.name">
            </div>
            <div class="form-group ml10">
              <label>登录名</label>
              <input type="text" class="form-control" placeholder="请输入用户名" v-model="searchData.account">
            </div>
            <span class="btn btn-primary" @click="getlistData()">搜索</span>
            <span class="btn btn-warning" @click="cancelSearch()">撤销搜索</span>
            <span class="btn btn-info spanblocks fr" @click="createModal=true">新建账号</span>
          </form>
        </div>

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">员工名称</td>
            <td>登录名</td>
            <td>权限</td>
            <td>状态</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center" v-for="item in listdata" :id="item.id" track-by="$index">
            <td class="text-left">{{item.name}}</td>
            <td>{{item.account}}</td>
            <td><span v-for="entry in item.permissions" track-by="$index">{{entry}}</span></td>
            <td>{{item.status}}</td>
            <td>
              <span class="btn btn-primary btn-sm" @click="edit($event)">编辑</span>
              <span class="btn btn-default btn-sm" v-if="item.id != 1 &&  isHasGrant" @click="getPermission($event)">权限管理</span>

            </td>
          </tr>
          </tbody>
        </table>

        <!--分页-->
        <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
              :last-page="page.last_page" v-if="listdata.length > 0">
        </page>
      </div>
    </div>
  </div>

  <!--模态框-权限管理-->
  <modal :show.sync="PermissionModal" :modal-size="PermissionModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="PermissionModal=false"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">权限管理</h4>
    </div>
    <div slot="body">
      <form action="" method="post" class="form-inline" id="permissionsId">
        <template v-for="item in listPermissionData">
          <div class="form-group">
            <label class="checkbox-inline"><input type="checkbox" :value="item.value" @click="inputOne($event)"> <strong> {{item.display_name}}</strong></label>
            <template v-if="item.children">
            <label class="checkbox-inline" v-for="it in item.children"><input type="checkbox" :value="it.value" @click="inputTwo($event)"> {{it.display_name}}</label>
            </template>
          </div>
          <br>
        </template>
      </form>
      <div v-if="isflag"><p class="error">请勾选相应的权限选项</p></div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="confirmPermission()">确定</button>
    </div>
  </modal>
  <!--模态框HTML-->

  <!--模态框-新建账号-->
  <modal :show.sync="createModal" :modal-size="createModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="createModal=false"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">新建账号</h4>
    </div>
    <div slot="body">
      <validator name="validation1">
        <form class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-4 control-label">员工名称</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="" v-model="postData.name"
                     v-validate:name="[ 'required' ]">
              <div v-if="$validation1.name.touched">
                <p class="error" v-if="$validation1.name.required">员工名不能为空</p>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">登录名</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="用户名一经提交不可更改" v-model="postData.account"
                     v-validate:account="[ 'required' ]">
              <div v-if="$validation1.account.touched">
                <p class="error" v-if="$validation1.account.required">用户名不能为空</p>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">密码</label>
            <div class="col-sm-8">
              <input type="password" class="form-control" placeholder="" v-model="postData.password"
                     v-validate:password="[ 'required' ]">
              <div v-if="$validation1.password.touched">
                <p class="error" v-if="$validation1.password.required">密码不能为空</p>
              </div>
            </div>
          </div>
          <!--<div class="form-group">-->
          <!--<label class="col-sm-4 control-label">所属工厂</label>-->
          <!--<div class="col-sm-8">-->
          <!--<select class="form-control" v-model="postData.warehouse_id">-->
          <!--<option value="">请选择</option>-->
          <!--<option v-for="item in listProviderA" value="{{item.id}}">{{item.name}}-->
          <!--<option v-for="item in listProviderB" value="{{item.id}}">{{item.name}}-->
          <!--</select>-->
          <!--</div>-->
          <!--</div>-->
          <div class="form-group">
            <label class="col-sm-4 control-label">状态</label>
            <div class="col-sm-8">
              <label class="radio-inline">
                <input type="radio" name="status" value="1" v-model="postData.status" checked> 开启
              </label>
              <label class="radio-inline">
                <input type="radio" name="status" value="0" v-model="postData.status"> 关闭
              </label>
            </div>
          </div>
        </form>
      </validator>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="onSubmit($event)">提交</button>
    </div>
  </modal>
  <!--模态框HTML-->

  <!--模态框-编辑账号-->
  <modal :show.sync="editModal" :modal-size="editModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="editModal=false"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">编辑账号</h4>
    </div>
    <div slot="body" class="form-horizontal">
      <validator name="validation2">
        <div class="form-group">
          <label class="col-sm-4 control-label">员工名称</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" v-model="formData.name" v-validate:name="[ 'required' ]">
            <div v-if="$validation2.name.touched">
              <p class="error" v-if="$validation2.name.required">员工名不能为空</p>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">登录名</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" v-model="formData.account" disabled>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">密码</label>
          <div class="col-sm-8">
            <input type="password" class="form-control" v-model="formData.password">
          </div>
        </div>
        <!--<div class="form-group">-->
        <!--<label class="col-sm-4 control-label">所属工厂</label>-->
        <!--<div class="col-sm-8">-->
        <!--<input type="text" class="form-control" v-model="formData.warehouse_name" disabled>-->
        <!--</div>-->
        <!--</div>-->
        <div class="form-group">
          <label class="col-sm-4 control-label">状态</label>
          <div class="col-sm-8">
            <label class="radio-inline">
              <input type="radio" name="status" value="1" v-model="formData.status" checked> 开启
            </label>
            <label class="radio-inline">
              <input type="radio" name="status" value="0" v-model="formData.status"> 关闭
            </label>
          </div>
        </div>
      </validator>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="onSubmitEdit($event)">保存</button>
    </div>
  </modal>
  <!--模态框HTML-->

  <!--错误信息弹出-->
  <error-tip :err-modal.sync="messageTipModal" :err-info="messageTip"></error-tip>
</template>
<style>

</style>
<script>
  import $ from 'jquery'
  import AdminNav from '../AdminNav'
  import LeftSetting from '../common/LeftSetting'
  import Grid from '../../common/Grid'
  import Modal from '../../common/Modal'
  import Page from '../../common/Page'
  import ErrorTip from '../../common/ErrorTip'
  import {
    requestUrl,
    requestSystemUrl,
    getDataFromApi,
    systermAuthority,
    token,
    searchRequest,
    exchangeData,
    putDataToApi,
    error
  } from '../../../publicFunction/index'
  export default{
    components: {
      AdminNav: AdminNav,
      LeftSetting: LeftSetting,
      Grid: Grid,
      Modal: Modal,
      Page: Page,
      ErrorTip: ErrorTip
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.getlistData(currentpage)
      }
    },
    ready: function () {
      this.getlistData(1)
      this.getlistProviderA()
      this.getlistProviderB()
      if(systermAuthority.indexOf('grant')>-1){
        this.isHasGrant = true
      }
//      this.getPermission()
    },
    methods: {
//      获取生产车间名称 '/backend-system/provider/provider'   '/backend-system/store/store/warehouses-list'
      getlistProviderA: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/warehouse-minimal-list'
        var data = {
          type: 2
        }
        getDataFromApi(url, data, function (response) {
          self.listProviderA = response.data.body.list
        })
      },
      getlistProviderB: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/warehouse-minimal-list'
        var data = {
          type: 3
        }
        getDataFromApi(url, data, function (response) {
          self.listProviderB = response.data.body.list
        })
      },
//      对获取到的数据进行处理
      modifyGetedData: function (data) {
        var self = this
        $.each(data, function (index, val) {
          switch (val.status) {
            case  1:
              val.status = '开启'
              break
            case  0:
              val.status = '关闭'
              break
          }
          $.each(val.permissions, function (current, currentVal) {
            switch (currentVal) {
              case  'setting':
                val.permissions[current] = '设置 '
                break
              case  'purchase':
                val.permissions[current] = '采购 '
                break
              case  'warehouse':
                val.permissions[current] = '仓库 '
                break
              case  'production':
                val.permissions[current] = '生产 '
                break
              case  'sale':
                val.permissions[current] = '零售 '
                break
              case  'member':
                val.permissions[current] = '会员 '
                break
              case  'mini-mall':
                val.permissions[current] = '微商城 '
                break
              default:
                val.permissions[current] = ''
            }
          })
        })
      },
//      获取列表
      getlistData: function (page) {
        this.$http({
          url: requestUrl + '/backend-system/store/account',
          method: 'get',
          data: {
            name: this.searchData.name || '',
            account: this.searchData.account || '',
            page: page
          },
          headers: {'X-Overpowered-Token': token},
        }).then(function (response) {
          this.listdata = response.data.body.list
          this.page = response.data.body.pagination
          this.modifyGetedData(this.listdata)
        }, function (err) {
          error(err)
        })
      },
//      取消搜索
      cancelSearch: function () {
        this.searchData.name = ''
        this.searchData.account = ''
        this.getlistData(1)
      },
//      表单验证1
      onSubmit: function (e) {
        var self = this
        this.$validate(function () {
          if (self.$validation1.invalid) {
            self.$validation1.name.touched = true
            self.$validation1.account.touched = true
            self.$validation1.password.touched = true
            e.preventDefault()
          } else {
            self.createSubmit()
          }
        })
      },
//      表单验证2编辑
      onSubmitEdit: function (e) {
        var self = this
        this.$validate(function () {
          if (self.$validation2.invalid) {
            self.$validation2.name.touched = true
            e.preventDefault()
          } else {
            self.confirmEdit()
          }
        })
      },
//      新增账号
      createSubmit: function () {
        this.$http.post(
          requestUrl + '/backend-system/store/account',
          {
            account: this.postData.account,
            name: this.postData.name,
            password: this.postData.password,
            status: this.postData.status
          },
          {
            headers: {
              'X-Overpowered-Token': token
            }
          }
        ).then(function (response) {
          this.createModal = false
          this.getlistData(1)
          this.postData.account = ''
          this.postData.name = ''
          this.postData.password = ''
        }, function (err) {
          if (err.data.code == '100000') {
            this.createModal = false
            this.messageTipModal = true
          }
        })
      },
//      编辑账号
      edit: function (event) {
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        this.$http({
          url: requestUrl + '/backend-system/store/account/' + this.thisId,
          method: 'get',
          headers: {'X-Overpowered-Token': token},
        }).then(function (response) {
          this.formData = response.data.body
          this.editModal = true
        }, function (err) {
          error(err)
        })
      },
//      编辑后保存
      confirmEdit: function () {
        this.$http({
          url: requestUrl + '/backend-system/store/account/' + this.thisId,
          method: 'put',
          data: {
            name: this.formData.name,
            password: this.formData.password,
            status: this.formData.status
          },
          headers: {'X-Overpowered-Token': token},
        }).then(function (response) {
          this.editModal = false
          this.getlistData(1)
        }, function (err) {
          error(err)
        })
      },
//      获取所有权限列表
      getPermission: function (event) {
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        var self = this
        var url = requestSystemUrl + '/backend-system/permissions'
        var listPermissionDataBox = []
        getDataFromApi(url, {}, function (response) {
          self.listPermission = response.data.body.list
//          把对象转换成数组输出
          for (var i in self.listPermission) {
            var obj = {}
            obj['value'] = i
            obj['display_name'] = self.listPermission[i].display_name
//            children属性循环，转换成数组
            if (self.listPermission[i].children) {
              var childrenData = []
              for (var o in self.listPermission[i].children) {
                var childrenObj = {}
                childrenObj['value'] = o
                childrenObj['display_name'] = self.listPermission[i].children[o].display_name
                childrenData.push(childrenObj)
              }
              obj['children'] = childrenData
            }
            listPermissionDataBox.push(obj)
          }
          self.listPermissionData = listPermissionDataBox
          self.permission()
        }, function(err){

          if(err.data.code == '110003'){
            self.messageTipModal = true
            self.messageTip = '您的权限不够'
          }
        })
      },
//      一级checkbox方法
      inputOne: function(event){
//        判断是否为选中状态
        var isChecked = $(event.currentTarget).is(":checked")
        if(isChecked){
          $(event.currentTarget).parent(".checkbox-inline").siblings().find("input:checkbox").prop('checked', true)
        }else{
          $(event.currentTarget).parent(".checkbox-inline").siblings().find("input:checkbox").prop('checked', false)
        }
      },
//      二级checkbox方法
      inputTwo: function(event){
//        获取到所有的二级input:checkbox
        var all_checked = true
        var inputTwos = $(event.currentTarget).parents(".form-group").find("input:not(:first):checkbox") //除第一个checkbox
        for(var i = 0 ; i < inputTwos.length ; i ++ ){
          if(!$(inputTwos[i]).prop('checked')){
            all_checked = false
          }
        }
        $(event.currentTarget).parents(".form-group").find("input:checkbox:first").prop("checked",all_checked) //获取到当前组第一个checkbox
      },
//      账号权限管理(获取数据)
      permission: function () {
        var self = this
        this.PermissionModal = true
        this.isflag = false
        var url = requestSystemUrl + '/backend-system/store/account/' + this.thisId + '/permissions'

        getDataFromApi(url, {}, function (response) {
          self.permissionsData = response.data.body.list
          $("#permissionsId").find('input').prop('checked', false)
          $.each(self.listPermissionData, function (current, value) {
            if (value.children) {
              $.each(self.permissionsData, function (index, val) {
                if (value.value == val) {
                  $("#permissionsId").find('input:checkbox[value=' + val + ']').prop('checked',true)
                  $("#permissionsId").find('input:checkbox[value=' + val + ']').parents(".form-group").find("input:checkbox").prop('checked', true)
                }else{
                  $.each(value.children, function (childrenCurrent, childrenValue) {
//              再次循环比较返回来的值，看是否相等
                    $.each(self.permissionsData, function (indexs, vals) {
                      if (childrenValue.value == vals) {
                        $("#permissionsId").find('input:checkbox[value=' + vals + ']').prop('checked', true)
                      }
                    })
                  })
                }
              })
            }else{
//          循环比较返回来的值，看是否相等
              $.each(self.permissionsData, function (index, val) {
                if (value.value == val) {
                  $("#permissionsId").find('input:checkbox[value=' + val + ']').prop('checked', true)
                }
              })
            }
          })
        }, function (err) {
        })
      },
//      权限保存
      confirmPermission: function () {
        var url = requestSystemUrl + '/backend-system/store/account/' + this.thisId + '/permissions'
        var permissions = []
        $.each($("#permissionsId input:checked"), function () {
          permissions.push($(this).val())
        })
        var data = {
          permissions: permissions
        }
        var self = this
        if ($("#permissionsId input:checked").length > 0) {
          putDataToApi(url, data, function (response) {
            self.PermissionModal = false
            self.getlistData(1)
          }, function (err) {
          })
        } else {
          self.isflag = true
        }
      }
    },
    data: function () {
      return {
        isflag: false,
        isHasGrant: false,
        permissions: '',
        permissionsData: '',
        exportUrl: '',
        listPermission: {},
        listPermissionData: [],
        PermissionModal: false,
        PermissionModalSize: 'modal-lg',
        createModal: false,
        createModalSize: 'modal-sm',
        editModal: false,
        editModalSize: 'modal-sm',
        thisId: '',
        formData: [],
        listdata: [],
        listProviderA: [],
        listProviderB: [],
        page: [],
        messageTipModal: false,
        messageTip: '该用户名已注册！',
        gridOperate: true,
        gridColumns: {
          name: '员工名称',
          account: '登录名',
          permissions: '权限',
          status: '状态'
        },
        postData: {
          account: '',
          name: '',
          password: '',
          status: ''
        },
        searchData: {
          account: '',
          name: '',
        }
      }
    }
  }
</script>
