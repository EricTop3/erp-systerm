<template>
  <site-nav></site-nav>
  <div class='contcainer-fluid mt20 mr20'>
    <div class='col-lg-5'>
      <!--首页左侧表格区域-->
      <div style='height:532px; overflow: auto; border: 1px solid #ddd;'>
        <table class='table table-striped table-border table-hover' style="border: transparent; border-bottom: 1px solid #ddd;">
          <thead>
          <tr class='text-center'>
            <td class='text-left col-lg-5'>品名/单价</td>
            <td class='col-lg-3'>数量</td>
            <td>小计</td>
            <td class='col-lg-3'>操作</td>
          </tr>
          </thead>
          <tbody class='checkedGoodsList'>
          <tr class='checkedGoods' v-for='item in checkedGoodsList' :id='item.id'>
            <td class='text-left'>{{item.goodName}}<br>￥{{item.goodPrice}}</td>
            <!--数量-->
            <td>
              <count-container :count.sync='item.count'></count-container>
            </td>
            <td class='c-erp'>
              <b>￥{{(item.goodPrice * item.count).toFixed(2)}}</b>
            </td>
            <td class='text-center'>
              <slot name='orderOperate'>
                  <span class='btn btn-primary' data-toggle='modal' data-target='#order-price-templ'
                        @click='priceAdject($event)' :class="{'btn-warning': saleMark}" :disabled="saleMark">价格</span>
                <span class='btn btn-default ml10' @click='deleteListgood($event)'>删除</span>
              </slot>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <!--首页选项卡区域-->
      <div>
        <ul class='nav nav-tabs nav-order' role='tablist'>
          <li role='presentation' class='active'><a href='#pay' data-toggle='tab'>支付方式</a></li>
          <li role='presentation'><a href='#preferential' data-toggle='tab'>优惠</a></li>
          <li role='presentation'><a href='#orderType' data-toggle='tab'>订单类型</a></li>
          <li role='presentation'><a href='#members' data-toggle='tab'>会员</a></li>
          <li role='presentation'><a href='#remark' data-toggle='tab'>订单备注</a></li>
        </ul>
        <!-- Tab panes -->
        <div class='tab-content index-order'>
          <div role='tabpanel' class='tab-pane active panel panel-default' id='pay'>
            <ul class='index-list pay-list'>
              <li class='active' data-toggle='modal' data-target='#order-pay-templ'>现金</li>
              <li>POS刷卡</li>
              <li>支付宝</li>
              <li>微信</li>
              <li data-toggle='modal' data-target='#order-member-pay-templ'>会员卡余额</li>
              <div class='clearboth'></div>
            </ul>
          </div>
          <div role='tabpanel' class='tab-pane panel panel-default' id='preferential'>
            <div class='index-list'>
              <form class='form-inline m30'>
                <div class='form-group'>
                  <select class='form-control' style='width: 150px;' v-model="order_mata_data.strategy_id"
                          @change="select($event)">
                    <option selected="selected" value="0">无优惠</option>
                    <option :value="item.id" v-for="item in couponName" :name="item.name">{{item.name}}</option>
                  </select>
                </div>
                <div class='form-group ml10'>
                  <input type='email' class='form-control' placeholder='优惠备注' v-model="order_mata_data.coupon_note">
                </div>
              </form>
            </div>
          </div>

          <div role='tabpanel' class='tab-pane panel panel-default' id='orderType'>
            <ul class='index-list ordertype-list'>
              <li class='active'>零售订单</li>
              <li>挂账订单</li>
              <li>预约订单</li>
              <div class='clearboth'></div>
            </ul>
          </div>
          <div role='tabpanel' class='tab-pane panel panel-default' id='members'>
            <div class='index-list'>
              <form class='form-inline m20'>
                <div class='form-group'>
                  <label>会员卡号</label>
                  <input type='text' class='form-control' placeholder='请填写会员卡号' v-model="member.memberCode">
                </div>
                <!--<div class='form-group ml10'>-->
                <!--<label>会员密码</label>-->
                <!--<input type='email' class='form-control'>-->
                <!--</div>-->
                <button type='submit' class='btn btn-primary ml10' @click="memberRequest">确定</button>
              </form>
            </div>
            <ul class='index-list-member'>
              <li>卡号：123456789</li>
              <li>等级：vip七折</li>
              <li>余额：100.00</li>
              <li>姓名：王二小</li>
              <li>生日：02.04</li>
              <li>积分：1200</li>
              <li>手机：13568656989</li>
              <li><span class='btn btn-info'>更换卡号</span></li>
            </ul>
          </div>
          <div role='tabpanel' class='tab-pane panel panel-default' id='remark'>
            <div class='index-list'>
              <form class='m20'>
                <div class='form-group'>
                  <textarea class='form-control' rows='3' v-model="order_mata_data.order_note"></textarea>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class='contcainer-fluid index-jiesuan'>
          <div class='col-xs-9'>
            <p class='f18'>原订单金额：<span><strong>￥{{totalPrice}}</strong></span></p>

            <p class='c-erp f18'>实际订单额：<span><strong>￥{{finalPrice || totalPrice}}</strong></span></p>

          </div>
          <div class='col-xs-3'><span class='btn  btn-lg' data-toggle='modal'
                                      :disabled="!settlementFlag"
                                      :class="{'btn-primary':settlementFlag,'btn-warning':!settlementFlag}"
                                      data-target='#order-settlement-templ' @click="settlement()">结算</span></div>
          <div class='clearboth'></div>
        </div>
      </div>
    </div>
    <div class='col-lg-7 panel panel-default'>
      <div class='index-nav-left' @click='slidePre()'><span class='glyphicon glyphicon-menu-left'></span></div>
      <div class='index-nav'>
        <ul class='index-list-category'>
          <li class='btn' :class="{'btn-primary':$index===0,'btn-warning':$index!==0}" track-by="$index" :id='item.id'
              v-for='item in category' @click='fetchProduct($event)'>
            {{item.display_name }}
          </li>
        </ul>
      </div>
      <div class='index-nav-right'>
        <span class='glyphicon glyphicon-menu-right' @click='slideNext()'></span>
      </div>
      <div class='clearboth'></div>
      <hr>
      <ul class='index-list-porducts'>
        <li @click='addOrderToList($event)' v-for='item in productFromCategory' :id='item.id'
            :class="{'tejia':item.sell_mark===2,'bukeyijia':item.sell_mark===3,'disabled':item.sell_unit_stock<=0}"
            :stock='item.sell_unit_stock'
            :sell_mark='item.sell_mark'>
          <h4>{{item.name}}</h4>
          <span>{{item.code}}</span>

          <p>￥<span class='single-price'>{{item.original_price|priceChange}}</span></p>
        </li>
      </ul>
      <div class='clearboth'></div>
      <hr>
      <div class='cow'>
        <div class='col-lg-6'>
          <form class='form-inline'>
            <div class='form-group'>
              <input type='text' class='form-control' placeholder='请输入商品名或商品编号' v-model="search">
            </div>
            <button type='submit' class='btn btn-primary' @click="searchProduct">搜索</button>
            <span class='btn btn-warning' @click="cancelSearchProduct">撤销搜索</span>
          </form>
        </div>
        <div class='col-lg-6'>
          <!-- 翻页 -->
          <page :total='page.total' :current.sync='page.current_page' :display='page.per_page'
                :last-page='page.last_page'></page>
        </div>
      </div>
    </div>
  </div>
  <!--结算零售账单弹窗-->
  <modal :show.sync="retailBill" :modal-size="retailBillSize" class="form-horizontal">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" @click="retailBill=false" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">支付</h4>
    </div>
    <div slot="body">
      <div class="form-group">
        <label for="" class="col-sm-4 control-label">订单金额</label>

        <div class="col-sm-8">
          <p class="form-control-static">{{finalPrice}}</p>
        </div>
      </div>
      <div class="form-group">
        <label for="" class="col-sm-4 control-label">订单抹零</label>

        <div class="col-sm-8">
          <input type="checkbox" v-model="truncate" @change="truncateMethod()">
        </div>
      </div>
      <div class="form-group">
        <label for="" class="col-sm-4 control-label">支付金额</label>

        <div class="col-sm-8">
          <input type="text" class="form-control" id="priceValidateFirst" v-model="paymentAmount"
                 @input=priceAjectValdate($event)>
        </div>
      </div>
      <div class="form-group">
        <label for=""
               class="col-sm-4 control-label">找零</label>

        <div class="col-sm-8">
          <p class="form-control-static">￥{{ finalPrice > paymentAmount ? 0 : (paymentAmount*100-finalPrice*100)*0.01
            }}</p>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" :disabled="isRightMoney()" @click="settlementUpload($event)">提交
      </button>
    </div>
  </modal>
  <!--结算挂账账单弹窗-->
  <modal :show.sync="creditlBill" :modal-size="creditlBillSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" @click="creditlBill=false" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">结算提示</h4>
    </div>
    <div slot="body">
      <h4>挂账成功！</h4>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="billUpload()">确定</button>
    </div>
  </modal>
  <!--删除弹窗-->
  <modal :show.sync='isDelete' :modal-size='deleteModalSize'>
    <div slot='header'>
      <div>确认是否删除</div>
    </div>

    <div slot='body'>
      <div>确认是否删除</div>
    </div>
    <div slot='footer'>
      <button type='button' class='btn btn-primary' @click='confimDelete()'>确认</button>
      <button type='button' class='btn btn-primary' @click='isDelete=false'>取消</button>
    </div>
  </modal>
  <!--价格调整弹窗-->
  <modal :show.sync='priceAdjectModal' :modal-size='priceAdjectModalSize' class='form-horizontal'>
    <div slot='header'>
      <button type='button' class='close' data-dismiss='modal' @click="priceAdjectModal=false" aria-label='Close'><span
        aria-hidden='true'>&times;</span></button>
      <h4 class='modal-title'>单价调整</h4>
    </div>
    <div slot='body'>
      <div class='form-group'>
        <label for='' class='col-sm-4 control-label'>原单价</label>

        <div class='col-sm-8'>
          <p class='form-control-static'>￥{{originalPrice}}</p>
        </div>
      </div>
      <div class='form-group'>
        <label for='' class='col-sm-4 control-label'>新单价</label>

        <div class='col-sm-8'>
          <input type='text' class='form-control' id='priceValidateSecond' v-model='newSinglePrice'
                 @input='priceAjectValdate($event)'>
        </div>
      </div>
      <div class='form-group'>
        <label for='' class='col-sm-4 control-label'>备注</label>

        <div class='col-sm-8'>
          <input type='text' class='form-control' id='' v-model="priceNote">
        </div>
      </div>
    </div>
    <div slot='footer'>
      <button type='button' class='btn btn-primary' @click='priceAjectUpload()'>提交</button>
    </div>
  </modal>
  <!--会员弹窗-->
  <modal :show.sync='memberModal' :modal-size='memberModalSize' class='form-horizontal'>
    <div slot='header'>
      <button type='button' class='close' data-dismiss='modal' @click="priceAdjectModal=false" aria-label='Close'><span
        aria-hidden='true' @click="memberModal=false">&times;</span></button>
      <h4 class='modal-title'>会员支付</h4>
    </div>
    <div slot='body'>
      <div class='form-group'>
        <p class="modal-body">会员余额 <span>{{memberCount|priceChange}}</span></p>

        <p class="modal-body color">订单金额 <span>{{finalPrice}}</span></p>
      </div>
    </div>
    <div slot='footer'>
      <button type='button' class='btn btn-primary' @click='memberUpload'>结算</button>
    </div>
  </modal>
  <!--错误信息弹出-->
  <modal :show.sync='messageTipModal' :modal-size="messageTipModalSize" class='form-horizontal'>
    <div slot='header'>
      <button type='button' class='close' data-dismiss='modal' @click="priceAdjectModal=false" aria-label='Close'><span
        aria-hidden='true' @click="messageTipModal=false">&times;</span></button>
      <h4 class='modal-title'>结算提示</h4>
    </div>
    <div slot='body'>
      <div class='form-group'>
        <p class="modal-body">{{messageTip}}</p>
      </div>
    </div>
    <div slot='footer'>
      <button type='button' class='btn btn-primary' @click='messageTipModal = false' v-if="error">关闭</button>
      <button type='button' class='btn btn-primary' @click="settlementUpload($event)" v-if="!error">确定</button>
    </div>
  </modal>
</template>
<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import Modal from '../../common/Modal'
  import CountContainer from '../../common/CountContainer'
  import Page from '../../common/Page'
  import Slide from 'vue-slide'
  import {requestUrl, token,searchRequest} from '../../../publicFunction/index'
  //  商品信息数组
  var orderItems = []
  //  订单类型
  var orderType = 1
  //  订单实付金额
  var orderMount = 0
  var deleteCheckedGoodId = ''
  var priceCheckdGoodId = ''
  export default {
    components: {
      CountContainer: CountContainer,
      Modal: Modal,
      Page: Page,
      Slide: Slide,
      SiteNav: SiteNav
    },
    compiled: function () {
//        分类
      this.$http({
        url: requestUrl + '/front-system/order/category',
        method: 'get',
        headers: {'X-Overpowered-Token': token}
      }).then(function (response) {
        this.category = response.data.body.list
      }, function (err) {
        console.log(err)
      })
//    产品
      this.$http({
        url: requestUrl + '/front-system/order/product',
        method: 'get',
        data: {
          per_page: 20
        },
        headers: {'X-Overpowered-Token': token}
      }).then(function (response) {
        this.productFromCategory = response.data.body.list
        this.page = response.data.body.pagination
      }, function (err) {
        console.log(err)
      })
//      优惠
      this.$http(requestUrl + '/front-system/order/coupon', {
        headers: {'X-Overpowered-Token': token}
      }).then(function (response) {
        this.couponName = response.data.body
      }, function (err) {
        console.log(err)
      })
    },
    ready: function () {
      const orderType = $('.ordertype-list')
      const payment = $('.pay-list')
      var $this = this
      this.checkedGoodsList = []
      function changeActive(elem, elemSon) {
        var orderTypeData = ''
        var paymentData = ''
        elem.on('click', elemSon, function () {
          $(this).addClass('active').siblings().removeClass('active')
          if ($(this).html() !== "会员卡余额") {
            if ($this.settlementFlag === false && $this.checkedGoodsList.length > 0) {
              $this.settlementFlag = true
            }
          }
          switch ($(this).html()) {
            case '零售订单':
              orderTypeData = 1
              break
            case '挂账订单':
              orderTypeData = 2
              break
            case '预约订单':
              orderTypeData = 3
              break
            case '现金':
              paymentData = 'cash'
              break
            case 'POS刷卡':
              paymentData = 'post'
              break
            case '支付宝':
              paymentData = 'alipay'
              break
            case '微信':
              paymentData = 'weixin'
              break
            case '会员卡余额':
              paymentData = 'vip'
              if ($this.memberFlag === false) {
                $this.settlementFlag = false
              }
              break
          }
          if (elem === orderType) {
            $this.order_mata_data.order_type = orderTypeData
          } else {
            $this.order_mata_data.payment = paymentData
            console.log($this.order_mata_data.payment)
          }
        })
      }

      changeActive(orderType, 'li')
      changeActive(payment, 'li')
    },
    events: {
      pagechange: function (currentpage) {
        this.pageRequest(currentpage)
      }
    },
    methods: {
//      搜索
      searchProduct: function () {
        var self = this
        searchRequest(
          requestUrl + '/front-system/order/product',
          {search: this.search},
          function (response) {
            self.productFromCategory = response.data.body.list
            self.page = response.data.body.pagination
            self.search = ''
          })
      },
//     取消搜索
      cancelSearchProduct: function () {
        var self = this
        searchRequest(
          requestUrl + '/front-system/order/product',
          {search: ""},
          function (response) {
            self.productFromCategory = response.data.body.list
            self.page = response.data.body.pagination
          })
      },
//      判断订单的支付金额
      isRightMoney: function () {
        return Number(this.finalPrice) <= Number(this.paymentAmount) ? false : true
      },
//       选择商品
      select: function (event) {
        var cur = Number($(event.currentTarget).val())
        switch (cur) {
          case  0:
            this.order_mata_data.coupon_name = "无优惠"
            break
          case  1:
            this.order_mata_data.coupon_name = "会员日七折"
            break
          case  2:
            this.order_mata_data.coupon_name = "会员日九折"
            break
          case  3:
            this.order_mata_data.coupon_name = "满299元减50元"
            break
          case  4:
            this.order_mata_data.coupon_name = "满199元八折"
            break
        }
        var settlementData = {}
        this.order_mata_data.strategy_id = $(event.currentTarget).val()
        this.order_mata_data.user_id = this.member.memberId
        orderItems = []
        window.localStorage.setItem('orderType', this.order_mata_data.order_type)
        orderType = Number(window.localStorage.getItem('orderType'))
        $.each(this.checkedGoodsList, function (index, val) {
          var obj = {}
          obj['goods_id'] = val.id
          obj['amount'] = val.count
          obj['price'] = val.goodPrice
          obj['note'] = val.priceNote
          orderItems.push(obj)
        })
        settlementData = {
          'items': orderItems,
          'order_meta_data': this.order_mata_data,
          'get_order_price': 1
        }
        this.settlementRequest(settlementData, this.select_money)
      },
//     选择优惠计算金额
      select_money: function (response) {
        if (response.data.body) {
          this.finalPrice = Number((response.data.body.total_sum * 0.01)).toFixed(2)
          Number(this.finalPrice) == 0 ? this.finalPrice = this.totalPrice : this.finalPrice
          orderMount = response.data.body.total_sum
        }else{
          if(response.data.code ==='200005'){
            this.error = true
            this.messageTipModal =  true
            this.messageTip = response.data.message
            this.order_mata_data.strategy_id = 0
            this.finalPrice = this.totalPrice
          }
          else{
            this.error = false
            this.messageTipModal =  true
            this.messageTip = response.data.message
          }
        }
      },
//     结算请求
      settlementRequest: function (data, callback) {
        this.$http.post(requestUrl + '/front-system/order/order', data, {
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          callback && callback(response)
        }, function (err) {
          console.log(err)
        })
      },
//     增加到左侧商品列表
      addOrderToList: function (event) {
        var flag = false
        const currentGood = $(event.currentTarget)
        const currentGoodId = Number(currentGood.attr('id'))
        const currentStock = Number(currentGood.attr('stock'))
        const currentSaleMark = Number(currentGood.attr('sell_mark'))
        const currentGoodName = currentGood.find('h4').html()
        const currentGoodPrice = currentGood.find('.single-price').html()
        const checkedGoodsList = this.checkedGoodsList
        currentGood.addClass('active').siblings().removeClass('active')
//       判断是否是特价或不可议价
        currentSaleMark !== 1 ? this.saleMark = true : this.saleMark = false
        /*//       判断是否为不可议价
         currentSaleMark === 3 ? this.saleMark = true : this.saleMark = false*/
//        判断库存是否为零
        if (currentStock <= 0) {
          return false
        } else {
//          结算的状态
          this.settlementFlag = true
        }
//       判断是否加入商品
        if (checkedGoodsList && checkedGoodsList.length > 0) {
          $.each(checkedGoodsList, function (index, val) {
            if (val.id === currentGoodId) {
              val.count++
              flag = true
            }
          })
          if (!flag) {
            var obj = {}
            obj.id = currentGoodId
            obj.goodName = currentGoodName
            obj.goodPrice = currentGoodPrice
            obj.saleMark = currentSaleMark
            obj.count = this.count
            obj.note = ''
            obj.priceNote = ''
            checkedGoodsList.push(obj)
          }
        } else {
          var obj1 = {}
          obj1.id = currentGoodId
          obj1.goodName = currentGoodName
          obj1.goodPrice = currentGoodPrice
          obj1.saleMark = currentSaleMark
          obj1.count = this.count
          obj1.note = ''
          obj1.priceNote = ''
          checkedGoodsList.push(obj1)
        }
      },
      addOrderToList: function (event) {
        var flag = false
        const currentGood = $(event.currentTarget)
        const currentGoodId = Number(currentGood.attr('id'))
        const currentStock = Number(currentGood.attr('stock'))
        const currentSaleMark = Number(currentGood.attr('sell_mark'))
        const currentGoodName = currentGood.find('h4').html()
        const currentGoodPrice = currentGood.find('.single-price').html()
        const checkedGoodsList = this.checkedGoodsList
        currentGood.addClass('active').siblings().removeClass('active')
//       判断是否是特价或不可议价
        currentSaleMark !== 1 ? this.saleMark = true : this.saleMark = false
        /*//       判断是否为不可议价
         currentSaleMark === 3 ? this.saleMark = true : this.saleMark = false*/
//        判断库存是否为零
        if (currentStock <= 0) {
          return false
        } else {
//          判断是否是会员余额支付
          if (this.order_mata_data.payment !== 'vip') {
            this.settlementFlag = true
          }
        }
//       判断是否加入商品
        if (checkedGoodsList && checkedGoodsList.length > 0) {
          $.each(checkedGoodsList, function (index, val) {
            if (val.id === currentGoodId) {
              val.count++
              flag = true
            }
          })
          if (!flag) {
            var obj = {}
            obj.id = currentGoodId
            obj.goodName = currentGoodName
            obj.goodPrice = currentGoodPrice
            obj.saleMark = currentSaleMark
            obj.count = this.count
            obj.note = ''
            obj.priceNote = ''
            checkedGoodsList.push(obj)
          }
        } else {
          var obj1 = {}
          obj1.id = currentGoodId
          obj1.goodName = currentGoodName
          obj1.goodPrice = currentGoodPrice
          obj1.saleMark = currentSaleMark
          obj1.note = ''
          obj1.count = this.count
          obj1.priceNote = ''
          checkedGoodsList.push(obj1)
        }
      },
//      点击分类请求数据
      fetchProduct: function (event) {
        const categoryId = Number($(event.currentTarget).attr('id'))
        $(event.currentTarget).addClass('btn-primary').removeClass('btn-warning').siblings().removeClass('btn-primary').addClass('btn-warning')
        this.$http({
          url: requestUrl + '/front-system/order/product',
          method: 'get',
          data: {
            category_id: categoryId,
            per_page: 16
          }
        }).then(function (response) {
          this.productFromCategory = response.data.body.list
          this.page = response.data.body.pagination
        }, function (err) {
          console.log(err)
        })
      },
//      点击删除当前列表商品
      deleteListgood: function (event) {
        deleteCheckedGoodId = Number($(event.currentTarget).parents('tr').attr('id'))
        this.isDelete = true
      },
//      确认删除
      confimDelete: function () {
        this.isDelete = false
        var checkedGoodsList = this.checkedGoodsList
        $.each(checkedGoodsList, function (index, value) {
          if (value.id === deleteCheckedGoodId) {
            checkedGoodsList.splice(index, 1)
          }
        })
        if (this.checkedGoodsList.length < 1) {
          this.settlementFlag = false
        }
      },
//      价格调整
      priceAdject: function (event) {
        priceCheckdGoodId = Number($(event.currentTarget).parents('tr').attr('id'))
        var checkedGoodsList = this.checkedGoodsList
        var originalPrice = this.originalPrice
        var flag = false
        $.each(checkedGoodsList, function (index, val) {
          if (val.id === priceCheckdGoodId) {
            originalPrice = val.goodPrice
            if (val.saleMark !== 1) {
              flag = true
            }
          }
        })
        if (!flag) {
          this.originalPrice = originalPrice
          this.priceAdjectModal = true
        }
      },
//      价格调整提交
      priceAjectUpload: function () {
        this.priceAdjectModal = false
        var checkedGoodsList = this.checkedGoodsList
        var newSinglePrice = this.newSinglePrice
        var priceNote = this.priceNote
        if (newSinglePrice === '') {
          return false
        }
        $.each(checkedGoodsList, function (index, val) {
          if (val.id === priceCheckdGoodId) {
            val.goodPrice = parseFloat(newSinglePrice).toFixed(2)
            val.priceNote = priceNote
          }
        })
        this.newSinglePrice = ''
        this.priceNote = ''
      },
//      分页请求
      pageRequest: function (currenPage) {
        this.$http({
          url: requestUrl + '/front-system/order/product',
          method: 'get',
          data: {
            page: currenPage
          }
        }).then(function (response) {
          this.productFromCategory = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      },
//      价格验证
      priceAjectValdate: function (event) {
//        价格正则
        var re = /^\d{0,8}\.{0,1}(\d{1,2})?$/
        var flagData = $(event.currentTarget).attr('id')
        console.log(flagData)
        switch (flagData) {
          case 'priceValidateFirst':
            if (!re.test(this.paymentAmount)) {
              this.paymentAmount = ""
            }
            break
          case 'priceValidateSecond':
            if (!re.test(this.newSinglePrice)) {
              this.newSinglePrice = ''
            }
            break
        }
      },
//      会员请求数据
      memberRequest: function () {
        this.$http({
            url: requestUrl + '/front-system/user/show/' + this.member.memberCode,
            headers: {'X-Overpowered-Token': token}
          })
          .then(function (response) {
            if (response.data.body) {
              this.member.memberId = response.data.body.id
              this.memberCount = response.data.body.balance
              this.settlementFlag = true
//            是否点击会员的确定
              this.memberFlag = true
            }else{
//            会员不存在的情况下
              if (response.data.code = '200009') {
                this.error = true
                this.messageTipModal = true
                this.messageTip = response.data.message
              } else {
                this.error = false
                this.messageTipModal = false
              }
            }
          }, function (err) {
            console.log(err)
          })
      },
//      会员结算
      memberUpload: function () {
        this.messageTipModal = false
        this.memberModal = false
        switch (orderType) {
          case 1:
            this.messageTipModal = true
            this.messageTip = '支付成功'
            break
          case 2:
            this.creditlBill = true
            break
          case 3:
            this.messageTip = '支付成功'
            break
        }
      },
//     结算请求成功后的函数
      setFinish: function (response) {
        if (response.data.body) {
          this.finalPrice = Number((response.data.body.total_sum * 0.01)).toFixed(2)
          Number(this.finalPrice) == 0 ? this.finalPrice = this.totalPrice : this.finalPrice
          orderMount = response.data.body.total_sum
        }else{
          if(response.data.code ==='200007'){
            this.error = true
            this.messageTipModal = true
            this.messageTip = response.data.message
          }
          else{
            this.error = true
            this.messageTipModal = true
          }
        }
        if (this.settlementFlag) {
//          判断支付方式是不是会员余额支付
          if (this.order_mata_data.payment === 'vip') {
            if (this.member.memberCode === '') {
              this.messageTip = '您需要填写您的会员信息'
              this.messageTipModal = true
              this.error = true
            }
          } else {
            switch (orderType) {
              case 1:
                this.retailBill = true
                break
              case 2:
                if (response.data.code === "200008") {
                  this.messageTipModal = true
                  this.error = true
                  this.messageTip = response.data.message
                } else {
                  this.messageTipModal = false
                  this.error = false
                  this.creditlBill = true
                }
                break
              case 3:
                this.retailBill = true
                break
            }
          }
        } else {
          return false
        }
      },
//    结算
      settlement: function () {
        if(this.settlementFlag === false){
          return
        }
        this.order_mata_data.user_id = this.member.memberId
        var settlementData = {}
        orderItems = []
        window.localStorage.setItem('orderType', this.order_mata_data.order_type)
        orderType = Number(window.localStorage.getItem('orderType'))
        $.each(this.checkedGoodsList, function (index, val) {
          var obj = {}
          obj['goods_id'] = val.id
          obj['amount'] = val.count
          obj['price'] = val.goodPrice
          obj['note'] = val.priceNote
          orderItems.push(obj)
        })
        settlementData = {
          'items': orderItems,
          'order_meta_data': this.order_mata_data,
          'get_order_price': 1
        }
        this.settlementRequest(settlementData, this.setFinish)
      },
//      零售账单结算提交成功回调函数
      setuploadFinish: function () {
        orderType = Number(window.localStorage.getItem('orderType'))
        this.order_mata_data.paymentAmount = ""
        this.settlementFlag = false
        this.retailBill = false
        this.checkedGoodsList = []
        window.location.href = '/?#!/site/tranquery'
      },
//      订单抹零请求后的函数
      truncateFinish: function (response) {
        this.finalPrice = Number((response.data.body.total_sum * 0.01)).toFixed(2)
      },
//      订单抹零
      truncateMethod: function () {
        if (this.truncate) {
          var settlementData = {
            'items': orderItems,
            'order_meta_data': this.order_mata_data,
            'truncate': 1,
            'get_order_price': 1
          }
          this.settlementRequest(settlementData, this.truncateFinish)
        } else {
          this.finalPrice = Number((orderMount * 0.01)).toFixed(2)
        }
      },
//      零售账单结算提交
      settlementUpload: function (event) {
        var settlementData = {}
        settlementData = {
          'items': orderItems,
          'order_meta_data': this.order_mata_data,
          'all_total': this.paymentAmount * 1000
        }
        this.settlementRequest(settlementData, this.setuploadFinish)
      },
//      挂账订单结算提交
      billUpload: function () {
//        类似零售账单
        this.settlementUpload()
      }
    },
    data: function () {
      return {
        memberCount: 0,
        goodsNote: '',
        paymentAmount: '',
        couponSelected: 0,
        couponName: [],
        truncate: false,
        error: false,
        retailBill: false,
        retailBillSize: 'modal-sm',
        creditlBill: false,
        creditlBillSize: 'modal-sm',
        isDelete: false,
        deleteModalSize: 'modal-sm',
        priceAdjectModal: false,
        priceAdjectModalSize: 'modal-sm',
        memberModal: false,
        memberModalSize: 'modal-sm',
        messageTipModal: false,
        messageTipModalSize: 'modal-sm',
        messageTip: 'high，这是友情提示框',
        memberFlag: false,
        member: {
          memberCode: '',
          memberId: ''
        },
        search: '',
        originalPrice: 0,
        finalPrice: 0,
        order_mata_data: {
          order_type: 1,
          coupon_name: '无优惠',
          user_id: '',
          payment: 'cash',
          strategy_id: '',
          order_note: '',
          coupon_note: ''
        },
        settlementFlag: false,
        sellMark: false,
        priceNote: '',
        newSinglePrice: '',
        count: 1,
        category: [],
        page: [],
        productFromCategory: [
          {
            'name': '28-测试普通商品',
            'code': 'P101N100028',
            'sell_unit_stock': 10,
            'original_price': 2050,
            'sell_mark': 1,
            'category_id': 2,
            'id': 28
          },
          {
            'name': '29-测试普通商品',
            'code': 'P101N100029',
            'sell_unit_stock': 0,
            'original_price': 2400,
            'sell_mark': 1,
            'category_id': 2,
            'id': 29
          },
          {
            'name': '30-测试普通商品',
            'code': 'P101N100030',
            'sell_unit_stock': 0,
            'original_price': 2050,
            'sell_mark': 2,
            'category_id': 2,
            'id': 30
          },
          {
            'name': '31-测试普通商品',
            'code': 'P101N100031',
            'sell_unit_stock': 10,
            'original_price': 2000,
            'sell_mark': 2,
            'category_id': 2,
            'id': 31
          }
        ],
        checkedGoodsList: [],
        gridOperate: true
      }
    },
    computed: {
      totalPrice: function () {
        var checkedGoodsList = this.checkedGoodsList
        var initValue = 0
        $.each(checkedGoodsList, function (index, value) {
          initValue += Number(value.count) * Number(value.goodPrice)
        })
        return initValue.toFixed(2)
      }
    }
  }
</script>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
  .index-list-porducts {
    height: 442px;
  }

  .modal-body {
    text-align: center;
    height: 15px;
  }

  .modal-body span {
    margin-left: 20px;
  }

  .color {
    color: red
  }
</style>

