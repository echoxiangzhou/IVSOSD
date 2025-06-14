/**
 * @filename: voyage-info.js
 * @description: 航次信息和轨迹模块
 * @version: 1.0
 * @date: 2025-01-01
 * @author: 系统重构
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

"use strict";

// 确保依赖的模块已加载
if (!window.IVSOSD || !window.IVSOSD.voyageCallbacksModuleLoaded) {
    throw new Error('voyage-info.js depends on voyage-callbacks.js module');
}

// 初始化全局变量（如果尚未定义）
if (typeof ctdInfoTable === 'undefined') {
    window.ctdInfoTable = [];
}

//===========================================
// 航次信息回调处理
//===========================================

/**
 * 航次信息回调函数
 * @param {Object} voyageInfo - 航次信息对象
 */
var callBackVoyageInfo = function (voyageInfo) {
    try {
        // 数据验证
        if (!voyageInfo) {
            console.error('❌ voyageInfo is null or undefined');
            return;
        }
        
        // 安全填充数据，添加空值检查和多种字段名映射
        const setElementText = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = value || '暂无数据';
            } else {
                console.warn(`⚠️ Element with ID '${id}' not found`);
            }
        };
        
        // 尝试多种可能的字段名映射（Java可能返回大写或小写字段名）
        const getFieldValue = (obj, ...fieldNames) => {
            for (const fieldName of fieldNames) {
                if (obj[fieldName] !== undefined && obj[fieldName] !== null) {
                    return obj[fieldName];
                }
            }
            return null;
        };
        
        // 航次编号
        const voyageId = getFieldValue(voyageInfo, 'ID', 'id', 'Id');
        setElementText("hangcibianhao", voyageId);
        
        // 航次名称 - 尝试多种字段名
        const voyageName = getFieldValue(voyageInfo, 'name', 'NAME', 'Name', 'VOYAGE_NAME', 'voyage_name', 'voyageName', 'V_NAME', 'v_name');
        setElementText("hangcimingcheng", voyageName);
        
        // 开始日期 - 尝试多种字段名和格式
        const vStart = getFieldValue(voyageInfo, 'VStart', 'vStart', 'V_START', 'v_start', 'START_DATE', 'start_date', 'startDate', 'START_TIME', 'start_time');
        const startDate = vStart ? (typeof vStart === 'string' ? vStart.substring(0, 10) : vStart) : '';
        setElementText("kaishiriqi", startDate);
        
        // 结束日期
        const vEnd = getFieldValue(voyageInfo, 'VEnd', 'vEnd', 'V_END', 'v_end', 'END_DATE', 'end_date', 'endDate', 'END_TIME', 'end_time');
        const endDate = vEnd ? (typeof vEnd === 'string' ? vEnd.substring(0, 10) : vEnd) : '';
        setElementText("jieshuriqi", endDate);
        
        // 科学家
        const scientist = getFieldValue(voyageInfo, 'scientist', 'SCIENTIST', 'Scientist', 'KEXUEJIA', 'kexuejia');
        setElementText("kexuejia", scientist);
        
        // 调查海域
        const seaArea = getFieldValue(voyageInfo, 'seaArea', 'SEA_AREA', 'sea_area', 'SeaArea', 'AREA', 'area', 'REGION', 'region', 'HAIYU', 'haiyu');
        setElementText("diaochahaiyu", seaArea);
        
        // 课题编号
        const project = getFieldValue(voyageInfo, 'project', 'PROJECT', 'Project');
        setElementText("ketibianhao", project);
        
    } catch (error) {
        console.error('❌ callBackVoyageInfo error:', error);
        console.error('❌ 错误堆栈:', error.stack);
    }

    // 处理航次轨迹显示
    var dataSourceLength = viewer.dataSources.length;
    for (var sourceIndex = 0; sourceIndex < dataSourceLength; sourceIndex++) {
        var tempvoytraj = viewer.dataSources.get(sourceIndex);
        if (tempvoytraj.name == selOldVoyID) {
            var seloldvoytraj = viewer.dataSources.get(sourceIndex);
            viewer.dataSources.remove(seloldvoytraj);
            AddRouteCZML2(selOldVoyTrajPath, selOldVoyID);
        }
    }
    
    // 选择新的航次轨迹
    SelectVoyageTraj(voyageInfo.trajPath, voyageInfo.ID);
}

//===========================================
// 航次轨迹处理
//===========================================

/**
 * 添加轨迹
 * @param {string} czmlURL - CZML文件URL
 * @param {string} voyID - 航次ID
 */
function AddRouteCZML2(czmlURL, voyID) {
    globe.depthTestAgainstTerrain = true;
    var czmlTraj = [{
        "id": "document",
        "name": voyID,
        "version": "1.0"
    }];

    var linePath = {
        "name": czmlURL,
        "polyline": {
            "description": "",
            "positions": {
                "cartographicDegrees": []
            },
            "material": {
                "solidColor": {
                    "color": {
                        "rgba": [225, 35, 44, 255]
                    }
                }
            },
            "width": 1
        }
    };

    $.ajax({
        async: false,
        type: "GET",
        url: czmlURL,
        success: function (content) {
            if (czmlURL != null) {
                var data = content.split('\n');

                for (var i = 0; i < 3; i++) {
                    ctdInfoTable[i] = new Array();
                }

                for (var lineIndex = 2; lineIndex < data.length - 10; lineIndex++) {
                    if (data[lineIndex] != "") {
                        var resultcoors = data[lineIndex].replace(/(^\s+)|(\s+$)/g, "");
                        resultcoors = resultcoors.replace("\n", "");
                        var coors = resultcoors.split(',');
                        for (var c in coors) {
                            if (coors[c] != "") {
                                if (coors[c].replace(/(^\s+)|(\s+$)/g, "") == "0") {
                                    linePath.polyline.positions.cartographicDegrees.push("1000");
                                }
                                else {
                                    linePath.polyline.positions.cartographicDegrees.push(coors[c]);
                                }
                            }
                        }
                    }
                }
            }
        },
        error: function(xhr, status, error) {
            console.warn('⚠️ 无法加载轨迹文件:', czmlURL, error);
        }
    });

    czmlTraj.push(linePath);
    var datasourceczmlTraj = Cesium.CzmlDataSource.load(czmlTraj);
    viewer.dataSources.add(datasourceczmlTraj);
}

/**
 * 选择航次路径
 * @param {string} czmlURL - CZML文件URL
 * @param {string} voyID - 航次ID
 */
function SelectVoyageTraj(czmlURL, voyID) {
    var czmlSelNew = [{
        "id": "document",
        "name": voyID,
        "version": "1.0"
    }];

    var linePath = {
        "name": czmlURL,
        "polyline": {
            "description": "",
            "positions": {
                "cartographicDegrees": []
            },
            "material": {
                "solidColor": {
                    "color": {
                        "rgba": [0, 255, 255, 255]
                    }
                }
            },
            "width": 2
        }
    };

    $.ajax({
        async: false,
        type: "GET",
        url: czmlURL,
        success: function (content) {
            var data = content.split('\n');
            for (var i = 0; i < 3; i++) {
                ctdInfoTable[i] = new Array();
            }

            for (var lineIndex in data) {
                var str = data[lineIndex];
                var substr = ",";
                var regex = new RegExp(substr, 'g');
                var resultstr = str.match(regex);
                var count = !resultstr ? 0 : resultstr.length;
                
                if (count == 3 || count == 2) {
                    var resultcoors = str.replace(/(^\s+)|(\s+$)/g, "");
                    resultcoors = resultcoors.replace("\n", "");
                    var coors = resultcoors.split(',');
                    
                    for (var i in coors) {
                        if (coors[i] != "") {
                            if (coors[i].replace(/(^\s+)|(\s+$)/g, "") == "0") {
                                linePath.polyline.positions.cartographicDegrees.push("1010");
                            }
                            else {
                                linePath.polyline.positions.cartographicDegrees.push(coors[i]);
                            }
                        }
                    }
                }

                if (str.indexOf("]") >= 0) {
                    break;
                }
            }
        },
        error: function(xhr, status, error) {
            console.warn('⚠️ 无法加载选中轨迹文件:', czmlURL, error);
        }
    });

    czmlSelNew.push(linePath);
    var dataSourceNewSelected = Cesium.CzmlDataSource.load(czmlSelNew);
    viewer.dataSources.add(dataSourceNewSelected);
}

//===========================================
// 数据范围回调
//===========================================

/**
 * 数据范围回调函数
 * @param {Object} dateRange - 日期范围对象
 */
var callBackDataRange = function (dateRange) {
    document.getElementById("startdate").value = dateRange.startDate;
    document.getElementById("enddate").value = dateRange.endDate;
};

//===========================================
// 航次轨迹相关事件绑定
//===========================================

// 移除航次按钮事件
$('#RemoveRoute1').click(function () {
    removedatasource();
});

// 停止地形按钮事件
$('#StopTerrain').click(function () {
    removedatasource();
    viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
    viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
});

//===========================================
// 删除数据源功能
//===========================================

/**
 * 删除数据源
 */
function removedatasource() {
    viewer.dataSources.removeAll();
    viewer.entities.removeAll();
}

//===========================================
// 影像图层清理功能
//===========================================

/**
 * 清理影像图层（带保护机制）
 */
function clearImageryLayers() {
    // 强制检查初始化状态
    if (!window.CESIUM_INITIALIZATION_COMPLETE) {
        console.warn('⚠️ Cesium未完全初始化，跳过清理操作');
        return;
    }
    
    // 只清除实体，绝对不删除影像图层
    viewer.entities.removeAll();
    
    // 强化的基础影像图层保护检查
    if (window.primaryImageryLayer) {
        var layerExists = viewer.imageryLayers.indexOf(window.primaryImageryLayer) !== -1;
        var layerValid = window.primaryImageryLayer.show !== undefined;
        
        if (!layerExists || !layerValid) {
            console.warn('⚠️ 基础影像图层被意外删除或损坏，立即恢复...');
            restoreBaseImageryLayer();
        } else {
            // 确保图层可见性
            if (!window.primaryImageryLayer.show) {
                window.primaryImageryLayer.show = true;
                viewer.scene.requestRender();
            }
        }
    } else {
        console.warn('⚠️ primaryImageryLayer引用丢失，立即恢复...');
        restoreBaseImageryLayer();
    }

    viewer.animation.viewModel.timeFormatter = function () {
    };
}

/**
 * 独立的基础影像图层恢复函数
 */
function restoreBaseImageryLayer() {
    try {
        // 如果没有任何影像图层，添加基础图层
        if (viewer.imageryLayers.length === 0) {
            const osmProvider = new Cesium.OpenStreetMapImageryProvider({
                url: 'https://a.tile.openstreetmap.org/'
            });
            const newLayer = viewer.imageryLayers.addImageryProvider(osmProvider);
            newLayer.show = true;
            newLayer.alpha = 1.0;
            newLayer._cesiumProtected = true;
            newLayer._isBaseLayer = true;
            window.primaryImageryLayer = newLayer;
            window.CESIUM_BASE_IMAGERY_PROTECTED = true;
            viewer.scene.requestRender();
        } else {
            // 检查现有图层是否为基础图层
            var foundBaseLayer = false;
            for (var i = 0; i < viewer.imageryLayers.length; i++) {
                var layer = viewer.imageryLayers.get(i);
                if (layer._isBaseLayer || layer._cesiumProtected) {
                    window.primaryImageryLayer = layer;
                    foundBaseLayer = true;
                    break;
                }
            }
            
            if (!foundBaseLayer) {
                // 将第一个图层标记为基础图层
                var firstLayer = viewer.imageryLayers.get(0);
                firstLayer._cesiumProtected = true;
                firstLayer._isBaseLayer = true;
                window.primaryImageryLayer = firstLayer;
            }
        }
        
    } catch (error) {
        console.error('❌ 基础影像图层恢复失败:', error);
    }
}

// 将函数暴露到全局命名空间
window.IVSOSD.callBackVoyageInfo = callBackVoyageInfo;
window.IVSOSD.AddRouteCZML2 = AddRouteCZML2;
window.IVSOSD.SelectVoyageTraj = SelectVoyageTraj;
window.IVSOSD.callBackDataRange = callBackDataRange;
window.IVSOSD.removedatasource = removedatasource;
window.IVSOSD.clearImageryLayers = clearImageryLayers;
window.IVSOSD.restoreBaseImageryLayer = restoreBaseImageryLayer;

// 标记航次信息模块已加载
window.IVSOSD.voyageInfoModuleLoaded = true;

