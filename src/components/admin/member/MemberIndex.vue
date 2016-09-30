<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="mt20">
      <!-- 页头 -->
      <div class="page-header">
        <form class="form-inline">
          <div class="form-group">
            <label>会员卡号</label>
            <input class="form-control" placeholder="请输入会员卡号" v-model="searchData.card_number">
          </div>
          <div class="form-group">
            <label>会员姓名</label>
            <input class="form-control" placeholder="请输入姓名" v-model="searchData.name">
          </div>
          <div class="form-group">
            <label>会员手机</label>
            <input class="form-control" placeholder="请输入手机" v-model="searchData.phone">
          </div>
          <div class="form-group">
            <label>会员生日</label>
            <date-picker :value.sync="searchData.birthday" :time-text="timetext1"></date-picker>
          </div>
          <div class="form-group ml10">
            <label>开卡点</label>
            <select class="form-control"  v-model="searchData.register_store_id">
              <option value="">请选择</option>
              <option v-for="item in storeData" track-by="$index" :value="item.id">{{item.display_name}}</option>
            </select>
          </div>
          <span class="btn btn-primary" @click="getlistData(1)">搜索</span>
          <span class="btn btn-warning" @click=cancelSearch()>撤销搜索</span>
        </form>
      </div>

      <!-- 表格 -->
      <grid :data="listdata" :columns="gridColumns" :operate="gridOperate">
        <div slot="operateList">
          <span class="btn btn-info btn-sm" @click="change($event)">变更</span>
          <span class="btn btn-primary btn-sm" @click="edit($event)">编辑</span>
          <span class="btn btn-warning btn-sm" @click="view($event)">查看</span>
        </div>
      </grid>

      <!--分页-->
      <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
            :last-page="page.last_page" v-if="listdata.length > 0">
      </page>
    </div>
  </div>
  <!--模态框-编辑-->
  <modal :show.sync="editModal" :modal-size="editModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="editModal=false"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">会员编辑</h4>
    </div>
    <div slot="body">
      <form action="" method="post" class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-4 control-label">会员卡号</label>
          <div class="col-sm-8">
            <p class="form-control-static">{{formData.card_number}}</p>
          </div>
        </div>
        <div class="form-group">
          <label for="" class="col-sm-4 control-label">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" placeholder="" value="江小白" v-model="formData.name">
          </div>
        </div>
        <div class="form-group">
          <label for="" class="col-sm-4 control-label">手机号码</label>
          <div class="col-sm-8">
            <p class="form-control-static">{{formData.mobile_phone}}</p>
          </div>
        </div>
        <div class="form-group">
          <label for="" class="col-sm-4 control-label">微商城密码</label>
          <div class="col-sm-8">
            <input type="password" class="form-control" placeholder="登录密码，请谨慎填写！"  v-model="formData.password">
          </div>
        </div>
        <div class="form-group">
          <label for="" class="col-sm-4 control-label">生&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</label>
          <div class="col-sm-8">
            <date-picker :value.sync="formData.birthday"></date-picker>
          </div>
        </div>
        <div class="form-group">
          <label for="" class="col-sm-4 control-label">等&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级</label>
          <div class="col-sm-8">
            <select class="form-control"  v-model="formData.member_type_id">
              <option value="">请选择</option>
              <option v-for="item in couponData" track-by="$index" v-if="item.model=='Member'" :value="item.id">{{item.display_name}}</option>
            </select>
          </div>
        </div>
        <div class="form-group" >
          <label class="col-sm-4 control-label">状态</label>
          <div class="col-sm-8 radio">
            <label><input type="radio" name="status" value="1" checked v-model="formData.status">启用</label>
            <label><input type="radio" name="status" value="0" v-model="formData.status">停用</label>
          </div>
        </div>
      </form>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="confirmEdit()">提交</button>
    </div>
  </modal>
  <!--模态框HTML-->
  <!-- 模态框-变更 -->
  <modal :show.sync="changeModal" :modal-size="changeModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="changeModal=false"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">管理变更</h4>
    </div>
    <div slot="body">
      <form action="" method="post" class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-4 control-label">操作方式</label>
          <div class="col-sm-8">
            <select class="form-control" v-model="changeData.type" id="operateMode" @change="changeMode($event)">
              <option value="">请选择</option>
              <option value="score" data-id='1'>增加积分</option>
              <option value="score" data-id='2'>减少积分</option>
              <option value="balance" data-id='3'>增加余额</option>
              <option value="balance" data-id='4'>减少余额</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">变更数额</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" placeholder="" v-model="changeData.valueNum" @input="priceValidateA()">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-4 control-label">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" placeholder="" v-model="changeData.note">
          </div>
        </div>
      </form>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="confirmChange()">提交</button>
    </div>
  </modal>
  <!-- 模态框-变更 -->

  <!-- 模态框-ok -->
  <modal :show.sync="noticeModal" :modal-size="noticeModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="noticeModal=false"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">提示</h4>
    </div>
    <div slot="body">
      <h3 class="text-center">变更成功！</h3>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="confirmNotice()">提交</button>
    </div>
  </modal>
  <!-- 模态框-ok -->
</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import AdminNav from '../AdminNav'
  import Grid from '../../common/Grid'
  import Modal from '../../common/Modal'
  import Page from '../../common/Page'
  import DatePicker from '../../common/DatePicker'
  import ErrorTip from '../../common/ErrorTip'
  import {
    requestUrl,
    requestSystemUrl,
    getDataFromApi,
    token,
    searchRequest,
    exchangeData,
    putDataToApi,
    error
  } from '../../../publicFunction/index'
  export default{
    components: {
      AdminNav: AdminNav,
      Grid: Grid,
      Modal: Modal,
      Page: Page,
      DatePicker: DatePicker,
      ErrorTip: ErrorTip
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.getlistData(currentpage)
      }
    },
    ready: function () {
//      渲染会员列表
      this.getlistData(1)
//      门店列表
      this.storeListData()
//      优惠列表
      this.couponListData()
    },
    methods: {
//      获取列表
      getlistData: function (page) {
        var self = this
        var url = requestSystemUrl + '/backend-system/member/member'
        var data = {
          card_number: this.searchData.card_number || '',
          name: this.searchData.name || '',
          phone: this.searchData.phone || '',
          birthday: this.searchData.birthday || '',
          register_store_id: this.searchData.register_store_id || '',
          page: page || ''
        }
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
          self.modifyGetedData(self.listdata)
        })
      },
//      门店列表数据渲染
      storeListData: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/store/get/store'
        getDataFromApi(url, {}, function (response) {
          self.storeData = response.data.body.list
        })
      },
//      优惠类型列表获取 /backend-system/coupon/get/coupon
      couponListData: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/coupon/get/coupon'
        getDataFromApi(url, {}, function (response) {
          self.couponData = response.data.body.list
        })
      },
//      取消搜索
      cancelSearch: function () {
        this.searchData = {}
        this.getlistData(1)
      },
//      编辑会员
      edit: function (event) {
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        var self = this
        var url = requestSystemUrl + '/backend-system/member/member/' + this.thisId
        getDataFromApi(url, {}, function (response) {
          self.formData = response.data.body.data
          self.editModal = true
        })
      },
//      编辑后保存
      confirmEdit: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/member/member/' + this.thisId
        var data = {
          name: this.formData.name,
          password: this.formData.password,
          birthday: this.formData.birthday,
          member_type_id: this.formData.member_type_id,
          status: this.formData.status
        }
        putDataToApi(url,data,function (response) {
          self.editModal = false
          self.getlistData(1)
        })
      },
//      变更
      change: function (event) {
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        this.changeModal = true
      },
//      变更后保存
      confirmChange: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/member/member/update-info/' + this.thisId
        var data = {
          type: this.changeData.type,
          value: this.changeData.value,
          note: this.changeData.note
        }
        putDataToApi(url,data,function (response) {
          self.changeModal = false
          self.getlistData(1)
        })
      },
//      查看
      view: function (event) {
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        window.location.href = '/#!/admin/member/detail/' + this.thisId
      },
//    对获取到de列表数据进行处理
      modifyGetedData: function (data) {
        $.each(data, function (index, value) {
          if(value.balance != '' && value.balance > 0 ){
            value.balance = '￥' + (value.balance * 0.01).toFixed(2)
          }
          if(value.status == '0'){
            value.status = '停用'
          }else if(value.status == '1'){
            value.status = '启用'
          }else{
            value.status =''
          }
        })
      },
//    价格正则1
      priceValidateA: function () {
        var re = /^[-+]?\d+(\.\d+)?$/
        if (!re.test(this.changeData.valueNum)) {
          this.changeData.valueNum =  ''
        }else{
          var indexs = $("#operateMode option:selected").index()
          if(indexs == 2 || indexs == 4){
            this.changeData.value = (-1) * Number(this.changeData.valueNum)
          }else{
            this.changeData.value =this.changeData.valueNum
          }
        }
      },
//      改变方式
      changeMode: function (event) {
        var indexs = $("#operateMode option:selected").index()
        if(indexs == 2 || indexs == 4){
          this.changeData.value = (-1) * Number(this.changeData.valueNum)
        }else{
          this.changeData.value =this.changeData.valueNum
        }
      }
    },
    data: function () {
      return {
        timetext1: '请选择生日',
        couponData: [],
        storeData: [],
        editModal: false,
        editModalSize: 'modal-sm',
        noticeModal: false,
        noticeModalSize: 'modal-sm',
        changeModal: false,
        changeModalSize: 'modal-sm',
        thisId: '',
        formData: [],
        listdata: [],
        page: [],
        gridOperate: true,
        gridColumns: {
          card_number: '会员卡号',
          balance: '余额',
          score: '积分',
          name: '姓名',
          mobile_phone: '手机号码',
          birthday: '生日',
          member_type: '等级',
          register_store_name: '开卡点',
          status: '状态'
        },
        searchData: {
          card_number: '',
          name: '',
          phone: '',
          birthday: '',
          register_store_id: ''
        },
        changeData: {
          type: '',
          value: '',
          valueNum: '',
          note: ''
        }
      }
    }
  }
</script>
