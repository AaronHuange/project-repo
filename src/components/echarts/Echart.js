import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import DarkTheme from './theme/Dark';

/**
 * 图表组件：用于渲染eChart数据。文档地址：https://echarts.apache.org/handbook/zh/get-started/
 * @param chartOption 用于渲染的数据，直接复制官网案例中的option部分即可
 * @param className 最外层div的样式
 * @param width 图表的宽度
 * @param height 图表的高度
 * @param refreshResize 用于主动刷新，使用数字类型更不容易冲突
 * @param onEChartItemClick 当图表中的元素被点击时
 * @param isDark 是否使用暗黑模式
 */
function EChart({
  chartOption = null,
  style = {},
  className = 'w-screen h-80', // FIXME: 注意宽度设置不是全屏时，是不包括轴线的 ？？
  width = 0, // FIXME: 注意宽度设置不是全屏时，是不包括轴线的 ？？
  height = 0,
  refreshResize = 0,
  onEChartItemClick,
  isDark = false,
}) {
  const myChart = useRef();
  const myChartDom = useRef();
  // 将Dark模式注册进去，此处只是注册相关样式，没有启用
  useEffect(() => {
    // 自定义Dark模式下的相关颜色，这里Dark模式设置为APP的主题色：紫色
    echarts.registerTheme('dark', DarkTheme);
  }, []);
  // 宽、高、刷新标记(int值) 发生变化时，重新渲染图表
  useEffect(() => {
    myChart?.current?.resize();
  }, [refreshResize, width, height]);
  // 监听chartOption变化，当Option变化时，重新渲染图表
  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    chartOption && myChart.current?.setOption(
      chartOption, // option
      true, // notMerge
    );
  }, [JSON.stringify(chartOption)]);
  useEffect(() => {
    myChart.current = echarts.init(myChartDom.current, isDark ? 'dark' : 'light');
    // 注册点击事件，
    // eslint-disable-next-line no-unused-expressions
    onEChartItemClick && myChart.current?.on('click', (params) => {
      // eslint-disable-next-line no-param-reassign
      params.lx_chartData = onEChartItemClick.chartData;
      onEChartItemClick(params);
    });
    if (myChart.current && chartOption) {
      myChart.current?.setOption(chartOption);
    }
    return () => {
      myChart?.current?.dispose();
    };
  }, [onEChartItemClick, isDark, JSON.stringify(chartOption)]);

  let wHStyle = {};
  if (width && height) {
    wHStyle = { width, height };
  }
  return (
    <div ref={ myChartDom } className={ className } style={ { ...style, ...wHStyle } } />
  );
}

export default React.memo(EChart);
