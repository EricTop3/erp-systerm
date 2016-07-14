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
          <date-picker :value="time"></date-picker>
        </div>
        <span class="btn btn-info" data-toggle="modal" data-target="#inventory-cite-templ"
              @click="parentIntroModal=true">引用原始数据</span>
        <span class="btn btn-primary" data-toggle="modal" @click="goodsUpload()">提交入货</span>
      </form>
    </div>

    <div>
      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active"><a href="#detail" data-toggle="tab">入库明细</a></li>
        <li role="presentation"><a href="#summary" data-toggle="tab">入库汇总</a></li>
      </ul>

      <!-- Tab panes -->
      <div class="tab-content">
        <!-- 入库明细 -->
        <div role="tabpanel" class="tab-pane active" id="detail">
          <!-- 表格 -->
          <table class="table table-striped table-border table-hover">
            <thead>
            <tr class="text-center">
              <td class="text-left">货号</td>
              <td>品名</td>
              <td>要货数量</td>
              <td>配送数量</td>
              <td>实际入库量</td>
              <td>单位</td>
              <td>单位规格</td>
              <td>来源单号</td>
              <td>操作</td>
            </tr>
            </thead>
            <tbody>
            <tr class="text-center" v-for="item in rederStockGoods" track-by="$index" :id="item.id">
              <td class="text-left">{{item.goods_code}}</td>
              <td>{{item.goods_name}}</td>
              <td>{{item.demanding_number}}</td>
              <td>{{item.distribution_number}}</td>
              <td align="center">
                <count :count.sync='item.now_number'></count>
              </td>
              <td>{{item.unit}}</td>
              <td>{{item.unit_specification}}</td>
              <td>{{item.store_distribution_id}}</td>
              <td><span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#inventory-del-templ"
                        @click="isDelete($event)">删除</span></td>
            </tr>
            </tbody>
          </table>

          <!-- 翻页 -->
          <page :total='page.total' :current.sync='page.current_page' :display='page.per_page'
                :last-page='page.last_page'></page>

        </div>

        <!-- 入库汇总 -->
        <div role="tabpanel" class="tab-pane" id="summary">
          <table class="table table-striped table-border table-hover">
            <thead>
            <tr class="text-center">
              <td class="text-left">货号</td>
              <td>品名</td>
              <td>要货数量</td>
              <td>配送数量</td>
              <td>实际入库量</td>
              <td>单位</td>
              <td>单位规格</td>
            </tr>
            </thead>
            <tbody>
            <tr class="text-center" v-for="item in renderData">
              <td class="text-left">{{item.goods_code}}</td>
              <td>{{item.goods_name}}</td>
              <td>{{item.demanding_number}}</td>
              <td>{{item.distribution_number}}</td>
              <td>{{item.now_number}}</td>
              <td>{{item.unit}}</td>
              <td>{{item.unit_specification}}</td>
            </tr>
            </tbody>
          </table>

          <!-- 翻页 -->
          <page :total='page.total' :current.sync='page.current_page' :display='page.per_page'
                :last-page='page.last_page'></page>

        </div>
      </div>
    </div>

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
</template>
<script>
  import $ from 'jquery'
  import IntroduceData from '../common/IntroduceData'
  import Count from '../common/Count'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import Modal from '../common/Modal'
  import DatePicker from  '../common/DatePicker'
  import {requestUrl, token} from '../../publicFunction/index'
  var deleteId = ''
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      Count: Count,
      DatePicker: DatePicker,
      IntroduceData: IntroduceData
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
        this.rederStockGoods = self.dataArray
        $.each(this.rederStockGoods, function (index, val) {
          $.each(self.citeData, function (index1, val1) {
            if (val.store_distribution_id === val1.id) {
              val.store_distribution_id = val1.code
            }
          })
        })
        this.renderData = self.dataArray
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
        console.log('nbo')
        var goods = []
        $.each(this.rederStockGoods, function (index, val) {
          var obj = {}
          obj['id'] = val.id
          obj['amount'] = val.now_number
          goods.push(obj)
        })
        this.$http.post(requestUrl + '/front-system/stock/recipient', {
          'goods': goods
        }, {
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          window.location.href = '?#!/instock/AllotNum/1'
        }, function (error) {
          console.log(err)
        })
      }
    },
    data: function () {
      return {
        time: '',
        citeData: [],
        renderData: [],
        parentIntroModal: false,
        parentIntroModalSize: 'modal-lg',
        deleteModal: false,
        deleteModalSize: 'modal-sm',
        stockGoods: [],
        dataArray: [],
        rederStockGoods: [],
        page : []
      }
    }
  }
</script>
