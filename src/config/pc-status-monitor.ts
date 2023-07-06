/* statusMonitor.ts */

export default {
  pageTitle: 'Nest.js 服务监控',
  port: 3305, // 端口配置无效，其实用的是nestjs的端口
  path: '/statusMonitor', // 需要加上nestjs的前缀
  ignoreStartsWith: '/health/alive',
  spans: [
    {
      interval: 1, // Every second
      retention: 60, // Keep 60 datapoints in memory
    },
    {
      interval: 5, // Every 5 seconds
      retention: 60,
    },
    {
      interval: 15, // Every 15 seconds
      retention: 60,
    }
  ],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    responseTime: true,
    rps: true,
    statusCodes: true,
  },
  healthChecks: []
};
