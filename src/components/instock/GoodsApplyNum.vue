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
          <input type="text" class="form-control" placeholder="" v-model="query.order_code">
        </div>
        <div class="form-group ml10">
          <label>状态</label>
          <select class="form-control">
            <option>请选择</option>
          </select>
        </div>
        <div class="form-group ml10">
          <label>制单人</label>
          <select class="form-control">
            <option>全部</option>
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
        <button type="submit" class="btn btn-info" @click="listData(1)">搜索</button>
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
  import { requestUrl,token} from '../../publicFunction/index'
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
        this.listData(currentpage)
      },
    },
    ready: function () {
      this.listData(1)
    },
    methods: {
//    生产出库-列表数据渲染
      listData: function (page) {
        this.$http({
          url: requestUrl + '/front-system/stock/enquiry',
          method: 'get',
          headers:{'X-Overpowered-Token':token}
        }).then(function (response) {
          this.page = response.data.body.pagination
          this.list = response.data.body.list
          var self = this
          $.each(this.list, function (index, val) {
            switch (val.check) {
              case 'start':
                val.check = '未审核'
                break
              case 'end':
                val.check = '已审核'
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
      }
//    生产明细点击>跳转页面，把id追加到浏览器地址栏后
    },
    data: function () {
      return {
        page: [],
        detailUrl: '/#!/instock/GoodsApplyNum/',
        showRight: false,
        format: 'yyyy-MM-dd',
        orderStartTime: '',
        orderEndTime: '',
        sendStartTime: '',
        sendEndTime: '',
        list: [111,123],
        gridOperate: true,
        gridColumns: {
          order_number: '单号',
          check: '状态',
          create_person: '制单人',
          check_person: '审核人',
          created_at: '制单日期',
          delivery_date: '送货日期',
          total_amount: '要货数量'
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
