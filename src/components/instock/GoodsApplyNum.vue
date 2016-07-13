<template>
  <div class="container-fluid">
    <!-- 路径导航 -->
    <ol class="breadcrumb">
      <li class="active"><span class="glyphicon glyphicon-home c-erp" aria-hidden="true"></span> 您当前的位置：库存首页</li>
      <li class="active">要货单汇总</li>
    </ol>

    <!-- 页头 -->
    <div class="page-header">
      <form class="form-inline">
        <div class="form-group">
          <label>单号</label>
          <input type="text" class="form-control" placeholder="" v-model="orderNumber">
        </div>
        <div class="form-group ml10">
          <label>状态</label>
          <select class="form-control" v-model="selectedCheck">
            <option value="1">已审核</option>
            <option value="0">未审核</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>制单人</label>
          <select class="form-control" v-model="createPersonId">
            <option v-for="item in creators" :value="item.id">{{item.name}}</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>制单时间段</label>
          <date-picker
            :value.sync=query.start_time1"
          >
          </date-picker>
          -
          <date-picker
            :value.sync="query.end_time1"
          >
          </date-picker>
        </div>
        <div class="form-group ml10">
          <label>送货时间段</label>
          <date-picker
            :value.sync="query.end_time1"
          >
          </date-picker>
          -
          <date-picker
            :value.sync="query.end_time2"
          >
          </date-picker>
        </div>
        <button type="submit" class="btn btn-info" @click="search()">搜索</button>
        <a v-link="{ path: '/instock/GoodsApply'}"><span class="btn btn-primary">申请要货</span></a>
      </form>
    </div>
    <!--汇总列表-->
    <summary :table-data="list" :table-header="gridColumns" :page="page"
             :detail-url="detailUrl"></summary>
  </div>
</template>
<script>
  import $ from 'jquery'
  import Grid from '../common/Grid'
  import Page from '../common/Page'
  import Summary from '../common/Summary'
  import ListValidate from '../common/ListValidate'
  import ListDelete from '../common/ListDelete'
  import DatePicker from '../common/DatePicker'
  import { requestUrl,token,searchRequest} from '../../publicFunction/index'
  export default {
    components: {
      Grid: Grid,
      Page: Page,
      Summary: Summary,
      alert: alert,
      ListValidate: ListValidate,
      ListDelete: ListDelete,
      DatePicker: DatePicker
    },
    events: {
//    绑定翻页事件
      pagechange: function (currentpage) {
        this.$http({
          url: requestUrl + '/front-system/stock/enquiry',
          data: {
            page: currentpage
          },
          method: 'get',
          headers: {'X-Overpowered-Token': token}
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.list = response.data.body.list
          var self = this
          $.each(this.list, function (index, val) {
            switch (val.checked) {
              case 1:
                val.checked = '已审核'
                break
              case 0:
                val.checked = '未审核'
                self.validateFlag = true
                break
            }
          })
        }, function (err) {
          console.log(err)
        })
      },
    },
    ready: function () {
      this.listData(16)
      this.$http({
        url: requestUrl + '/front-system/create/order/users',
        method: 'get',
        headers: {'X-Overpowered-Token': token},
      }).then(function (response) {
        this.creators = response.data.body
      }, function (err) {
        console.log(err)
      })
    },
    methods: {
//    生产出库-列表数据渲染
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/enquiry',
          method: 'get',
          headers: {'X-Overpowered-Token': token},
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.list = response.data.body.list
          var self = this
          $.each(this.list, function (index, val) {
            switch (val.checked) {
              case 1:
                val.checked = '已审核'
                break
              case 0:
                val.checked = '未审核'
                self.validateFlag = true
                break
            }
          })
        }, function (err) {
          console.log(err)
        })
      },
      cancel: function () {
        this.query.start_time = ''
        this.query.end_time = ''
        this.query.search = ''
        this.query.category = ''
        this.listData(1)
      },
//      搜索页面
      search: function () {
        var self = this
        searchRequest(
          requestUrl + '/front-system/stock/enquiry',
          {
            order_number: this.orderNumber,
            checked: Number(this.selectedCheck),
            creator_id: this.createPersonId,
            per_page: 16
          },
          function (response) {
            self.list = response.data.body.list
            self.page = response.data.body.pagination
            $.each(self.list, function (index, val) {
              switch (val.checked) {
                case 1:
                  val.checked = '已审核'
                  break
                case 0:
                  val.checked = '未审核'
                  self.validateFlag = true
                  break
              }
            })
          }
        )
      }
    },
    data: function () {
      return {
        page: [],
        detailUrl: '/#!/instock/GoodsApplyNum/',
        showRight: false,
        creators: [],
        orderNumber: '',
        selectedCheck: '',
        createPersonId: '',
        format: 'yyyy-MM-dd',
        orderStartTime: '',
        orderEndTime: '',
        sendStartTime: '',
        sendEndTime: '',
        list: [],
        gridOperate: true,
        gridColumns: {
          order_number: '单号',
          checked: '状态',
          creator: '制单人',
          auditor: '审核人',
          created_at: '制单日期',
          delivery_date: '送货日期',
          amount: '要货数量'
        },
        query: {
          start_time1: '',
          start_time2: '',
          end_time1: '',
          end_time2: '',
          order_code: '',
          create_person: '',
          check: ''
        }
      }
    }
  }
</script>
<style scoped>
  table thead tr th {
    text-align: center
  }

  table thead tr th:first-child {
    text-align: left;
  }

  table tbody tr td:first-child {
    text-align: left;
  }
</style>
