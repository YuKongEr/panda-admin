<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>开源作者：yukong</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="goGithub">github地址</el-button>
          </div>
          <el-timeline>
            <el-timeline-item v-for="(activity, index) in activities2" :key="index" :icon="activity.icon" :type="activity.type" :color="activity.color" :size="activity.size" :timestamp="activity.timestamp">
              {{activity.content}}
            </el-timeline-item>
          </el-timeline>
        </el-card>

      </el-col>

      <el-col :span="16" :offset="2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>访问趋势图</span>
          </div>
          <line-chart :chart-data="lineChartData" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      activities2: [{
        content: 'v1版本发布',
        timestamp: '2019-04-25 20:46',
        size: 'large',
        type: 'primary',
        icon: 'el-icon-more'
      }, {
        content: '支持动态路由',
        timestamp: '2019-02-03 20:46',
        color: '#0bed87'
      }, {
        content: '支持oauth2 client管理',
        timestamp: '2019-01-03 20:46',
        color: '#0bed87'
      }, {
        content: '支持终端管理,代码生成，一键curd',
        timestamp: '2019-01-03 20:46',
        color: '#0bdd87'
      }, {
        content: '支持token管理',
        timestamp: '2018-12-03 20:46',
        color: '#0bcd87'
      }, {
        content: '完善字典管理等功能',
        timestamp: '2018-10-03 20:46',
        color: '#0bbd87'
      }, {
        content: '完善手机登录',
        timestamp: '2018-04-26 20:46',
        size: 'large'
      }, {
        content: '正式开源panda-cloud',
        timestamp: '2018-04-03 20:46'
      }]
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    goGithub() {
      location.href = 'https://github.com/YuKongEr/panda-cloud'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>