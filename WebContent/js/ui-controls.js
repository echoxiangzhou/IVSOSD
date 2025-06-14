/**
 * @filename: ui-controls.js
 * @description: UI控制和标签页切换模块
 * @version: 1.0
 * @date: 2025-01-01
 * @author: 系统重构
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

"use strict";

// 确保依赖的init模块已加载
if (!window.IVSOSD || !window.IVSOSD.initModuleLoaded) {
    throw new Error('ui-controls.js depends on init.js module');
}

//===========================================
// 地形渲染标签页事件处理
//===========================================

// 地形渲染标签页单击事件
terrain1.click(function () {
    if (terrain1.hasClass('active')) {
        return;
    }
    terrain2.removeClass('active');
    terrainpage2.removeClass('in');
    terrain3.removeClass('active');
    terrainpage3.removeClass('in');

    terrain1.addClass('active');
    terrainpage1.addClass('in');
    $('#terrain-info1-tab').css('background-image', "url(images/tabbg2101.png)");
    $('#terrain-info2-tab').css('background-image', "url(images/tabbg2200.png)");
});

// 地形剖面标签页单击事件
terrain2.click(function () {
    if (terrain2.hasClass('active')) {
        return;
    }
    terrain1.removeClass('active');
    terrainpage1.removeClass('in');
    terrain3.removeClass('active');
    terrainpage3.removeClass('in');

    terrain2.addClass('active');
    terrainpage2.addClass('in');
    $('#terrain-info1-tab').css('background-image', "url(images/tabbg2100.png)");
    $('#terrain-info2-tab').css('background-image', "url(images/tabbg2201.png)");

    viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
    viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
});

terrain3.click(function () {
    if (terrain3.hasClass('active')) {
        return;
    }
    terrain1.removeClass('active');
    terrainpage1.removeClass('in');
    terrain2.removeClass('active');
    terrainpage2.removeClass('in');

    terrain3.addClass('active');
    terrainpage3.addClass('in');
});

//===========================================
// 洋流风场标签页事件处理
//===========================================

// 洋流标签页单击事件
currentpage1.click(function () {
    if (currentpage1.hasClass('active')) {
        return;
    }
    currentpage2.removeClass('active');
    currentcontent2.removeClass('in');
    currentpage1.addClass('active');
    currentcontent1.addClass('in');
    $('#current-info-tab1').css('background-image', "url(images/tabbg2101.png)");
    $('#current-info-tab2').css('background-image', "url(images/tabbg2200.png)");
});

// 风场标签页单击事件
currentpage2.click(function () {
    if (currentpage2.hasClass('active')) {
        return;
    }
    currentpage1.removeClass('active');
    currentcontent1.removeClass('in');
    currentpage2.addClass('active');
    currentcontent2.addClass('in');
    $('#current-info-tab1').css('background-image', "url(images/tabbg2100.png)");
    $('#current-info-tab2').css('background-image', "url(images/tabbg2201.png)");
});

//===========================================
// 航次站点标签页事件处理
//===========================================

// 航线列表单击事件
voyagepage1.click(function () {
    selectVoyTab1();
});

// 航次信息标签页单击事件
voyagepage2.click(function () {
    if (selectedVoy == 0) {
        alert("未选择航次");
        selectVoyTab1();
    }
    else {
        selectVoyTab2();
    }
});

// 站点信息标签页单击事件
voyagepage3.click(function () {
    if (selectedSta == 0) {
        if (selectedVoy == 0) {
            alert("未选择航次");
            selectVoyTab1();
        }
        else {
            alert("未选择站点");
            selectVoyTab2();
        }
    }
    else {
        selectVoyTab3();
    }
});

hangxian4.click(function () {
    if (hangxian4.hasClass('active')) {
        return;
    }
    voyagepage2.removeClass('active');
    voyageinfo2.removeClass('in');
    voyagepage1.removeClass('active');
    voyageinfo1.removeClass('in');
    voyagepage3.removeClass('active');
    voyageinfo3.removeClass('in');
    hangxian4.addClass('active');
    hangxianpage4.addClass('in');
});

//===========================================
// 航次站点标签页UI控制函数
//===========================================

/**
 * 航次站点标签页UI控制 - 选择航次列表
 */
function selectVoyTab1() {
    if (voyagepage1.hasClass('active')) {
        return;
    }
    voyagepage3.removeClass('active');
    voyageinfo3.removeClass('in');
    voyagepage2.removeClass('active');
    voyageinfo2.removeClass('in');
    voyagepage1.addClass('active');
    voyageinfo1.addClass('in');
    $('#voyage-info-tab1').css('background-image', "url(images/tabbg3101.png)");
    $('#voyage-info-tab2').css('background-image', "url(images/tabbg3200.png)");
    $('#voyage-info-tab3').css('background-image', "url(images/tabbg3300.png)");
}

/**
 * 航次站点标签页UI控制 - 选择航次信息
 */
function selectVoyTab2() {
    if (voyagepage2.hasClass('active')) {
        return;
    }
    voyagepage3.removeClass('active');
    voyageinfo3.removeClass('in');
    voyagepage1.removeClass('active');
    voyageinfo1.removeClass('in');
    voyagepage2.addClass('active');
    voyageinfo2.addClass('in');

    $('#voyage-info-tab1').css('background-image', "url(images/tabbg3100.png)");
    $('#voyage-info-tab2').css('background-image', "url(images/tabbg3201.png)");
    $('#voyage-info-tab3').css('background-image', "url(images/tabbg3300.png)");
}

/**
 * 航次站点标签页UI控制 - 选择站点信息
 */
function selectVoyTab3() {
    if (voyagepage3.hasClass('active')) {
        return;
    }
    voyagepage2.removeClass('active');
    voyageinfo2.removeClass('in');
    voyagepage1.removeClass('active');
    voyageinfo1.removeClass('in');
    voyagepage3.addClass('active');
    voyageinfo3.addClass('in');

    $('#voyage-info-tab1').css('background-image', "url(images/tabbg3100.png)");
    $('#voyage-info-tab2').css('background-image', "url(images/tabbg3200.png)");
    $('#voyage-info-tab3').css('background-image', "url(images/tabbg3301.png)");
}

//===========================================
// 剖面展示标签页事件处理
//===========================================

/**
 * 大面清除
 */
function DaMianCancle() {
    viewer.dataSources.removeAll();
    var damianLegend = document.getElementById('damianLegend');
    damianLegend.style.display = "none";
}

// 大面展示标签页事件
poumian1.click(function () {
    DaMianCancle();
    ClearDynaMaps();
    viewer.entities.removeAll();
    if (poumian1.hasClass('active')) {
        return;
    }
    poumian2.removeClass('active');
    poumianpage2.removeClass('in');
    poumian3.removeClass('active');
    poumianpage3.removeClass('in');
    poumian1.addClass('active');
    poumianpage1.addClass('in');

    $('#profile-info1-tab').css('background-image', "url(images/tabbg3101.png)");
    $('#profile-info2-tab').css('background-image', "url(images/tabbg3200.png)");
    $('#profile-info3-tab').css('background-image', "url(images/tabbg3300.png)");

    globe.depthTestAgainstTerrain = true;
    var TerrainPoint = document.getElementById("TerrainPoint").value;
    if (viewer.terrainProvider._url != 'Data/terrain/terrain03') {
        var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
            url: 'Data/terrain/terrain03',
            maximumLevel: 0,
            requestVertexNormals: true
        });
        viewer.terrainProvider = cesiumTerrainProviderMeshes;
    }
});

poumian2.click(function () {
    DaMianCancle();
    viewer.entities.removeAll();
    ClearDynaMaps();

    $('#sliderProfLoca').slider({
        min: 120,
        max: 130,
        value: 127,
        natural_arrow_keys: true,
        tooltip: 'always',
        formatter: function (value) {
            return '' + value;
        }
    });

    if (poumian2.hasClass('active')) {
        return;
    }
    poumian1.removeClass('active');
    poumianpage1.removeClass('in');
    poumian3.removeClass('active');
    poumianpage3.removeClass('in');
    poumian2.addClass('active');
    poumianpage2.addClass('in');
    $('#profile-info1-tab').css('background-image', "url(images/tabbg3100.png)");
    $('#profile-info2-tab').css('background-image', "url(images/tabbg3201.png)");
    $('#profile-info3-tab').css('background-image', "url(images/tabbg3300.png)");
    globe.depthTestAgainstTerrain = true;
    var TerrainPoint = document.getElementById("TerrainPoint").value;
    if (viewer.terrainProvider._url != 'Data/terrain/terrain03') {
        var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
            url: 'Data/terrain/terrain03',
            requestVertexNormals: true
        });
        viewer.terrainProvider = cesiumTerrainProviderMeshes;
    }
});

// 时间序列标签页事件
poumian3.click(function () {
    DaMianCancle();
    viewer.entities.removeAll();
    if (poumian3.hasClass('active')) {
        return;
    }
    poumian1.removeClass('active');
    poumianpage1.removeClass('in');
    poumian2.removeClass('active');
    poumianpage2.removeClass('in');
    poumian3.addClass('active');
    poumianpage3.addClass('in');
    $('#profile-info1-tab').css('background-image', "url(images/tabbg3100.png)");
    $('#profile-info2-tab').css('background-image', "url(images/tabbg3200.png)");
    $('#profile-info3-tab').css('background-image', "url(images/tabbg3301.png)");
    globe.depthTestAgainstTerrain = true;
    var TerrainPoint = document.getElementById("TerrainPoint").value;
    if (viewer.terrainProvider._url != 'Data/terrain/terrain03') {
        var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
            url: 'Data/terrain/terrain03',
            maximumLevel: 0,
            requestVertexNormals: true
        });
        viewer.terrainProvider = cesiumTerrainProviderMeshes;
    }
});

// 将这些函数暴露到全局命名空间
window.IVSOSD.selectVoyTab1 = selectVoyTab1;
window.IVSOSD.selectVoyTab2 = selectVoyTab2;
window.IVSOSD.selectVoyTab3 = selectVoyTab3;
window.IVSOSD.DaMianCancle = DaMianCancle;

// 标记UI控制模块已加载
window.IVSOSD.uiControlsModuleLoaded = true;

console.log('✅ ui-controls.js 模块已加载');
