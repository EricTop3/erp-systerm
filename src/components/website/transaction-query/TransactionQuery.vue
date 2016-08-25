<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：交易查询</li>
      <li class="active">预约单</li>
    </ol>

    <!-- 页头 -->
    <div class="page-header">
      <form class="form-inline">
        <div class="form-group">
          <label>小票编号</label>
          <input type="text" class="form-control" placeholder="请输入小票编号" v-model="search.orderNumber">
        </div>
        <div class="form-group">
          <label>会员卡号</label>
          <input type="text" class="form-control" placeholder="请输入会员卡号" v-model="search.cardNumber">
        </div>
        <div class="form-group ml10">
          <label>支付方式</label>
          <select class="form-control" v-model="search.selectedPayway">
            <option value="">请选择</option>
            <option value="cash" checked>现金</option>
            <option value="alipay">支付宝</option>
            <option value="post">post刷卡</option>
            <option value="weixin">微信</option>
            <option value="vip">会员余额</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>营业员</label>
          <select class="form-control" v-model="search.selectedClerk">
            <option value="">请选择</option>
            <option :value="item.id" v-for="item in search.clerk">{{item.name}}</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>进度</label>
          <select class="form-control" v-model="search.selectedProgress">
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
        <div class="form-group ml10">
          <label>下单时间段</label>
          <date-picker :value.sync="time.startTime" :time-text="time.timeText"></date-picker>
          -
          <date-picker :value.sync="time.endTime"  :time-text="time.timeText">></date-picker>
        </div>
        <button class="btn btn-info" @click="searchMethod">搜索</button>
        <span class="btn btn-warning" @click="cancelSearch">撤销搜索</span>
      </form>
    </div>

    <div>
      <ul class="nav nav-tabs" role="tablist">
        <li value="1" role="presentation" :class="{'active': orderType===1}"><a href="#retail-list" data-toggle="tab">零售单</a>
        </li>
        <li value="2" role="presentation" :class="{'active': orderType===2}"><a href="#guazhang-list" data-toggle="tab">挂账单</a>
        </li>
        <li value="3" role="presentation" :class="{'active': orderType===3}"><a href="#order-list"
                                                                                data-toggle="tab">预约单</a></li>
      </ul>

      <!-- Tab panes -->
      <div class="tab-content">
        <!-- begin零售单 -->
        <div role="tabpanel" class="tab-pane active" v-if='retailShow===true'>
          <table class="table table-striped table-bordered table-hover">
            <thead>
            <tr class="text-center">
              <th v-for="value in retailGridColumns">
                {{value}}
              </th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr class="text-center" v-for="entry in queryList" track-by="$index" :id="[entry.id ? entry.id : '']">
              <td v-for="value in  retailGridColumns">
                {{entry[$key]}}
              </td>
              <td  :id="[entry.id ? entry.id : '']">
                <span class="btn btn-primary btn-sm" data-target="#inventory-returnGoods-templ" @click="returnGoods($event)" v-if="entry.status === '已提交'">退货</span>
                <span class="btn btn-info btn-sm" data-toggle="modal" data-target="#inventory-checkRetailGoods-templ"
                    @click="lookDetail($event)">查看</span>
              </td>
            </tr>
            </tbody>
          </table>
          <!-- 翻页 -->
          <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
                :last-page="page.last_page"></page>
        </div>
        <!-- end零售单 -->

        <!-- begin挂账单 -->
        <div role="tabpanel" class="tab-pane active" v-if="guazhangShow === true">
          <table class="table table-striped table-bordered table-hover">
            <thead>
            <tr class="text-center">
              <th ><label><input type="checkbox" @change="checkAllMethod()" v-model="checkAll" :disabled="data  && data.length<0">全选</label></th>
              <th v-for="value in hangingGridColumns">
                {{value}}
              </th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr class="text-center" v-for="entry in queryList" track-by="$index" :id="[entry.id ? entry.id : '']">
              <td><input type="checkbox"  :id="[entry.id ? entry.id : '']" @change="changeOperate($event)"  v-model="entry.choice" class="singleChecked"></td>
              <td v-for="value in  retailGridColumns">
                {{entry[$key]}}
              </td>
              <td  :id="[entry.id ? entry.id : '']">
                <span class="btn btn-primary btn-sm" @click="payment($event)" v-if="entry.status!='已退货'">回款</span>
                <span class="btn btn-info btn-sm" @click="lookDetail($event)">查看</span>
                <span class="btn btn-warning btn-sm" @click="returnGoods($event)" v-if="entry.status!='已退货'">退货</span>
              </td>
            </tr>
            </tbody>
          </table>
          <div>
            <span class="btn btn-sm btn-info" style="margin-right:15px;" @click="paymentAll()">全部回款</span>
              <span></span>合计回款额：<span>￥{{totalPayMent|priceChange}}</span>
          </div>
          <!-- 翻页 -->
          <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
                :last-page="page.last_page"></page>
        </div>
        <!-- end挂账单 -->

        <!-- begin预约单 -->

        <div role="tabpanel" class="tab-pane active" v-if="orderShow===true">
          <table class="table table-striped table-bordered table-hover">
            <thead>
            <tr class="text-center">
              <td class="text-left">小票编号</td>
              <td>下单时间</td>
              <td>合计金额</td>
              <td>合计数量</td>
              <td>会员卡号</td>
              <td>优惠方式</td>
              <td>支付方式</td>
              <td>进度</td>
              <td>营业员</td>
              <td>操作</td>
            </tr>
            </thead>
            <tbody>
            <tr class="text-center" v-for="item in queryList" id="{{item.id}}">
              <td class="text-left">{{item.order_number}}</td>
              <td>{{item.created_at}}</td>
              <td>{{item.total_sum}}</td>
              <td>{{item.total_sell}}</td>
              <td>{{item.member_card_number}}</td>
              <td>{{item.coupon_name}}</td>
              <td>{{item.payment}}</td>
              <td>{{item.status}}</td>
              <td>{{item.operator}}</td>
              <td>
                <span v-if="item.status=='门店配送中'" class="btn btn-sm btn-primary"
                      @click="storeReceived($event)">门店收货</span>
                <span v-if="item.status=='等待签收'" class="btn btn-sm btn-primary"
                      @click="userReceived($event)">客户签收</span>
                <span v-if="item.status=='订单已取消' && item.status=='已退款'" class="btn btn-sm btn-primary" @click="returnMondy($event)">退款</span>
                <span class="btn btn-sm btn-info" @click="lookDetail($event)">查看</span>
              </td>
            </tr>
            </tbody>
          </table>
          <!-- 翻页 -->
          <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
                :last-page="page.last_page"></page>
        </div>
        <!-- end预约单 -->
      </div>
    </div>
  </div>

  <!-- begin退货 -->
  <modal :show.sync="modal.refundModal" :modal-size="modal.refundModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true" @click="modal.refundModal=false">&times;</span></button>
      <h4 class="modal-title">退货</h4>
    </div>
    <div slot="body">
      <table class="table table-striped table-border table-hover">
        <thead>
        <tr class="text-aligen">
          <td  style="text-align: center">商品名称</td>
          <td>零售单价</td>
          <td>销售数量</td>
          <td>退货数量</td>
          <td>小计退款额</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in returnGoodsList" class="text-aligen">
          <td  style="text-align: center">{{item.name}}</td>
          <td>￥{{item.new_price |priceChange}}</td>
          <td>{{item.amount}}</td>
          <td>{{item.amount}}</td>
          <td>￥{{(item.new_price * item.return_number)|priceChange}}</td>
        </tr>
        </tbody>
      </table>
      <div class="panel">
        <div class="panel-body">
          <p style="line-height: 33px;">合计退款：<span>￥{{refund_total_sum | priceChange}}</span><span
            class="pull-right btn-primary btn" @click="confirmRefoundGoods"
            :disabled="refundFlag"
            :class="{'btn-primary':!refundFlag,'btn-warning':refundFlag}">确定退货</span>
          </p>
        </div>
      </div>
    </div>
    <div slot="footer">
    </div>
  </modal>
  <!-- end退货 -->

  <!-- begin查看零售单 -->
  <modal :show.sync="modal.deleteModal" :modal-size.sync='modal.deleteModalSize'>
    <div slot="header">
      <button type="button" class="close" aria-label="Close"><span
        aria-hidden="true" @click="deleteModal=false">&times;</span></button>
      <h4 class="modal-title">订单明细</h4>
    </div>
    <div slot="body">
      <table class="table table-striped table-border table-hover">
        <thead>
        <tr class="text-aligen">
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
        <tr v-for="item in listDetail" class="text-aligen">
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
          <p>优惠备注：{{coupon_note=== null ? '无备注' : coupon_note }}</p>

          <p>订单备注：{{order_note=== null ?  '无备注' : order_note }}</p>
        </div>
      </div>
    </div>
    <div slot="footer"></div>
  </modal>
  <!--回款-->
  <modal :show.sync="modal.paymentModal" :modal-size.sync='modal.paymentModalSize'>
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true" @click="modal.paymentModal=false">&times;</span></button>
      <h4 class="modal-title">挂账回款</h4>
    </div>
    <div slot="body" class="gzhk">
      <div class="radio">
        <label>
          <input type="radio" value="cash" name="payment" checked="true">现金
        </label>
        <label>
          <input type="radio" value="alipay" name="payment">支付宝
        </label>
      </div>
      <div class="radio">
        <label>
          <input type="radio" value="pos" name="payment"> post刷卡
        </label>
        <label>
          <input type="radio" value="weixin" name="payment"> 微信
        </label>
      </div>
      <div class="radio">
        <label>
          <input type="radio" value="vip" name="payment"> 会员卡余额
        </label>
      </div>
    </div>
    <div slot="footer">
      <p class="text-left" style="line-height: 33px;">合计金额：<span>￥{{paymentAmount}}</span><span
        class="pull-right btn-primary btn" data-dismiss="modal" @click="confirmPayment">确定回款</span></p>
    </div>
  </modal>

  <!-- begin门店收货 -->
  <modal :show.sync="modal.storeReceivedModal" :modal-size.sync='modal.storeReceivedModalSize'>
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">提示</h4>
    </div>
    <div slot="body">
      <h4 class="text-center">门店确定已收货？</h4>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-info" data-dismiss="modal" @click="storeConfirmReceived">确定</button>
      <button type="button" class="btn btn-primary" @click="modal.storeReceivedModal=false">取消</button>
    </div>
  </modal>
  <!-- end门店收货 -->

  <!-- begin客户收货 -->
  <modal :show.sync="modal.userReceivedModal" :modal-size.sync='modal.userReceivedModalSize'>
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">提示</h4>
    </div>
    <div slot="body">
      <h4 class="text-center">客户确定已收货？</h4>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-info" data-dismiss="modal" @click="userConfirmReceived">确定</button>
      <button type="button" class="btn btn-primary" @click="modal.userReceivedModal=false">取消</button>
    </div>
  </modal>
  <!-- end客户收货 -->

  <!-- begin退款 -->
  <modal :show.sync="modal.returnMoneyModal" :modal-size.sync='modal.returnMoneyModalSize'>
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">提示</h4>
    </div>
    <div slot="body">
      <h4 class="text-center">确定退款至客户？</h4>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-info" data-dismiss="modal" @click="confirmReturnMoney">确定</button>
      <button type="button" class="btn btn-primary" @click="modal.returnMoneyModal=false">取消</button>
    </div>
  </modal>
  <!--错误信息-->
  <error-tip :err-modal.sync="modal.errModal" :err-info="modal.errInfo"></error-tip>
</template>
<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import Count from '../../common/Count'
  import DatePicker from '../../common/DatePicker'
  import Modal from  '../../common/Modal'
  import ErrorTip from '../../common/ErrorTip'
  import {requestUrl, token, searchRequest, error,getDataFromSiteApi,putDataToApi} from '../../../publicFunction/index'
  var detailId = 0
  var paymentid = 0
  var refundId = 0
  export default {
    components: {
      SiteNav: SiteNav,
      Count: Count,
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      DatePicker: DatePicker,
      ErrorTip: ErrorTip
    },
    route: {
      activate: function () {
        if (!window.localStorage.getItem('orderType')) {
          window.localStorage.setItem('orderType', 1)
        }
        this.orderType = Number(window.localStorage.getItem('orderType'))
        var self = this
        switch (self.orderType) {
          case 1:
            self.retailShow = true
            self.orderShow = false
            self.guazhangShow = false
            break
          case 2:
            self.retailShow = false
            self.orderShow = false
            self.guazhangShow = true
            break
          case 3:
            self.retailShow = false
            self.orderShow = true
            self.guazhangShow = false
        }
//    交易查询
        var url = requestUrl + '/front-system/order'
        var data = {
          order_type: this.orderType,
        }
        this.fetchData(url, data, this.finishPage)
      }
    },
    events: {
//     分页
      pagechange: function (current) {
        var url = requestUrl + '/front-system/order'
        var data = {
          order_type: this.orderType,
          page: current
        }
        this.fetchData(url, data, this.finishPage)
      },
//    输入退货数量的时候
      countEmmit: function (count){
        var self = this
        var len = 0
        $.each(this.returnGoodsList,function(index,val){
          (function(){
            if( Number(val.return_number ) !== Number(val.amount) ){
              val.return_number = ''
              self.refundFlag = true
            }else {
              len ++
            }
          })(val)
        })
       if(len ===this.returnGoodsList.length ){
         self.refundFlag = false
       }
      }
    },
    ready: function () {
      var self = this
      var url = requestUrl + '/front-system/order'
//    获取营业员
      getDataFromSiteApi( requestUrl + '/front-system/account',{},function(response){
        self.search.clerk = response.data.body.list
      })
//      切换订单类型
      $('.nav-tabs li').click(function () {
        self.orderType = Number($(this).attr('value'))
        switch (self.orderType) {
          case 1:
            self.retailShow = true
            self.orderShow = false
            self.guazhangShow = false
            break
          case 2:
            self.retailShow = false
            self.orderShow = false
            self.guazhangShow = true
            break
          case 3:
            self.retailShow = false
            self.orderShow = true
            self.guazhangShow = false
        }
        var data = {
          order_type: self.orderType
        }
        self.fetchData(url, data, self.finishPage)
      })
    },
    methods: {
//      搜索
      searchMethod: function () {
        var self = this
        var url = requestUrl + '/front-system/order'
        var data = {
          order_type: self.orderType
        }
        searchRequest(
          requestUrl + '/front-system/order',
          {
            order_number: this.search.orderNumber,
            payment: this.search.selectedPayway,
            card_number: this.search.cardNumber,
            operator: this.search.selectedClerk,
            status: this.search.selectedProgress,
            order_type: this.orderType,
            start_time: this.time.startTime,
            end_time: this.time.endTime
          },
          function (response) {
            self.finishPage(response)
          }
        )
      },
      cancelSearch: function () {
        var self = this
        searchRequest(
          requestUrl + '/front-system/order',
          {
            order_type: this.orderType
          },
          function (response) {
            self.finishPage(response)
            self.search.orderNumber = ''
            self.search.selectedPayway = ''
            self.search.cardNumber = ''
            self.search.selectedClerk = ''
            self.search.selectedProgress = ''
            self.time.startTime = ''
            self.time.endTime = ''
          }
        )
      },
//     封装获取数据方法
      fetchData: function (url, data, callback) {
        this.$http.get(url, data, {headers: {'X-Overpowered-Token': token}}).then(function (response) {
          callback && callback(response)
        }, function (err) {
          error(err)
        })
      },
//      对获取到的数据进行处理
      modifyGetedData: function (data) {
        var self = this
        $.each(data, function (index, val) {
          val.total_sum = Number((val.total_sum) * 0.01).toFixed(2)
          val.coupon_name = val.coupon_name!=='' ? val.coupon_name : '无优惠'
          switch (val.payment) {
            case  'cash':
              val.payment = '现金'
              break
            case 'alipay':
              val.payment = '支付宝'
              break
            case  'weixin':
              val.payment = '微信'
              break
            case 'post':
              val.payment= 'post机刷卡'
              break
            case  'vip':
              val.payment = '会员卡余额'
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
              if(self.orderType === 1){
                val.status = '已退货'
              }
              if(self.orderType === 2){
                val.status = '已退货'
              }
              if(self.orderType === 3){
                val.status = '已退款'
              }
              break
            case  'kd00':
              val.status = '快递配送中'
              break
            case  'rm00':
              val.status = '客户已签收'
              break
          }
          if(self.orderType === 1){
            val.after_sale = val.status !== '已退货' ? '无': val.status
          }
          if(self.orderType === 2){
            val.after_sale = val.status !== '已退货' ? '无': val.status
          }
          if(self.orderType === 3){
            val.after_sale = val.status !== '已退款' ? '无': val.status
          }
        })
      },
//      翻页请求完成数据和订单切换完成数据
      finishPage: function (response) {
        this.page = response.data.body.pagination
        this.queryList = response.data.body.list
        this.modifyGetedData(this.queryList)
      },
//     查看详情获取数据完成后的函数
      finishLookDetail: function (response) {
        this.listDetail = response.body.list
        var self = this
        $.each(this.queryList, function (index, val) {
          if (val.id === detailId) {
            self.coupon_note = val.coupon_note
            self.order_note = val.order_note
          }
        })
      },
//     查看详情
      lookDetail: function (event) {
        this.modal.deleteModal = true
        detailId = Number($(event.currentTarget).parents('tr').attr('id'))
        var url = requestUrl + '/front-system/order/' + detailId + '/detail'
        this.fetchData(url, this.finishLookDetail)
      },
//      客户签收
      userReceived: function (event) {
        var button = $(event.currentTarget)
        this.currentButton = button
        this.modal.userReceivedModal = true
        this.receivedId = $(event.currentTarget).parents('tr').attr('id')
      },
//      客户确认签收
      userConfirmReceived: function () {
        this.modal.userReceivedModal = false
        this.$http({
          url: requestUrl + '/front-system/order/finish/' + this.receivedId,
          method: 'put',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response){
          var self =  this
          var url = requestUrl + '/front-system/order'
          var data = {
            order_type: this.orderType,
          }
          this.modal.userReceivedModal = false
          self.fetchData(url, data, self.finishPage)
        }, function (err) {
          error(err)
        })
      },
//      门店签收
      storeReceived: function (event) {
        var button = $(event.currentTarget)
        this.currentButton = button
        this.modal.storeReceivedModal = true
        this.receivedId = $(event.currentTarget).parents('tr').attr('id')
      },
//      门店确认签收
      storeConfirmReceived: function () {
        this.modal.storeReceivedModal = false
        this.$http({
          url: requestUrl + '/front-system/order/receipt/' + this.receivedId,
          method: 'put',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          var self = this
          this.modal.storeReceivedModal = false
          var url = requestUrl + '/front-system/order'
          var data = {
            order_type: this.orderType,
          }
          this.fetchData(url, data, self.finishPage)
        })
      },
//      退款
      returnMondy: function (event){
        var self = this
        var button = $(event.currentTarget)
        this.currentButton = button
        this.receivedId = $(event.currentTarget).parents('tr').attr('id')
        getDataFromSiteApi(requestUrl + '/front-system/order/'+ this.receivedId+ '/detail',{},function (response) {
          self.receivedGoodsList = response.data.body.list
          self.modal.returnMoneyModal = true
        })
      },
//      确认退款
      confirmReturnMoney: function () {
        this.modal.returnMoneyModal = false
        var self = this
        var items = []
        var url = requestUrl + '/front-system/order'
        var data = {
          order_type: self.orderType
        }
        $.each(self.receivedGoodsList,function(index,val){
              var obj = {}
              obj.amount = val.return_number
              obj.consumable_id  = val.id
              items.push(obj)
        })
        putDataToApi(requestUrl + '/front-system/order/refund-goods/' + this.receivedId,{'items':items},function(response){
          self.modal.returnMoneyModal = false
          self.fetchData(url, data, self.finishPage)
        })
      },
//      退货
      returnGoods: function (event) {
        var button = $(event.currentTarget)
        var self = this
        this.modal.refundModal = true
        refundId= Number($(event.currentTarget).parents('tr').attr('id'))
        getDataFromSiteApi(requestUrl + '/front-system/order/'+  refundId + '/detail',{},function (response) {
            self.returnGoodsList = response.data.body.list
            $.each(self.returnGoodsList,function(index,val){
              val.return_number = val.amount
              self.refund_total_sum = val.total_sum
            })
        })
        this.currentButton = button
      },
//      退货后隐藏按钮
      confirmRefoundGoods: function () {
        var items = []
        var self = this
        var url = requestUrl + '/front-system/order'
        var data = {
          order_type: self.orderType
        }
        $.each(self.returnGoodsList,function(index,val){
          var obj = {}
          obj.amount = val.return_number
          obj.consumable_id  = val.id
          items.push(obj)
        })
        if (self.refundFlag === true) {
          return false
        } else {
          putDataToApi(requestUrl + '/front-system/order/refund-goods/'+ refundId, {'items':items}, function (response) {
            self.modal.refundModal = false
            self.fetchData(url, data, self.finishPage)
          },function (err) {
            if(err.data.code ==="200002") {
              self.modal.refundModal = false
              self.modal.errModal = true
              self.modal.errInfo  = "high,该订单已经退货不能重复退货"
            }
          })
        }
      },
//      回款
      payment: function (event) {
        var button = $(event.currentTarget)
        this.currentButton = button
        this.modal.paymentModal = true
        var self = this
        paymentid = Number($(event.currentTarget).parents('tr').attr('id'))
        $.each(this.queryList, function (index, val) {
          if (paymentid === val.id) {
            self.paymentAmount = val.total_sum
          }
        })
      },
//      选择回款
      changeOperate: function (event) {
        var self = this
        var len = this.queryList.length
        var currentId = Number($(event.currentTarget).attr('id'))
        var currentObjCheck = $(event.currentTarget).prop('checked')
        if(!currentObjCheck){
          self.checkAll = false
          self.singleCheckMount --
        }else{
          self.singleCheckMount++
        }
        if(len ===  self.singleCheckMount){
          self.checkAll = true
        }else{
          self.checkAll = false
        }
        $.each(this.queryList, function (index, val) {
          if (currentId === val.id) {
            if (currentObjCheck) {
              self.totalPayMent = self.totalPayMent + val.total_sum * 100
            } else {
              self.totalPayMent = self.totalPayMent - val.total_sum * 100
            }
          }
        })
      },
      checkAllMethod: function () {
        var self = this
        $('.singleChecked').prop('checked',self.checkAll)
        $.each(this.queryList, function (index, val) {
          if(self.checkAll){
            self.totalPayMent = self.totalPayMent + val.total_sum * 100
          }else{
            self.totalPayMent = self.totalPayMent - val.total_sum * 100
          }
        })
      },
//      全部选择回款
      changeAllOperate: function (checkall) {
        var self = this
        self.checkAll = true
        $('.singleChecked').prop('checked',self.checkAll)
        $.each(this.queryList, function (index, val) {
          if(self.checkAll){
            self.totalPayMent = self.totalPayMent + val.total_sum * 100
          }else{
            self.totalPayMent = self.totalPayMent - val.total_sum * 100
          }
        })
      },
//      点击全部回款金额
      paymentAll: function () {
        this.changeAllOperate()
        this.modal.paymentModal = true
        this.paymentAmount = (this.totalPayMent * 0.01).toFixed(2)
      },
//       确定回款
      confirmPayment: function () {
        var payment = $(".gzhk").find('input[name="payment"]:checked').val()
        this.$http({
          url: requestUrl + '/front-system/order/back-money/' + paymentid,
          method: 'put',
          data: {payment: payment},
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.modal.paymentModal = false
          var url = requestUrl + '/front-system/order'
          var data = {
            order_type: this.orderType,
          }
          this.fetchData(url, data, this.finishPage)
        }, function (err) {
          error(err)
        })
      }
    },
    data: function () {
      return {
        refundFlag: false,
        checkAll: false,
        singleCheckMount: 0,
        refund_total_sum: 0,
        modal:{
           errModal: false,
           errInfo: 'high,这是退货错误提示',
           refundModal: false,
           refundModalSize: 'modal-lg',
           deleteModal: false,
           deleteModalSize: 'modal-lg',
           paymentModal: false,
           paymentModalSize: 'modal-sm',
           storeReceivedModal: false,
           storeReceivedModalSize: 'modal-sm',
           userReceivedModal: false,
           userReceivedModalSize: 'modal-sm',
           returnMoneyModal: false,
           returnMoneyModalSize: 'modal-sm',
         },
        search: {
          clerk: [],
          sorderNumber: '',
          selectedPayway: '',
          cardNumber: '',
          selectedClerk: '',
          selectedProgress: ''
        },
        time: {
          startTime: '',
          endTime: '',
          timeText: '请输入日期'
        },
        totalPayMent: 0,
        paymentAmount: 0,
        guazhangShow: false,
        orderShow: false,
        retailShow: false,
        selcted: '',
        coupon_note: '',
        order_note: '',
        gridCheck: true,
        returnGoodsList: [],
        listDetail: [],
        queryList: [],
        page: [],
        orderType: 1,
        gridCheck: true,
        gridOperate: true,
        receivedId: '',
        receivedGoodsList: [],
        isRedfundGoos: false,
        retailGridColumns: {
          order_number: '小票编号',
          created_at: '下单时间',
          total_sum: '合计金额',
          total_sell: '合计数量',
          member_card_number: '会员卡号',
          coupon_name: '优惠方式',
          payment: '支付方式',
          after_sale: '售后',
          operator: '营业员'
        },
        hangingGridColumns: {
          order_number: '小票编号',
          created_at: '下单时间',
          total_sum: '合计金额',
          total_sell: '合计数量',
          member_card_number: '会员卡号',
          coupon_name: '优惠方式',
          payment: '支付方式',
          after_sale: '售后',
          operator: '营业员'
        },
        subscribeGridColumns: {
          order_number: '小票编号',
          created_at: '下单时间',
          total_sum: '合计金额',
          total_sell: '合计数量',
          member_card_number: '会员卡号',
          coupon_name: '优惠方式',
          payment: '支付方式',
          status: '进度',
          operator: '营业员'
        }
      }
    },
    computed: {
      allReturnPrice: function () {
        var price = 0
        var returnGoodsList = this.returnGoodsList
        $.each(returnGoodsList, function (index, value) {
          price += value.new_price * value.return_number
        })
        return (price * 0.01).toFixed(2)
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .text-aligen {
    text-align: center;
  }
  table thead tr th:first-child {
    text-align: left;
  }

  table tbody tr td:first-child {
    text-align: left;
  }
</style>

