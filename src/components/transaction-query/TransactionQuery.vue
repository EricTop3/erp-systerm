<template>
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
          <input type="text" class="form-control" placeholder="">
        </div>
        <div class="form-group">
          <label>会员卡号</label>
          <input type="text" class="form-control" placeholder="">
        </div>
        <div class="form-group ml10">
          <label>支付方式</label>
          <select class="form-control">
            <option>请选择</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>营业员</label>
          <select class="form-control">
            <option>全部</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>进度</label>
          <select class="form-control">
            <option>全部</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>下单时间段</label>
          <input type="text" class="form-control date_picker" placeholder="开始时间"> -
          <input type="text" class="form-control date_picker" placeholder="结束时间">
        </div>
        <button type="submit" class="btn btn-info">搜索</button>
        <span class="btn btn-warning">撤销搜索</span>
      </form>
    </div>

    <div>
      <ul class="nav nav-tabs" role="tablist">
        <li value="1" role="presentation" class="active"><a href="#retail-list" data-toggle="tab">零售单</a></li>
        <li value="2" role="presentation"><a href="#guazhang-list" data-toggle="tab">挂账单</a></li>
        <li value="3" role="presentation"><a href="#order-list" data-toggle="tab">预约单</a></li>
      </ul>

      <!-- Tab panes -->
      <div class="tab-content">
        <!-- begin零售单 -->
        <div role="tabpanel" class="tab-pane active" id="retail-list">
          <!-- 表格 -->
          <grid :data="queryList" :columns="retailGridColumns" :operate="gridOperate">
            <div slot="operateList">
              <span class="btn btn-primary btn-sm" data-toggle="modal"
                    data-target="#inventory-returnGoods-templ" @click="returnGoods($event)">退货</span>
              <span class="btn btn-info btn-sm" data-toggle="modal" data-target="#inventory-checkRetailGoods-templ"
                    @click="lookDetail($event)">查看</span>
            </div>
          </grid>
          <!-- 翻页 -->
          <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
                :last-page="page.last_page"></page>
        </div>
        <!-- end零售单 -->

        <!-- begin挂账单 -->
        <div role="tabpanel" class="tab-pane" id="guazhang-list">
          <!-- 表格 -->
          <grid :data="queryList" :columns="hangingGridColumns" :operate="gridOperate" :check="gridCheck">
            <div slot="operateList">
              <span class="btn btn-primary btn-sm" data-toggle="modal"
                    data-target="#inventory-returnGoods-templ" @click="returnGoods($event)">退货</span>
              <span class="btn btn-info btn-sm" data-toggle="modal" data-target="#inventory-checkHangingGoods-templ"
                    @click="lookDetail($event)">查看</span>
              <span class="btn btn-warning btn-sm" data-toggle="modal" data-target="#inventory-huikuan-templ">回款</span>
            </div>
          </grid>
          <table>
            <tr>
              <td><span class="btn btn-sm btn-info" style="margin-right:15px;">全部回款</span></td>
              <td>合计回款额：<span>￥25000.00</span></td>
            </tr>
          </table>

          <!-- 翻页 -->
          <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
                :last-page="page.last_page"></page>
        </div>
        <!-- end挂账单 -->

        <!-- begin预约单 -->
        <div role="tabpanel" class="tab-pane" id="order-list">
          <grid :data="queryList" :columns="subscribeGridColumns" :operate="gridOperate">
            <div slot="operateList">

              <span v-if="status == '门店配送中'" class="btn btn-sm btn-primary" data-toggle="modal"
                    data-target="#inventory-notice1-templ">门店收货</span>
              <span v-if="status == '等待签收'" class="btn btn-sm btn-primary" data-toggle="modal"
                    data-target="#inventory-notice2-templ">客户签收</span>
              <span v-if="status == '订单取消'" class="btn btn-sm btn-primary" data-toggle="modal"
                    data-target="#inventory-notice3-templ">退款</span>
              <span class="btn btn-sm btn-info" data-toggle="modal" data-target="#inventory-checkSubscribeGoods-templ"
                    @click="lookDetail($event)">查看</span>
            </div>
          </grid>

          <!-- 翻页 -->
          <page :total="page.total" :current.sync="page.current_page" :display="page.per_page"
                :last-page="page.last_page"></page>
        </div>
        <!-- end预约单 -->

      </div>
    </div>
  </div>

  <!-- begin退货 -->
  <div class="modal fade" id="inventory-returnGoods-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">退货</h4>
        </div>
        <div class="modal-body">
          <table class="table table-striped table-border table-hover">
            <thead>
            <tr>
              <td>商品名称</td>
              <td>零售单价</td>
              <td>销售数量</td>
              <td>退货数量</td>
              <td>小计退额款</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in returnGoodsList">
              <td>{{item.name}}</td>
              <td>￥{{item.new_price}}</td>
              <td>{{item.amount}}</td>
              <td class="text-center">
                <!--<template v-if="item.return_number <= item.amount">-->
                <!--<input type="text" class="form-control text-center" style="width:70px;"-->
                <!--v-model="item.return_number">-->
                <!--</template>-->

                <count :count.sync='item.return_number' :amount.sync='item.amount'></count>
              </td>
              <td>￥{{item.return_number*item.new_price}}</td>
            </tr>
            </tbody>
          </table>
          <div class="panel">
            <div class="panel-body">
              <p style="line-height: 33px;">合计退款：<span>￥{{allReturnPrice}}</span><span
                class="pull-right btn-primary btn" data-dismiss="modal" @click="onlyReturnOnce">确定退货</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end退货 -->

  <!-- begin查看零售单 -->
  <div class="modal fade" id="inventory-checkRetailGoods-templ" tabindex="-1" role="dialog"
       aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">订单明细</h4>
        </div>
        <div class="modal-body">
          <table class="table table-striped table-border table-hover">
            <thead>
            <tr>
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
            <tr v-for="item in listDetail">
              <td>{{item.name}}</td>
              <td>{{item.price}}</td>
              <td>{{item.new_price}}</td>
              <td>{{item.amount}}</td>
              <td>{{item.return_number}}</td>
              <td>{{item.total_sum}}</td>
              <td>{{item.note}}</td>
            </tr>
            </tbody>
          </table>
          <div class="panel">
            <div class="panel-body">
              <p>优惠备注：抵扣券编号QXP001</p>

              <p>订单备注：快递配送至重庆市渝北区光电园冬电b区3楼3-3，联系人王小姐，联系电话18580201731</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end查看零售单 -->

  <!-- begin查看挂账单 -->
  <div class="modal fade" id="inventory-checkHangingGoods-templ" tabindex="-1" role="dialog"
       aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">订单明细</h4>
        </div>
        <div class="modal-body">
          <table class="table table-striped table-border table-hover">
            <thead>
            <tr>
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
            <tr v-for="item in listDetail">
              <td>{{item.name}}</td>
              <td>{{item.price}}</td>
              <td>{{item.new_price}}</td>
              <td>{{item.amount}}</td>
              <td>{{item.return_number}}</td>
              <td>{{item.total_sum}}</td>
              <td>{{item.note}}</td>
            </tr>
            </tbody>
          </table>
          <div class="panel">
            <div class="panel-body">
              <p>优惠备注：抵扣券编号QXP001</p>

              <p>订单备注：快递配送至重庆市渝北区光电园冬电b区3楼3-3，联系人王小姐，联系电话18580201731</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end查看挂账单 -->

  <!-- begin查看预约单 -->
  <div class="modal fade" id="inventory-checkSubscribeGoods-templ" tabindex="-1" role="dialog"
       aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">订单明细</h4>
        </div>
        <div class="modal-body">
          <table class="table table-striped table-border table-hover">
            <thead>
            <tr>
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
            <tr v-for="item in listDetail">
              <td>{{item.name}}</td>
              <td>{{item.price}}</td>
              <td>{{item.new_price}}</td>
              <td>{{item.amount}}</td>
              <td>{{item.return_number}}</td>
              <td>{{item.total_sum}}</td>
              <td>{{item.note}}</td>
            </tr>
            </tbody>
          </table>
          <div class="panel">
            <div class="panel-body">
              <p>优惠备注：抵扣券编号QXP001</p>

              <p>订单备注：快递配送至重庆市渝北区光电园冬电b区3楼3-3，联系人王小姐，联系电话18580201731</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end查看预约单 -->

  <!-- begin回款 -->
  <div class="modal fade" id="inventory-huikuan-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">挂账回款</h4>
        </div>
        <div class="modal-body">
          <div class="checkbox">
            <label>
              <input type="checkbox">现金
            </label>
            <label>
              <input type="checkbox">支付宝
            </label>
          </div>
          <div class="checkbox">
            <label>
              <input type="checkbox"> Pos刷卡
            </label>
            <label>
              <input type="checkbox"> 微信
            </label>
          </div>
          <div class="checkbox">
            <label>
              <input type="checkbox"> 会员卡余额￥{{}}
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <p class="text-left" style="line-height: 33px;">合计金额：<span>￥{{}}</span><span
            class="pull-right btn-primary btn" data-dismiss="modal">确定回款</span></p>
        </div>
      </div>
    </div>
  </div>
  <!-- end回款 -->

  <!-- begin门店收货 -->
  <div class="modal fade" id="inventory-notice1-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">提示</h4>
        </div>
        <div class="modal-body">
          <h4 class="text-center">门店确定已收货？</h4>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">确定</button>
          <button type="button" class="btn btn-primary">取消</button>
        </div>
      </div>
    </div>
  </div>
  <!-- end门店收货 -->

  <!-- begin门店收货 -->
  <div class="modal fade" id="inventory-notice2-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">提示</h4>
        </div>
        <div class="modal-body">
          <h4 class="text-center">客户确定已收货？</h4>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">确定</button>
          <button type="button" class="btn btn-primary">取消</button>
        </div>
      </div>
    </div>
  </div>
  <!-- end门店收货 -->

  <!-- begin门店收货 -->
  <div class="modal fade" id="inventory-notice3-templ" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
            aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">提示</h4>
        </div>
        <div class="modal-body">
          <h4 class="text-center">确定退款至客户？</h4>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-info" data-dismiss="modal">确定</button>
          <button type="button" class="btn btn-primary">取消</button>
        </div>
      </div>
    </div>
  </div>
  <!-- end门店收货 -->
</template>
<script>
  import $ from 'jquery'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import Count from '../common/Count'
  import {requestUrl,token} from '../../publicFunction/index'
  export default {
    components: {
      Count: Count,
      Grid: Grid,
      Page: Page
    },
    ready: function () {
      var orderType = '1'

      var self = this
//    交易查询
      this.$http({
        url: requestUrl + '/front-system/order',
        method: 'get',
        data: {order_type: 1},
        headers:{
          'X-Overpowered-Token':token
        }
      }).then(function (response) {
        this.page = response.data.body.pagination
        this.queryList = response.data.body.list
      }, function (err) {
        console.log(err)
      })
//      切换订单类型
      $('.nav-tabs li').click(function () {
        orderType = $(this).attr('value')
        self.$http({
          url: requestUrl + '/front-system/order',
          method: 'get',
          data: {
            order_type: 1
          },
        headers:{
          'Content-Type': 'application/json',
            'X-Overpowered-Token':'75207fdf8d926efcd2db52cd31e3073fff4f3cb2'
        }}).then(function (response) {
          this.page = response.data.body.pagination
          this.queryList = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      })
    },
    methods: {
      lookDetail: function (event) {
        var id = $(event.currentTarget).parents('tr').attr('id')
        this.$http({
          url: requestUrl + '/front-system/order/' + id + '/detail',
          method: 'get'
        }).then(function (response) {
          this.listDetail = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      },
      returnGoods: function (event) {
        var button = $(event.currentTarget)
        var id = $(event.currentTarget).parents('tr').attr('id')
        this.$http({
          url: requestUrl + '/front-system/order/' + id + '/detail',
          method: 'get'
        }).then(function (response) {
          this.returnGoodsList = response.data.body.list
        }, function (err) {
          console.log(err)
        })

        this.currentButton = button
      },
//      退货后隐藏按钮
      onlyReturnOnce: function () {
        $(this.currentButton).css('visibility','hidden')
        console.log('test')
      }
    },
    data: function () {
      return {
        gridCheck: true,
        returnGoodsList: [],
        listDetail: [],
        queryList: [],
        page: [],
        gridOperate: true,
        retailGridColumns: {
          order_number: '小票编号',
          created_at: '下单时间',
          total_sum: '合计金额',
          total_number: '合计数量',
          card_number: '会员卡号',
          coupon_name: '优惠方式',
          payment: '支付方式',
          after_sales: '售后',
          operator: '营业员'
        },
        hangingGridColumns: {
          order_number: '小票编号',
          created_at: '下单时间',
          total_sum: '合计金额',
          total_number: '合计数量',
          card_number: '会员卡号',
          coupon_name: '优惠方式',
          payment: '支付方式',
          after_sales: '售后',
          operator: '营业员'
        },
        subscribeGridColumns: {
          order_number: '小票编号',
          created_at: '下单时间',
          total_sum: '合计金额',
          total_number: '合计数量',
          card_number: '会员卡号',
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
          price += Number(value.return_number) * Number(value.new_price)
        })
        return price.toFixed(2)
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    color: #42b983;
  }
</style>

