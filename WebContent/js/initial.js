/**
 * @filename: initial.js
 * @description: Create a Viewer instances and add the DataSource.初始化cesium视图并加载数据
 * @version: 1.130 - 使用最新版本Cesium
 * @date: 2016-11-26
 * @author:
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */



// 创建使用最新版本Cesium 1.130的Viewer
try {
    var viewer = new Cesium.Viewer('vmap', {
        animation: false,           // 禁用动画控件
        baseLayerPicker: false,    // 禁用底图选择器
        fullscreenButton: false,   // 禁用全屏按钮
        geocoder: false,           // 禁用地址搜索
        homeButton: true,          // 保留主页按钮方便测试
        infoBox: false,            // 禁用信息框
        sceneModePicker: false,    // 禁用场景模式选择器
        selectionIndicator: false, // 禁用选择指示器
        timeline: false,           // 禁用时间轴
        navigationHelpButton: false, // 禁用导航帮助
        scene3DOnly: true,         // 强制3D模式
        showRenderLoopErrors: true // 显示渲染错误便于调试
    });
    

    
    // 隐藏版权信息
    if (viewer._cesiumWidget._creditContainer) {
        viewer._cesiumWidget._creditContainer.style.display = "none";
    }
    
    // 基本场景设置
    var scene = viewer.scene;
    var globe = scene.globe;
    globe.depthTestAgainstTerrain = true;
    
  
    
    // 设置初始视角到中国海域
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(105.00, 24.00, 24000000.0)
    });
    

    
    // 确保容器样式正确
    var earthContainerHeight = document.body.clientHeight - 100;
    var mapDiv = $('#vmap');
    var mapWidth = document.body.clientWidth;
    
    mapDiv.css({
        'width': mapWidth,
        'height': earthContainerHeight,
        'display': 'block',
        'visibility': 'visible'
    });
    

    
    // 设置动画容器
    $('.cesium-viewer-animationContainer').css({
        'width': '0px',
        'height': '0px',
        'display': 'none'
    });
    
    // 设置正北为0，俯视角度
    var heading = Cesium.Math.toRadians(0);
    var pitch = Cesium.Math.toRadians(-90);
    var range = 500 * 10000;
    viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(heading, pitch, range));
    
    // 设置侧边栏
    $('.sidebar-left').addClass('active');
    
    var treeDiv = $('#tree');
    var treeHeight = document.body.clientHeight - 325;
    treeDiv.css('height', treeHeight);
    
    // 初始化时间轴设置
    var startTime = Cesium.JulianDate.fromDate(new Date(2017, 1, 4, 0));
    var stopTime = Cesium.JulianDate.addDays(startTime, 7, new Cesium.JulianDate());
    var currentTime = Cesium.JulianDate.fromIso8601("2017-01-04");
    
    viewer.clock.startTime = startTime.clone();
    viewer.clock.stopTime = stopTime.clone();
    viewer.clock.currentTime = currentTime.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.multiplier = 1;
    

    
    // 查询数据范围
    var strSQLDataRange = "";
    function callBackDataRange(result) {
        // 数据范围回调处理
    }
    
    if (typeof DatabaseOperationJS !== 'undefined') {
        DatabaseOperationJS.QueryDataRange(strSQLDataRange, callBackDataRange);
    }
    
    // 暴露viewer到全局作用域
    window.viewer = viewer;
    window.debugViewer = viewer;
    

    
} catch (error) {
    console.error("❌ Cesium初始化失败:", error);
    
    // 显示错误信息到页面
    var vmapElement = document.getElementById('vmap');
    if (vmapElement) {
        vmapElement.innerHTML = '<div style="color: red; padding: 20px; font-size: 16px;">Cesium 初始化失败: ' + error.message + '</div>';
    }
}

// 全局变量声明
var handler;