export class DonutChart{
  public options={
    chart:{
      spacing : [0, 0 , 0, 0], //margin 上左下右
    },
    title:{
      text:"測試",
      align:'center',
      y:25,
      style:{
        fontSize:'2em'
      }
    },
    //商標
    credits:{
      enabled:false
    },
    //滑鼠移上去時顯示的文字方塊
    tooltip:{
      pointFormat:'{series.name}: <b>{point.y:.1f}A</b>'
    },
    // 针对不同类型图表的配置
    legend:{
      align:'center',
      verticalAlign:'top',
      margin:0,
      reversed:true
    },
    plotOptions: {
      pie: {
        showInLegend: true,
        allowPointSelect: true, //可被選取
        cursor: 'pointer', //指標變滑鼠
        dataLabels: {
          enabled: true,
          distance:'-10%',
          // format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          format: '{point.percentage:.1f} %',
          style: {
            color: 'black',
            fontSize:'18px'
          }
        },
      },
    },
    // 数据列，图表上一个或多个数据系列
    series:[{
      size: '80%',
      name: '比例',
      innerSize:'60%',
      type:"pie",
      data: [
      ]
    }]
  }
}
