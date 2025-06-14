/**
 * @filename: terrain-rendering.js
 * @description: 地形渲染模块
 * @version: 1.0
 * @date: 2025-01-01
 * @author: 系统重构
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

"use strict";

// 确保依赖的模块已加载
if (!window.IVSOSD || !window.IVSOSD.stationManagementModuleLoaded) {
    throw new Error('terrain-rendering.js depends on station-management.js module');
}

//===========================================
// 地形清除功能
//===========================================

/**
 * 清除地形数据
 */
function TerrainMove() {
    if (maliyana) {
        viewer.imageryLayers.remove(maliyana);
    }
    if (chongsheng) {
        viewer.imageryLayers.remove(chongsheng);
    }

    var cesiumTerrainFalse = new Cesium.CesiumTerrainProvider({
        url: 'Data/terrain/terrain03',
        maximumLevel: 0,
        requestVertexNormals: true
    });
    if (viewer.terrainProvider._url != 'Data/terrain/terrain03') {
        viewer.terrainProvider = cesiumTerrainFalse;
    }
}

//===========================================
// 全球地形显示
//===========================================

/**
 * 加载显示地形数据
 */
function ShowGlobalTerrain() {
    globe.depthTestAgainstTerrain = true;
    var TerrainPoint = document.getElementById("TerrainPoint").value;
    if (viewer.terrainProvider._url != 'Data/terrain/terrain01') {
        var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
            url: 'Data/terrain/terrain01',
            requestVertexNormals: true
        });
        viewer.terrainProvider = cesiumTerrainProviderMeshes;
    }

    var imageryLayers = viewer.imageryLayers;
    if (chongsheng) {
        viewer.imageryLayers.remove(chongsheng);
    }
    if (maliyana) {
        viewer.imageryLayers.remove(maliyana);
    }
    global01 = imageryLayers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
        url: 'Data/tiles/color_etopo1_ice_full',
        fileExtension: 'png',
        maximumLevel: 5,
        credit: 'global01'
    }));

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(105.00, 24.00, 24000000.0)
    });
}

//===========================================
// 地形区域选择处理
//===========================================

/**
 * 选择渲染区域
 */
$('#TerrainPoint').change(function (e) {
    var h = $(this).val();

    var options = "全球数字高程模型渲染";
    var options1 = "马里亚纳海沟，又称'马里亚纳群岛海沟'，是目前所知地球上最深的海沟，该海沟地处北太平洋西部海床，" +
        "靠近关岛的马里亚纳群岛的东方，该海沟为两个板块辐辏俯冲带，太平洋板块在这里俯冲到菲律宾板块（或细分出的马里亚纳板块）之下。";
    var options2 = "冲绳海槽是位于东海大陆架外缘、东海陆架边缘隆褶带与琉球岛弧之间的一个狭长带状弧间盆地。";
    var options3 = "南海为东北—西南走向，其南部边界在南纬3度，位于印度尼西亚的南苏门达腊和加里曼丹之间。";
    var options4 = "全球数字高程模型渲染";

    globe.depthTestAgainstTerrain = true;
    if (viewer.terrainProvider._url != 'Data/terrain/terrain01') {
        var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
            url: 'Data/terrain/terrain01',
            requestVertexNormals: true
        });
        viewer.terrainProvider = cesiumTerrainProviderMeshes;
    }

    if (h == "global01") {
        document.getElementById("ZoneIntroduce").innerHTML = options;
        ShowGlobalTerrain();
        document.getElementById("imgTerLeg").src = "images/terLegGLB01.png";
        document.getElementById("terLegMin").innerText = "-10977";
        document.getElementById("terLegMax").innerText = "8848";
    }
    else if (h == "maliyana") {
        document.getElementById("ZoneIntroduce").innerHTML = options1;
        loadMaliyanaTerrainImagery();
        document.getElementById("imgTerLeg").src = "images/terLegML01.png";
        document.getElementById("terLegMin").innerText = "-10977";
        document.getElementById("terLegMax").innerText = "781";
    } 
    else if (h == "chongsheng") {
        document.getElementById("ZoneIntroduce").innerHTML = options2;
        loadChongshengTerrainImagery();
        document.getElementById("imgTerLeg").src = "images/terLegCS01.png";
        document.getElementById("terLegMin").innerText = "-4960";
        document.getElementById("terLegMax").innerText = "4021";
    } 
    else if (h == "nanhai") {
        document.getElementById("ZoneIntroduce").innerHTML = options3;
    }
    else if (h == "global02") {
        document.getElementById("ZoneIntroduce").innerHTML = options4;
        loadGlobal02TerrainImagery();
        document.getElementById("imgTerLeg").src = "images/terLegGLB02.png";
        document.getElementById("terLegMin").innerText = "-10977";
        document.getElementById("terLegMax").innerText = "8848";
    }
});

//===========================================
// 马里亚纳海沟地形加载
//===========================================

/**
 * 加载马里亚纳海沟地形影像
 */
function loadMaliyanaTerrainImagery() {
    var imageryLayers = viewer.imageryLayers;
    if (chongsheng) {
        viewer.imageryLayers.remove(chongsheng);
    }
    if (nanhai) {
        viewer.imageryLayers.remove(nanhai);
    }
    if (global01) {
        viewer.imageryLayers.remove(global01);
    }
    if (global02) {
        viewer.imageryLayers.remove(global02);
    }

    maliyana = imageryLayers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
        url: 'Data/tiles/maliyanarender',
        maximumLevel: 10,
        credit: 'maliyana',
        parameters: {
            transparent: true,
            format: 'image/png'
        }
    }));

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(138.9, 1.931, 2000000.0),
        orientation: {
            heading: Cesium.Math.toRadians(-1.0),
            pitch: Cesium.Math.toRadians(-50.0),
            roll: 0.0
        }
    });
}

//===========================================
// 冲绳海槽地形加载
//===========================================

/**
 * 加载冲绳海槽地形影像
 */
function loadChongshengTerrainImagery() {
    var imageryLayers = viewer.imageryLayers;
    if (maliyana) {
        viewer.imageryLayers.remove(maliyana);
    }
    if (nanhai) {
        viewer.imageryLayers.remove(nanhai);
    }
    if (global01) {
        viewer.imageryLayers.remove(global01);
    }
    if (global02) {
        viewer.imageryLayers.remove(global02);
    }

    chongsheng = imageryLayers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
        url: 'Data/tiles/chongshengrender',
        maximumLevel: 10,
        credit: 'chongsheng',
        parameters: {
            transparent: true,
            format: 'image/png'
        }
    }));

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(122.583, 12.065, 2000000.0),
        orientation: {
            heading: Cesium.Math.toRadians(-1.0),
            pitch: Cesium.Math.toRadians(-50.0),
            roll: 0.0
        }
    });
}

//===========================================
// 全球地形模型2加载
//===========================================

/**
 * 加载全球地形模型2影像
 */
function loadGlobal02TerrainImagery() {
    var imageryLayers = viewer.imageryLayers;
    if (nanhai) {
        viewer.imageryLayers.remove(nanhai);
    }
    if (maliyana) {
        viewer.imageryLayers.remove(maliyana);
    }
    if (chongsheng) {
        viewer.imageryLayers.remove(chongsheng);
    }
    if (global01) {
        viewer.imageryLayers.remove(global01);
    }
    
    global02 = imageryLayers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
        url: 'Data/tiles/GEBCO_render01',
        maximumLevel: 5,
        credit: 'global02',
        parameters: {
            transparent: true,
            format: 'image/png'
        }
    }));
}

//===========================================
// 地形查询按钮事件
//===========================================

/**
 * 地形查询按钮事件处理
 */
$('#SearchTerrain').click(function () {
    globe.depthTestAgainstTerrain = true;
    var TerrainPoint = document.getElementById("TerrainPoint").value;
    if (viewer.terrainProvider._url != 'Data/terrain/terrain01') {
        var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
            url: 'Data/terrain/terrain01',
            requestVertexNormals: true
        });
        viewer.terrainProvider = cesiumTerrainProviderMeshes;
    }

    if (TerrainPoint == "global01") {
        loadGlobal01Terrain();
    }
    else if (TerrainPoint == "maliyana") {
        loadMaliyanaWithAnimation();
    }
    else if (TerrainPoint == "chongsheng") {
        loadChongshengWithAnimation();
    }
    else if (TerrainPoint == "nanhai") {
        loadNanhaiWithAnimation();
    }
    else if (TerrainPoint == "global02") {
        loadGlobal02Terrain();
    }
});

//===========================================
// 特定地形加载函数
//===========================================

/**
 * 加载全球地形1
 */
function loadGlobal01Terrain() {
    globe.depthTestAgainstTerrain = true;
    if (viewer.terrainProvider._url != 'Data/terrain/terrain01') {
        var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
            url: 'Data/terrain/terrain01',
            requestVertexNormals: true
        });
        viewer.terrainProvider = cesiumTerrainProviderMeshes;
    }

    var imageryLayers = viewer.imageryLayers;
    if (chongsheng) {
        viewer.imageryLayers.remove(chongsheng);
    }
    if (maliyana) {
        viewer.imageryLayers.remove(maliyana);
    }

    global01 = imageryLayers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
        url: 'Data/tiles/color_etopo1_ice_full',
        fileExtension: 'png',
        maximumLevel: 5,
        credit: 'global01'
    }));

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(105.00, 24.00, 24000000.0)
    });
}

/**
 * 加载马里亚纳海沟带动画
 */
function loadMaliyanaWithAnimation() {
    var imageryLayers = viewer.imageryLayers;
    clearOtherTerrainLayers(['maliyana']);

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(138.9, 0.9310001, 2000000.1),
        orientation: {
            heading: Cesium.Math.toRadians(-1.0),
            pitch: Cesium.Math.toRadians(-50.0),
            roll: 0.0
        }
    });

    var czmlterrain = createMaliyanaAnimationCZML();
    if (typeof huhuhu1 === 'function') {
        huhuhu1(czmlterrain);
    }
}

/**
 * 加载冲绳海槽带动画
 */
function loadChongshengWithAnimation() {
    var imageryLayers = viewer.imageryLayers;
    clearOtherTerrainLayers(['chongsheng']);

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(122.583, 12.065, 2000000.1),
        orientation: {
            heading: Cesium.Math.toRadians(-1.0),
            pitch: Cesium.Math.toRadians(-50.0),
            roll: 0.0
        }
    });

    var czmlterrain = createChongshengAnimationCZML();
    if (typeof huhuhu1 === 'function') {
        huhuhu1(czmlterrain);
    }
}

/**
 * 加载南海带动画
 */
function loadNanhaiWithAnimation() {
    var imageryLayers = viewer.imageryLayers;
    clearOtherTerrainLayers(['nanhai']);
    
    nanhai = imageryLayers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
        url: 'Data/tiles/nanhairender',
        maximumLevel: 10,
        credit: 'nanhai',
        parameters: {
            transparent: true,
            format: 'image/png'
        }
    }));

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(110.583, 5.065, 1000000.0),
        orientation: {
            heading: Cesium.Math.toRadians(-1.0),
            pitch: Cesium.Math.toRadians(-50.0),
            roll: 0.0
        }
    });

    var czmlterrain = createNanhaiAnimationCZML();
    if (typeof huhuhu1 === 'function') {
        huhuhu1(czmlterrain);
    }
}

/**
 * 加载全球地形2
 */
function loadGlobal02Terrain() {
    var imageryLayers = viewer.imageryLayers;
    clearOtherTerrainLayers(['global02']);
    
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(105.00, 24.00, 24000000.0)
    });
}

//===========================================
// 辅助函数
//===========================================

/**
 * 清除其他地形图层
 * @param {Array} keepLayers - 要保留的图层名称数组
 */
function clearOtherTerrainLayers(keepLayers) {
    keepLayers = keepLayers || [];
    
    if (keepLayers.indexOf('nanhai') === -1 && nanhai) {
        viewer.imageryLayers.remove(nanhai);
    }
    if (keepLayers.indexOf('maliyana') === -1 && maliyana) {
        viewer.imageryLayers.remove(maliyana);
    }
    if (keepLayers.indexOf('chongsheng') === -1 && chongsheng) {
        viewer.imageryLayers.remove(chongsheng);
    }
    if (keepLayers.indexOf('global01') === -1 && global01) {
        viewer.imageryLayers.remove(global01);
    }
    if (keepLayers.indexOf('global02') === -1 && global02) {
        viewer.imageryLayers.remove(global02);
    }
}

//===========================================
// CZML动画数据创建
//===========================================

/**
 * 创建马里亚纳海沟动画CZML数据
 */
function createMaliyanaAnimationCZML() {
    return [{
        "id": "document",
        "name": "CZML Path",
        "version": "1.0",
        "clock": {
            "interval": "2016-10-07T00:00:00Z/3016-10-10T10:00:00Z",
            "currentTime": "2016-10-07T00:00:00Z",
            "multiplier": 1000
        }
    }, {
        "id": "path",
        "name": "path of maliyana",
        "description": "<p> </p>",
        "availability": "2016-10-07T00:00:00Z/9998-10-10T10:00:00Z",
        "path": {
            "material": {
                "polylineOutline": {
                    "color": {
                        "rgba": [255, 0, 255, 255]
                    },
                    "outlineColor": {
                        "rgba": [0, 255, 255, 255]
                    },
                    "outlineWidth": 0,
                    "polylineGlow": {
                        "color": {
                            "rgba": [255, 255, 0, 255]
                        },
                        "glowPower": 3
                    }
                }
            },
            "width": 8,
            "leadTime": 10,
            "trailTime": 0,
            "resolution": 20
        },
        "billboard": {
            "image": "images/UUVs.png",
            "scale": 1.5
        },
        "position": {
            "epoch": "2016-10-07T00:00:00Z",
            "cartographicDegrees": [
                1000, 139.588042370183103, 10.67822500098195, 80000,
                2000, 140.22208504269679, 10.75842377298922, 80000,
                3000, 140.846234000007797, 10.864472864556459, 80000,
                4000, 141.465872561920406, 10.995972160401861, 80000,
                5000, 142.050931706930498, 11.145714882465841, 80000,
                60000, 138.877820123069, 10.650491507974429, 80000
            ]
        }
    }];
}

/**
 * 创建冲绳海槽动画CZML数据
 */
function createChongshengAnimationCZML() {
    return [{
        "id": "document",
        "name": "CZML Path",
        "version": "1.0",
        "clock": {
            "interval": "2016-10-07T10:00:00Z/3016-10-07T15:00:00Z",
            "currentTime": "2016-10-07T10:00:00Z",
            "multiplier": 1000
        },
        "clockrange": "clamped"
    }, {
        "id": "path",
        "name": "path of chongsheng",
        "description": "<p>  </p>",
        "availability": "2016-10-07T10:00:00Z/3016-10-07T15:00:00Z",
        "path": {
            "material": {
                "polylineOutline": {
                    "color": {
                        "rgba": [255, 0, 255, 255]
                    },
                    "outlineColor": {
                        "rgba": [0, 255, 255, 255]
                    },
                    "outlineWidth": 0,
                    "polylineGlow": {
                        "color": {
                            "rgba": [255, 255, 0, 255]
                        },
                        "glowPower": 3
                    }
                }
            },
            "width": 0,
            "leadTime": 10,
            "trailTime": 0,
            "resolution": 20
        },
        "billboard": {
            "image": "images/UUVs.png",
            "scale": 1.5
        },
        "position": {
            "epoch": "2016-10-07T10:00:00Z",
            "cartographicDegrees": [
                0, 122.583, 23.065, 80000,
                1000, 123.76, 23.136, 80000,
                2000, 125.117, 23.314, 80000,
                3000, 126.116, 23.671, 80000,
                4000, 126.83, 24.207, 80000,
                11000, 131.684, 29.239, 80000
            ]
        }
    }];
}

/**
 * 创建南海动画CZML数据
 */
function createNanhaiAnimationCZML() {
    return [{
        "id": "document",
        "name": "CZML Path",
        "version": "1.0",
        "clock": {
            "interval": "2016-10-07T10:00:00Z/3016-10-10T15:00:00Z",
            "currentTime": "2016-10-07T10:00:00Z",
            "multiplier": 1000
        }
    }, {
        "id": "path",
        "name": "path of nanhai",
        "description": "<p>  </p>",
        "availability": "2016-10-07T10:00:00Z/3016-10-10T15:00:00Z",
        "path": {
            "material": {
                "polylineOutline": {
                    "color": {
                        "rgba": [255, 0, 255, 255]
                    },
                    "outlineColor": {
                        "rgba": [0, 255, 255, 255]
                    },
                    "outlineWidth": 5,
                    "polylineGlow": {
                        "color": {
                            "rgba": [255, 255, 0, 255]
                        },
                        "glowPower": 3
                    }
                }
            },
            "width": 8,
            "leadTime": 10,
            "trailTime": 0,
            "resolution": 20
        },
        "billboard": {
            "image": "images/UUVs.png",
            "scale": 1.5
        },
        "position": {
            "epoch": "2016-10-07T10:00:00Z",
            "cartographicDegrees": [
                1000, 113.326237706226095, 8.398680800842524, 80000,
                2000, 113.178494939011799, 8.80995869976007, 80000,
                3000, 112.9133634773615, 9.724829119000386, 80000,
                48000, 113.917656617932195, 7.965628105648136, 80000
            ]
        }
    }];
}

// 将函数暴露到全局命名空间
window.IVSOSD.TerrainMove = TerrainMove;
window.IVSOSD.ShowGlobalTerrain = ShowGlobalTerrain;
window.IVSOSD.loadMaliyanaTerrainImagery = loadMaliyanaTerrainImagery;
window.IVSOSD.loadChongshengTerrainImagery = loadChongshengTerrainImagery;
window.IVSOSD.loadGlobal02TerrainImagery = loadGlobal02TerrainImagery;
window.IVSOSD.clearOtherTerrainLayers = clearOtherTerrainLayers;

// 标记地形渲染模块已加载
window.IVSOSD.terrainRenderingModuleLoaded = true;

