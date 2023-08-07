const colorPalette = ['#4992ff', '#7cffb2', '#fddd60', '#ff6e76', '#58d9f9', '#05c091', '#ff8a45', '#8d48e3', '#dd79ff'];

const darkColor1 = '#b089f5';
const darkColor2 = '#a172f5';
const darkColor3 = '#7c52cb';
const darkColor4 = '#4b3377';
const darkColor5 = '#452d70';
const darkColor6 = '#3e2964';
const darkColor7 = '#372852';
// const darkColor8 = '#1c1c1c';
// const darkColor9 = '#161616';

const contrastColor = darkColor2;
const backgroundColor = darkColor7;

const axisCommon = () => ({
  axisLine: {
    lineStyle: {
      color: contrastColor,
    },
  },
  splitLine: {
    lineStyle: {
      color: '#7c52cb',
    },
  },
  splitArea: {
    areaStyle: {
      color: ['rgba(112,112,112,0.02)', 'rgba(112,112,112,0.05)'],
    },
  },
  minorSplitLine: {
    lineStyle: {
      color: darkColor5,
    },
  },
});
const DarkTheme = {
  darkMode: true,
  color: colorPalette,
  backgroundColor,
  axisPointer: {
    lineStyle: {
      color: darkColor5,
    },
    crossStyle: {
      color: darkColor5,
    },
    label: {
      color: darkColor1,
    },
  },
  legend: {
    textStyle: {
      color: contrastColor,
    },
  },
  textStyle: {
    color: contrastColor,
  },
  title: {
    textStyle: {
      color: contrastColor,
    },
    subtextStyle: {
      color: darkColor2,
    },
  },
  toolbox: {
    iconStyle: {
      borderColor: contrastColor,
    },
  },
  dataZoom: {
    borderColor: darkColor5,
    textStyle: {
      color: contrastColor,
    },
    brushStyle: {
      color: darkColor3,
      opacity: 0.3,
    },
    handleStyle: {
      color: darkColor3,
      borderColor: darkColor3,
    },
    moveHandleStyle: {
      color: darkColor4,
      opacity: 0.3,
    },
    fillerColor: 'rgba(135,163,206,0.2)',
    emphasis: {
      handleStyle: {
        borderColor: '#91B7F2',
        color: '#4D587D',
      },
      moveHandleStyle: {
        color: '#636D9A',
        opacity: 0.7,
      },
    },
    dataBackground: {
      lineStyle: {
        color: darkColor6,
        width: 1,
      },
      areaStyle: {
        color: darkColor6,
      },
    },
    selectedDataBackground: {
      lineStyle: {
        color: '#87A3CE',
      },
      areaStyle: {
        color: '#87A3CE',
      },
    },
  },
  visualMap: {
    textStyle: {
      color: contrastColor,
    },
  },
  timeline: {
    lineStyle: {
      color: contrastColor,
    },
    label: {
      color: contrastColor,
    },
    controlStyle: {
      color: contrastColor,
      borderColor: contrastColor,
    },
  },
  calendar: {
    itemStyle: {
      color: backgroundColor,
    },
    dayLabel: {
      color: contrastColor,
    },
    monthLabel: {
      color: contrastColor,
    },
    yearLabel: {
      color: contrastColor,
    },
  },
  timeAxis: axisCommon(),
  logAxis: axisCommon(),
  valueAxis: axisCommon(),
  categoryAxis: axisCommon(),

  line: {
    symbol: 'circle',
  },
  graph: {
    color: colorPalette,
  },
  gauge: {
    title: {
      color: contrastColor,
    },
  },
  candlestick: {
    itemStyle: {
      color: '#FD1050', color0: '#0CF49B', borderColor: '#FD1050', borderColor0: '#0CF49B',
    },
  },
};
DarkTheme.categoryAxis.splitLine.show = false; // 是否显示竖直方向网格线
export default DarkTheme;
