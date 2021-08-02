
export class SplineChart{
  public options={
    title: {
      text: '總耗電量'
    },
    subtitle: {
      text: '最後更新時間: '
    },
    plotOptions: {
      bar: {
          dataLabels: {
              enabled: true,
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
    series: [{
        type: 'bar',
        colorByPoint: true,
        data: [],
        showInLegend: false
    }]
  }
}



