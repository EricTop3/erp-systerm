<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-setting></left-setting>
      <div class="col-lg-10">
      <!-- 路径导航 -->
      <ol class="breadcrumb">
        <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：设置首页</li>
        <li class="active">门店账号</li>
      </ol>
      <!-- 页头 -->
      <div class="page-header">
        <form class="form-inline">
          <div class="form-group">
            <label>门店名称</label>
            <select class="form-control" v-model="storeName">
              <option value="">请选择</option>
              <option v-for="item in storeList" track-by="$index" :value="item.code">{{item.display_name}}</option>
            </select>
          </div>
          <div class="form-group ml10">
            <label>状态</label>
            <select class="form-control" v-model="storeStatus">
              <option value="">请选择</option>
              <option value="0">关闭中</option>
              <option value="1">开启中</option>
            </select>
          </div>
          <div class="form-group ml10">
            <label>店员名称</label>
            <input type="text" class="form-control" placeholder="请输入店员名称" v-model="clerkName">
          </div>
          <button type="submit" class="btn btn-primary" @click="search">搜索</button>
          <span class="btn btn-warning" @click="cancelSearch">撤销搜索</span>
          <span class="btn btn-info spanblocks fr" data-toggle="modal" data-target="#person-add-templ" @click="addClerk">新增店员</span>
          <span class="btn btn-info spanblocks fr mr10"  data-toggle="modal" data-target="#account-add-templ" @click="addStore">新增门店</span>
        </form>
      </div>
        <!--账户列表-->
      <grid :data="accountList" :operate="true" :columns="accountHeader">
        <div slot="operateList">
          <span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#person-edit-templ" @click="editClerk($event)">编辑</span>
        </div>
      </grid>
        <!-- 翻页 -->
        <page :total='page.total' :current.sync='page.current_page' :display='page.per_page'
              :last-page='page.last_page' v-if="accountList.length>0"></page>
    </div>
    </div>
  </div>
  <!--新增门店-->
  <modal :show.sync="modal.addStoreModal" :modal-size="modal.addStoreModalSize"  class="form-horizontal">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" @click="modal.addStoreModal=false">&times;</span></button>
      <h4 class="modal-title">新增门店</h4>
    </div>
    <div slot="body">
      <div class="form-group">
        <label for="" class="col-sm-4 control-label">门店编号</label>
        <div class="col-sm-8"><input type="text" class="form-control" v-model="store.storeCode" @blur="checkStoreCode"></div>
      </div>
      <div class="form-group">
        <label for="" class="col-sm-4 control-label">门店名：</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" placeholder="用户名一经设置不可修改和删除" v-model="store.storeName">
        </div>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="modal.addStoreModal=false">取消</button>
      <button type="button" class="btn btn-primary" @click="addStoreConfirm">提交</button>
    </div>
  </modal>
  <!--新增店员-->
  <modal :show.sync="modal.addClerkModal" :modal-size="modal.addClerkModalSize"  class="form-horizontal">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" @click="modal.addClerkModal=false">&times;</span></button>
      <h4 class="modal-title">新增店员</h4>
    </div>
    <div slot="body">
      <div class="form-group">
        <label for="" class="col-sm-4 control-label">门店名称</label>
        <div class="col-sm-8">
          <select v-model="storeName">
            <option v-for="item in storeList" track-by="$index" :value="item.id">{{item.display_name}}</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label for="" class="col-sm-4 control-label">店员名称</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" placeholder="" v-model="clerk.account">
        </div>
      </div>
      <div class="form-group">
        <label for="" class="col-sm-4 control-label">登录名</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" placeholder="" v-model="clerk.name">
        </div>
      </div>
      <div class="form-group">
        <label for="" class="col-sm-4 control-label">密码</label>
        <div class="col-sm-8">
          <input type="password" class="form-control" placeholder="" v-model="clerk.password">
        </div>
      </div>
      <div class="form-group">
        <label for="" class="col-sm-4 control-label">状态</label>
        <div class="col-sm-8" class="statusChoose" style="height: 34px;line-height: 34px;">
          <label style="margin-right: 20px;"><input type="radio" placeholder="" name="status" value="0" checked v-model="clerk.status">关闭</label>
          <label><input type="radio" placeholder="" name="status" value="1"  v-model="clerk.status">开启</label>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="addClerkConfirm">确定</button>
    </div>
  </modal>
  <!--编辑-->
  <modal :show.sync="modal.editModal" :modal-size="modal.editModalSize"  class="form-horizontal">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" @click="modal.editModal=false">&times;</span></button>
      <h4 class="modal-title">编辑店员</h4>
    </div>
    <div slot="body">
      <div class="form-group">
        <label for="" class="col-sm-4 control-label">门店名称</label>
        <div class="col-sm-8">
          <label for="" class="title">{{editClerkInfo.storeName}}</label>
        </div>
      </div>
    <div class="form-group">
      <label for="" class="col-sm-4 control-label">店员名称</label>
      <div class="col-sm-8">
        <input type="text" class="form-control" placeholder=""  value="王小二" v-model="editClerkInfo.account">
      </div>
    </div>
    <div class="form-group">
      <label for="" class="col-sm-4 control-label">登录名</label>
      <div class="col-sm-8">
        <label for="" class="title">{{editClerkInfo.name}}</label>
      </div>
    </div>
    <div class="form-group">
      <label for="" class="col-sm-4 control-label">密码</label>
      <div class="col-sm-8">
        <input type="password" class="form-control" placeholder="请填写密码"  v-model="editClerkInfo.password">
      </div>
    </div>
    <div class="form-group">
      <label for="" class="col-sm-4 control-label">状态</label>
      <div class="col-sm-8" class="statusChoose" style="height: 34px;line-height: 34px;">
        <label style="margin-right: 20px;"><input type="radio" placeholder="" name="editstatus" value="0" checked v-model="editClerkInfo.status">关闭</label>
        <label><input type="radio" placeholder="" name="editstatus" value="1"  v-model="editClerkInfo.status">开启</label>
      </div>
    </div>
      </div>
    <div slot="footer">
      <button type="button" class="btn" @click="editClerkConfirm" :class=" btn-waring ? canEdit : btn-primary">确定</button>
    </div>
    <!--错误信息-->
    <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
  </modal>
</template>
<script>
  import $ from 'jquery'
  import Modal from '../../common/Modal'
  import AdminNav from '../AdminNav'
  import LeftSetting from '../common/LeftSetting'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import ErrorTip from '../../common/ErrorTip'
  import {requestSystemUrl,getDataFromApi,postDataToApi, exchangeData,searchRequest,putDataToApi} from '../../../publicFunction/index'
  var accountId = 0
  export default{
    components:{
      AdminNav: AdminNav,
      LeftSetting: LeftSetting,
      Modal: Modal,
      Grid: Grid,
      Page: Page,
      ErrorTip: ErrorTip
    },
    events: {
      pagechange: function (currentpgae) {
        var data = {
          page:  currentpgae
        }
        this.getAccountName(data)
      },
    },
    ready: function () {
//    获取门店名称
      this.getstoreName()
//      获取账户名称
      this.getAccountName({})
    },
    methods:{
//      获取门店名称
      getstoreName: function () {
        var self = this
        var storeUrl = requestSystemUrl + '/backend-system/store/store'
        getDataFromApi(storeUrl,{},function(response){
          self.storeList = response.data.body.list
        })
      },
//      获取账户名称
      getAccountName: function (data) {
        var self = this
        var accountUrl = requestSystemUrl + '/backend-system/store/store-account'
        getDataFromApi(accountUrl,data,function(response){
          self.accountList = response.data.body.list
          self.page =response.data.body.pagination
          exchangeData(self.accountList)
        })
      },
//   新增门店
      addStore: function () {
        this.modal.addStoreModal = true
        this.store = {
          storeCode: '',
          storeName: ''
        }
      },
//     新增门店
      addStoreConfirm: function () {
        var self = this
        var addStoreUrl=requestSystemUrl + '/backend-system/store/store'
        var data = {
          code: this.store.storeCode,
          display_name: this.store.storeName
        }
        postDataToApi(addStoreUrl,data,function(response){
          self.getstoreName({})
          self.modal.addStoreModal  = false
        })
      },
//     检查门店编号
      checkStoreCode: function () {
      },
//      新增店员
      addClerk: function () {
        this.modal.addClerkModal = true
        this.clerk = {
          account: '',
            name: '',
            password: '',
            status: 0,
        }
      },
//      确定新增店员
      addClerkConfirm: function () {
        var self = this
        var addStoreUrl=requestSystemUrl + '/backend-system/store/store-account'
        var data = {
          store_id: Number(this.storeName),
          account: this.clerk.account,
          name: this.clerk.name,
          password: this.clerk.password,
          status: Number(this.clerk.status),
        }
        postDataToApi(addStoreUrl,data,function(response){
          self.getAccountName({})
          self.modal.addClerkModal  = false
        })
      },
//      编辑店员
      editClerk: function (event) {
        this.editClerkInfo= {
            storeName:'',
            account: '',
            name: '',
            password: '',
            status: 0,
        }
        var self = this
        accountId = Number($(event.currentTarget).parents('tr').attr('id'))
        self.getAccountName({})
        $.each(this.accountList,function(index,val){
          if(accountId ===val.id){
            self.editClerkInfo.account =val.account
            self.editClerkInfo.name =val.name
            self.editClerkInfo.status =val.status
            self.editClerkInfo.storeName =val.store_name
            if(self.editClerkInfo.status ==='开启'){
              self.editClerkInfo.status = 1
            }else{
              self.editClerkInfo.status = 0
            }
          }
        })
        this.modal.editModal = true
      },
//      确认编辑
      editClerkConfirm: function () {
        var self = this
        var data  = {
          name: this.editClerkInfo.name,
          password: this.editClerkInfo.password,
          status: this.editClerkInfo.status
        }
        putDataToApi(requestSystemUrl + '/backend-system/store/store-account/' + accountId,data,function(response){
          self.getAccountName({})
          self.modal.editModal  = false
        })
      },
//     搜索
      search: function () {
        var url = requestSystemUrl + '/backend-system/store/store-account'
        var self = this
        var data = {
          store_code: this.storeName,
          name:  this.clerkName,
          status: this.storeStatus
        }
        searchRequest(url,data,function(response){
          self.accountList = response.data.body.list
          exchangeData(self.accountList)
        })
      },
//     取消
      cancelSearch: function () {
        var url = requestSystemUrl + '/backend-system/store/store-account'
        var self = this
        var data = {}
        searchRequest(url,data,function(response){
          self.accountList = response.data.body.list
          exchangeData(self.accountList)
        })
      }
    },
    data: function () {
      return {
        storeName: '',
        storeStatus: '',
        clerkName: '',
        storeList: [],
        page: [],
        canEdit: false,
        currentStatus: 0,
        accountHeader:{
          store_code: '门店编号',
          store_name: '门店名称',
          account:'店员名称',
          name: '登录名',
          status: '账号状态'
        },
        accountList: [],
        store:{
          storeCode: '',
          storeName: ''
        },
        clerk: {
          account: '',
          name: '',
          password: '',
          status: 0,
        },
        editClerkInfo: {
          storeName:'',
          account: '',
          name: '',
          password: '',
          status: 0,
        },
        modal: {
          addStoreModal: false,
          addStoreModalSize: 'modal-sm',
          addClerkModal: false,
          addClerkModalSize: 'modal-sm',
          editModal: false,
          editModalSize:  'modal-sm',
          errModal: false,
          errInfo: ""
        }
      }
    }
  }
</script>
<style scoped>
  .statusChoose{
    width:200px;
    height: 34px;
    line-height: 34px;
    border:1px solid red;
  }
  .title{
    height: 34px;
    line-height: 34px;
  }
</style>
