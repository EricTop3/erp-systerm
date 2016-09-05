<template>
  <site-nav></site-nav>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">盘点单汇总</li>
      <li class="active">查看盘点单</li>
    </ol>
    <!--列表汇总-->
    <table class="table table-striped table-bordered table-hover">
      <thead>
      <tr class="text-center">
        <th v-for="value in gridColumns">
          {{value}}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center">
        <td>{{onedata.document_number}}</td>
        <td>{{onedata.checked}}</td>
        <td>{{onedata.creator_name}}</td>
        <td>{{onedata.auditor_name}}</td>
        <td>{{onedata.created_at}}</td>
        <td>{{onedata.difference}}</td>
      </tr>
      </tbody>
    </table>

    <!-- 表格2 详情页面列表数据-->
    <table class="table table-striped table-bordered table-hover">
      <thead>
      <tr class="text-center">
        <th v-for="value in  gridColumns2">
          {{value}}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center" v-for="entry in listdata" track-by="$index" :id="[entry.id ? entry.id : '']">
        <td>{{entry.item_code}}</td>
        <td>{{entry.item_name}}</td>
        <td>{{entry.system_stock}}</td>
        <td v-if='editFlag'><count :count.sync='entry.main_reference_value'></count>{{entry.purchase_unit_name}}</td>
        <td v-if='!editFlag'>{{entry.main_reference_value}}</td>
        <td>{{entry.main_reference_value - entry.system_stock}}</td>
        <td>{{entry.unit_name}}</td>
        <td>{{entry.unit_specification}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  import Grid from '../../common/Grid'
  import SiteNav from '../SiteNav'
  import Count from '../../common/Count'
  import Page from '../../common/Page'
  import  SummaryDetail from '../../common/SummaryDetail'
  import {requestUrl, requestSystemUrl, token,error ,putDataToApi ,changeStatus} from '../../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      Count: Count,
      SummaryDetail: SummaryDetail,
      SiteNav: SiteNav
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
//        this.detailListData(currentpage)
        console.log(currentpage)
      },
//      编辑
      editGoods: function (event) {
        this.editFlag = true
        this.isExist =  true
      },
//      保存
      saveGoods: function (event) {
        var self = this
        var id = this.$route.params.queryId
        var item = []
        $.each(self.listdata,function (index,val) {
          var obj = {}
          obj['current_stock'] = val.main_reference_value
          obj['id'] = val.id
          obj['reference_id'] = val.item_id
          item.push(obj)
        })
        var data = {
          items: item
        }
        var url = requestSystemUrl + '/front-system/stock/inventory/'+ id
        putDataToApi(url,data,function (res) {
          self.editFlag = false
          self.isExist =  false
          self.detailListData(1)
          self.thisOneData()
        },function (err){
          self.editFlag = true
          self.isExist = true
          self.modal.errModal = true
          self.modal.errInfo = '服务器错误'
        })
      }
    },
    ready: function () {
      this.id = this.$route.params.queryId
//      单条数据渲染
      this.thisOneData()
//      明细列表渲染
      this.detailListData(1)
    },
    methods: {
//      当前id的一条数据
      thisOneData: function () {
        this.$http({
          url: requestUrl + '/front-system/stock/inventory/' + this.id + '/detail',
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.onedata = response.data.body
          changeStatus(this.onedata)

        }, function (err) {
          error(err)
        })
      },
//      明细列表渲染 /front-system/stock/inventory/{id}/detail
      detailListData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/inventory/' + this.id,
          method: 'get',
          headers: {'X-Overpowered-Token': token},
          data: {
            start_time: this.query.start_time || '',
            end_time: this.query.end_time || '',
            operation_type: this.query.operation_type || '',
            page: page,
            per_page: 10
          }
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.listdata = response.data.body.list
        }, function (err) {
          error(err)
        })
      }
    },
    data: function () {
      return {
        id: 0,
        isExist: false,
        editFlag: false,
        checkUrl: requestUrl + '/front-system/stock/inventory/',
        page: [],
        onedata: [],
        listdata: [],
        gridOperate: true,
        gridColumns: {
          document_number: '盘点单号',
          checked: '审核状态',
          creator_name: '制单人',
          auditor_name: '审核人',
          created_at: '盘点日期',
          difference: '差异库存量'
        },
        gridOperate2: false,
        gridColumns2: {
          item_code: '货号',
          item_name: '品名',
          system_stock: '系统库存量',
          main_reference_value: '实际库存量',
          difference: '差异库存量',
          unit: '单位',
          unit_specification: '单位规格'
        },
        query: {
          start_time: '',
          end_time: ''
        }
      }
    }
  }
</script>
