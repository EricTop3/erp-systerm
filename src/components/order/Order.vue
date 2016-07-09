<template>
  <div class='contcainer-fluid mt20 mr20'>
    <div class='col-lg-5'>
      <!--首页左侧表格区域-->
      <div style='height:532px; overflow: auto;'>
        <table class='table table-striped table-border table-hover'>
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
                  <select class='form-control' style='width: 150px;'>
                    <option>无优惠</option>
                  </select>
                </div>
                <div class='form-group ml10'>
                  <input type='email' class='form-control' placeholder='优惠备注'>
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
                  <input type='text' class='form-control' placeholder='请填写会员卡号'>
                </div>
                <div class='form-group ml10'>
                  <label>会员密码</label>
                  <input type='email' class='form-control'>
                </div>
                <button type='submit' class='btn btn-primary ml10'>确定</button>
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
                  <textarea class='form-control' rows='3'></textarea>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class='contcainer-fluid index-jiesuan'>
          <div class='col-xs-9'>
            <p class='f18'>原订单金额：<span><strong>￥{{totalPrice}}</strong></span></p>

            <p class='c-erp f18'>实际订单额：<span><strong>￥{{finalPrice|priceChange}}</strong></span></p>
          </div>
          <div class='col-xs-3'><span class='btn  btn-lg' data-toggle='modal'
                                      :disabled="!order_mata_data.settlementFlag"
                                      :class="{'btn-primary':order_mata_data.settlementFlag,'btn-warning':!order_mata_data.settlementFlag}"
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
            :class="{'tejia':item.sell_mark===2,'disabled':item.sell_unit_stock<=0}" :stock='item.sell_unit_stock'
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
              <input type='text' class='form-control' placeholder='请输入商品名或商品编号'>
            </div>
            <button type='submit' class='btn btn-primary'>搜索</button>
            <span class='btn btn-warning'>撤销搜索</span>
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
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">支付</h4>
    </div>
    <div slot="body">
      <div class="form-group">
        <label for="" class="col-sm-4 control-label">订单金额</label>

        <div class="col-sm-8">
          <p class="form-control-static">{{finalPrice|priceChange}}</p>
        </div>
      </div>
      <div class="form-group">
        <label for="" class="col-sm-4 control-label">订单抹零</label>

        <div class="col-sm-8">
          <input type="checkbox" v-model="order_mata_data.isGiveZero">
        </div>
      </div>
      <div class="form-group">
        <label for="" class="col-sm-4 control-label">支付金额</label>

        <div class="col-sm-8">
          <input type="text" class="form-control" id="priceValidateFirst" v-model="order_mata_data.paymentAmount"
                 @input=priceAjectValdate($event)>
        </div>
      </div>
      <div class="form-group">
        <label for=""
               class="col-sm-4 control-label">找零</label>

        <div class="col-sm-8">
          <p class="form-control-static">￥{{ order_mata_data.oldPayment > order_mata_data.paymentAmount ? 0 :
            order_mata_data.paymentAmount-order_mata_data.oldPayment
            }}</p>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="settlementUpload()">提交</button>
    </div>
  </modal>
  <!--结算挂账账单弹窗-->
  <modal :show.sync="creditlBill" :modal-size="creditlBillSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
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
      <button type='button' class='close' data-dismiss='modal' aria-label='Close'><span
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
</template>
<script>
  import $ from 'jquery'
  import Modal from '../common/Modal'
  import CountContainer from '../common/CountContainer'
  import Page from '../common/Page'
  import Slide from 'vue-slide'
  import {requestUrl,token} from '../../publicFunction/index'
  //  商品信息数组
  var orderItems = []
  var deleteCheckedGoodId = ''
  var priceCheckdGoodId = ''
  export default {
    components: {
      CountContainer: CountContainer,
      Modal: Modal,
      Page: Page,
      Slide: Slide
    },
    compiled: function () {
//        分类
      this.$http({
        url: requestUrl + '/front-system/order/category',
        method: 'get'
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
        }
      }).then(function (response) {
        this.productFromCategory = response.data.body.list
        this.page = response.data.body.pagination
      }, function (err) {
        console.log(err)
      })
    },
    ready: function () {
      const orderType = $('.ordertype-list')
      const payment = $('.pay-list')
      var $this = this

      function changeActive(elem, elemSon) {
        var orderTypeData = ''
        var paymentData = ''
        elem.on('click', elemSon, function () {
          $(this).addClass('active').siblings().removeClass('active')
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
              paymentData = 'balance'
              break
          }
          if (elem === orderType) {
            $this.order_mata_data.order_type = orderTypeData
          } else {
            $this.order_mata_data.payment =  paymentData
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
//      结算请求
      settlementRequest: function (data) {
        this.$http.post(
          requestUrl + '/front-system/order/order',
          {
            'items': orderItems,
            'order_meta_data': this.order_mata_data,
            'get_order_price': 1
          },
          {
            headers: {'X-Overpowered-Token': token
            }
          }).then(function (response) {
            this.finalPrice = response.data.body.total_sum
            if (this.order_mata_data.settlementFlag) {
              switch (orderType) {
                case 1:
                  this.retailBill = true
                  break
                case 2:
                  this.creditlBill = true
                  break
              }
            } else {
              return false
            }
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
//       判断是否是特价
        currentSaleMark === 2 ? this.saleMark = true : this.saleMark = false
//        判断库存是否为零
        if (currentStock <= 0) {
          return false
        } else {
//          结算的状态
          this.order_mata_data.settlementFlag = true
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
          this.order_mata_data.settlementFlag = false
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
            if (val.saleMark === 2) {
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
            if (!re.test(this.order_mata_data.paymentAmount)) {
              this.order_mata_data.paymentAmount = ''
            }
            break
          case 'priceValidateSecond':
            if (!re.test(this.newSinglePrice)) {
              this.newSinglePrice = ''
            }
            break
        }
      },
//    结算
      settlement: function () {
        var orderType = this.order_mata_data.order_type
        console.log(orderType)
        $.each(this.checkedGoodsList, function (index, val) {
          var obj = {}
          obj['goods_id'] = val.id
          obj['amount'] = val.count
          obj['price'] = val.goodPrice
          orderItems.push(obj)
        })
        this.$http.post(
          requestUrl + '/front-system/order/order',
          {
            'items': orderItems,
            'order_meta_data': this.order_mata_data,
            'get_order_price': 1
          },
          {
            headers: {'X-Overpowered-Token': token
            }
          }).then(function (response) {
          this.finalPrice = response.data.body.total_sum
          if (this.order_mata_data.settlementFlag) {
            switch (orderType) {
              case 1:
                this.retailBill = true
                break
              case 2:
                this.creditlBill = true
                break
            }
          } else {
            return false
          }
        }, function (err) {
          console.log(err)
        })
      },
//      零售账单结算提交
      settlementUpload: function () {
        this.$http.post(requestUrl + '/front-system/order/order', {
          'items': orderItems,
          'order_meta_data': this.order_mata_data
        }, {
          headers: {
            'X-Overpowered-Token': token
          }
        }).then(function (response) {
          this.order_mata_data.paymentAmount = ''
          this.checkedGoodsList = []
          this.order_mata_data.settlementFlag = false
          this.retailBill = false
          window.location.href = '/?#!/tranquery'
        }, function (err) {
          console.log(err)
        })
      },
//      挂账订单结算提交

    },
    data: function () {
      return {
        retailBill: false,
        retailBillSize: 'modal-sm',
        creditlBill: false,
        creditlBillSize: 'modal-sm',
        isDelete: false,
        deleteModalSize: 'modal-sm',
        priceAdjectModal: false,
        priceAdjectModalSize: 'modal-sm',
        originalPrice: 0,
        finalPrice: 0,
        order_mata_data: {
          order_type: 1,
          coupen_name: '七折优惠',
          payment: 'cash',
          discount: 0.7,
          strategy_id: 1,
          settlementFlag: false,
          orderFlag: true,
          settlementFlag: false
        },
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
</style>

