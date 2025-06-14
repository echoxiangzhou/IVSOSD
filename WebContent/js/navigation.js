/**
 * @filename: navigation.js
 * @description: 模块切换和导航模块
 * @version: 1.0
 * @date: 2025-01-01
 * @author: 系统重构
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

"use strict";

// 确保依赖的模块已加载
if (!window.IVSOSD || !window.IVSOSD.utilitiesModuleLoaded) {
    throw new Error('navigation.js depends on utilities.js module');
}

//===========================================
// 主模块切换功能
//===========================================

/**
 * 切换到航次模块
 */
function hanciclick() {
    $('.nav-button1').css('background-image', "url(images/HangCi32.png)");
    $('.nav-button2').css('background-image', "url(images/PouMian30.png)");
    $('.nav-button3').css('background-image', "url(images/DiXing30.png)");
    $('.nav-button4').css('background-image', "url(images/YangLiu30.png)");
    $('.nav-button5').css('background-image', "url(images/ZhongXin30.png)");

    // 手动设置样式而不触发清理事件
    if (!sTab1.hasClass('active')) {
        sTab1.addClass('active');
        content1.addClass('in');
    }
    if (!voyagepage1.hasClass('active')) {
        voyagepage1.addClass('active');
    }

    sideBarRight.removeClass('active');

    var treeDiv = $('#tree');
    var treeHeight = document.body.clientHeight - 325;
    treeDiv.css('height', treeHeight);
    $('.sidebar-left').addClass('active');
    
    menuBox.addClass('active');
    menuClickBox.addClass('active');
    markerBoxBack.addClass('on');
    legendBox.addClass('active');
    legendIcon.addClass('active');

    $('.sidebar-left-close').css('right', '-30px');

    AddAllRoute();
}

/**
 * 切换到剖面模块
 */
function poumianclick() {
    $('.nav-button1').css('background-image', "url(images/HangCi30.png)");
    $('.nav-button2').css('background-image', "url(images/PouMian32.png)");
    $('.nav-button3').css('background-image', "url(images/DiXing30.png)");
    $('.nav-button4').css('background-image', "url(images/YangLiu30.png)");
    $('.nav-button5').css('background-image', "url(images/ZhongXin30.png)");

    $('.sidebar-left').removeClass('active');
    sTab2.trigger('click');
    sideBarRight.addClass('active');
    
    var sideBarRightHeight = document.body.clientHeight;
    var tabContent2Height = document.body.clientHeight;
    $('.infoTabs-content').css('height', tabContent2Height - 36);
    
    mapDiv.css('left', '0%');
    var mapWidth = document.body.clientWidth;
    mapDiv.css('width', mapWidth);
    
    menuBox.addClass('active');
    settingBox.addClass('active');
    map2dtoggle.addClass('active');
    map3dtoggle.addClass('active');
    $('.coorInfo').addClass('active');
    menuClickBox.addClass('active');
    settingClickBox.addClass('active');
    markerBoxBack.addClass('on');
    legendBox.addClass('active');
    legendIcon.addClass('active');

    $('.sidebar-left-close').css('right', '-0px');
}

/**
 * 切换到地形渲染模块
 */
function dixingclick() {
    $('.nav-button1').css('background-image', "url(images/HangCi30.png)");
    $('.nav-button2').css('background-image', "url(images/PouMian30.png)");
    $('.nav-button3').css('background-image', "url(images/DiXing32.png)");
    $('.nav-button4').css('background-image', "url(images/YangLiu30.png)");
    $('.nav-button5').css('background-image', "url(images/ZhongXin30.png)");
    
    $('.sidebar-left').removeClass('active');
    sTab3.trigger('click');
    sideBarRight.addClass('active');
    
    var sideBarRightHeight = document.body.clientHeight;
    var tabContent2Height = document.body.clientHeight;
    $('.infoTabs-content').css('height', tabContent2Height - 36);
    
    mapDiv.css('left', '0%');
    var mapWidth = document.body.clientWidth;
    mapDiv.css('width', mapWidth);
    
    menuBox.addClass('active');
    settingBox.addClass('active');
    map2dtoggle.addClass('active');
    map3dtoggle.addClass('active');
    $('.coorInfo').addClass('active');
    menuClickBox.addClass('active');
    settingClickBox.addClass('active');
    markerBoxBack.addClass('on');
    legendBox.addClass('active');
    legendIcon.addClass('active');

    $('.sidebar-left-close').css('right', '-0px');
}

/**
 * 切换到洋流模块
 */
function yangliuclick() {
    $('.nav-button1').css('background-image', "url(images/HangCi30.png)");
    $('.nav-button2').css('background-image', "url(images/PouMian30.png)");
    $('.nav-button3').css('background-image', "url(images/DiXing30.png)");
    $('.nav-button4').css('background-image', "url(images/YangLiu32.png)");
    $('.nav-button5').css('background-image', "url(images/ZhongXin30.png)");
    
    $('.sidebar-left').removeClass('active');
    sTab4.trigger('click');
    sideBarRight.addClass('active');
    
    var sideBarRightHeight = document.body.clientHeight;
    var tabContent2Height = document.body.clientHeight;
    $('.infoTabs-content').css('height', tabContent2Height - 36);
    
    mapDiv.css('left', '0%');
    var mapWidth = document.body.clientWidth;
    mapDiv.css('width', mapWidth);
    
    menuBox.addClass('active');
    settingBox.addClass('active');
    map2dtoggle.addClass('active');
    map3dtoggle.addClass('active');
    $('.coorInfo').addClass('active');
    menuClickBox.addClass('active');
    settingClickBox.addClass('active');
    markerBoxBack.addClass('on');
    legendBox.addClass('active');
    legendIcon.addClass('active');

    $('.sidebar-left-close').css('right', '-0px');
}

//===========================================
// 主标签页控制
//===========================================

/**
 * 航次站点标签页控制
 */
sTab1.click(function () {
    if (modular != 1) {
        TerrainMove();
        removedatasource();
        clearImageryLayers();
        ClearDynaMaps();
        viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
        viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
    }
    modular = 1;

    if (sTab1.hasClass('active')) {
        return;
    }
    sTab2.removeClass('active');
    content2.removeClass('in');
    sTab3.removeClass('active');
    content3.removeClass('in');
    sTab4.removeClass('active');
    content4.removeClass('in');
    sTab1.addClass('active');
    content1.addClass('in');
});

/**
 * 剖面展示标签页控制
 */
sTab2.click(function () {
    if (modular != 2) {
        TerrainMove();
        removedatasource();
        clearImageryLayers();
        ClearDynaMaps();
        viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
        viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
    }

    modular = 2;

    if (sTab2.hasClass('active')) {
        return;
    }
    sTab1.removeClass('active');
    content1.removeClass('in');
    sTab3.removeClass('active');
    content3.removeClass('in');
    sTab4.removeClass('active');
    content4.removeClass('in');
    sTab2.addClass('active');
    content2.addClass('in');
});

/**
 * 地形渲染标签页控制
 */
sTab3.click(function () {
    if (modular != 3) {
        removedatasource();
        clearImageryLayers();
        ClearDynaMaps();
        ShowGlobalTerrain();
        viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
        viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
    }
    modular = 3;

    if (sTab3.hasClass('active')) {
        return;
    }

    sTab1.removeClass('active');
    content1.removeClass('in');
    sTab2.removeClass('active');
    content2.removeClass('in');
    sTab4.removeClass('active');
    content4.removeClass('in');
    sTab3.addClass('active');
    content3.addClass('in');
});

/**
 * 洋流风场标签页控制
 */
sTab4.click(function () {
    if (modular != 4) {
        TerrainMove();
        removedatasource();
        clearImageryLayers();
        ClearDynaMaps();
        viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
        viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
    }
    modular = 4;
    
    if (sTab4.hasClass('active')) {
        return;
    }

    sTab1.removeClass('active');
    content1.removeClass('in');
    sTab2.removeClass('active');
    content2.removeClass('in');
    sTab3.removeClass('active');
    content3.removeClass('in');
    sTab4.addClass('active');
    content4.addClass('in');
});

//===========================================
// 面板控制功能
//===========================================

/**
 * 关闭右侧信息面板
 */
$('.sidebar-close').click(function () {
    if (sideBarRight.hasClass('active')) {
        if ($('.sidebar-left').hasClass('active')) {
            sideBarRight.removeClass('active');
            mapDiv.css('left', '0px');
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);

            map2dtoggle.removeClass('active');
            map3dtoggle.removeClass('active');
            $('.coorInfo').removeClass('active');
        }
        else {
            sideBarRight.removeClass('active');
            mapDiv.css('left', '0%');
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);

            map2dtoggle.removeClass('active');
            map3dtoggle.removeClass('active');
            $('.coorInfo').removeClass('active');
        }
    }
    else {
        if ($('.sidebar-left').hasClass('active')) {
            sideBarRight.addClass('active');
            mapDiv.css('left', '0px');
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);

            map2dtoggle.addClass('active');
            map3dtoggle.addClass('active');
            $('.coorInfo').addClass('active');
        }
        else {
            sideBarRight.addClass('active');
            mapDiv.css('left', '0%');
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);

            map2dtoggle.addClass('active');
            map3dtoggle.addClass('active');
            $('.coorInfo').addClass('active');
        }
    }
});

/**
 * 左侧面板控制
 */
$('.sidebar-left-close').click(function () {
    if ($('.sidebar-left').hasClass('active')) {
        if (sideBarRight.hasClass('active')) {
            $('.sidebar-left').removeClass('active');
            mapDiv.css('left', '0px');
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);
            menuBox.removeClass('active');
            settingBox.removeClass('active');
            menuClickBox.removeClass('active');
            settingClickBox.removeClass('active');
            markerBoxBack.removeClass('on');
            legendBox.removeClass('active');
            legendIcon.removeClass('active');
        }
        else {
            $('.sidebar-left').removeClass('active');
            mapDiv.css('left', '0px');
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);
            menuBox.removeClass('active');
            settingBox.removeClass('active');
            menuClickBox.removeClass('active');
            settingClickBox.removeClass('active');
            markerBoxBack.removeClass('on');
            legendBox.removeClass('active');
            legendIcon.removeClass('active');
        }
    }
    else {
        var treeDiv = $('#tree');
        var treeHeight = document.body.clientHeight - 325;
        treeDiv.css('height', treeHeight);
        
        if (sideBarRight.hasClass('active')) {
            $('.sidebar-left').addClass('active');
            mapDiv.css('left', '0px');
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);
            menuBox.removeClass('active');
            settingBox.removeClass('active');
            menuClickBox.removeClass('active');
            settingClickBox.removeClass('active');
            markerBoxBack.removeClass('on');
            legendBox.removeClass('active');
            legendIcon.removeClass('active');
        }
        else {
            $('.sidebar-left').addClass('active');
            mapDiv.css('left', '0px');
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);
            menuBox.removeClass('active');
            settingBox.removeClass('active');
            menuClickBox.removeClass('active');
            settingClickBox.removeClass('active');
            markerBoxBack.removeClass('on');
            legendBox.removeClass('active');
            legendIcon.removeClass('active');
        }
    }
});

/**
 * 左侧面板切换控制（旧版）
 */
$('.toggle').click(function () {
    if ($('.navbar-left').hasClass('open')) {
        if (sideBarRight.hasClass('active')) {
            $('.navbar-left').removeClass('open');
            mapDiv.css('left', '0px');
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);
            menuBox.removeClass('active');
            settingBox.removeClass('active');
            menuClickBox.removeClass('active');
            settingClickBox.removeClass('active');
            markerBoxBack.removeClass('on');
            legendBox.removeClass('active');
            legendIcon.removeClass('active');
        }
        else {
            $('.navbar-left').removeClass('open');
            mapDiv.css('left', '0px');
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);
            menuBox.removeClass('active');
            settingBox.removeClass('active');
            menuClickBox.removeClass('active');
            settingClickBox.removeClass('active');
            markerBoxBack.removeClass('on');
            legendBox.removeClass('active');
            legendIcon.removeClass('active');
        }
    }
    else {
        var treeDiv = $('#tree');
        var treeHeight = document.body.clientHeight - 325;
        treeDiv.css('height', treeHeight);
        
        if (sideBarRight.hasClass('active')) {
            $('.navbar-left').addClass('open');
            mapDiv.css('left', '0px');
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);
            menuBox.removeClass('active');
            settingBox.removeClass('active');
            menuClickBox.removeClass('active');
            settingClickBox.removeClass('active');
            markerBoxBack.removeClass('on');
            legendBox.removeClass('active');
            legendIcon.removeClass('active');
        }
        else {
            $('.navbar-left').addClass('open');
            mapDiv.css('left', '0px');
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);
            menuBox.removeClass('active');
            settingBox.removeClass('active');
            menuClickBox.removeClass('active');
            settingClickBox.removeClass('active');
            markerBoxBack.removeClass('on');
            legendBox.removeClass('active');
            legendIcon.removeClass('active');
        }
    }
});

// 将函数暴露到全局命名空间
window.IVSOSD.hanciclick = hanciclick;
window.IVSOSD.poumianclick = poumianclick;
window.IVSOSD.dixingclick = dixingclick;
window.IVSOSD.yangliuclick = yangliuclick;

// 标记导航模块已加载
window.IVSOSD.navigationModuleLoaded = true;

