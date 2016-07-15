<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">收货单汇总</li>
      <li class="active">查看收货单</li>
    </ol>

    <!-- 页头 -->
    <div class="page-header text-center">
      <form action="" method="post" class="form-inline">
        <div class="form-group">
          <label>备注</label>
          <input type="text" class="form-control" placeholder="">
          <label>收货时间</label>
          <date-picker :value.sync="time"></date-picker>
        </div>
        <span class="btn btn-info" data-toggle="modal" data-target="#inventory-cite-templ"
              @click="parentIntroModal=true">引用原始数据</span>
        <span class="btn btn-primary" data-toggle="modal" @click="goodsUpload()">提交入货</span>
      </form>
    </div>
    <!--表格 -->
    <summary :table-header="gridColumns" :summary-data="summryData" :table-data="detailData" :page="page"   :detail-url="detailUrl" :tab-flag="tabFlag"></summary>
  </div>
  <!--模态框-删除-->
  <modal :show.sync="deleteModal" :modal-size="deleteModalSize">
    <div slot="header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
        aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">删除</h4>
    </div>
    <div slot="body">
      <h4>删除弹出框！</h4>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="confirmDelelte()">保存</button>
      <button type="button" class="btn btn-default" data-dismiss="modal" @click="deleteModal=false">关闭</button>
    </div>
  </modal>
  <!--模态框-引用原始数据-->
  <introduce-data :instroduce-data-modal.sync='parentIntroModal'
                  :instroduce-data-modal-size="parentIntroModalSize" :add-data.sync="stockGoods"></introduce-data>
  <!--模态框HTML-->

  <!--错误信息弹出-->
  <modal :show.sync='messageTipModal' :modal-size="messageTipModalSize" class='form-horizontal'>
    <div slot='header'>
      <button type='button' class='close' data-dismiss='modal' @click="priceAdjectModal=false" aria-label='Close'><span
        aria-hidden='true' @click="messageTipModal=false">&times;</span></button>
      <h4 class='modal-title'>友情提示</h4>
    </div>
    <div slot='body'>
      <div class='form-group'>
        <p class="modal-body">{{messageTip}}</p>
      </div>
    </div>
    <div slot='footer'>
      <button type='button' class='btn btn-primary' @click='messageTipModal = false'>关闭</button>
    </div>
  </modal>
</template>
<script>
  import $ from 'jquery'
  import IntroduceData from '../common/IntroduceData'
  import Count from '../common/Count'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import Modal from '../common/Modal'
  import DatePicker from  '../common/DatePicker'
  import Summary from '../common/Summary'
  import {requestUrl, token} from '../../publicFunction/index'
  var deleteId = ''
  var data = []
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      Count: Count,
      DatePicker: DatePicker,
      IntroduceData: IntroduceData,
      Summary: Summary
    },
    events: {
//      确认增加
      confirmAdd: function () {
        var self = this
        $.each(self.stockGoods, function (index, val) {
          if (val.checked) {
            self.dataArray.push(val)
          }
        })
        data =  self.dataArray
        this.rederStockGoods = self.dataArray
        $.each(this.rederStockGoods, function (index, val) {
          val.now_number = val.distribution_number
          $.each(self.citeData, function (index1, val1) {
            if (val.store_distribution_id === val1.id) {
              val.store_distribution_id = val1.code
            }
          })
        })
        this.detailData =  this.rederStockGoods
      },
//    入库汇总函数双循环遍历数量相加
      summary: function () {
        var goodsName = []
        var self = this
        self.summryData = self.rederStockGoods
        $.each(self.summryData,function(index,val){
           var currentName = val.goods_name
           for(var i= index + 1; i<self.summryData.length; i++){
             if(self.summryData[i]['goods_name']){
               if(self.summryData[i]['goods_name'] === currentName ) {
                 val.demanding_number = Number(val.demanding_number) + Number(self.summryData[i].demanding_number)
                 val.distribution_number = Number(val.distribution_number) + Number(self.summryData[i].distribution_number)
                 val.now_number =  Number(val.now_number) + Number(self.summryData[i].now_number)
                 self.summryData.splice(i, 1)
               }
             }
           }
        })
        self.rederStockGoods =   this.detailData
      },
//      入库明细函数
      detail: function () {
        this.detailData = data
      },
//    绑定翻页事件
      pagechange: function (currentpage) {
//        this.detailListData(currentpage)
        console.log(currentpage)
      }
    },
    ready: function () {
      this.listData(1)
    },
    methods: {
//      删除弹出框
      isDelete: function (event) {
        var currentId = Number($(event.currentTarget).parents('tr').attr('id'))
        deleteId = currentId
        this.deleteModal = true
      },
//      确认删除
      confirmDelelte: function () {
        var goodList = this.rederStockGoods
        this.deleteModal = false
        $.each(goodList, function (index, val) {
          if (val.id === deleteId) {
            goodList.splice(index, 1)
          }
        })
      },
//   列表数据渲染
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/store/resource',
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.citeData = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      },
//      提交入货
      goodsUpload: function () {
        var goods = []
        $.each(this.rederStockGoods, function (index, val) {
          var obj = {}
          obj['consumable_id'] = val.id
          obj['consumable_amount'] = val.now_number
          obj['distribution_amount'] = Number(val.distribution_number)
          goods.push(obj)
        })

        if (this.time === '') {
          this.messageTipModal = true
          this.messageTip = 'high,你还没有填写日期哟'
        } else if (this.rederStockGoods.length < 1) {
          this.messageTipModal = true
          this.messageTip = 'high,你忘记添加商品了哟'
        } else {
          this.$http.post(requestUrl + '/front-system/stock/recipient', {
            'items': goods,
            'date': this.time
          }, {
            headers: {'X-Overpowered-Token': token}
          }).then(function (response) {
            window.location.href = '?#!/instock/AllotNum/1'
          }, function (err) {
            if(err.data.code==='100000' || err.data.code==='900000'){
              this.messageTipModal = true
              this.messageTip = 'high,你实际入库量不能为空哟'
            }
            if(err.data.code==='200013'){
              this.messageTipModal = true
              this.messageTip = 'high,你实际入库量不能大于配送数量哟'
            }
          })
        }
      }
    },
    data: function () {
      return {
        time: '',
        tabFlag: true,
        messageTip: '请填写正确的信息！',
        citeData: [],
        messageTipModal: false,
        messageTipModalSize: 'modal-sm',
        parentIntroModal: false,
        parentIntroModalSize: 'modal-lg',
        deleteModal: false,
        deleteModalSize: 'modal-sm',
        stockGoods: [],
        dataArray: [],
        rederStockGoods: [],
        renderData: [],
        summryData: [],
        detailData: [],
        page: [],
        gridColumns: {
          goods_code: '货号',
          goods_name: '品名',
          recipient_amount: '要货数量',
          distribution_amount: '配送数量',
          current_amount: '实际入库量',
          unit: '单位',
          unit_specification: '单位规格',
          order_source_code: '来源单号'
        },
      }
    }
  }
</script>
