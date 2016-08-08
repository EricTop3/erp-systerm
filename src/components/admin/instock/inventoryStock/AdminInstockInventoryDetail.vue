<template>
  <admin-nav></admin-nav>
  <div class="container-fluid">
    <div class="row">
      <left-instock></left-instock>
      <div class="col-lg-10">
        <!-- 路径导航 -->
        <ol class="breadcrumb">
          <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
          <li class="active">库存盘点</li>
          <li class="active">查看</li>
        </ol>

        <!-- 单条表格 -->
        <summary-detail
          :table-header="gridColumns"
          :table-data="list"
          :grid-operate="gridOperate"
          :edit-flag.sync="editFlag"
          :check-url = 'checkUrl'>
        </summary-detail>

        <!-- 列表表格 -->
        <table class="table table-striped table-border table-hover">
          <thead>
          <tr class="text-center">
            <td class="text-left">货号</td>
            <td>品名</td>
            <td>系统库存量</td>
            <td>实际库存量</td>
            <td>差异库存量</td>
            <td>单位</td>
            <td>单位规格</td>
          </tr>
          </thead>
          <tbody>
          <tr class="text-center" v-for="entry in detailList" track-by="$index" :id="[entry.id ? entry.id : '']">
            <td class="text-left">{{entry.item_code}}</td>
            <td>{{entry.item_name}}</td>
            <td>{{entry.system_stock}}</td>
            <td v-if='!editFlag'>{{entry.main_reference_value}}</td>
            <td v-if='editFlag'><count :count.sync =entry.main_reference_value :flag.sync="editFlag"></count></td>
            <td>{{entry.difference}}</td>
            <td>{{entry.unit_name}}</td>
            <td>{{entry.unit_specification}}</td>
          </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>
</template>
<style>
</style>
<script>
  import $ from 'jquery'
  import Grid from '../../../common/Grid'
  import Page from '../../../common/Page'
  import AdminNav from '../../AdminNav'
  import Modal from '../../../common/Modal'
  import Summary from '../../../common/Summary'
  import DatePicker from  '../../../common/DatePicker'
  import LeftInstock from '../../common/LeftInstock'
  import SummaryDetail from '../../../common/SummaryDetail'
  import Count from '../../../common/Count'
  import ErrorTip  from '../../../common/ErrorTip'
  import {
    requestUrl,
    requestSystemUrl,
    getDataFromApi,
    token,
    changeStatus,
    detailNull,
    searchRequest,
    deleteRequest,
    checkRequest,
    finishRequest,
    putDataToApi } from '../../../../publicFunction/index'
  export default{
    components: {
      Grid: Grid,
      Page: Page,
      Modal: Modal,
      AdminNav: AdminNav,
      Summary: Summary,
      DatePicker: DatePicker,
      LeftInstock:LeftInstock,
      SummaryDetail: SummaryDetail,
      Count: Count,
      ErrorTip: ErrorTip
    },
    events: {
/*//    绑定翻页事件
      pagechange: function (currentpage) {
        var self = this
        this.$http({
          url:requestSystemUrl + '/backend-system/stock/inventory',
          data: {
            page: currentpage
          },
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          self.page = response.data.body.pagination
          self.list = response.data.body.list
        }, function (err) {
          console.log(err)
        })
      },*/
//     完成請求
      finishFromApi: function (id) {
        var self = this
        finishRequest(requestSystemUrl +'/backend-system/stock/inventory/'+ id +'/finished',function(response){
          console.log('finished')
        })
      },
//         审核失败
      checkFail: function (err){
        var self = this
        if(Number(err.data.code) === 220000){
          self.modal.errModal = true
          self.modal.errInfo =  err.data.message
        }
      },
//      编辑
      editGoods: function (event) {
        this.editFlag = true
      },
//      保存
      saveGoods: function (event) {
        var self = this
        this.editFlag = false
        var id = self.$route.params.queryId
        var item = []
        $.each(self.detailList,function (index,val) {
          var obj = {}

          obj['reference_id'] = val.item_id
          obj['id'] = val.id
          obj['current_stock'] = val.current_stock
          obj['reference_type'] = val.item_type
          item.push(obj)
        })
        var data = {
          items: item
        }
        var url = requestSystemUrl + '/backend-system/stock/inventory/'+ id
        putDataToApi(url,data,function (res) {
          console.log('yes')
        })
      }
    },
    ready: function () {
      this.listData()
    },
    methods: {
      listData: function (page) {
        var currentId = this.$route.params.queryId
        var self = this
//        获取单条
        var oneUrl = requestSystemUrl + '/backend-system/stock/inventory/' + currentId + '/detail'
        getDataFromApi(oneUrl,{},function(response){
          self.list = response.data.body
          changeStatus(self.list)
        })
//        获取列表
        var listUrl = requestSystemUrl + '/backend-system/stock/inventory/' + currentId
        getDataFromApi(listUrl,{},function(response){
          self.detailList = response.data.body.list
        })
      }
    },
    data: function () {
      return {
        page: [],
        list: {},
        detailList: [],
        checkUrl: requestSystemUrl  + '/backend-system/stock/inventory/',
        editFlag: false,
        gridColumns: {
          document_number: '盘点单号',
          checked: '审核状态',
          c: '仓库',
          creator_name: '制单人',
          auditor_name: '审核人',
          created_at: '盘点日期',
          difference: '差异库存量'
        }
      }
    }
  }
</script>
