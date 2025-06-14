/**
 * @filename: station-management.js
 * @description: 站点管理模块
 * @version: 1.0
 * @date: 2025-01-01
 * @author: 系统重构
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

"use strict";

// 确保依赖的模块已加载
if (!window.IVSOSD || !window.IVSOSD.voyageInfoModuleLoaded) {
    throw new Error('station-management.js depends on voyage-info.js module');
}

//===========================================
// 站点列表回调处理
//===========================================

/**
 * 站点列表回调函数
 * @param {Array} stationList - 站点列表数据
 */
var callBackStationList = function (stationList) {
    viewer.entities.removeAll();
    stationList2 = stationList;
    clickHandlerStationList = stationList;
    BingdingStationHandler();
    clearTable("tbodyStationList");
    
    var staSumPageNumber = Math.ceil(stationList2.length / staRowNumber);
    updateStationPaginationButtons(staSumPageNumber);

    var staStartIndex = (staCurPageNumber - 1) * staRowNumber;
    var staEndIndex = ( 1 + staCurPageNumber - 1) * staRowNumber;

    if (staCurPageNumber == staSumPageNumber) {
        staEndIndex = (staCurPageNumber - 1) * staRowNumber + (stationList2.length - (staSumPageNumber - 1) * staRowNumber);
    }

    // 添加所有站点实体到地图
    for (var staIndex = 0; staIndex < stationList2.length; staIndex++) {
        viewer.entities.add({
            name: stationList2[staIndex].name,
            position: Cesium.Cartesian3.fromDegrees(stationList2[staIndex].longitude, stationList2[staIndex].latitude, 3000),
            point: {
                pixelSize: 8,
                scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                color: Cesium.Color.RED
            },
            data: stationList2[staIndex]
        });
    }

    // 显示当前页的站点列表
    staRows = [];
    for (var i = staStartIndex; i < staEndIndex; i++) {
        var nameSubstr = stationList[i].name;
        if (stationList[i].name.length > 10) {
            nameSubstr = stationList[i].name.substring(0, 10) + "…";
        }
        
        staRows.push({
            staid: stationList[i].ID,
            name: stationList[i].name,
            longitude: stationList[i].longitude,
            latitude: stationList[i].latitude,
            deep: stationList[i].deep
        });

        var row = createStationRow(nameSubstr, stationList[i], staStartIndex);
        var obody = document.getElementById("tbodyStationList");
        obody.appendChild(row);
    }
};

//===========================================
// 站点表格行创建
//===========================================

/**
 * 创建站点表格行
 * @param {string} nameSubstr - 站点名称缩写
 * @param {Object} stationData - 站点数据
 * @param {number} startIndex - 起始索引
 * @returns {HTMLTableRowElement} 表格行元素
 */
function createStationRow(nameSubstr, stationData, startIndex) {
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    var cell1 = document.createElement("td");
    var cell2 = document.createElement("td");
    var cell3 = document.createElement("td");

    cell.appendChild(document.createTextNode(nameSubstr));
    cell1.appendChild(document.createTextNode(parseFloat(stationData.longitude).toFixed(4)));
    cell2.appendChild(document.createTextNode(parseFloat(stationData.latitude).toFixed(4)));
    cell3.appendChild(document.createTextNode(parseFloat(stationData.deep).toFixed(2)));

    cell.setAttribute("data-toggle", "tooltip");
    cell.setAttribute("title", stationData.name);

    row.appendChild(cell);
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);

    row.onclick = function () {
        handleStationRowClick(this, startIndex);
    };
    
    return row;
}

/**
 * 处理站点行点击事件
 * @param {HTMLTableRowElement} row - 被点击的行
 * @param {number} startIndex - 起始索引
 */
function handleStationRowClick(row, startIndex) {
    var terminaltablecontent4 = $('#voyagepage2');
    var terminaltablecontent5 = $('#voyage-info2');
    var terminaltablecontent6 = $('#voyagepage3');
    var terminaltablecontent7 = $('#voyage-info3');
    terminaltablecontent4.removeClass('active');
    terminaltablecontent5.removeClass('in');
    terminaltablecontent6.addClass('active');
    terminaltablecontent7.addClass('in');
    $('#voyage-info-tab1').css('background-image', "url(images/tabbg3100.png)");
    $('#voyage-info-tab2').css('background-image', "url(images/tabbg3200.png)");
    $('#voyage-info-tab3').css('background-image', "url(images/tabbg3301.png)");

    selectedSta = 1;

    var selRowIndex = row.rowIndex;
    selRowStaName = staRows[selRowIndex - 1].name;

    var strSQLStaInfo = "select * from STATION where NAME=?";
    DatabaseOperationJS.QueryStationInfo(strSQLStaInfo, selRowStaName, callBackStationInfo);

    // 重新绘制站点，突出显示选中的站点
    viewer.entities.removeAll();
    for (var j = 0; j < stationList2.length; j++) {
        viewer.entities.add({
            name: "Stations",
            position: Cesium.Cartesian3.fromDegrees(stationList2[j].longitude, stationList2[j].latitude, 3000),
            point: {
                pixelSize: 8,
                scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                color: Cesium.Color.RED
            },
            data: stationList2[j]
        });
    }

    // 添加选中站点的特殊标记
    viewer.entities.add({
        name: "seletedStation",
        position: Cesium.Cartesian3.fromDegrees(parseFloat(row.cells[1].innerHTML), parseFloat(row.cells[2].innerHTML), 3000),
        point: {
            pixelSize: 6,
            scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
            show: true,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.YELLOW,
            outlineWidth: 4
        }
    });
    
    // 摄像机飞到选中站点
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(parseFloat(row.cells[1].innerHTML), parseFloat(row.cells[2].innerHTML), 2000000.0)
    });
}

//===========================================
// 站点分页控制
//===========================================

/**
 * 更新站点分页按钮状态
 * @param {number} staSumPageNumber - 总页数
 */
function updateStationPaginationButtons(staSumPageNumber) {
    if (staSumPageNumber == 0 || staSumPageNumber == 1) {
        $('#staNext').css('background-image', "url(images/NextB02.png)");
        $('#staPre').css('background-image', "url(images/PreB02.png)");
    }
    else if (staSumPageNumber == 2) {
        if (staCurPageNumber == 1) {
            $('#staNext').css('background-image', "url(images/NextA02.png)");
            $('#staPre').css('background-image', "url(images/PreB02.png)");
        }
        else {
            $('#staNext').css('background-image', "url(images/NextB02.png)");
            $('#staPre').css('background-image', "url(images/PreA02.png)");
        }
    }
    else {
        if (staCurPageNumber == staSumPageNumber) {
            $('#staNext').css('background-image', "url(images/NextB02.png)");
            $('#staPre').css('background-image', "url(images/PreA02.png)");
        }
        else {
            $('#staNext').css('background-image', "url(images/NextA02.png)");
            $('#staPre').css('background-image', "url(images/PreA02.png)");
        }
        if (staCurPageNumber == 1) {
            $('#staNext').css('background-image', "url(images/NextA02.png)");
            $('#staPre').css('background-image', "url(images/PreB02.png)");
        }
    }
}

/**
 * 站点列表下一页
 */
function staPageNext() {
    var staSumPageNumber = Math.ceil(stationList2.length / staRowNumber);
    if (staCurPageNumber < staSumPageNumber) {
        staCurPageNumber++;
    }
    clearTable("tbodyStationList");

    updateStationPaginationButtons(staSumPageNumber);

    var staStartIndex = (staCurPageNumber - 1) * staRowNumber;
    var staEndIndex = ( 1 + staCurPageNumber - 1) * staRowNumber;

    if (staCurPageNumber == staSumPageNumber) {
        staEndIndex = (staCurPageNumber - 1) * staRowNumber + (stationList2.length - (staSumPageNumber - 1) * staRowNumber);
    }

    // 重新添加站点实体
    for (var staIndex = 0; staIndex < stationList2.length; staIndex++) {
        viewer.entities.add({
            name: stationList2[staIndex].name,
            position: Cesium.Cartesian3.fromDegrees(stationList2[staIndex].longitude, stationList2[staIndex].latitude, 3000),
            point: {
                pixelSize: 8,
                scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                color: Cesium.Color.RED
            }
        });
    }
    
    staRows = [];
    for (var i = staStartIndex; i < staEndIndex; i++) {
        var nameSubstr = stationList2[i].name;
        if (stationList2[i].name.length > 10) {
            nameSubstr = stationList2[i].name.substring(0, 10) + "…";
        }
        
        staRows.push({
            staid: stationList2[i].ID,
            name: stationList2[i].name,
            longitude: stationList2[i].longitude,
            latitude: stationList2[i].latitude,
            deep: stationList2[i].deep
        });

        var row = createStationRow(nameSubstr, stationList2[i], staStartIndex);
        var obody = document.getElementById("tbodyStationList");
        obody.appendChild(row);
    }
}

/**
 * 站点列表上一页
 */
function staPagePrevious() {
    var staSumPageNumber = Math.ceil(stationList2.length / staRowNumber);
    if (staCurPageNumber > 1) {
        staCurPageNumber--;
    }

    clearTable("tbodyStationList");
    updateStationPaginationButtons(staSumPageNumber);

    var staStartIndex = (staCurPageNumber - 1) * staRowNumber;
    var staEndIndex = ( 1 + staCurPageNumber - 1) * staRowNumber;

    if (staCurPageNumber == staSumPageNumber) {
        staEndIndex = (staCurPageNumber - 1) * staRowNumber + (stationList2.length - (staSumPageNumber - 1) * staRowNumber);
    }

    for (var staIndex = 0; staIndex < stationList2.length; staIndex++) {
        viewer.entities.add({
            name: stationList2[staIndex].name,
            position: Cesium.Cartesian3.fromDegrees(stationList2[staIndex].longitude, stationList2[staIndex].latitude, 3000),
            point: {
                pixelSize: 8,
                scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                color: Cesium.Color.RED
            }
        });
    }

    staRows = [];
    for (var i = staStartIndex; i < staEndIndex; i++) {
        var nameSubstr = stationList2[i].name;
        if (stationList2[i].name.length > 10) {
            nameSubstr = stationList2[i].name.substring(0, 10) + "…";
        }
        
        staRows.push({
            staid: stationList2[i].ID,
            name: stationList2[i].name,
            longitude: stationList2[i].longitude,
            latitude: stationList2[i].latitude,
            deep: stationList2[i].deep
        });

        var row = createStationRow(nameSubstr, stationList2[i], staStartIndex);
        var obody = document.getElementById("tbodyStationList");
        obody.appendChild(row);
    }
}

//===========================================
// 站点信息回调处理
//===========================================

/**
 * 站点信息回调函数
 * @param {Object} stationInfo - 站点信息对象
 */
var callBackStationInfo = function (stationInfo) {
    document.getElementById("zhandian").innerHTML = stationInfo.name;
    document.getElementById("jingdu").innerHTML = parseFloat(stationInfo.longitude).toFixed(4);
    document.getElementById("weidu").innerHTML = parseFloat(stationInfo.latitude).toFixed(4);
    document.getElementById("shuishen").innerHTML = parseFloat(stationInfo.deep).toFixed(2);
    document.getElementById("riqi").innerHTML = stationInfo.date.substring(0, 10);
    document.getElementById("hangci").innerHTML = stationInfo.voyageName;
    document.getElementById("haiqu").innerHTML = stationInfo.type;

    ctdURL = stationInfo.infoPath;
    document.getElementById("yValue").selectedIndex = 0;

    for (var i = 0; i < staRows.length; i++) {
        if (staRows[i].name == selRowStaName) {
            staID = staRows[i].staid;
        }
    }
    
    initctdInfoTable(selVoyName, staID);
    fillEchart(ctdInfoTable[1], ctdInfoTable[0], '温度', '温度', '水深');
};

//===========================================
// 站点点击事件处理
//===========================================

/**
 * 绑定站点点击事件处理器
 */
function BingdingStationHandler() {
    handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function (movement) {
        var pArray = viewer.scene.drillPick(movement.position);
        var pArrayLength = pArray.length;
        
        for (var i = 0; i < pArrayLength; i++) {
            if (Cesium.defined(pArray[i])) {
                var entity = pArray[i].id;
                if (entity instanceof Cesium.Entity) {
                    if (Cesium.defined(entity.point)) {
                        var data = entity._data;
                        
                        // 切换到站点信息标签页
                        var terminaltablecontent1 = $('#voyagepage1');
                        var terminaltablecontent2 = $('#voyage-info1');
                        var terminaltablecontent3 = $('#voyagepage2');
                        var terminaltablecontent4 = $('#voyage-info2');
                        var terminaltablecontent5 = $('#voyagepage3');
                        var terminaltablecontent6 = $('#voyage-info3');
                        terminaltablecontent1.removeClass('active');
                        terminaltablecontent2.removeClass('in');
                        terminaltablecontent3.removeClass('active');
                        terminaltablecontent4.removeClass('in');
                        terminaltablecontent5.addClass('active');
                        terminaltablecontent6.addClass('in');
                        $('#voyage-info-tab1').css('background-image', "url(images/tabbg3100.png)");
                        $('#voyage-info-tab2').css('background-image', "url(images/tabbg3200.png)");
                        $('#voyage-info-tab3').css('background-image', "url(images/tabbg3301.png)");

                        // 填充站点信息
                        document.getElementById("zhandian").innerHTML = data.name;
                        document.getElementById("jingdu").innerHTML = parseFloat(data.longitude).toFixed(4);
                        document.getElementById("weidu").innerHTML = parseFloat(data.latitude).toFixed(4);
                        document.getElementById("shuishen").innerHTML = parseFloat(data.deep).toFixed(2) + "";
                        document.getElementById("riqi").innerHTML = data.date.substring(0, 10);
                        document.getElementById("hangci").innerHTML = data.voyageName;
                        document.getElementById("haiqu").innerHTML = data.type;
                        ctdURL = data.infoPath;
                        selStaName = data.name;

                        // 重新绘制站点
                        viewer.entities.removeAll();
                        for (var j = 0; j < clickHandlerStationList.length; j++) {
                            viewer.entities.add({
                                name: "Stations",
                                position: Cesium.Cartesian3.fromDegrees(clickHandlerStationList[j].longitude, clickHandlerStationList[j].latitude, 3000),
                                point: {
                                    pixelSize: 8,
                                    scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                                    color: Cesium.Color.RED
                                },
                                data: clickHandlerStationList[j]
                            });
                        }
                        
                        // 添加选中站点的特殊标记
                        viewer.entities.add({
                            name: "seletedStation",
                            position: Cesium.Cartesian3.fromDegrees(data.longitude, data.latitude, 3000),
                            point: {
                                pixelSize: 6,
                                scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                                show: true,
                                color: Cesium.Color.RED,
                                outlineColor: Cesium.Color.YELLOW,
                                outlineWidth: 4
                            },
                            data: data
                        });

                        document.getElementById("yValue").selectedIndex = 0;
                        var selStaID = data.ID;

                        initctdInfoTable(selVoyName, selStaID);
                        fillEchart(ctdInfoTable[1], ctdInfoTable[0], '温度', '温度(°C)', '水深(米)');
                    }
                }
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 将函数暴露到全局命名空间
window.IVSOSD.callBackStationList = callBackStationList;
window.IVSOSD.staPageNext = staPageNext;
window.IVSOSD.staPagePrevious = staPagePrevious;
window.IVSOSD.callBackStationInfo = callBackStationInfo;
window.IVSOSD.BingdingStationHandler = BingdingStationHandler;
window.IVSOSD.updateStationPaginationButtons = updateStationPaginationButtons;

// 标记站点管理模块已加载
window.IVSOSD.stationManagementModuleLoaded = true;

console.log('✅ station-management.js 模块已加载');
