<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-production></left-production>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：生产首页</li>
          <li class="active">生产预约单</li>
        </ol>

        <!-- 页头 -->
        <div class="page-header">
          <form class="form-inline">
            <div class="form-group">
              <label>小票编号</label>
              <input type="text" class="form-control" placeholder="请输入单号" v-model="search.code">
            </div>
            <div class="form-group">
              <label>门店</label>
              <select class="form-control" v-model="search.selectStore">
                <option value="">请选择</option>
                <option :value="item.code" v-for="item in search.store">{{item.display_name}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>营业员</label>
              <select class="form-control" v-model="search.selectClerk">
                <option value="">请选择</option>
                <option :value="item.id" v-for="item in search.clerk">{{item.name}}</option>
              </select>
            </div>
            <div class="form-group ml10">
              <label>下单时间段</label>
              <date-picker :value.sync="time.startTime" :time-text="time.timeText"></date-picker> -
              <date-picker :value.sync="time.endTime"   :time-text="time.timeText"></date-picker>
            </div>

            <div class="form-group">
              <label>进度</label>
              <select class="form-control" v-model="search.selectProgress">
                <option value="">请选择</option>
                <option value="at00">已提交</option>
                <option value="ip00">生产中</option>
                <option value="sd00">门店配送中</option>
                <option value="gs00">等待签收</option>
                <option value="kd00">快递配送中</option>
                <option value="rm00">客户已签收</option>
                <option value="c000">订单取消</option>
                <option value="hr00">已退款</option>
              </select>
            </div>
            <span type="submit" class="btn btn-primary" @click="searchMethod">搜索</span>
            <span class="btn btn-warning" @click="cancelSearch">撤销搜索</span>
            <a :href="exports" target="_blank"><span class="btn btn-info spanblocks fr mr10">导出</span></a>
          </form>
        </div>
        <!--预约单列表-->
        <table class="table table-striped table-bordered table-hover">
        <thead>
        <tr class="text-center">
          <th v-for="value in gridColumns">
            {{value}}
          </th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr class="text-center" v-for="entry in orderList" track-by="$index" :id="[entry.id ? entry.id : '']">
          <td v-for="value in  gridColumns">
            {{entry[$key]}}
          </td>
          <td  :id="[entry.id ? entry.id : '']">
            <span class="btn btn-primary btn-sm"  @click="cancelOrder($event)" v-if="entry.status==='已提交'">取消订单</span>
            <span class="btn btn-info btn-sm"  @click="startProduct($event)" v-if="entry.status==='已提交'">开始生产</span>
            <span class="btn btn-primary btn-sm"  @click="distribution($event)" v-if="entry.status==='生产中'">配送</span>
            <span class="btn btn-primary btn-sm"  @click="finishOrder($event)" v-if="entry.status==='快递配送中'">客户签收</span>
            <span class="btn btn-info btn-sm"  @click="lookDetail($event)">查看</span>
          </td>
        </tr>
        </tbody>
        </table>
        <!-- 翻页 -->
        <page :total="page.total" :current.sync="page.current_page" :display="page.per_page" :last-page="page.last_page" v-if="orderList.length>0"></page>
      </div>
    </div>
    </div>
  <!--取消订单弹窗-->
  <modal :show.sync='modal.orderModal' :modal-size="modal.orderModalSize" class='form-horizontal'>
    <div slot='header'>
      <button type='button' class='close' data-dismiss='modal'  aria-label='Close'><span
        aria-hidden='true' @click="modal.orderModal=false">&times;</span></button>
      <h4 class='modal-title'>友情提示</h4>
    </div>
    <div slot='body'>
      <div class='form-group'>
        <p class="modal-body text-center">确定是否取消订单</p>
      </div>
    </div>
    <div slot='footer'>
      <button type='button' class='btn btn-primary' @click='confirmCancelOrder'>确定</button>
      <button type='button' class='btn btn-info' @click='modal.orderModal = false'>关闭</button>
    </div>
  </modal>
  <!--配送弹窗-->
  <modal :show.sync='modal.distributionModal' :modal-size="modal.distributionModalSize" class='form-horizontal'>
    <div slot='header'>
      <button type='button' class='close' data-dismiss='modal'  aria-label='Close'><span
        aria-hidden='true' @click="modal.distributionModal=false">&times;</span></button>
      <h4 class='modal-title text-center'>配送</h4>
    </div>
    <div slot='body'>
      <div class='form-group'>
        <form class="form-inline">
            <div class="text-center">
              <label for="toUser">
                <input type="radio" name="addr" id="toUser" v-model="distributionWay" value="kd00">
                配送至用户
              </label>
            </div>
            <div class="text-center">
              <label for="toShop">
                <input type="radio" name="addr" id="toShop" v-model="distributionWay" value="sd00">
                配送至门店</label>
            </div>
        </form>
      </div>
    </div>
    <div slot='footer'>
      <button type='button' class='btn btn-primary' @click='confirmdistribution'>确定</button>
      <button type='button' class='btn btn-info' @click='modal.distributionModal = false'>关闭</button>
    </div>
  </modal>
  <!--确定收货弹窗-->
  <modal :show.sync='modal.orderFinishModal' :modal-size="modal.orderFinishModalSize" class='form-horizontal'>
    <div slot='header'>
      <button type='button' class='close' data-dismiss='modal'  aria-label='Close'><span
        aria-hidden='true' @click="modal.orderFinishModal=false">&times;</span></button>
      <h4 class='modal-title'>友情提示</h4>
    </div>
    <div slot='body'>
      <div class='form-group'>
        <p class="modal-body text-center">客户确定已收货？</p>
      </div>
    </div>
    <div slot='footer'>
      <button type='button' class='btn btn-primary' @click='confirmFinishOrder'>确定</button>
      <button type='button' class='btn btn-info' @click='modal.orderFinishModal = false'>关闭</button>
    </div>
  </modal>

  <!--查看订单弹窗-->
  <modal :show.sync='modal.lookDetailModal' :modal-size="modal.lookDetailModalSize" class='form-horizontal'>
    <div slot='header'>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="modal.lookDetailModal=false"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">订单明细</h4>
    </div>
    <div slot='body'>
      <table class="table table-striped table-border table-hover">
        <thead>
        <tr class="text-center">
          <td>品名</td>
          <td>原单价</td>
          <td>零售单价</td>
          <td>销售数量</td>
          <td>退货数量</td>
          <td>小计</td>
          <td>议价备注</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in listDetail" class="text-center">
          <td>{{item.name}}</td>
          <td>{{item.old_price | priceChange}}</td>
          <td>{{item.new_price | priceChange}}</td>
          <td>{{item.amount }}</td>
          <td>{{item.return_number }}</td>
          <td>{{item.total_sum | priceChange}}</td>
          <td>{{ item.note==="" ? '无备注' : item.note }}</td>
        </tr>
        </tbody>
      </table>
      <div class="panel">
        <div class="panel-body">
          <p>优惠备注：{{note.coupon_note=== null ? '无备注' : note.coupon_note }}</p>

          <p>订单备注：{{note.order_note=== null ?  '无备注' : note.order_note }}</p>
        </div>
      </div>
    </div>
    <div slot='footer'></div>
  </modal>
  <!--库存不足跳转的提示-->
  <modal :show.sync='modal.skipModal' :modal-size="modal.skipModalSize" class='form-horizontal'>
    <div slot='header'>
      <button type='button' class='close' data-dismiss='modal'  aria-label='Close'><span
        aria-hidden='true' @click="errModal=false">&times;</span></button>
      <h4 class='modal-title'>友情提示</h4>
    </div>
    <div slot='body'>
      <div class='form-group' style="text-align: center">
        <p class="modal-body">{{modal.errInfo}}</p>
      </div>
    </div>

    <div slot='footer'>
      <button type='button' class='btn btn-primary' @click='skip'>关闭</button>
    </div>
  </modal>
</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import AdminNav from '../../AdminNav.vue'
  import leftProduction from '../../common/LeftProduction'
  import Modal from '../../../common/Modal'
  import Page from '../../../common/Page'
  import DatePicker from '../../../common/DatePicker'
  import {requestSystemUrl,getDataFromApi,putDataToApi,token} from '../../../../publicFunction/index'
  var orderId = 0
  var distributionId = 0
  var finishOrderId = 0
  export default{
    components:{
      AdminNav: AdminNav,
      leftProduction: leftProduction,
      Modal: Modal,
      Page: Page,
      DatePicker:DatePicker
    },
    events: {
      pagechange: function (currentpage) {
        this.getOrderList({page:currentpage})
      }
    },
    ready: function () {
      var self = this
//    获取门店列表
      getDataFromApi(requestSystemUrl + '/backend-system/store/get/store',{}, function (response) {
        self.search.store = response.data.body.list
      })
//    获取营业员
      getDataFromApi(requestSystemUrl + '/backend-system/store/get/store-account',{}, function (response) {
        self.search.clerk = response.data.body.list
      })
//    加载列表
     this.getOrderList({})
    },
    methods: {
//     获取列表方法
      getOrderList: function (data) {
        var self = this
        getDataFromApi(requestSystemUrl + '/backend-system/order/order',data,function (response) {
          self.orderList = response.data.body.list
          self.page =  response.data.body.pagination
          $.each(self.orderList,function (index,val) {
            val.total_sum = '￥' + (val.total_sum * 0.01).toFixed(2)
            switch (val.payment) {
              case  'cash':
                val.payment = '现金支付'
                break
              case 'alipay':
                val.payment = '支付宝支付'
                break
              case  'weixin':
                val.payment = '微信支付'
                break
              case 'pos':
                val.payment= 'pos支付'
                break
              case  'vip':
                val.payment = '会员卡余额支付'
                break
            }
            switch (val.status) {
              case  'at00':
                val.status = '已提交'
                break
              case 'ip00':
                val.status = '生产中'
                break
              case  'sd00':
                val.status = '门店配送中'
                break
              case 'gs00':
                val.status = '等待签收'
                break
              case  'c000':
                val.status = '订单已取消'
                break
              case  'hr00':
                val.status = '已退款'
                break
              case  'kd00':
                val.status = '快递配送中'
                break
              case  'rm00':
                val.status = '客户已签收'
                break
            }
          })
        })
      },
//    点击取消订单
      cancelOrder: function (even) {
        orderId = Number($(even.currentTarget).parents("tr").attr("id"))
        this.modal.orderModal = true
      },
//    查看详情
      lookDetail: function (even) {
        var curId = Number($(even.currentTarget).parents("tr").attr("id"))
        var self = this
        getDataFromApi(requestSystemUrl + '/backend-system/order/order/' +  curId,{},function (response){
          self.listDetail = response.data.body.list
          $.each( self.listDetail,function(index,val){
            self.note.coupon_note = val.coupon_note
            self.note.order_note = val.order_note
          })
          self.modal.lookDetailModal = true
        })
      },
//    确定取消订单
      confirmCancelOrder: function () {
        var self = this
        putDataToApi(requestSystemUrl + '/backend-system/order/order/cancel/' +  orderId,{},function (response){
          self.getOrderList({})
          self.modal.orderModal = false
        })
      },
//    后台开始生产
      startProduct: function (even) {
        if($(even.currentTarget).attr("disabled")){
          console.log("请勿重复操作")
        }else{
          var curId = Number($(even.currentTarget).parents("tr").attr("id"))
          $(even.currentTarget).attr("disabled",true)
          var self = this
          putDataToApi(requestSystemUrl + '/backend-system/order/order/produce/' +  curId,{},function (response){
            self.getOrderList({})
          },function(err){
            if(err.data.code==='220001'){
              self.modal.skipModal = true
              self.modal.errInfo = '已生成领料单，请前往领料单查看！'
            }
          })
        }
      },
      skip: function () {
        window.location.href = '#!/admin/production/getSupplies'
      },
//    后台配送
      distribution: function  (even) {
        distributionId = Number($(even.currentTarget).parents("tr").attr("id"))
        var self = this
        self.modal.distributionModal = true
      },
//      确定配送
        confirmdistribution: function () {
          var self = this
          putDataToApi(requestSystemUrl + '/backend-system/order/order/distribution/' +  distributionId,{
           type: self.distributionWay
          },function (response){
            self.modal.distributionModal = false
            self.getOrderList({})
          })
        },
//      客户签收
        finishOrder: function (even) {
          finishOrderId = Number($(even.currentTarget).parents("tr").attr("id"))
          this.modal.orderFinishModal = true
        },
//      确认签收
        confirmFinishOrder: function () {
          var self = this
          putDataToApi(requestSystemUrl + '/backend-system/order/order/finish/' +  finishOrderId,{},function (response){
            self.getOrderList({})
            self.modal.orderFinishModal = false
          })
        },
//      搜索
        searchMethod: function () {
         var data = {
           order_number: this.search.code,
           store_code: this.search.selectStore,
           seller_id: this.search.selectClerk,
           status: this.search.selectProgress,
           start_time: this.time.startTime,
           end_time: this.time.endTime,
         }
          this.getOrderList(data)
        },
//      撤销搜索
      cancelSearch: function () {
        this.search.code = ""
        this.search.selectClerk = ""
        this.search.selectStore = ""
        this.search.selectProgress = ''
        this.time.startTime = ""
        this.time.endTime = ""
        this.time.timeText = "结束日期"
        this.getOrderList({})
      }
    },
    computed: {
//      导出requestSystemUrl + '/backend-system/order/order
      exports: function () {
        var url = requestSystemUrl + '/backend-system/' + token + '/export' + '/order/order'
        var data =
          'order_number=' + this.search.code + '&' +
          'store_code=' + this.search.selectStore + '&' +
          'seller_id=' + this.search.selectClerk + '&' +
          'status=' + this.search.selectProgress + '&' +
          'start_time=' + this.time.startTime + '&' +
          'end_time=' + this.time.endTime
        return this.exportUrl = url + '/export-excel?' + data
      }
    },
    data: function () {
      return {
        gridColumns: {
          order_number: '小票编号',
          store_name: '下单门店',
          created_at: '下单时间',
          total_sum: '合计金额',
          total_sell: '合计数量',
          coupon_name: '优惠方式',
          payment: '支付方式',
          status: '进度',
          operator: '营业员',
        },
        orderList: [],
        listDetail: [],
        page: {},
        distributionWay: 'kd00',
        time:{
          startTime: '',
          endTime: '',
          timeText: '开始时间'
        },
        note: {
          coupon_note: '',
          order_note: ''
        },
        search: {
          clerk:[],
          store: [],
          code: '',
          selectClerk:  '',
          selectStore: '',
          selectProgress: ''
        },
        modal: {
          orderModal: false,
          orderModalSize: 'modal-sm',
          distributionModal: false,
          distributionModalSize: 'modal-sm',
          orderFinishModal: false,
          orderFinishModalSize: 'modal-sm',
          lookDetailModal: false,
          lookDetailModalSize:'modal-lg',
          skipModal: false,
          skipModalSize: 'modal-sm',
          errInfo: ''
        }
      }
    }
  }
</script>
