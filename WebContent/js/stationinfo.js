"use strict";
/**
 * @filename: stationinfo.js
 * @description: 单点剖面结果显示
 * @version:
 * @date: 2016-11-05
 * @author: xingwujie
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

var ctdInfoTable = new Array();
//填充图表
function fillEchart(dataX, dataY, title, nameX, nameY) {
    var myChart = echarts.init(document.getElementById('pointChart'));
    // 指定图表的配置项和数据
    var option = {
        //backgroundColor: '#ffffff',//背景色
        backgroundColor: 'transparent',//背景色
        title: {
            text: title,
            textStyle: {
                fontSize: 13,
                fontWeight: 'normal',
                color: '#000'          // 主标题文字颜色
            },
//                subtext: 'CTD数据可视化',
            x: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: true
            }
        },

        grid: [{
            left: 60,
            right: 75,
            height: '50%'
        }],
        xAxis: [
            {
                name: nameX,
                min: Math.min.apply(null, dataX) - (Math.max.apply(null, dataX) - Math.min.apply(null, dataX)) * 0.1,
                max: Math.max.apply(null, dataX) + (Math.max.apply(null, dataX) - Math.min.apply(null, dataX)) * 0.1,
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        yAxis: [
            {
                name: '\n' + nameY,
                //type : 'value',
                //max : Math.ceil(Math.max.apply(null, dataY)),
                inverse: false,
//                    min: 0,
//                    max: 50,
                splitNumber: 10,
                precision: 2,
//                    interval: 5,
                type: 'category',
//                    type: 'value',
                axisLine: {onZero: false},
//                    axisLabel: {
//                        formatter: '{value}'
//                    },
                axisLabel: {
                    formatter: function (value) {

                        return parseInt(value);
                    }

                },

                boundaryGap: false,
                data: dataY

            }
        ],


        series: [
            {
                name: '',
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color:'#FFFF00',
                        lineStyle: {
                            shadowColor: 'rgba(0,0,0,0.4)'
                            ,
                            color:'#FF0000'
                        }
                    }
                },
                data: dataX

            }
        ]
    };
    //使用指定的配置项和数据显示图表。
    myChart.setOption(option);
}

/**
 *
 *  查询CTD列表
 */
var callBackCTDList = function (ctdList) {
        //ctdInfoTable = new Array();
        for (var ctdFieldIndex = 0; ctdFieldIndex < 3; ctdFieldIndex++) {
            ctdInfoTable[ctdFieldIndex] = new Array();
        }
        for (var i = 0; i < ctdList.length; i++) {
            if (ctdList.length > 100) {
                var steps = Math.floor(ctdList.length / 100);
                if (i % steps == 0) {
                    ctdInfoTable[0].push(ctdList[i].depth);//深度
                    ctdInfoTable[1].push(ctdList[i].temperature);//温度
                    ctdInfoTable[2].push(ctdList[i].salinity);//盐度
                }
            }
            else {
                ctdInfoTable[0].push(ctdList[i].depth);//深度
                ctdInfoTable[1].push(ctdList[i].temperature);//温度
                ctdInfoTable[2].push(ctdList[i].salinity);//盐度
            }
        }
        fillEchart(ctdInfoTable[1], ctdInfoTable[0], '温度', '温度(°C)', '水深(米)');

    }
    ;


/**
 *
 *  初始化ctd信息表
 */
function initctdInfoTable(selVoyName,selStaID) {
    var voyageCode = "0001";
    var stationCode = "20160627";

    for (var ctdFieldIndex = 0; ctdFieldIndex < 3; ctdFieldIndex++) {
        ctdInfoTable[ctdFieldIndex].length=0;
    }

    var strSQLCTDlist = "";
    // 使用正确的DWR调用格式
    try {
        DatabaseOperationJS.QueryCTDList(strSQLCTDlist, selStaID, 
            function(data) {
                console.log('✅ CTD数据查询成功:', data);
                callBackCTDList(data);
            },
            function(error) {
                console.error('❌ CTD数据查询失败:', error);
                alert('CTD数据查询失败，请检查网络连接和数据库状态');
                callBackCTDList([]);
            }
        );
    } catch (e) {
        console.error('❌ CTD数据查询异常:', e);
        alert('CTD数据查询出现异常');
        callBackCTDList([]);
    }


}

/**
 *
 *  更新视图
 */
function updateView() {
       //initctdInfoTable();
    var objS = document.getElementById("yValue");
    var v = objS.options[objS.selectedIndex].value;
    if (v == "Temperature") {
        fillEchart(ctdInfoTable[1], ctdInfoTable[0],  '温度', '温度(°C)', '水深(米)');
    }
    else if (v == "Salinity") {
        fillEchart(ctdInfoTable[2], ctdInfoTable[0], '盐度', '盐度(PUS)', '水深(米)');
    }


}