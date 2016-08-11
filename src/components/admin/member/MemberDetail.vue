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
          <td>164643138431315</td>
          <td>￥2514.00</td>
          <td>2541656</td>
          <td>王小二</td>
          <td>13812345678</td>
          <td>03.01</td>
          <td>九折会员</td>
          <td>水星店</td>
          <td>启用</td>
          <td>
            <span class="btn btn-default" data-toggle="modal" data-target="#vip-change-templ">变更</span>
            <span class="btn btn-default" data-toggle="modal" data-target="#vip-edit-templ">编辑</span>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- 表格2 -->
      <table class="table table-striped table-border table-hover">
        <thead>
        <tr class="text-center">
          <td>操作类型</td>
          <td>余额变更</td>
          <td>积分变更</td>
          <td>最新余额</td>
          <td>最新积分</td>
          <td>操作时间</td>
          <td>操作点</td>
          <td>备注</td>
        </tr>
        </thead>
        <tbody>
        <tr class="text-center">
          <td>164643138431315</td>
          <td>￥2514.00</td>
          <td>2541656</td>
          <td>王小二</td>
          <td>13812345678</td>
          <td>03.01</td>
          <td>九折会员</td>
          <td>水星店</td>
        </tr>
        </tbody>
      </table>

      <!-- 翻页 -->
      <nav class="text-right">
        <ul class="pagination">
          <li><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>
          <li class="active"><a href="#">1</a></li>
          <li><a href="#">2</a></li>
          <li><a href="#">3</a></li>
          <li><a href="#">4</a></li>
          <li><a href="#">5</a></li>
          <li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>
        </ul>
      </nav>
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
    },
    methods: {
//      获取列表
      getlistData: function (page) {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/backend-system/member/member/' + this.thisId
        var data = {}
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
          self.modifyGetedData(self.listdata)
        })
      },
//      获取单条数据
      getOneData: function () {
        this.thisId = this.$route.params.queryId
        var self = this
        var url = requestSystemUrl + '/backend-system/member/member/' + this.thisId + '/detail'
        var data = {}
        getDataFromApi(url, data, function (response) {
          self.onedata = response.data.body
        })
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
