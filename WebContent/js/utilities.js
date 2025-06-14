/**
 * @filename: utilities.js
 * @description: 工具和辅助功能模块
 * @version: 1.0
 * @date: 2025-01-01
 * @author: 系统重构
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

"use strict";

// 确保依赖的模块已加载
if (!window.IVSOSD || !window.IVSOSD.terrainRenderingModuleLoaded) {
    throw new Error('utilities.js depends on terrain-rendering.js module');
}

//===========================================
// 日期选择功能
//===========================================

/**
 * 全部日期复选框点击事件
 */
$('#ckbAllDate').click(function () {
    var ckballdate = document.getElementById("ckbAllDate");
    var dpCX = document.getElementById("datepickerHangCiChaXun");
    if (!ckballdate.checked) {
        dpCX.style.display = "block";
    }
    else {
        dpCX.style.display = "none";
    }
});

//===========================================
// 站位点热力图功能
//===========================================

/**
 * 站位点热力图
 */
$('#ckbheatmap').click(function () {
    var ckbheatmap = document.getElementById("ckbheatmap");
    if (!ckbheatmap.checked) {
        var imageryLayers = viewer.imageryLayers;
        for (var i = 1; i < imageryLayers.length; i++) {
            var tempLayer = imageryLayers.get(i);
            imageryLayers.remove(tempLayer);
        }

        for (var i = 1; i < imageryLayers.length; i++) {
            var tempLayer = imageryLayers.get(i);
            imageryLayers.remove(tempLayer);
        }
    }
    else {
        globe.depthTestAgainstTerrain = false;

        var obj = document.getElementById("tbodyVoyageList");
        var voyIDList = [];

        for (var i = 0; i < voyageList2.length; i++) {
            voyIDList.push(voyageList2[i].ID);
        }

        if (voyIDList.length >= 1) {
            var strSQLSelStaList = "select * from STATION where ( VOYAGE_ID = " + voyIDList[0] + "";
            for (var voyIndex = 1; voyIndex < obj.rows.length; voyIndex++) {
                strSQLSelStaList = strSQLSelStaList + " OR VOYAGE_ID = " + voyIDList[voyIndex] + "";
            }

            var voyDateStart = document.getElementById("startdate").value;
            var voyDateEnd = document.getElementById("enddate").value;

            strSQLSelStaList = strSQLSelStaList + " ) and to_char(S_DATE,'yyyy-mm-dd')<='" + voyDateEnd + "' and to_char(S_DATE,'yyyy-mm-dd')>='" + voyDateStart + "'" + " order by ID";

            DatabaseOperationJS.QueryStationList2(strSQLSelStaList, callBackHeatStaList);
        }
    }
});

/**
 * 热力图站点列表回调
 * @param {Array} heatStaList - 热力图站点数据
 */
var callBackHeatStaList = function (heatStaList) {
    for (var i = 0; i < heatStaList.length; i++) {
        var datapoint = [];
        var northpoint = "90";
        var eastpoint = "180";
        var southpoint = "-90";
        var westpoint = "-180";
        
        var cesiumHeatmapInstance = CesiumHeatmap.create(viewer, {
            north: northpoint,
            east: eastpoint,
            south: southpoint,
            west: westpoint
        }, {radius: 7.5});
        
        for (var q = 0; q < heatStaList.length; q++) {
            var lon = heatStaList[q].longitude;
            var lat = heatStaList[q].latitude;
            if (lon >= westpoint && lon <= eastpoint && lat >= southpoint && lat <= northpoint) {
                var pointheat = {};
                pointheat.x = lon;
                pointheat.y = lat;
                pointheat.value = 25;
                datapoint.push(pointheat);
            }
        }
    }
    cesiumHeatmapInstance.setWGS84Data(0, 100, datapoint);
}

//===========================================
// 坐标信息显示功能
//===========================================

/**
 * 显示经纬度基本信息
 */
function ShowBaseInfo() {
    // 在函数开始时调试地球状态
    if (typeof debugGlobeState === 'function') {
        debugGlobeState('ShowBaseInfo函数开始');
    }
    
    scene = viewer.scene;
    var globe = scene.globe;
    
    globe.depthTestAgainstTerrain = false;
    
    // 在地形提供者切换前保存当前影像图层状态
    var primaryLayerBackup = window.primaryImageryLayer;
    var hasValidPrimaryLayer = primaryLayerBackup && 
                              viewer.imageryLayers.indexOf(primaryLayerBackup) !== -1;

    // 兼容Cesium 1.130 - 简化地形设置逻辑
    try {
        var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
            url: 'Data/terrain/terrain03',
            requestVertexNormals: true
        });
        
        // 在Cesium 1.130中，直接设置terrain而不检查URL
        if (typeof debugGlobeState === 'function') {
            debugGlobeState('地形切换前最后状态');
        }
        
        viewer.terrainProvider = cesiumTerrainProviderMeshes;
        
        // 地形切换后立即检查并恢复影像图层
        setTimeout(() => {
            // 详细调试地形切换后的状态
            if (typeof debugGlobeState === 'function') {
                debugGlobeState('地形切换后立即检查');
            }
            
            var currentLayerCount = viewer.imageryLayers.length;
            var primaryStillExists = window.primaryImageryLayer && 
                                   viewer.imageryLayers.indexOf(window.primaryImageryLayer) !== -1;

            if (currentLayerCount === 0 || !primaryStillExists) {
                console.warn('⚠️ 地形切换导致影像图层丢失，立即恢复OpenStreetMap...');
                
                // 重新添加OpenStreetMap
                const osmProvider = new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://a.tile.openstreetmap.org/'
                });
                const osmLayer = viewer.imageryLayers.addImageryProvider(osmProvider);
                osmLayer.show = true;
                osmLayer.alpha = 1.0;
                osmLayer._cesiumProtected = true;
                osmLayer._isBaseLayer = true;
                osmLayer._restoredAfterTerrain = true;
                
                window.primaryImageryLayer = osmLayer;
                window.CESIUM_BASE_IMAGERY_PROTECTED = true;
                
                viewer.scene.requestRender();
            } else {
                // 即使图层存在，也要检查其可见性和透明度
                if (window.primaryImageryLayer) {
                    var currentShow = window.primaryImageryLayer.show;
                    var currentAlpha = window.primaryImageryLayer.alpha;
                    var isReady = window.primaryImageryLayer.ready;

                    // 强制确保图层可见
                    if (!currentShow || currentAlpha < 0.8) {
                        console.warn('⚠️ 影像图层存在但不可见，强制恢复可见性...');
                        window.primaryImageryLayer.show = true;
                        window.primaryImageryLayer.alpha = 1.0;
                        viewer.scene.requestRender();
                    }
                    
                    // 如果图层提供者有问题，强制替换
                    if (!isReady || !window.primaryImageryLayer.imageryProvider) {
                        console.warn('⚠️ 影像图层提供者有问题，强制替换为新的OpenStreetMap...');
                        
                        // 移除当前有问题的图层
                        viewer.imageryLayers.remove(window.primaryImageryLayer);
                        
                        // 添加新的OpenStreetMap图层
                        const newOsmProvider = new Cesium.OpenStreetMapImageryProvider({
                            url: 'https://a.tile.openstreetmap.org/'
                        });
                        const newOsmLayer = viewer.imageryLayers.addImageryProvider(newOsmProvider);
                        newOsmLayer.show = true;
                        newOsmLayer.alpha = 1.0;
                        newOsmLayer._cesiumProtected = true;
                        newOsmLayer._isBaseLayer = true;
                        newOsmLayer._forcedReplace = true;
                        
                        window.primaryImageryLayer = newOsmLayer;
                        viewer.scene.requestRender();
                    }
                }
            }
        }, 50); // 非常短的延迟，确保及时响应
        
    } catch (e) {
        console.warn('❌ 自定义地形提供者设置失败，使用默认椭球地形:', e);
        // 使用默认的椭球地形
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        
        // 即使使用默认地形，也要检查影像图层
        setTimeout(() => {
            if (viewer.imageryLayers.length === 0 || 
                !window.primaryImageryLayer || 
                viewer.imageryLayers.indexOf(window.primaryImageryLayer) === -1) {
                
                console.warn('⚠️ 默认地形设置后影像图层丢失，恢复OpenStreetMap...');
                const osmProvider = new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://a.tile.openstreetmap.org/'
                });
                const osmLayer = viewer.imageryLayers.addImageryProvider(osmProvider);
                osmLayer.show = true;
                osmLayer.alpha = 1.0;
                window.primaryImageryLayer = osmLayer;
                viewer.scene.requestRender();
            }
        }, 50);
    }
    
    // ShowBaseInfo函数结束时的详细调试
    if (typeof debugGlobeState === 'function') {
        debugGlobeState('ShowBaseInfo函数结束');
    }

    var scene = viewer.scene;
    var ellipsoid = scene.globe.ellipsoid;
    var distPosCarte = [];
    var distPosCarto = [];
    var surfaceDist = 0;
    var distLine = viewer.entities.add({
        id: 'distLine',
        name: 'Distance Line',
        polyline: {
            width: 3,
            positions: [],
            "material": new Cesium.PolylineOutlineMaterialProperty({
                color: Cesium.Color.RED,
                outlineWidth: 2,
                outlineColor: Cesium.Color.RED
            })
        }
    });

    handlerShowCoor = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handlerShowCoor.setInputAction(function (movement) {
        // clear distPos arrays on single click without SHIFT
        distPosCarto.length = 0;
        distPosCarte.length = 0;
        surfaceDist = 0;
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handlerShowCoor.setInputAction(function (movement) {
        var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
        var t = viewer.scene.globe.ellipsoid,
            i = viewer.scene.camera.getPickRay(movement.endPosition),
            r = viewer.scene.globe.pick(i, viewer.scene);
        if (r) {
            var n = t.cartesianToCartographic(r);
            distPosCarto.push(n);
            distPosCarte.push(n);
            var surfaceDist = 0;
            if (distPosCarte.length >= 2) {
                var posArray = [];
                var chartxArray = [];
                var chartyArray = [];
                chartxArray.push(surfaceDist);
                // Build array with all points
                var minheight = distPosCarte[0].height;
                var maxheight = distPosCarte[0].height;

                for (var i = 0; i < distPosCarte.length; i++) {
                    posArray.push(Cesium.Math.toDegrees(distPosCarte[i].longitude));
                    posArray.push(Cesium.Math.toDegrees(distPosCarte[i].latitude));
                    posArray.push(distPosCarte[i].height);
                    chartyArray.push(((distPosCarte[i].height / 100) * 3 - 10977).toFixed(1));
                }

                for (var j = 1; j < distPosCarto.length; j++) {
                    var geodesic = new Cesium.EllipsoidGeodesic(distPosCarto[j - 1], distPosCarto[j]);
                    surfaceDist += geodesic.surfaceDistance;
                    chartxArray.push((surfaceDist / 1000).toFixed(1));
                }

                viewer.selectedEntity = distLine;

                var currLong = posArray[posArray.length - 3];
                var currLati = posArray[posArray.length - 2];
                var currAlti = chartyArray[chartyArray.length - 1];
                var showLong;
                var showLati;
                var showAlti;

                if (currLong < 0) {
                    showLong = currLong.toFixed(3).split("-")[1] + "°W";
                }
                else {
                    showLong = currLong.toFixed(3) + "°E";
                }
                if (currLati < 0) {
                    showLati = currLati.toFixed(3).split("-")[1] + "°S";
                }
                else {
                    showLati = currLati.toFixed(3) + "°N";
                }

                if (viewer.terrainProvider._url != 'Data/terrain/terrain01') {
                    document.getElementById('idCoorInfo').innerText = "经度：" + showLong + "， 纬度：" + showLati;
                }
                else {
                    document.getElementById('idCoorInfo').innerText = "经度：" + showLong + "， 纬度：" + showLati + "， 海拔：" + parseInt(currAlti) + " 米";
                }
            }
        }
        else {
            document.getElementById('idCoorInfo').innerText = "经度： 无 " + "  ， 纬度： 无 ";
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

//===========================================
// 2D/3D切换功能
//===========================================

/**
 * 2D/3D切换
 */
$('.map2d').click(function () {
    if (morph == "3D") {
        viewer._cesiumWidget.scene.morphTo2D(0);
        morph = "2D";

        $('.map2d').css('background-image', 'url(images/2d_on.png)');
        $('.map3d').css('background-image', 'url(images/3d_off.png)');
    }
});

$('.map3d').click(function () {
    if (morph == "2D") {
        viewer._cesiumWidget.scene.morphTo3D(0);
        morph = "3D";
        $('.map2d').css('background-image', 'url(images/2d_off.png)');
        $('.map3d').css('background-image', 'url(images/3d_on.png)');
    }
});

//===========================================
// 自动图标控制
//===========================================

/**
 * 自动图标点击事件
 */
$("#autoIcon").click(function (e) {
    var scon = $("#slider-container");
    if (scon.is(":hidden")) {
        scon.slideDown("fast");
    } else {
        scon.slideUp("fast");
    }
});

//===========================================
// 图例控制
//===========================================

/**
 * 图例隐藏功能
 */
$('.legend-hide').click(function () {
    legendBox.addClass('off');
    legendIcon.removeClass('off');
});

//===========================================
// 信息图标事件
//===========================================

/**
 * 信息图标点击事件
 */
$("#info1Icon").click(function () {
    openerInfo.trigger('click');
    $("#info1-tab").trigger('click');
});

$("#info2Icon").click(function () {
    openerInfo.trigger('click');
    $("#info2-tab").trigger('click');
});

//===========================================
// 航次信息标签页控制
//===========================================

/**
 * 航次信息标签页1点击事件
 */
$('#voyage-info-tab1').click(function () {
    // 具体实现可根据需要添加
});

// 将函数暴露到全局命名空间
window.IVSOSD.callBackHeatStaList = callBackHeatStaList;
window.IVSOSD.ShowBaseInfo = ShowBaseInfo;

// 标记工具模块已加载
window.IVSOSD.utilitiesModuleLoaded = true;

console.log('✅ utilities.js 模块已加载');
