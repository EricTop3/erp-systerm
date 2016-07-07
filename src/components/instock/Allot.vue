<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">收货汇总</li>
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
        <span class="btn btn-primary" data-toggle="modal">提交入货</span>
      </form>
    </div>

    <div>
      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active"><a href="#detail" data-toggle="tab">入库明细</a></li>
        <li role="presentation"><a href="#summary" data-toggle="tab">入库汇总</a></li>
      </ul>

      <!-- Tab panes -->
      <div class="tab-content">
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
              <td>{{item.recipient_number}}</td>
              <td>{{item.distribution_number}}</td>
              <td align="center">
                <count :count='item.now_number'></count>
              </td>
              <td>{{item.unit}}</td>
              <td>{{item.unit_specification}}</td>
              <td>{{item.order_source_code}}</td>
              <td><span class="btn btn-primary btn-sm" data-toggle="modal" data-target="#inventory-del-templ"
                        @click="isDelete($event)">删除</span></td>
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
              <td align="center">
                <count :count.sync='item.is_number'></count>
              </td>
              <td>{{item.goods_name}}</td>
              <td>{{item.demanding_number}}</td>
              <td>{{item.distribution_number}}</td>
              <td>{{item.unit}}</td>
              <td>{{item.unit_specification}}</td>
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
  import {requestUrl} from '../../publicFunction/index'
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
        self.dataArray = []
        this.addGoodModal = false
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
          method: 'get'
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.citeData = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      }
    },
    data: function () {
      return {
        time: '',
        renderData: [],
        parentIntroModal: false,
        parentIntroModalSize: 'modal-lg',
        deleteModal: false,
        deleteModalSize: 'modal-sm',
        stockGoods: [],
        dataArray: [],
        rederStockGoods: []
      }
    }
  }
</script>
