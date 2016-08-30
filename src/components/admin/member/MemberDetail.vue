<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="mt20">

      <!-- 表格 -->
      <table class="table table-striped table-border table-hover">
        <thead>
        <tr class="text-center">
          <td>会员卡号</td>
          <td>余额</td>
          <td>积分</td>
          <td>姓名</td>
          <td>手机号码</td>
          <td>生日</td>
          <td>等级</td>
          <td>开卡点</td>
          <td>状态</td>
          <td>操作</td>
        </tr>
        </thead>
        <tbody>
        <tr class="text-center">
          <td>{{onedata.card_number}}</td>
          <td>{{onedata.balance}}</td>
          <td>{{onedata.score}}</td>
          <td>{{onedata.name}}</td>
          <td>{{onedata.mobile_phone}}</td>
          <td>{{onedata.birthday}}</td>
          <td>{{onedata.member_type}}</td>
          <td>{{onedata.register_store_name}}</td>
          <td>{{onedata.status}}</td>
          <td>
            <span class="btn btn-info btn-sm" @click="changeModal=true">变更</span>
            <span class="btn btn-primary btn-sm" @click="edit()">编辑</span>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- 表格2 -->
      <grid :data="listdata" :columns="gridColumns" :operate="gridOperate"></grid>

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
              <option v-for="item in couponData" track-by="$index" :value="item.id">{{item.display_name}}</option>
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
      <span class="btn btn-primary" @click="confirmEdit()">提交</span>
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
//      获取优惠列表
      this.couponListData()
    },
    methods: {
//      获取列表
      getlistData: function (page) {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/backend-system/member/member/' + this.thisId
        var data = {
          page: page
        }
        getDataFromApi(url, data, function (response) {
          self.onedata = response.data.body.data
          self.modifyGetedOneData(self.onedata)

          self.listdata = response.data.body.list.data
          self.modifyGetedData(self.listdata)
          self.page = response.data.body.list.pagination
        })
      },
//      优惠类型列表获取 /backend-system/coupon/coupon
      couponListData: function () {
        var self = this
        var url = requestSystemUrl + '/backend-system/coupon/coupon'
        getDataFromApi(url, {}, function (response) {
          self.couponData = response.data.body.list
        })
      },
//      编辑会员
      edit: function () {
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


//    对获取到的单条数据进行处理
      modifyGetedOneData: function (value) {
        if(value.balance != ''){
          value.balance = '￥' + (value.balance * 0.01).toFixed(2)
        }
        if(value.status == '1'){
          value.status = '启用'
        }else if(value.status == '0'){
          value.status = '停用'
        }else{
          value.status =''
        }
      },
//    对获取到de列表数据进行处理
      modifyGetedData: function (data) {
        $.each(data, function (index, value) {
          if(value.balance != ''){
            value.balance = '￥' + (value.balance * 0.01).toFixed(2)
          }
          if(value.balance_change != ''){
            value.balance_change = '￥' + (value.balance_change * 0.01).toFixed(2)
          }
          switch(value.operate_type){
            case 1:
              value.point_type = '会员卡充值'
              break;
            case 5:
              value.point_type = 'erp管理系统变更'
              break;
            case 6:
              value.point_type = '退货退款'
              break;
            case 2:
              if(value.balance_change == 0){
                value.point_type = '订单交易'
              }else{
                value.point_type = '会员余额支付'
              }
              break;
          }

          switch(value.note){
            case 'alipay':
              value.note = '支付宝支付'
              break;
            case 'weixin':
              value.note = '微信支付'
              break;
            case 'pos':
              value.note = 'pos支付'
              break;
            case 'cash':
              value.note = '现金支付'
              break;
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
        couponData: [],
        editModal: false,
        editModalSize: 'modal-sm',
        noticeModal: false,
        noticeModalSize: 'modal-sm',
        changeModal: false,
        changeModalSize: 'modal-sm',
        thisId: '',
        formData: [],
        listdata: [],
        onedata: [],
        page: [],
        gridOperate: false,
        gridColumns: {
          point_type: '操作类型',
          balance_change: '余额变更',
          score_change: '积分变更',
          balance: '最新余额',
          score: '最新积分',
          created_at: '操作时间',
          point_name: '操作点',
          note: '备注'
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
