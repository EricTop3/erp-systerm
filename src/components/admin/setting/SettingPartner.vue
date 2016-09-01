<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <left-setting></left-setting>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：设置首页</li>
          <li class="active">合作方设置</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>编号</label>
              <input type="text" class="form-control" placeholder="请输入编号" @change='repeatCode()' v-model='searchData.code'>
            </div>
            <div class="form-group ml10">
              <label>公司全称</label>
              <input type="text" class="form-control" placeholder="请输入公司全称" v-model='searchData.name'>
            </div>
            <div class="form-group">
              <label>合作形式</label>
              <select class="form-control" v-model="searchData.type">
                <option value="">请选择</option>
                <option value="1">供应商</option>
                <option value="2">工厂</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary" @click="search()">搜索</button>
            <span class="btn btn-warning" @click="cancelSearch()">撤销搜索</span>
            <span class="btn btn-info spanblocks fr" @click="create()">新建合作方</span>
          </form>
        </div>

        <!-- 表格 -->
        <grid :data="listdata" :columns="gridColumns" :operate="gridOperate">
          <div slot="operateList">
            <list-delete :delete-data="listdata"></list-delete>
            <span class="btn btn-success btn-sm" @click="edit($event)">编辑</span>
            <span class="btn btn-default btn-sm" @click="view($event)">查看</span>
          </div>
        </grid>
        <!--分页-->
        <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
              :last-page="page.last_page" v-if="listdata.length > 0">
        </page>
      </div>
    </div>
  </div>

  <!--模态框-新建合作方-->
  <modal :show.sync="createModal" :modal-size="createModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="createModal=false"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">新建合作方</h4>
    </div>
    <div slot="body">
      <validator name="validation1">
        <form action="" method="post" class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-4 control-label">合作形式</label>
            <div class="col-sm-8">
              <select class="form-control" v-model="postData.type" v-validate:type="{required: true}">
                <option value="">请选择</option>
                <option value="1">供应商</option>
                <option value="2">合作工厂</option>
              </select>
              <div v-if="$validation1.type.touched">
                <p class="error" v-if="$validation1.type.required">请选择供应商或合作工厂</p>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">编号</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="必填且不可重复" v-model="postData.code"
                     v-validate:code="{required: true}" @change="repeatCode()">
              <div v-if="$validation1.code.touched">
                <p class="error" v-if="$validation1.code.required">这是必填项</p>
              </div>
              <div v-if="codeFlag"><p class="error">编号已存在！</p></div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">公司全称</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="必填且不可重复" v-model="postData.name"
                     v-validate:name="{required: true}" @change="repeatName()">
              <div v-if="$validation1.name.touched">
                <p class="error" v-if="$validation1.name.required">这是必填项</p>
              </div>
              <div v-if="nameFlag"><p class="error">公司名称已存在！</p></div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">纳税人识别码</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="选填" v-model="postData.taxpayer_identification">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">注册地址</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="选填" v-model="postData.register_address">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">注册电话</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="选填" v-model="postData.register_phone">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">开户银行</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="选填" v-model="postData.account_bank">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">联系人</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="选填" v-model="postData.contact_person">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">联系人手机</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="选填1" v-model="postData.contact_phone">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">详细地址</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="选填" v-model="postData.contact_address">
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

  <!--模态框-编辑合作方-->
  <modal :show.sync="editModal" :modal-size="editModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="editModal=false"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">编辑合作方</h4>
    </div>
    <div slot="body">
      <validator name="validation2">
        <form action="" method="post" class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-4 control-label">合作形式</label>
            <div class="col-sm-8">
              <select class="form-control" v-model="postData.type" v-validate:type="{required: true}">
                <option value="">请选择</option>
                <option value="1">供应商</option>
                <option value="2">合作工厂</option>
              </select>
              <div v-if="$validation2.type.touched">
                <p class="error" v-if="$validation2.type.required">请选择供应商或合作工厂</p>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">编号</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="必填且不可重复" v-model="postData.code"
                     v-validate:code="{required: true}" @change="repeatCode()">
              <div v-if="$validation2.code.touched">
                <p class="error" v-if="$validation2.code.required">这是必填项</p>
              </div>
              <div v-if="codeFlag"><p class="error">编号已存在！</p></div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">公司全称</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="必填且不可重复" v-model="postData.name"
                     v-validate:name="{required: true}" @change="repeatName()">
              <div v-if="$validation2.name.touched">
                <p class="error" v-if="$validation2.name.required">这是必填项</p>
              </div>
              <div v-if="nameFlag"><p class="error">公司名称已存在！</p></div>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">纳税人识别码</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="选填" v-model="postData.taxpayer_identification">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">注册地址</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="选填" v-model="postData.register_address">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">注册电话</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="选填" v-model="postData.register_phone">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">开户银行</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="选填" v-model="postData.account_bank">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">联系人</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="选填" v-model="postData.contact_person">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">联系人手机</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="选填" v-model="postData.contact_phone">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-4 control-label">详细地址</label>
            <div class="col-sm-8">
              <input type="text" class="form-control" placeholder="选填" v-model="postData.contact_address">
            </div>
          </div>
        </form>
      </validator>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="editonSubmit($event)">提交</button>
    </div>
  </modal>
  <!--模态框HTML-->

  <!--模态框-查看合作方-->
  <modal :show.sync="viewModal" :modal-size="viewModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="viewModal=false"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">查看合作方</h4>
    </div>
    <div slot="body">
      <form action="" method="post" class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-4 control-label">合作形式</label>
          <div class="col-sm-8">
            <p class="form-control-static">{{postData.type}}</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">编号</label>
          <div class="col-sm-8">
            <p class="form-control-static">{{postData.code}}</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">公司全称</label>
          <div class="col-sm-8">
            <p class="form-control-static">{{postData.name}}</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">纳税人识别码</label>
          <div class="col-sm-8">
            <p class="form-control-static">{{postData.taxpayer_identification}}</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">注册地址</label>
          <div class="col-sm-8">
            <p class="form-control-static">{{postData.register_address}}</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">注册电话</label>
          <div class="col-sm-8">
            <p class="form-control-static">{{postData.register_phone}}</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">开户银行</label>
          <div class="col-sm-8">
            <p class="form-control-static">{{postData.account_bank}} </p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">联系人</label>
          <div class="col-sm-8">
            <p class="form-control-static">{{postData.contact_person}}</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">联系人手机</label>
          <div class="col-sm-8">
            <p class="form-control-static">{{postData.contact_phone}}</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">详细地址</label>
          <div class="col-sm-8">
            <p class="form-control-static">{{postData.contact_address}}</p>
          </div>
        </div>
      </form>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="viewModal=false">关闭</button>
    </div>
  </modal>
  <!--模态框HTML-->
</template>

<style>
</style>
<script>
  import $ from 'jquery'
  import AdminNav from '../AdminNav'
  import LeftSetting from '../common/LeftSetting'
  import ListDelete from '../../common/ListDelete'
  import Grid from '../../common/Grid'
  import Modal from '../../common/Modal'
  import Page from '../../common/Page'
  import ErrorTip from '../../common/ErrorTip'
  import {
    requestUrl,
    requestSystemUrl,
    token,
    error,
    searchRequest,
    exchangeData,
    postDataToApi,
    getDataFromApi,
    deleteRequest
  } from '../../../publicFunction/index'
  export default{
    components: {
      AdminNav: AdminNav,
      LeftSetting: LeftSetting,
      Grid: Grid,
      Modal: Modal,
      Page: Page,
      ErrorTip: ErrorTip,
      ListDelete: ListDelete
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.getlistData(currentpage)
      },
//   确认删除
      delete: function (id) {
        console.log(id)
        var self = this
        deleteRequest(requestSystemUrl + '/backend-system/provider/provider/' + id, function (response) {
          self.getlistData(1)
        })
      }
    },
    ready: function () {
      this.getlistData(1)
    },
    methods: {
//      列表数据渲染
      getlistData: function (page) {
        var self = this
        var url = requestSystemUrl + '/backend-system/provider/provider'
        var data = {
          code: this.searchData.code || '',
          name: this.searchData.name || '',
          type: this.searchData.type || '',
          page: page || ''
        }
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
        })
      },
//     搜索
      search: function () {
        this.getlistData(1)
      },
//     取消
      cancelSearch: function () {
        this.searchData = {}
        this.getlistData(1)
      },
//      创建合作方
      create: function () {
        this.postData = {}
        this.postData.type = ''
        this.createModal = true
        // 表单验证提示消息
        this.codeFlag = false
        this.nameFlag = false
      },
//      创建合作方 点击提交按钮
      createSubmit: function () {
        var self = this
        var data = {
          type: this.postData.type,
          code: this.postData.code,
          name: this.postData.name,
          taxpayer_identification: this.postData.taxpayer_identification || '',
          register_address: this.postData.register_address || '',
          register_phone: this.postData.register_phone || '',
          account_bank: this.postData.account_bank || '',
          contact_person: this.postData.contact_person || '',
          contact_phone: this.postData.contact_phone || '',
          contact_address: this.postData.contact_address || ''
        }
        postDataToApi(requestUrl + '/backend-system/provider/provider', data, function (response) {
          self.createModal = false
          self.getlistData(1)
        })
      },
//      对获取到的数据进行处理
      modifyGetedData: function (data) {
        if (data.type == '供应商') {
          data.type = 1
        } else {
          data.type = 2
        }
      },
//      编辑账号
      edit: function (event) {
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        this.$http({
          url: requestUrl + '/backend-system/provider/provider/' + this.thisId,
          method: 'get',
          headers: {'X-Overpowered-Token': token},
        }).then(function (response) {
          this.postData = response.data.body
          this.modifyGetedData(this.postData)
          this.editModal = true
          // 表单验证提示消息
          this.codeFlag = false
          this.nameFlag = false
        }, function (err) {
          error(err)
        })
      },
//      编辑后保存
      confirmEdit: function () {
        this.$http({
          url: requestUrl + '/backend-system/provider/provider/' + this.thisId,
          method: 'put',
          data: {
            type: this.postData.type,
            code: this.postData.code,
            name: this.postData.name,
            taxpayer_identification: this.postData.taxpayer_identification || '',
            register_address: this.postData.register_address || '',
            register_phone: this.postData.register_phone || '',
            account_bank: this.postData.account_bank || '',
            contact_person: this.postData.contact_person || '',
            contact_phone: this.postData.contact_phone || '',
            contact_address: this.postData.contact_address || ''
          },
          headers: {'X-Overpowered-Token': token},
        }).then(function (response) {
          this.editModal = false
          this.getlistData(1)
        }, function (err) {
          error(err)
        })
      },
//      查看
      view: function (event) {
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        this.$http({
          url: requestUrl + '/backend-system/provider/provider/' + this.thisId,
          method: 'get',
          headers: {'X-Overpowered-Token': token},
        }).then(function (response) {
          this.postData = response.data.body
          this.viewModal = true
        }, function (err) {
          error(err)
        })
      },
//      表单验证
      onSubmit: function (e) {
        var self = this
        this.$validate(function () {
          if (self.$validation1.invalid) {
            self.$validation1.type.touched = true
            self.$validation1.code.touched = true
            self.$validation1.name.touched = true
            e.preventDefault()
          } else {
            if(!self.codeFlag && !self.nameFlag){
              self.createSubmit()
            }
          }
        })
      },
//      编辑保存表单验证
      editonSubmit: function (e) {
        var self = this
        this.$validate(function () {
          if (self.$validation2.invalid) {
            self.$validation2.type.touched = true
            self.$validation2.code.touched = true
            self.$validation2.name.touched = true
            e.preventDefault()
          } else {
            if(!self.codeFlag && !self.nameFlag){
              self.confirmEdit()
            }
          }
        })
      },
//      编号不能重复的验证
      repeatCode: function(){
        var self = this
        $.each(self.listdata,function(index,val){
          if(String((self.postData.code).trim()).toUpperCase() === String(val.code).toUpperCase()){
            self.codeFlag = true
            return false
          }else{
            self.codeFlag = false
          }
        })
      },
//      公司名称不能重复的验证
      repeatName: function(){
        var self = this
        $.each(self.listdata,function(index,val){
          if(String((self.postData.name).trim()).toUpperCase() === String(val.name).toUpperCase()){
            self.nameFlag = true
            return false
          }else{
            self.nameFlag = false
          }
        })

      }
    },
    data: function () {
      return {
        //code重复判断flag
        codeFlag: false,
        nameFlag: false,
        createModal: false,
        createModalSize: 'modal-sm',
        editModal: false,
        editModalSize: 'modal-sm',
        viewModal: false,
        viewModalSize: 'modal-sm',
        thisId: '',
        listdata: [],
        page: [],
        gridOperate: true,
        gridColumns: {
          code: '编号',
          type: '合作形式',
          name: '公司全称',
          contact_person: '联系人',
          contact_phone: '联系人手机',
          contact_address: '详细地址'
        },
        searchList: [],
        searchData: {
          code: '',
          name: '',
          type: ''
        },
        postData: {
          type: '',
          code: '',
          name: '',
          taxpayer_identification: '',
          register_address: '',
          register_phone: '',
          account_bank: '',
          contact_person: '',
          contact_phone: '',
          contact_address: ''
        }
      }
    }
  }
</script>
