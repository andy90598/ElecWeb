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
            fontSize:'18px'
          }
        },
      }
    },
    xAxis: {
        categories: [""],
        title: {
          text: '設備名稱'
        }
    },
    yAxis: {
      title: {
        text: '瓦'
      }
    },
    tooltip:{
      pointFormat:'{series.name}: <b>{point.y:.0f}瓦</b>'
    },
    series: [
      {
        name:"消耗",
        type:"bar",
        data:[1,2],
      }
    ]
  } as any
}



