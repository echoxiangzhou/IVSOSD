/**
 * @filename: initial.js
 * @description: Create a Viewer instances and add the DataSource.初始化cesium视图并加载数据
 * @version: 原始版本 - 恢复正常三维地球显示
 * @date: 2016-11-26
 * @author:
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

// 恢复原始的Cesium配置，确保三维地球正常显示
var viewer = new Cesium.Viewer(
    'vmap',
    {
        animation: true,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        terrainExaggeration: 100,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        scene3DOnly: false,
        navigationInstructionsInitiallyVisible: false,
        showRenderLoopErrors: false
    });

// 原始的动画容器设置
$('.cesium-viewer-animationContainer').css('width', '0px');
$('.cesium-viewer-animationContainer').css('height', '0px');
$('.cesium-viewer-animationContainer').css('display', 'none');

//初始化球体视野中心
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(105.00, 24.00, 24000000.0)
});

var scene = viewer.scene;
viewer._cesiumWidget._creditContainer.style.display = "none";
scene.skyAtmosphere = new Cesium.SkyAtmosphere();

var globe = scene.globe;
globe.depthTestAgainstTerrain = true;

var earthContainerHeight = document.body.clientHeight - 100;
var earthContainerDiv = $('#earthContainer');
earthContainerDiv.css('height', earthContainerHeight);

//正北为0
var heading = Cesium.Math.toRadians(0);
//倾斜角度(此为正上方,俯视)
var pitch = Cesium.Math.toRadians(-90);
//视角高度(meter)
var range = 500 * 10000;
viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(heading, pitch, range));

var mapDiv = $('#vmap');
mapDiv.css('left', '0px');
var mapWidth = document.body.clientWidth;
mapDiv.css('width', mapWidth);

var treeDiv = $('#tree');
var treeHeight = document.body.clientHeight - 325;
treeDiv.css('height', treeHeight);

$('.sidebar-left').addClass('active');

//移动鼠标，显示基本坐标信息
ShowBaseInfo();

//初始化时间轴设置
var startTime = Cesium.JulianDate.fromDate(new Date(2017, 1, 4, 0));
var stopTime = Cesium.JulianDate.addDays(startTime, 7, new Cesium.JulianDate());

var currentTime = Cesium.JulianDate.fromIso8601("2017-01-04");
var clockRange = Cesium.ClockRange.CLAMPED;
var clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;

//Make sure viewer is at the desired time.
viewer.clock.startTime = startTime.clone();
viewer.clock.stopTime = stopTime.clone();
viewer.clock.currentTime = currentTime.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
viewer.clock.multiplier = 1;

var strSQLDataRange = "";
DatabaseOperationJS.QueryDataRange(strSQLDataRange, callBackDataRange);

//加载全部航线 - 使用修复后的DWR调用方式
AddAllRoute();

var handler;