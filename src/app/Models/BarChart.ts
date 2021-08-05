export class BarChart{
  chartOptions={
    chart:{
      type:'bar',
      spacing : [20, 0 , 0, 0], //margin 上左下右,
    },
    title: {
      text: '當前耗電量/瓦'
    },
    subtitle: {
      text: ""
    },
    exporting:{
      enabled:true
    },
    plotOptions: {
      bar:{
        showInLegend: false,
        colorByPoint: true,
        dataLabels: {
          enabled: true,
          format: '{y} 瓦',
          style: {
            fontSize:'24px'
          }
        },
      }
    },
    xAxis: {
        categories: ['機台', '冷氣'],
        title: {
          text: '設備名稱'
        }
    },
    yAxis: {
      title: {
        text: '瓦'
      }
    },
    series: [
      {
        type:"bar",
        data:[1,2],
      }
    ]
  } as any
}



