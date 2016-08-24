<template>
  <site-nav></site-nav>
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
          <input type="text" class="form-control" placeholder="" v-model="note">
          <label>收货时间</label>
          <date-picker :value.sync="time"></date-picker>
        </div>
        <span class="btn btn-info" @click="inclucdeData">引用原始数据</span>
        <span class="btn btn-primary" data-toggle="modal" @click="goodsUpload">提交入货</span>
      </form>
    </div>
    <!--入库明细入库汇总-->
    <div>
      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active" @click="changeActive($event)" id="1"><a href="javascript:void(0)" data-toggle="tab">入库明细</a></li>
        <li role="presentation" @click="changeActive($event)" id="2"><a href="javascript:void(0)" data-toggle="tab">入库汇总</a></li>
      </ul>
      <!-- Tab panes -->
      <div class="tab-content">
        <!-- 入库明细 -->
        <div role="tabpanel" class="tab-pane active" v-if="detailModal">
          <table class="table table-striped table-bordered table-hover">
            <thead>
            <tr class="text-center">
              <th v-for="value in  gridColumns">
                {{value}}
              </th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr class="text-center" v-for="entry in renderstockGoods" track-by="$index" :id="[entry.id ? entry.id : '']">
              <td>{{entry.item_code}}</td>
              <td>{{entry.item_name}}</td>
              <td>{{entry.purchase_amount}}</td>
              <td>{{entry.main_reference_value}}</td>
              <td><count :count.sync = 'entry.realInstock_amount'></count></td>
              <td>{{entry.unit_name}}</td>
              <td>{{entry.unit_specification}}</td>
              <td>{{entry.reference_number}}</td>
              <td>
                <slot name="operate">
                  <list-delete :delete-data.sync="tableData" ></list-delete>
                </slot>
              </td>
            </tr>
            </tbody>
          </table>
          <!--&lt;!&ndash; 翻页 &ndash;&gt;-->
          <!--<page :total="page.total" :current.sync="page.current_page" :display="page.per_page"-->
          <!--:last-page="page.last_page"></page>-->
        </div>

        <!-- 入库汇总 -->
        <div role="tabpanel" class="tab-pane active"  v-if="summaryModal">
          <table class="table table-striped table-bordered table-hover">
            <thead>
            <tr class="text-center">
              <th v-for="value in  gridColumns1">
                {{value}}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr class="text-center" v-for="entry in summarystockGoods" track-by="$index" :id="[entry.id ? entry.id : '']">
              <td>{{entry.item_code}}</td>
              <td>{{entry.item_name}}</td>
              <td>{{entry.item_purchase_amount}}</td>
              <td>{{entry.item_main_reference_value}}</td>
              <td>{{entry.item_realInstock_amount}}</td>
              <td>{{entry.unit_name}}</td>
              <td>{{entry.unit_specification}}</td>
            </tr>
            </tbody>
          </table>
          <!--&lt;!&ndash; 翻页 &ndash;&gt;-->
          <!--<page :total="page.total" :current.sync="page.current_page" :display="page.per_page"-->
          <!--:last-page="page.last_page"></page>-->
        </div>
      </div>
    </div>
  </div>
  <!--引入原始数据-->
  <introduce-data
    :title="origenData.title"
    :url="origenData.dataUrl"
    :second-url="origenData.secondUrl"
    :instroduce-data-modal.sync='parentIntroModal'
    :instroduce-data-modal-size="parentIntroModalSize"
    :first-data-title="origenData.firstDataTitle"
    :first-data.sync="origenData.firstData"
    :second-data-title="origenData.secondDataTitle"
    :second-data.sync="origenData.secondData">
  </introduce-data>
  <!--错误信息弹出-->
  <error-tip :err-modal.sync="messageTipModal" :err-info="messageTip"></error-tip>
</template>
<script>
  import $ from 'jquery'
  import SiteNav from '../SiteNav'
  import IntroduceData from '../../common/IntroduceData'
  import Count from '../../common/Count'
  import Grid from '../../common/Grid'
  import Page from '../../common/Page'
  import Modal from '../../common/Modal'
  import ErrorTip from '../../common/ErrorTip'
  import DatePicker from  '../../common/DatePicker'
  import ListDelete from '../../common/ListDelete'
  import Summary from '../../common/Summary'
  import {requestUrl, token, requestSystemUrl,detailGoodsInfo,error,postSiteDataToApi} from '../../../publicFunction/index'
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
      Summary: Summary,
      ErrorTip: ErrorTip,
      ListDelete: ListDelete,
      SiteNav: SiteNav
    },
    events: {
//      确认增加
      includeConfirmAdd: function () {
        var self = this
        var saveDataArray = []
        var detailArrayFromApi = []
        detailGoodsInfo(this.origenData.secondData,'Requisition')
        saveDataArray = this.stockGoods.concat(this.origenData.secondData)
        $.each(saveDataArray, function (index, val) {
          if (val.choice && !val.again) {
            val.again = true
            self.dataArray.push(val)
          }
        })
        console.log(self.dataArray)
        this.renderstockGoods = self.dataArray
      },
//    绑定翻页事件
      pagechange: function (currentpage) {
//        this.detailListData(currentpage)
        console.log(currentpage)
      },
//    删除商品
      delete: function (id) {
        var self = this
        $.each(this.renderstockGoods, function (index, val) {
          if (val.id === id) {
            self.renderstockGoods.splice(index, 1)
            val.choice = false
            val.again =  false
          }
        })
      }
    },
    methods: {
//    删除弹出框
      isDelete: function (event) {
        var currentId = Number($(event.currentTarget).parents('tr').attr('id'))
        deleteId = currentId
        this.deleteModal = true
      },
//    确认删除
      confirmDelelte: function () {
        var goodList = this.rederStockGoods
        this.deleteModal = false
        $.each(goodList, function (index, val) {
          if (val.id === deleteId) {
            goodList.splice(index, 1)
          }
        })
      },
//     引入数据
      inclucdeData: function () {
        this.parentIntroModal = true
        this.$broadcast('getGoodsWhenClick')
      },
//     提交入货
      goodsUpload: function () {
        var goods = []
        $.each(this.renderstockGoods, function (index, val) {
          var obj = {}
          obj['reference_id'] = val.id
          obj['amount'] = val.realInstock_amount
          goods.push(obj)
        })
        if (this.time === '') {
          this.messageTipModal = true
          this.messageTip = 'high,你还没有填写日期哟'
        } else if (this.renderstockGoods.length < 1) {
          this.messageTipModal = true
          this.messageTip = 'high,你忘记添加商品了哟'
        } else {
          this.$http.post(requestUrl + '/front-system/stock/recipient', {
            'items': goods,
            'operated_at': this.time,
             note: this.note
          }, {
            headers: {'X-Overpowered-Token': token}
          }).then(function (response) {
            window.location.href = '?#!/site/instock/AllotNum/'
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
      },
//       入库明细与入库汇总切换
      changeActive: function (event) {
        var cur = $(event.currentTarget)
        cur.addClass('active').siblings('li').removeClass('active')
        switch (Number(cur.attr('id'))){
          case 1:
            this.detailModal = true
            this.summaryModal = false
            break
          case 2:
            this.detailModal = false
            this.summaryModal = true
            this.summary()
        }
      },
//     汇总方法
      summary: function () {
        var self = this
        this.summarystockGoods = []
        this.summarystockGoods =this.summarystockGoods.concat(self.renderstockGoods)
        $.each(this.summarystockGoods,function (index,val){
          val.item_purchase_amount = val.purchase_amount
          val.item_main_reference_value = val.main_reference_value
          val.item_realInstock_amount = val.realInstock_amount
        })
        this.summarystockGoods = this.summaryMethod ("item_code", this.summarystockGoods)
      },
//    汇总方法
      summaryMethod: function  (ObjPropInArr, array){
        var hash={};
        var result=[];
        for(var i=0;i<array.length;i++){
          if(hash[array[i][ObjPropInArr]]){
            hash[array[i][ObjPropInArr]].item_purchase_amount=Number(array[i].item_purchase_amount) + Number( hash[array[i][ObjPropInArr]].item_purchase_amount)
            hash[array[i][ObjPropInArr]].item_main_reference_value=Number(array[i].item_main_reference_value) + Number( hash[array[i][ObjPropInArr]].item_main_reference_value)
            hash[array[i][ObjPropInArr]].item_realInstock_amount=Number(array[i].item_realInstock_amount) + Number( hash[array[i][ObjPropInArr]].item_realInstock_amount)
          }else{
            hash[array[i][ObjPropInArr]]=array[i];
          }
        }
        for(var j in hash){
          result.push(hash[j])
        }
        return result
      },
    },
    data: function () {
      return {
//       入库明细
        detailModal: true,
//       入库汇总
        summaryModal: false,
        note: '',
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
        renderstockGoods: [],
        renderData: [],
        summryData: [],
        detailData: [],
        page: [],
        origenData: {
          title: '原始配送出货单',
          dataUrl: requestSystemUrl + '/front-system/reference-document/distribution',
          secondUrl: requestSystemUrl + '/front-system/reference-document/requisition',
          firstDataTitle: {
            "document_number": "配送单号",
            "store_name": "调出仓库",
            "amount": "配送数量",
            "created_at": "配送日期",
            "creator_name": "制单人",
            "auditor_name": "审核人"
          },
          firstData: [],
          secondDataTitle: {
            "item_code": "货号",
            "item_name": "品名",
            "purchase_amount": "要货数量",
            "main_reference_value":"配送数量",
            "unit_name": "单位",
            "unit_specification": "单位规格"
          },
          secondData: []
        },
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
        summarystockGoods: [],
        gridColumns1: {
          goods_code: '货号',
          goods_name: '品名',
          recipient_amount: '要货数量',
          distribution_amount: '配送数量',
          current_amount: '实际入库量',
          unit: '单位',
          unit_specification: '单位规格',
        }
      }
    }
  }
</script>
