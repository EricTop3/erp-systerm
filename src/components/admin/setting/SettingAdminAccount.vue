<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-2" role="navigation">
        <left-setting></left-setting>
      </div>
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
              <input type="text" class="form-control" placeholder="" v-model="searchData.name">
            </div>
            <div class="form-group ml10">
              <label>登录名</label>
              <input type="text" class="form-control" placeholder="" v-model="searchData.account">
            </div>
            <span class="btn btn-primary" @click="getlistdata()">搜索</span>
            <span class="btn btn-warning" @click="cancelSearch()">撤销搜索</span>
            <span class="btn btn-info spanblocks fr" @click="createModal=true">新建账号</span>
            <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10">导出</span></a>
          </form>
        </div>
        <!-- 表格 -->
        <grid :data="listdata" :columns="gridColumns" :operate="gridOperate">
          <div slot="operateList">
            <span class="btn btn-primary btn-sm" @click="edit($event)">编辑</span>
            <span class="btn btn-default btn-sm" @click="permission($event)">权限管理</span>
          </div>
        </grid>

        <!--分页-->
        <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
              :last-page="page.last_page">
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
      <form action="" method="post" class="form-inline">
        <label><input type="checkbox" class="input-group">设置</label>
        <label class="ml10"><input type="checkbox" class="input-group">采购</label>
        <label class="ml10"><input type="checkbox" class="input-group">库存</label><br>
        <label><input type="checkbox" class="input-group">零售</label>
        <label class="ml10"><input type="checkbox" class="input-group">会员</label>
        <label class="ml10"><input type="checkbox" class="input-group">微商城</label>
        <label><input type="checkbox" class="input-group">生产</label>
      </form>
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
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-4 control-label">员工名称</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" placeholder="" v-model="postData.name">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">登录名</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" placeholder="用户名一经提交不可更改" v-model="postData.account">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">密码</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" placeholder="" v-model="postData.password">
          </div>
        </div>
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
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="createSubmit()">提交</button>
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
      <div class="form-group">
        <label class="col-sm-4 control-label">员工名称</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" v-model="formData.name">
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
          <input type="text" class="form-control" v-model="formData.password">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-4 control-label">状态</label>
        <div class="col-sm-8">
          <label class="radio-inline">
            <input type="radio" name="status" value="1" v-model="formData.status"> 开启
          </label>
          <label class="radio-inline">
            <input type="radio" name="status" value="0" v-model="formData.status"> 关闭
          </label>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="confirmEdit">保存</button>
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
    token,
    searchRequest,
    exchangeData,
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
    },
    computed: {
//      导出
      exports: function () {
        return this.exportUrl = requestSystemUrl + '/backend-system/stock/store/account/export-excel' + '?account='+ this.searchData.account + '&name=' + this.searchData.name
      }
    },
    methods: {
//      对获取到的数据进行处理
      modifyGetedData: function (data) {
        $.each(data, function (index, val) {
          switch (val.status) {
            case  1:
              val.status = '开启'
              break
            case  0:
              val.status = '关闭'
              break
          }
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
//      账号权限管理
      permission: function (event) {
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        this.PermissionModal = true
      },
      confirmPermission: function () {
      }
    },
    data: function () {
      return {
        exportUrl: '',
        PermissionModal: false,
        PermissionModalSize: 'modal-sm',
        createModal: false,
        createModalSize: 'modal-sm',
        editModal: false,
        editModalSize: 'modal-sm',
        thisId: '',
        formData: [],
        listdata: [],
        page: [],
        messageTipModal: false,
        messageTip: '该用户名已注册！',
        gridOperate: true,
        gridColumns: {
          name: '员工名称',
          account: '登录名',
          permissio: '权限',
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
