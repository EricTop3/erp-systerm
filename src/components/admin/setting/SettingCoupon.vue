<template>
  <admin-nav></admin-nav>

  <div class="container-fluid">
    <div class="row">
      <left-setting></left-setting>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：设置首页</li>
          <li class="active">优惠设置</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <span class="btn btn-info fr spanblocks" @click="createModal=true">新增促销</span>
          <div class="clearboth"></div>
        </div>

        <!-- 表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">促销名称</td>
            <td>促销规则</td>
            <td>开始时间</td>
            <td>结束时间</td>
            <td>操作</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center" v-for="item in listdata" :id="item.id">
            <td class="text-left">{{item.display_name}}</td>
            <td>
              <template v-if="item.type=='discount'">折扣 系数 {{item.value}}</template>
              <template v-if="item.type=='reduce'">减少 系数 {{item.condition}}减{{item.value}}</template>
            </td>
            <td>{{item.begin_time}}</td>
            <td>{{item.end_time}}</td>
            <td>
              <span class="btn btn-primary btn-sm" @click="edit($event)">编辑</span>
              <span v-if="item.model!='Member'" class="btn btn-warning btn-sm" @click="deletes($event)">删除</span>
            </td>
          </tr>
          </tbody>
        </table>
        <!--分页-->
        <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
              :last-page="page.last_page" v-if="listdata.length > 0">
        </page>
        <!-- 表格 -->

      </div>
    </div>
  </div>

  <!--模态框-新增促销-->
  <modal :show.sync="createModal" :modal-size="createModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="createModal=false"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">新增促销</h4>
    </div>
    <div slot="body">
      <validator name="validation1">
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-3 control-label">开始时间</label>
          <div class="col-sm-9">
            <date-picker :value.sync="addFormData.begin_time" :time-text="timetext1"></date-picker>
            <div v-if="flag1">
              <p class="error">这是必填字段</p>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="col-sm-3 control-label">结束时间</label>
          <div class="col-sm-9">
            <date-picker :value.sync="addFormData.end_time" :time-text="timetext2"></date-picker>
            <div v-if="flag2">
              <p class="error">这是必填字段</p>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">促销名称</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" placeholder="如：现金抵扣卷100元" v-model="addFormData.display_name">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">促销规则</label>
          <div class="col-sm-9 form-inline">
            <select class="form-control" style="width: 114px;" v-model="addFormData.type">
              <option value="">请选择</option>
              <option value="discount">折扣</option>
              <option value="reduce">减少</option>
            </select>
            <div style="float:right" v-if=" addFormData.type == 'reduce' ">满 <input type="text" class="form-control" placeholder="100" style="width: 50px;" v-model="addFormData.condition" v-validate:condition="[ 'required' ]">
              减 <input type="text" class="form-control" placeholder="30" style="width: 50px;" v-model="addFormData.value" v-validate:value="[ 'required' ]">
            </div>

            <input v-else type="text" class="form-control" placeholder="折扣率,如：0.8" style="width: 145px; float:right" v-model="addFormData.value" v-validate:value="[ 'required' ]">
            <div v-if="$validation1.value.touched">
              <p class="error" v-if="$validation1.value.required">这是必填字段</p>
              <p class="error" v-if="$validation1.condition.required">这是必填字段</p>
            </div>
          </div>
        </div>
      </form>
      </validator>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="onSubmit($event)">提交</button>
      <button type="button" class="btn btn-default" @click="createModal=false">取消</button>
    </div>
  </modal>
  <!--模态框HTML-->

  <!--模态框-编辑促销-->
  <modal :show.sync="editModal" :modal-size="editModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="editModal=false"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">新增促销</h4>
    </div>
    <div slot="body">
      <validator name="validation2">
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-3 control-label">开始时间</label>
          <div class="col-sm-9">
            <date-picker :value.sync="formData.begin_time" :time-text="timetext1"></date-picker>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">结束时间</label>
          <div class="col-sm-9">
            <date-picker :value.sync="formData.end_time" :time-text="timetext2"></date-picker>
          </div>
          <div v-if="flag2">
            <p class="error">这是必填字段</p>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">促销名称</label>
          <div class="col-sm-9">
            <input type="text" class="form-control" placeholder="如：现金抵扣卷100元" v-model="formData.display_name">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">促销规则</label>
          <div class="col-sm-9 form-inline">
            <select class="form-control" style="width: 114px;" v-model="formData.type">
              <option value="">请选择</option>
              <option value="discount">折扣</option>
              <option value="reduce">减少</option>
            </select>
            <div style="float:right" v-if=" formData.type == 'reduce' ">满 <input type="text" class="form-control" placeholder="100" style="width: 50px;" v-model="formData.condition" v-validate:condition="[ 'required' ]">
              减 <input type="text" class="form-control" placeholder="30" style="width: 50px;" v-model="formData.value" v-validate:value="[ 'required' ]">
            </div>
            <input v-else type="text" class="form-control" placeholder="折扣率,如：0.8" style="width: 145px; float:right" v-model="formData.value" v-validate:value="[ 'required' ]">
            <div v-if="$validation1.value.touched">
              <p class="error" v-if="$validation1.value.required">这是必填字段</p>
            </div>
          </div>
        </div>
      </form>

      </validator>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="EditonSubmit($event)">保存</button>
      <button type="button" class="btn btn-default" @click="editModal=false">取消</button>
    </div>
  </modal>
    <!--模态框HTML-->

  <!--模态框-删除-->
  <modal :show.sync="deleteModal" :modal-size="deleteModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="deleteModal=false"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">删除</h4>
    </div>
    <div slot="body">
      <h4>确认删除该促销吗？</h4>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="confirmDelete()">确定</button>
      <button type="button" class="btn btn-default" @click="deleteModal=false">取消</button>
    </div>
  </modal>
  <!--模态框HTML-->

</template>
<style>
  .timewidth {width: 225px !important;}
</style>
<script>
  import $ from 'jquery'
  import AdminNav from '../AdminNav'
  import LeftSetting from '../common/LeftSetting'
  import Grid from '../../common/Grid'
  import Modal from '../../common/Modal'
  import Page from '../../common/Page'
  import ErrorTip from '../../common/ErrorTip'
  import DatePicker from  '../../common/DatePicker'
  import {requestUrl, requestSystemUrl, token, searchRequest, exchangeData, error, putDataToApi, postDataToApi, getDataFromApi, deleteRequest} from '../../../publicFunction/index'
  export default{
    components: {
      AdminNav: AdminNav,
      LeftSetting: LeftSetting,
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
      this.getlistData(1)
    },
    methods: {
//      列表数据渲染
      getlistData: function (page) {
        var self = this
        var url = requestSystemUrl + '/backend-system/coupon/get/coupon'
        var data = {
          page: page || ''
        }
        getDataFromApi(url, data, function (response) {
          self.listdata = response.data.body.list
          self.page = response.data.body.pagination
        })
      },
//      编辑
      edit: function (event) {
        this.editModal = true
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
        var url = requestSystemUrl + '/backend-system/coupon/get/coupon/' +this.thisId
        var self = this
        getDataFromApi(url,{},function (response) {
          self.formData = response.data.body
        })
      },
//      保存编辑
      confirmEdit: function () {
        var url = requestSystemUrl + '/backend-system/coupon/get/coupon/' +this.thisId
        var data = {
          display_name: this.formData.display_name,
          type: this.formData.type,
          condition: this.formData.condition,
          value: this.formData.value,
          begin_time: this.formData.begin_time,
          end_time: this.formData.end_time
        }
        var self = this
        putDataToApi(url, data, function (response) {
          self.editModal = false
          self.getlistData(1)
        })
      },
//      删除
      deletes: function (event) {
        this.deleteModal = true
        this.thisId = Number($(event.currentTarget).parents('tr').attr('id'))
      },
//      确认删除
      confirmDelete: function () {
        var url = requestSystemUrl + '/backend-system/coupon/get/coupon/' + this.thisId
        var self = this
        deleteRequest(url,function (response) {
          self.deleteModal = false
          self.getlistData(1)
        })
      },
//      添加促销
      createSubmit: function () {
        var url = requestSystemUrl + '/backend-system/coupon/get/coupon'
        var data = {
          display_name: this.addFormData.display_name,
          type: this.addFormData.type,
          condition: this.addFormData.condition,
          value: this.addFormData.value,
          begin_time: this.addFormData.begin_time,
          end_time: this.addFormData.end_time
        }
        var self = this
        if(self.addFormData.begin_time != '' && self.addFormData.end_time != ''){
          postDataToApi(url,data,function (response) {
            self.createModal = false
            self.getlistData(1)
            self.addFormData = {}
          })
        }else {
          if(self.addFormData.begin_time == ''){
            self.flag1 = true
          }
          if(self.addFormData.end_time == '') {
            self.flag2 = true
          }
        }
      },
//      表单验证
      onSubmit: function (e) {
        var self = this
        this.$validate(function () {
          if (self.$validation1.invalid) {
            console.log(self.$validation1.invalid)
            self.$validation1.value.touched = true
            self.$validation1.condition.touched = true
            e.preventDefault()
          } else {
            console.log(self.$validation1.invalid)
            self.createSubmit()
          }
        })
      },
//      编辑保存的表单验证
      EditonSubmit: function (e) {
        var self = this
        this.$validate(function () {
          if (self.$validation2.invalid) {
            console.log(self.$validation2.invalid)
            self.$validation2.value.touched = true
            e.preventDefault()
          } else {
            console.log(self.$validation2.invalid)
            self.confirmEdit()
          }
        })
      }
    },
    data: function () {
      return {
        flag1: false,
        flag2: false,
        timewidth: 'timewidth',
        timetext1: '开始时间',
        timetext2: '结束时间',
        createModal: false,
        createModalSize: 'modal-sm',
        editModal: false,
        editModalSize: 'modal-sm',
        deleteModal: false,
        deleteModalSize: 'modal-sm',
        thisId: '',
        listdata: [],
        page: [],
        formData: {
          display_name: '',
          type: '',
          condition: '',
          value: '',
          begin_time: '',
          end_time: ''
        },
        addFormData: {
          display_name: '',
          type: '',
          condition: '',
          value: '',
          begin_time: '',
          end_time: ''
        }
      }
    }
  }
</script>
