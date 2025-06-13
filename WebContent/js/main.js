"use strict";

/**
 * @filename: main.js
 * @description: 航次站点模块和面板控制
 * @version:
 * @date: 2016-10-09
 * @author:
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

// Check if jQuery is available
if (typeof $ === 'undefined') {
    console.error('main.js: jQuery is not loaded yet!');
    // Try to reload after a delay
    setTimeout(function() {
        if (typeof $ !== 'undefined') {
            location.reload();
        }
    }, 1000);
    throw new Error('jQuery not loaded');
}

//右侧面板
var sideBarRight = $('#sidebar-right');
// 左侧面板
var sideBarLeft = $('#sidebar-left');
//地图
var mapDiv = $('#vmap');
//航次站点
var sTab1 = $('#sidebar-tab1');
//剖面展示
var sTab2 = $('#sidebar-tab2');
//地形渲染
var sTab3 = $('#sidebar-tab3');
//洋流风场模拟
var sTab4 = $('#sidebar-tab4');
var openerInfo = $('#side_info');
//站点信息
var voyagepage3 = $('#voyagepage3');
//航次信息
var voyagepage2 = $('#voyagepage2');
//航次列表
var voyagepage1 = $('#voyagepage1');
var hangxian4 = $('#page4');
//大面信息
var poumian1 = $('#page5');
//三维剖面
var poumian2 = $('#page6');
//时间序列
var poumian3 = $('#page7');
//地形渲染1
var terrain1 = $('#page8');
//地形剖面
var terrain2 = $('#page9');
var terrain3 = $('#page10');
//地形渲染页面1
var terrainpage1 = $('#terrain-info1');
//地形渲染页面2
var terrainpage2 = $('#terrain-info2');
var terrainpage3 = $('#terrain-info3');
//洋流1
var currentpage1 = $('#pagecurrent1');
//洋流2
var currentpage2 = $('#pagecurrent2');
var currentcontent1 = $('#current-info1');
var currentcontent2 = $('#current-info2');
//航次列表内容页
var voyageinfo1 = $('#voyage-info1');
//航次信息内容页
var voyageinfo2 = $('#voyage-info2');
//站点信息内容页
var voyageinfo3 = $('#voyage-info3');
var hangxianpage4 = $('#station-info3');
//地形渲染内容页
var poumianpage1 = $('#profile-info1');
//地形剖面内容页
var poumianpage2 = $('#profile-info2');
var poumianpage3 = $('#profile-info3');
//航次站点内容页
var content1 = $('#sidebar-content1');
//剖面信息内容页
var content2 = $('#sidebar-content2');
//地形渲染内容页
var content3 = $('#sidebar-content3');
//洋流模块内容
var content4 = $('#sidebar-content4');
var menuBox = $('.menu-outbox');
var settingBox = $('.setting-outbox');
var menuClickBox = $('.menu-clickbox');
var settingClickBox = $('.setting-clickbox');
//二维按钮
var map2dtoggle = $('.map2d');
//三维按钮
var map3dtoggle = $('.map3d');
var markerBoxBack = $('.markerbox-back');
var legendBox = $('.legend');
var legendIcon = $('.legend-icon');

var selectedVoy = 0;
var selectedSta = 0;
var selectedPage = 3;
var modular = 1;//dangqianmokuaibiaoshi

//地形渲染标签页单击事件
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

//地形剖面标签页单击事件
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
//洋流标签页单击事件
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

//风场标签页单击事件
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

//航线列表单击事件
voyagepage1.click(function () {
    selectVoyTab1();
});

//航次信息标签页单击事件
voyagepage2.click(function () {
    if (selectedVoy == 0) {
        alert("未选择航次");
        selectVoyTab1();
    }
    else {
        selectVoyTab2();
    }

});

//站点信息标签页单击事件
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

//航次站点标签页UI控制
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

//航次站点标签页UI控制
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

//航次站点标签页UI控制
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

//大面展示标签页事件
poumian1.click(function () {

    DaMianCancle();
    ClearDynaMaps();
    //scene.primitives.removeAll();
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

//大面清除
function DaMianCancle() {
    viewer.dataSources.removeAll();
    var damianLegend = document.getElementById('damianLegend');
    //if (damianLegend.style.display == "block") {
    damianLegend.style.display = "none";
    //}
}
poumian2.click(function () {

    DaMianCancle();
    //scene.primitives.removeAll();
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

//时间序列标签页事件
poumian3.click(function () {

    DaMianCancle();
    //scene.primitives.removeAll();
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

function arr_count(o) {
    var t = typeof o;

    if (t == 'string') {
        return o.length;
    } else if (t == 'object') {
        var n = 0;
        for (var i in o) {
            n++;
        }
        return n;
    }
    return false;
}


/**
 *
 *  添加全部航次 - 原始版本（将被安全版本替代）
 */
function OriginalAddAllRoute() {
    //var strSQLVoyAll = "select * from VOYAGE t order by V_START";
    var strSQLVoyAll = "select * from VOYAGE t order by ID";
    
    // Add DWR readiness check
    if (typeof DatabaseOperationJS === 'undefined') {
        console.error('DatabaseOperationJS is not available, retrying in 1 second...');
        setTimeout(OriginalAddAllRoute, 1000);
        return;
    }
    
    
    // 使用新的安全查询方法（基于test_db.html成功案例）
    try {
        
        // 优先使用新的安全方法
        if (typeof DatabaseOperationJS.queryVoyageListSafe === 'function') {
            DatabaseOperationJS.queryVoyageListSafe({
                callback: function(result) {
                    
                    // 将字符串结果解析为航次数据
                    if (typeof result === 'string') {
                        
                        // 解析字符串结果，提取航次信息
                        var voyageData = parseSafeQueryResult(result);
                        callBackVoyageList(voyageData);
                    } else {
                        callBackVoyageList([]);
                    }
                },
                errorHandler: function(error) {
                    console.error('❌ 安全航次查询失败:', error);
                    tryOriginalQuery();
                }
            });
        } else {
            tryOriginalQuery();
        }
        
        function tryOriginalQuery() {
            DatabaseOperationJS.QueryVoyageList(strSQLVoyAll, 
                function(data) {
                    callBackVoyageList(data);
                },
                function(error) {
                    console.error('❌ 原始航次数据查询失败:', error);
                    // Try with empty SQL to use default query
                    DatabaseOperationJS.QueryVoyageList('', 
                        function(data) {
                            callBackVoyageList(data);
                        },
                        function(error2) {
                            console.error('❌ 默认查询也失败:', error2);
                            callBackVoyageList([]); // Call with empty array
                        }
                    );
                }
            );
        }
        
    } catch (e) {
        console.error('Exception calling voyage query methods:', e);
        callBackVoyageList([]); // Call with empty array
    }

    // 注释掉自动触发的tab点击，避免清除影像图层
    // sTab1.trigger('click');
    // voyagepage1.trigger('click');
    
    // 手动设置样式而不触发清理事件
    if (!sTab1.hasClass('active')) {
        sTab1.addClass('active');
        content1.addClass('in');
    }
    if (!voyagepage1.hasClass('active')) {
        voyagepage1.addClass('active');
    }
    mapDiv.css('left', '0px');
    var mapWidth = document.body.clientWidth;
    mapDiv.css('width', mapWidth);
    //navBarLeft.addClass('open');
    $('.sidebar-left').addClass('active');
    sideBarRight.addClass('active');
    var sideBarRightHeight = document.body.clientHeight;
    //sideBarRight.css('height',sideBarRightHeight-36);
    var tabContent2Height = document.body.clientHeight;
    $('.infoTabs-content').css('height', tabContent2Height - 36);
    $('.setting-outbox').addClass('active');
    $('.map2d').addClass('active');
    $('.map3d').addClass('active');
    $('.coorInfo').addClass('active');

    //ShowRoutes();
}


/**
 *
 *  航次查询
 */
function QueryRouteClick() {
    //var strSQLVoyAll = "select * from VOYAGE t";
    //DatabaseOperationJS.QueryVoyageList(strSQLVoyAll, callBackVoyageList);

    // 显示右侧面板
    const rightPanel = document.getElementById('sidebar-right');
    if (rightPanel && !rightPanel.classList.contains('active')) {
        rightPanel.classList.add('active');
    }

    clearTable("tbodyVoyageList");
    viewer.dataSources.removeAll();
    viewer.entities.removeAll();

    var tree = $("#tree").fancytree("getTree");
    var selNodes = tree.getSelectedNodes();

    var strSQLMetaListSub1 = "select * from METADATA where ";
    var strSQLMetaListSub2 = "ELEMENT like '%" + selNodes[0].title + "%'";

    var strSQLMetaListSub3 = "";
    arrSelL3.length = 0;
    if (selNodes.length > 1) {
        selNodes.forEach(function (node) {
            if (node.key.replace(/[^.]/g, "").length == 2) {
                arrSelL3.push(node.title);
                strSQLMetaListSub3 = strSQLMetaListSub3 + " OR ELEMENT like '%" + node.title + "%'";
            }

        });
    }
    var strSQLSelVoyList = strSQLMetaListSub1 + "(" + strSQLMetaListSub2 + strSQLMetaListSub3 + ")";
    DatabaseOperationJS.QueryMetadataList(strSQLSelVoyList, callBackMetadataList);

    // 注释掉自动触发的tab点击，避免清除影像图层
    // sTab1.trigger('click');
    // voyagepage1.trigger('click');
    
    // 手动设置样式而不触发清理事件
    if (!sTab1.hasClass('active')) {
        sTab1.addClass('active');
        content1.addClass('in');
    }
    if (!voyagepage1.hasClass('active')) {
        voyagepage1.addClass('active');
    }
    //mapDiv.css('left', '320px');
    mapDiv.css('left', '0px');
    //var mapWidth = document.body.clientWidth - 320 - 450;
    //var mapWidth = document.body.clientWidth - 320;
    var mapWidth = document.body.clientWidth;
    mapDiv.css('width', mapWidth);
    //navBarLeft.addClass('open');
    $('.sidebar-left').addClass('active');
    sideBarRight.addClass('active');
    var sideBarRightHeight = document.body.clientHeight;
    //sideBarRight.css('height',sideBarRightHeight-36);
    var tabContent2Height = document.body.clientHeight;
    $('.infoTabs-content').css('height', tabContent2Height - 36);
    $('.setting-outbox').addClass('active');
    $('.map2d').addClass('active');
    $('.map3d').addClass('active');
    $('.coorInfo').addClass('active');

    //ShowRoutes();
}


$('#SearchRoute1').click(function () {
    //RouteClick();
    QueryRouteClick();

});


/**
 *
 *  航次列表
 */
var ctdURL;
var voyageTrajPathList = new Array();
var selNewVoyID;
var selOldVoyID;
var selOldVoyTrajPath;
var voyRows = [];
var voyageList2 = [];
var voyRowNumber = 15;
var curPageNumber = 1;
// 解析安全查询返回的字符串结果
function parseSafeQueryResult(resultString) {
    
    var voyageList = [];
    
    if (!resultString || typeof resultString !== 'string') {
        console.warn('⚠️ 安全查询结果为空或非字符串');
        return voyageList;
    }
    
    try {
        // 解析字符串，提取航次信息
        var lines = resultString.split('\n');
        
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            
            // 查找航次数据行 (格式: 航次1: ID=..., NAME=..., SEA_AREA=..., V_START=...)
            if (line.startsWith('航次') && line.includes('ID=')) {
                try {
                    var voyageInfo = {};
                    
                    // 提取ID
                    var idMatch = line.match(/ID=([^,]+)/);
                    if (idMatch) voyageInfo.id = idMatch[1].trim();
                    
                    // 提取NAME
                    var nameMatch = line.match(/NAME=([^,]+)/);
                    if (nameMatch) {
                        var name = nameMatch[1].trim();
                        voyageInfo.name = name !== 'null' ? name : '';
                    }
                    
                    // 提取SEA_AREA
                    var areaMatch = line.match(/SEA_AREA=([^,]+)/);
                    if (areaMatch) {
                        var area = areaMatch[1].trim();
                        voyageInfo.seaArea = area !== 'null' ? area : '';
                    }
                    
                    // 提取V_START
                    var startMatch = line.match(/V_START=([^,\n]+)/);
                    if (startMatch) {
                        var start = startMatch[1].trim();
                        voyageInfo.vStart = start !== 'null' ? start : '';
                    }
                    
                    // 设置默认值以匹配VoyageInfo结构
                    voyageInfo.trajPath = '';
                    voyageInfo.element = '';
                    voyageInfo.vEnd = '';
                    voyageInfo.scientist = '';
                    voyageInfo.project = '';
                    
                    if (voyageInfo.id) {
                        voyageList.push(voyageInfo);
                    }
                } catch (parseError) {
                    console.warn('⚠️ 解析航次行失败:', line, parseError);
                }
            }
        }
        
        
    } catch (error) {
        console.error('❌ 解析安全查询结果失败:', error);
    }
    
    return voyageList;
}

var callBackVoyageList = function (voyageList) {
    
    // Add null check and error handling for voyageList
    if (!voyageList || !Array.isArray(voyageList)) {
        console.error('❌ callBackVoyageList: voyageList is null or not an array', voyageList);
        
        // Show user-friendly message
        var tbody = document.getElementById('tbodyVoyageList');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #666;">暂无航次数据或数据库连接失败</td></tr>';
        }
        
        // 确保右侧面板显示
        showVoyagePanel();
        
        voyageList = []; // Initialize as empty array
        return;
    }
    
    voyageList2 = voyageList;
    var rowSumNumber = voyageList.length;
    
    // 确保右侧面板显示
    showVoyagePanel();
    
    // Check if jQuery is available before using it
    if (typeof $ === 'undefined') {
        console.error('jQuery is not available in callBackVoyageList');
        return;
    }
    
    voyageTrajPathList.splice(0, voyageTrajPathList.length);
    clearTable("tbodyVoyageList");
    var sumPageNumber = Math.ceil(voyageList2.length / voyRowNumber);

    if (sumPageNumber == 1) {
        $('#voyNext').css('background-image', "url(images/NextB02.png)");
        $('#voyPre').css('background-image', "url(images/PreB02.png)");
    }
    else if (sumPageNumber == 2) {
        if (curPageNumber == 1) {
            $('#voyNext').css('background-image', "url(images/NextA02.png)");
            $('#voyPre').css('background-image', "url(images/PreB02.png)");
        }
        else {
            $('#voyNext').css('background-image', "url(images/NextB02.png)");
            $('#voyPre').css('background-image', "url(images/PreA02.png)");
        }

    }
    else {
        if (curPageNumber == sumPageNumber) {
            $('#voyNext').css('background-image', "url(images/NextB02.png)");
            $('#voyPre').css('background-image', "url(images/PreA02.png)");
        }
        else {
            $('#voyNext').css('background-image', "url(images/NextA02.png)");
            $('#voyPre').css('background-image', "url(images/PreA02.png)");
        }
        if (curPageNumber == 1) {
            $('#voyNext').css('background-image', "url(images/NextA02.png)");
            $('#voyPre').css('background-image', "url(images/PreB02.png)");
        }

    }

    document.getElementById("tblVoyageList").rows[0].cells[0].style.width = 48 + "px";
    document.getElementById("tblVoyageList").rows[0].cells[2].style.width = 80 + "px";
    document.getElementById("tblVoyageList").rows[0].cells[3].style.width = 100 + "px";

    var startIndex = (curPageNumber - 1) * voyRowNumber;
    var endIndex = ( 1 + curPageNumber - 1) * voyRowNumber;
    if (curPageNumber == sumPageNumber) {
        endIndex = (curPageNumber - 1) * voyRowNumber + voyageList2.length - (sumPageNumber - 1) * voyRowNumber;
    }
    for (var voyIndex = 0; voyIndex < voyageList2.length; voyIndex++) {
        // 通用字段值获取函数
        const getFieldValue = (obj, ...fieldNames) => {
            for (const fieldName of fieldNames) {
                if (obj[fieldName] !== undefined && obj[fieldName] !== null) {
                    return obj[fieldName];
                }
            }
            return null;
        };
        
        var trajPath = getFieldValue(voyageList2[voyIndex], 'trajPath', 'TRAJ_PATH', 'traj_path', 'TrajPath') || '';
        var voyId = getFieldValue(voyageList2[voyIndex], 'ID', 'id', 'Id') || '';
        
        if (trajPath && voyId) {
            AddRouteCZML2(trajPath, voyId);
        }
    }

    for (var i = startIndex; i < endIndex; i++) {
        //for (var i = 0; i < voyageList.length; i++) {
        
        // Add null checks for voyageList[i] and its properties
        if (!voyageList[i]) {
            console.warn('voyageList[' + i + '] is null or undefined, skipping');
            continue;
        }
        
        
        // 通用字段值获取函数
        const getFieldValue = (obj, ...fieldNames) => {
            for (const fieldName of fieldNames) {
                if (obj[fieldName] !== undefined && obj[fieldName] !== null) {
                    return obj[fieldName];
                }
            }
            return null;
        };
        
        // 获取航次名称 - 添加更多可能的字段名
        var voyageName = getFieldValue(voyageList[i], 'name', 'NAME', 'Name', 'VOYAGE_NAME', 'voyage_name', 'voyageName', 'V_NAME', 'v_name') || '未知航次';
        var nameSubstr = voyageName;
        if (voyageName && voyageName.length > 14) {
            nameSubstr = voyageName.substring(0, 14) + "…";
        }
        
        // 获取海域 - 添加更多可能的字段名
        var seaAreaName = getFieldValue(voyageList[i], 'seaArea', 'SEA_AREA', 'sea_area', 'SeaArea', 'AREA', 'area', 'REGION', 'region', 'HAIYU', 'haiyu') || '未知区域';
        var seaAreaSubstr = seaAreaName;
        if (seaAreaName && seaAreaName.length > 3) {
            seaAreaSubstr = seaAreaName.substring(0, 3) + "…";
        }
        
        // 获取开始时间 - 添加更多可能的字段名
        var vStartValue = getFieldValue(voyageList[i], 'VStart', 'vStart', 'V_START', 'v_start', 'START_DATE', 'start_date', 'startDate', 'START_TIME', 'start_time') || '';
        var startDateStr = '';
        if (vStartValue) {
            startDateStr = typeof vStartValue === 'string' ? vStartValue.substring(0, 10) : vStartValue;
        }
        
        // 获取航次ID
        var voyageId = getFieldValue(voyageList[i], 'ID', 'id', 'Id') || 0;
        
        // 获取轨迹路径
        var trajPath = getFieldValue(voyageList[i], 'trajPath', 'TRAJ_PATH', 'traj_path', 'TrajPath') || '';

            编号: voyageId,
            名称: voyageName,
            海域: seaAreaName,
            开始时间: startDateStr,
            轨迹路径: trajPath
        });

        voyRows = [];
        voyRows.push({
            rowid: (i + 1).toString(),
            voyid: voyageId,
            name: nameSubstr,
            seaArea: seaAreaSubstr,
            VStart: startDateStr
        });

        var row = document.createElement("tr");
        var cell = document.createElement("td");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        var cell3 = document.createElement("td");
        cell.appendChild(document.createTextNode((i + 1).toString()));
        cell1.appendChild(document.createTextNode(nameSubstr));
        cell2.appendChild(document.createTextNode(seaAreaSubstr));
        cell3.appendChild(document.createTextNode(startDateStr));
        cell1.setAttribute("data-toggle", "tooltip");
        cell1.setAttribute("title", voyageName);

        cell2.setAttribute("data-toggle", "tooltip");
        cell2.setAttribute("title", seaAreaName);
        row.appendChild(cell);
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);

        voyageTrajPathList.push(trajPath);
        //var voyageTrajectory = Cesium.CzmlDataSource.load(voyageList[i].trajPath);
        //viewer.dataSources.add(voyageTrajectory);

        //AddRouteCZML2(voyageList[i].trajPath, voyageList2[i].ID);

        row.onclick = function () {
            clearTable("tbodyStationList");
            //    $('#voyagepage2').click();
            var terminaltablecontent2 = $('#voyagepage1');
            var terminaltablecontent3 = $('#voyage-info1');
            var terminaltablecontent = $('#voyagepage2');
            var terminaltablecontent1 = $('#voyage-info2');
            terminaltablecontent2.removeClass('active');
            terminaltablecontent3.removeClass('in');
            terminaltablecontent.addClass('active');
            terminaltablecontent1.addClass('in');

            $('#voyage-info-tab1').css('background-image', "url(images/tabbg3100.png)");
            $('#voyage-info-tab2').css('background-image', "url(images/tabbg3201.png)");
            $('#voyage-info-tab3').css('background-image', "url(images/tabbg3300.png)");

            selectedVoy = 1;
            selectedSta = 0;

            var selRowIndex = this.rowIndex;
            var selVoyID = voyageList2[startIndex + selRowIndex - 1].ID;
            var selVoyName = voyageList2[startIndex + selRowIndex - 1].name;
            selOldVoyID = selNewVoyID;
            selNewVoyID = selVoyID;
            selOldVoyTrajPath = voyageList2[startIndex + selRowIndex - 1].trajPath;

            var strSQLVoyInfo = "select * from VOYAGE where ID=?";
            DatabaseOperationJS.QueryVoyageInfo(strSQLVoyInfo, selVoyID, callBackVoyageInfo);

            var strSQLStaList = "select * from STATION where VOYAGE_ID=? order by ID";
            DatabaseOperationJS.QueryStationList(strSQLStaList, selVoyID, callBackStationList);

        };
        var obody = document.getElementById("tbodyVoyageList");
        obody.appendChild(row);
    }
};


/**
 *
 *  航次列表下一页
 */
function voyPageNext() {
    var sumPageNumber = Math.ceil(voyageList2.length / voyRowNumber);
    if (curPageNumber < sumPageNumber) {
        curPageNumber++;
    }

    if (sumPageNumber == 1) {
        $('#voyNext').css('background-image', "url(images/NextB02.png)");
        $('#voyPre').css('background-image', "url(images/PreB02.png)");
    }
    else if (sumPageNumber == 2) {
        if (curPageNumber == 1) {
            $('#voyNext').css('background-image', "url(images/NextA02.png)");
            $('#voyPre').css('background-image', "url(images/PreB02.png)");
        }
        else {
            $('#voyNext').css('background-image', "url(images/NextB02.png)");
            $('#voyPre').css('background-image', "url(images/PreA02.png)");
        }

    }
    else {
        if (curPageNumber == sumPageNumber) {
            $('#voyNext').css('background-image', "url(images/NextB02.png)");
            $('#voyPre').css('background-image', "url(images/PreA02.png)");
        }
        else {
            $('#voyNext').css('background-image', "url(images/NextA02.png)");
            $('#voyPre').css('background-image', "url(images/PreA02.png)");
        }
        if (curPageNumber == 1) {
            $('#voyNext').css('background-image', "url(images/NextA02.png)");
            $('#voyPre').css('background-image', "url(images/PreB02.png)");
        }

    }
    var startIndex = (curPageNumber - 1) * voyRowNumber;
    var endIndex = ( 1 + curPageNumber - 1) * voyRowNumber;

    if (curPageNumber == sumPageNumber) {
        endIndex = (curPageNumber - 1) * voyRowNumber + voyageList2.length - (sumPageNumber - 1) * voyRowNumber;
    }

    for (var voyIndex = 0; voyIndex < voyageList2.length; voyIndex++) {
        AddRouteCZML2(voyageList2[voyIndex].trajPath, voyageList2[voyIndex].ID);
    }

    clearTable("tbodyVoyageList");
    for (var i = startIndex; i < endIndex; i++) {
        //for (var i = 0; i < voyageList.length; i++) {
        var nameSubstr = voyageList2[i].name;
        var seaAreaSubstr = voyageList2[i].seaArea;
        if (voyageList2[i].name.length > 14) {
            nameSubstr = voyageList2[i].name.substring(0, 14) + "…";
        }
        if (voyageList2[i].seaArea != null && voyageList2[i].seaArea.length > 3) {
            seaAreaSubstr = voyageList2[i].seaArea.substring(0, 3) + "…";
        }

        voyRows = [];
        voyRows.push({
            voyid: voyageList2[i].ID,
            rowid: (i + 1).toString(),
            name: nameSubstr,
            seaArea: seaAreaSubstr,
            VStart: voyageList2[i].VStart.substring(0, 10)
        });


        var row = document.createElement("tr");
        var cell = document.createElement("td");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        var cell3 = document.createElement("td");
        cell.appendChild(document.createTextNode((i + 1).toString()));
        cell1.appendChild(document.createTextNode(nameSubstr));
        cell2.appendChild(document.createTextNode(seaAreaSubstr));
        cell3.appendChild(document.createTextNode(voyageList2[i].VStart.substring(0, 10)));

        cell1.setAttribute("data-toggle", "tooltip");
        cell1.setAttribute("title", voyageList2[i].name);

        cell2.setAttribute("data-toggle", "tooltip");
        cell2.setAttribute("title", voyageList2[i].seaArea);
        //title="<h2>I'am Header2 </h2>"
        row.appendChild(cell);
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);

        voyageTrajPathList.push(voyageList2[i].trajPath);
        row.onclick = function () {
            clearTable("tbodyStationList");
            //    $('#voyagepage2').click();
            var terminaltablecontent2 = $('#voyagepage1');
            var terminaltablecontent3 = $('#voyage-info1');
            var terminaltablecontent = $('#voyagepage2');
            var terminaltablecontent1 = $('#voyage-info2');
            terminaltablecontent2.removeClass('active');
            terminaltablecontent3.removeClass('in');
            terminaltablecontent.addClass('active');
            terminaltablecontent1.addClass('in');
            $('#voyage-info-tab1').css('background-image', "url(images/tabbg3100.png)");
            $('#voyage-info-tab2').css('background-image', "url(images/tabbg3201.png)");
            $('#voyage-info-tab3').css('background-image', "url(images/tabbg3300.png)");

            var selRowIndex = this.rowIndex;
            var selVoyID = voyageList2[startIndex + selRowIndex - 1].ID;
            var selVoyName = voyageList2[startIndex + selRowIndex - 1].name;
            selOldVoyID = selNewVoyID;
            selNewVoyID = selVoyID;
            selOldVoyTrajPath = voyageList2[startIndex + selRowIndex - 1].trajPath;

            var strSQLVoyInfo = "select * from VOYAGE where ID=?";
            DatabaseOperationJS.QueryVoyageInfo(strSQLVoyInfo, selVoyID, callBackVoyageInfo);

            var strSQLStaList = "select * from STATION where VOYAGE_ID=?  order by ID";
            DatabaseOperationJS.QueryStationList(strSQLStaList, selVoyID, callBackStationList);


        };
        var obody = document.getElementById("tbodyVoyageList");
        obody.appendChild(row);

    }
}


/**
 *
 *  航次列表上一页
 */
function voyPagePrevious() {
    var sumPageNumber = Math.ceil(voyageList2.length / voyRowNumber);
    if (curPageNumber > 1) {
        curPageNumber--;
    }

    if (sumPageNumber == 1) {
        $('#voyNext').css('background-image', "url(images/NextB02.png)");
        $('#voyPre').css('background-image', "url(images/PreB02.png)");
    }
    else if (sumPageNumber == 2) {
        if (curPageNumber == 1) {
            $('#voyNext').css('background-image', "url(images/NextA02.png)");
            $('#voyPre').css('background-image', "url(images/PreB02.png)");
        }
        else {
            $('#voyNext').css('background-image', "url(images/NextB02.png)");
            $('#voyPre').css('background-image', "url(images/PreA02.png)");
        }

    }
    else {
        if (curPageNumber == sumPageNumber) {
            $('#voyNext').css('background-image', "url(images/NextB02.png)");
            $('#voyPre').css('background-image', "url(images/PreA02.png)");
        }
        else {
            $('#voyNext').css('background-image', "url(images/NextA02.png)");
            $('#voyPre').css('background-image', "url(images/PreA02.png)");
        }
        if (curPageNumber == 1) {
            $('#voyNext').css('background-image', "url(images/NextA02.png)");
            $('#voyPre').css('background-image', "url(images/PreB02.png)");
        }
    }

    //var voyRowNumber = 10;
    //var sumPageNumber = Math.ceil(voyageList2.length / voyRowNumber);
    var startIndex = (curPageNumber - 1) * voyRowNumber;
    var endIndex = ( 1 + curPageNumber - 1) * voyRowNumber;

    if (curPageNumber == sumPageNumber) {
        endIndex = (curPageNumber - 1) * voyRowNumber + voyageList2.length - (sumPageNumber - 1) * voyRowNumber;
    }


    for (var voyIndex = 0; voyIndex < voyageList2.length; voyIndex++) {
        AddRouteCZML2(voyageList2[voyIndex].trajPath, voyageList2[voyIndex].ID);
    }

    clearTable("tbodyVoyageList");
    for (var i = startIndex; i < endIndex; i++) {
        //for (var i = 0; i < voyageList.length; i++) {
        var nameSubstr = voyageList2[i].name;
        var seaAreaSubstr = voyageList2[i].seaArea;
        if (voyageList2[i].name.length > 14) {
            nameSubstr = voyageList2[i].name.substring(0, 14) + "…";
        }
        if (voyageList2[i].seaArea != null && voyageList2[i].seaArea.length > 3) {
            seaAreaSubstr = voyageList2[i].seaArea.substring(0, 3) + "…";
        }

        voyRows = [];
        voyRows.push({
            voyid: voyageList2[i].ID,
            rowid: (i + 1).toString(),
            name: nameSubstr,
            seaArea: seaAreaSubstr,
            VStart: voyageList2[i].VStart.substring(0, 10)
        });

        var row = document.createElement("tr");
        var cell = document.createElement("td");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        var cell3 = document.createElement("td");
        cell.appendChild(document.createTextNode((i + 1).toString()));
        cell1.appendChild(document.createTextNode(nameSubstr));
        cell2.appendChild(document.createTextNode(seaAreaSubstr));
        cell3.appendChild(document.createTextNode(voyageList2[i].VStart.substring(0, 10)));

        cell1.setAttribute("data-toggle", "tooltip");
        cell1.setAttribute("title", voyageList2[i].name);

        cell2.setAttribute("data-toggle", "tooltip");
        cell2.setAttribute("title", voyageList2[i].seaArea);

        row.appendChild(cell);
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);

        voyageTrajPathList.push(voyageList2[i].trajPath);
        row.onclick = function () {
            clearTable("tbodyStationList");
            //    $('#voyagepage2').click();
            var terminaltablecontent2 = $('#voyagepage1');
            var terminaltablecontent3 = $('#voyage-info1');
            var terminaltablecontent = $('#voyagepage2');
            var terminaltablecontent1 = $('#voyage-info2');
            terminaltablecontent2.removeClass('active');
            terminaltablecontent3.removeClass('in');
            terminaltablecontent.addClass('active');
            terminaltablecontent1.addClass('in');
            $('#voyage-info-tab1').css('background-image', "url(images/tabbg3100.png)");
            $('#voyage-info-tab2').css('background-image', "url(images/tabbg3201.png)");
            $('#voyage-info-tab3').css('background-image', "url(images/tabbg3300.png)");

            var selRowIndex = this.rowIndex;
            var selVoyID = voyageList2[startIndex + selRowIndex - 1].ID;
            var selVoyName = voyageList2[startIndex + selRowIndex - 1].name;
            selOldVoyID = selNewVoyID;
            selNewVoyID = selVoyID;
            selOldVoyTrajPath = voyageList2[startIndex + selRowIndex - 1].trajPath;

            var strSQLVoyInfo = "select * from VOYAGE where ID=?";
            DatabaseOperationJS.QueryVoyageInfo(strSQLVoyInfo, selVoyID, callBackVoyageInfo);

            var strSQLStaList = "select * from STATION where VOYAGE_ID=? order by ID";
            DatabaseOperationJS.QueryStationList(strSQLStaList, selVoyID, callBackStationList);
        };
        var obody = document.getElementById("tbodyVoyageList");
        obody.appendChild(row);
    }
}


/**
 *
 *  添加轨迹
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
                        var coors = resultcoors.split(',');//
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
        }
    });

    czmlTraj.push(linePath);
    var datasourceczmlTraj = Cesium.CzmlDataSource.load(czmlTraj);
    viewer.dataSources.add(datasourceczmlTraj);

}


/**
 *
 *  航次信息
 */
var callBackVoyageInfo = function (voyageInfo) {
    try {
        
        // 数据验证
        if (!voyageInfo) {
            console.error('❌ voyageInfo is null or undefined');
            return;
        }
        
        // 打印所有可用的属性名，用于调试
        
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
        
            编号: voyageId,
            名称: voyageName,
            开始: startDate,
            结束: endDate,
            科学家: scientist,
            海域: seaArea,
            课题: project
        });
        
    } catch (error) {
        console.error('❌ callBackVoyageInfo error:', error);
        console.error('❌ 错误堆栈:', error.stack);
    }

    var dataSourceLength = viewer.dataSources.length;
    for (var sourceIndex = 0; sourceIndex < dataSourceLength; sourceIndex++) {
        var tempvoytraj = viewer.dataSources.get(sourceIndex);
        if (tempvoytraj.name == selOldVoyID) {
            var seloldvoytraj = viewer.dataSources.get(sourceIndex);
            viewer.dataSources.remove(seloldvoytraj);

            AddRouteCZML2(selOldVoyTrajPath, selOldVoyID);

        }

    }
    SelectVoyageTraj(voyageInfo.trajPath, voyageInfo.ID);
}

/**
 *
 *  选择航次路径
 */
function SelectVoyageTraj(czmlURL, voyID) {

    var czmlSelNew = [{
        "id": "document",
        //"name": "CZML Geometries: Polyline",
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
        //url: 'Data/Temp/WDMaxin.txt',
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
                    var coors = resultcoors.split(',');//
                    //if (coors.length != colNumber) {
                    //   alert(lineData.length);
                    for (var i in coors) {
                        if (coors[i] != "") {
                            if (coors[i].replace(/(^\s+)|(\s+$)/g, "") == "0") {
                                linePath.polyline.positions.cartographicDegrees.push("1010");
                            }
                            else {
                                linePath.polyline.positions.cartographicDegrees.push(coors[i]);
                            }
                            //alert(i.toString);
                        }

                    }

                }

                if (str.indexOf("]") >= 0) {
                    break;
                }
            }

        }
    });


    czmlSelNew.push(linePath);

    var dataSourceNewSelected = Cesium.CzmlDataSource.load(czmlSelNew);
    viewer.dataSources.add(dataSourceNewSelected);

}

/**
 *
 *  站点列表
 */
var staRows = [];
var clickHandlerStationList;
var stationList2 = [];
var staRowNumber = 6;
var selRowStaName;
var staCurPageNumber = 1;

var callBackStationList = function (stationList) {
    //alert(stationList);

    viewer.entities.removeAll();
    stationList2 = stationList;
    clickHandlerStationList = stationList;
    BingdingStationHandler();
    clearTable("tbodyStationList");
    //var staSumPageNumber = Math.ceil(stationList2.length / staRowNumber);
    var staSumPageNumber = Math.ceil(stationList2.length / staRowNumber);
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


    var staStartIndex = (staCurPageNumber - 1) * staRowNumber;
    var staEndIndex = ( 1 + staCurPageNumber - 1) * staRowNumber;

    if (staCurPageNumber == staSumPageNumber) {
        staEndIndex = (staCurPageNumber - 1) * staRowNumber + (stationList2.length - (staSumPageNumber - 1) * staRowNumber);
    }

    for (var staIndex = 0; staIndex < stationList2.length; staIndex++) {
        viewer.entities.add(
            {
                //                 parent: layer,
                name: stationList2[staIndex].name,
                position: Cesium.Cartesian3.fromDegrees(stationList2[staIndex].longitude, stationList2[staIndex].latitude, 3000),
                point: {
                    pixelSize: 8,
                    scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                    color: Cesium.Color.RED
                    //, outlineColor: Cesium.Color.YELLOW // default: BLACK
                }
                ,
                data: stationList2[staIndex]
            });


    }

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

        var row = document.createElement("tr");
        var cell = document.createElement("td");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        var cell3 = document.createElement("td");

        cell.appendChild(document.createTextNode(nameSubstr));
        cell1.appendChild(document.createTextNode(parseFloat(stationList[i].longitude).toFixed(4)));
        cell2.appendChild(document.createTextNode(parseFloat(stationList[i].latitude).toFixed(4)));
        cell3.appendChild(document.createTextNode(parseFloat(stationList[i].deep).toFixed(2)));

        cell.setAttribute("data-toggle", "tooltip");
        cell.setAttribute("title", stationList2[i].name);

        row.appendChild(cell);
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);


        row.onclick = function () {
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

            var selRowIndex = this.rowIndex;
            selRowStaName = staRows[selRowIndex - 1].name;

            var strSQLStaInfo = "select * from STATION where NAME=?";
            DatabaseOperationJS.QueryStationInfo(strSQLStaInfo, selRowStaName, callBackStationInfo);

            viewer.entities.removeAll();
            for (var j = 0; j < stationList.length; j++) {
                viewer.entities.add(
                    {
                        name: "Stations",
                        position: Cesium.Cartesian3.fromDegrees(stationList[j].longitude, stationList[j].latitude, 3000),
                        point: {
                            pixelSize: 8,
                            scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                            color: Cesium.Color.RED
                            //, outlineColor: Cesium.Color.YELLOW // default: BLACK
                        },
                        data: stationList[j]
                    });

            }

            viewer.entities.add(
                {
                    name: "seletedStation",
                    position: Cesium.Cartesian3.fromDegrees(parseFloat(this.cells[1].innerHTML), parseFloat(this.cells[2].innerHTML), 3000),

                    point: {
                        pixelSize: 6,
                        //color: new Cesium.Color(0.5, 0.9, 1.0, 1.0),
                        scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                        show: true, // default
                        color: Cesium.Color.RED, // default: WHITE
                        outlineColor: Cesium.Color.YELLOW, // default: BLACK
                        outlineWidth: 4 // default: 0
                    }
                }
            );
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(parseFloat(this.cells[1].innerHTML), parseFloat(this.cells[2].innerHTML), 2000000.0)
            });
        };
        var obody = document.getElementById("tbodyStationList");
        obody.appendChild(row);
    }

};


/**
 *
 *  站点列表下一页
 */
function staPageNext() {
    var staSumPageNumber = Math.ceil(stationList2.length / staRowNumber);
    if (staCurPageNumber < staSumPageNumber) {
        staCurPageNumber++;
    }
    clearTable("tbodyStationList");

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

    var staStartIndex = (staCurPageNumber - 1) * staRowNumber;
    var staEndIndex = ( 1 + staCurPageNumber - 1) * staRowNumber;

    if (staCurPageNumber == staSumPageNumber) {
        staEndIndex = (staCurPageNumber - 1) * staRowNumber + (stationList2.length - (staSumPageNumber - 1) * staRowNumber);
    }

    for (var staIndex = 0; staIndex < stationList2.length; staIndex++) {
        viewer.entities.add(
            {
                name: stationList2[staIndex].name,
                position: Cesium.Cartesian3.fromDegrees(stationList2[staIndex].longitude, stationList2[staIndex].latitude, 3000),
                point: {
                    pixelSize: 8,
                    scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                    color: Cesium.Color.RED
                    //, outlineColor: Cesium.Color.YELLOW // default: BLACK
                }
                //,
                //data: stationList2[staIndex]
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

        var row = document.createElement("tr");
        var cell = document.createElement("td");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        var cell3 = document.createElement("td");

        cell.appendChild(document.createTextNode(nameSubstr));
        cell1.appendChild(document.createTextNode(parseFloat(stationList2[i].longitude).toFixed(4)));
        cell2.appendChild(document.createTextNode(parseFloat(stationList2[i].latitude).toFixed(4)));
        cell3.appendChild(document.createTextNode(parseFloat(stationList2[i].deep).toFixed(2)));

        cell.setAttribute("data-toggle", "tooltip");
        cell.setAttribute("title", stationList2[i].name);

        row.appendChild(cell);
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);


        row.onclick = function () {
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

            var selRowIndex = this.rowIndex;
            selRowStaName = staRows[selRowIndex - 1].name;

            var strSQLStaInfo = "select * from STATION where NAME=?";
            DatabaseOperationJS.QueryStationInfo(strSQLStaInfo, selRowStaName, callBackStationInfo);


            viewer.entities.removeAll();
            for (var j = 0; j < stationList2.length; j++) {
                viewer.entities.add(
                    {
                        //                 parent: layer,
                        name: "Stations",
                        position: Cesium.Cartesian3.fromDegrees(stationList2[j].longitude, stationList2[j].latitude, 3000),
                        point: {
                            pixelSize: 8,
                            scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                            color: Cesium.Color.RED
                            //, outlineColor: Cesium.Color.YELLOW // default: BLACK
                        },
                        data: stationList2[j]
                    });

            }

            viewer.entities.add(
                {
                    //                 parent: layer,
                    name: "seletedStation",
                    position: Cesium.Cartesian3.fromDegrees(parseFloat(this.cells[1].innerHTML), parseFloat(this.cells[2].innerHTML), 3000),

                    point: {
                        pixelSize: 6,
                        //color: new Cesium.Color(0.5, 0.9, 1.0, 1.0),
                        scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                        show: true, // default
                        color: Cesium.Color.RED, // default: WHITE
                        outlineColor: Cesium.Color.YELLOW, // default: BLACK
                        outlineWidth: 4 // default: 0
                    }
                }
            );


            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(parseFloat(this.cells[1].innerHTML), parseFloat(this.cells[2].innerHTML), 2000000.0)
            });


        };
        var obody = document.getElementById("tbodyStationList");
        obody.appendChild(row);
    }


}


/**
 *
 *  站点列表上一页
 */
function staPagePrevious() {
    var staSumPageNumber = Math.ceil(stationList2.length / staRowNumber);
    if (staCurPageNumber > 1) {
        staCurPageNumber--;
    }

    clearTable("tbodyStationList");
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


    var staStartIndex = (staCurPageNumber - 1) * staRowNumber;
    var staEndIndex = ( 1 + staCurPageNumber - 1) * staRowNumber;

    if (staCurPageNumber == staSumPageNumber) {
        staEndIndex = (staCurPageNumber - 1) * staRowNumber + (stationList2.length - (staSumPageNumber - 1) * staRowNumber);
    }

    for (var staIndex = 0; staIndex < stationList2.length; staIndex++) {
        viewer.entities.add(
            {
                //                 parent: layer,
                name: stationList2[staIndex].name,
                position: Cesium.Cartesian3.fromDegrees(stationList2[staIndex].longitude, stationList2[staIndex].latitude, 3000),
                point: {
                    pixelSize: 8,
                    scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                    color: Cesium.Color.RED
                    //, outlineColor: Cesium.Color.YELLOW // default: BLACK
                }
                //,
                //data: stationList2[staIndex]
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

        var row = document.createElement("tr");
        var cell = document.createElement("td");
        var cell1 = document.createElement("td");
        var cell2 = document.createElement("td");
        var cell3 = document.createElement("td");

        cell.appendChild(document.createTextNode(nameSubstr));
        cell1.appendChild(document.createTextNode(parseFloat(stationList2[i].longitude).toFixed(4)));
        cell2.appendChild(document.createTextNode(parseFloat(stationList2[i].latitude).toFixed(4)));
        cell3.appendChild(document.createTextNode(parseFloat(stationList2[i].deep).toFixed(2)));

        cell.setAttribute("data-toggle", "tooltip");
        cell.setAttribute("title", stationList2[i].name);

        row.appendChild(cell);
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);


        row.onclick = function () {
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

            var selRowIndex = this.rowIndex;
            selRowStaName = staRows[selRowIndex - 1].name;

            var strSQLStaInfo = "select * from STATION where NAME=?";
            DatabaseOperationJS.QueryStationInfo(strSQLStaInfo, selRowStaName, callBackStationInfo);

            viewer.entities.removeAll();
            for (var j = 0; j < stationList2.length; j++) {
                viewer.entities.add(
                    {
                        //                 parent: layer,
                        name: "Stations",
                        position: Cesium.Cartesian3.fromDegrees(stationList2[j].longitude, stationList2[j].latitude, 3000),
                        point: {
                            pixelSize: 8,
                            scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                            color: Cesium.Color.RED
                            //, outlineColor: Cesium.Color.YELLOW // default: BLACK
                        },
                        data: stationList2[j]
                    });

            }

            viewer.entities.add(
                {
                    //                 parent: layer,
                    name: "seletedStation",
                    position: Cesium.Cartesian3.fromDegrees(parseFloat(this.cells[1].innerHTML), parseFloat(this.cells[2].innerHTML), 3000),

                    point: {
                        pixelSize: 6,
                        //color: new Cesium.Color(0.5, 0.9, 1.0, 1.0),
                        scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                        show: true, // default
                        color: Cesium.Color.RED, // default: WHITE
                        outlineColor: Cesium.Color.YELLOW, // default: BLACK
                        outlineWidth: 4 // default: 0
                    }
                }
            );
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(parseFloat(this.cells[1].innerHTML), parseFloat(this.cells[2].innerHTML), 2000000.0)
            });


        };
        var obody = document.getElementById("tbodyStationList");
        obody.appendChild(row);
    }


}


/**
 *
 *  站点信息
 */
var staID;
var callBackStationInfo = function (stationInfo) {
    //alert(stationInfo);
    document.getElementById("zhandian").innerHTML = stationInfo.name;

    document.getElementById("jingdu").innerHTML = parseFloat(stationInfo.longitude).toFixed(4);
    document.getElementById("weidu").innerHTML = parseFloat(stationInfo.latitude).toFixed(4);
    document.getElementById("shuishen").innerHTML = parseFloat(stationInfo.deep).toFixed(2);
    document.getElementById("riqi").innerHTML = stationInfo.date.substring(0, 10);
    document.getElementById("hangci").innerHTML = stationInfo.voyageName;
    document.getElementById("haiqu").innerHTML = stationInfo.type;

    //document.getElementById("riqi").innerHTML = callBackStationInfo.infoPath;
    ctdURL = stationInfo.infoPath;


    document.getElementById("yValue").selectedIndex = 0;
    //updateView();

    for (var i = 0; i < staRows.length; i++) {
        if (staRows[i].name == selRowStaName) {
            staID = staRows[i].staid;
        }
    }
    initctdInfoTable(selVoyName, staID);
    fillEchart(ctdInfoTable[1], ctdInfoTable[0], '温度', '温度', '水深');

};

function BingdingStationHandler() {

// Mouse over the globe to see the cartographic position

    handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function (movement) {
        //  alert(movement.position.x);
        var pArray = viewer.scene.drillPick(movement.position);
        var pArrayLength = pArray.length;
        for (var i = 0; i < pArrayLength; i++) {
            if (Cesium.defined(pArray[i])) {
                var entity = pArray[i].id;
                if (entity instanceof Cesium.Entity) {

                    if (Cesium.defined(entity.point)) {

                        var data = entity._data;
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

                        document.getElementById("zhandian").innerHTML = data.name;
                        document.getElementById("jingdu").innerHTML = parseFloat(data.longitude).toFixed(4);
                        document.getElementById("weidu").innerHTML = parseFloat(data.latitude).toFixed(4);
                        document.getElementById("shuishen").innerHTML = parseFloat(data.deep).toFixed(2) + "";
                        document.getElementById("riqi").innerHTML = data.date.substring(0, 10);
                        document.getElementById("hangci").innerHTML = data.voyageName;
                        document.getElementById("haiqu").innerHTML = data.type;
                        ctdURL = data.infoPath;
                        selStaName = data.name;

                        viewer.entities.removeAll();
                        for (var j = 0; j < clickHandlerStationList.length; j++) {
                            viewer.entities.add(
                                {
                                    //                 parent: layer,
                                    name: "Stations",
                                    position: Cesium.Cartesian3.fromDegrees(clickHandlerStationList[j].longitude, clickHandlerStationList[j].latitude, 3000),
                                    point: {
                                        pixelSize: 8,
                                        scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                                        color: Cesium.Color.RED // default: WHITE
                                        //,outlineColor: Cesium.Color.YELLOW // default: BLACK
                                    },
                                    data: clickHandlerStationList[j]
                                });
                        }
                        viewer.entities.add(
                            {
                                //                 parent: layer,
                                name: "seletedStation",
                                position: Cesium.Cartesian3.fromDegrees(data.longitude, data.latitude, 3000),

                                point: {
                                    pixelSize: 6,
                                    //color: new Cesium.Color(0.5, 0.9, 1.0, 1.0),
                                    scaleByDistance: new Cesium.NearFarScalar(2.5e2, 2.0, 1.5e7, 0.5),
                                    show: true, // default
                                    color: Cesium.Color.RED, // default: WHITE
                                    outlineColor: Cesium.Color.YELLOW, // default: BLACK
                                    outlineWidth: 4 // default: 0
                                },
                                data: data
                            });


                        document.getElementById("yValue").selectedIndex = 0;
                        var selStaID = data.ID;

                        initctdInfoTable(selVoyName, selStaID);
                        fillEchart(ctdInfoTable[1], ctdInfoTable[0], '温度', '温度(°C)', '水深(米)');

                    }
                    else {

                    }
                }
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

var callBackDataRange = function (dateRange) {
    document.getElementById("startdate").value = dateRange.startDate;
    document.getElementById("enddate").value = dateRange.endDate;
};

$('#RemoveRoute1').click(function () {
    removedatasource();
});
$('#StopTerrain').click(function () {

    removedatasource();
    viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
    viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
});


/**
 *
 *  清除地形数据
 */
function TerrainMove() {
    if (maliyana) {
        //  alert("koko");
        viewer.imageryLayers.remove(maliyana);
    }
    if (chongsheng) {
        //  alert("koko");
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
    //viewer.terrainProvider = null;
}


/**
 *
 *  加载显示地形数据
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
        //  alert("koko");
        viewer.imageryLayers.remove(chongsheng);
    }
    if (maliyana) {
        //  alert("koko");
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

var global01;
var global02;
var maliyana;
var chongsheng;
var nanhai;

/**
 *
 *  选择渲染区域
 */
$('#TerrainPoint').change(function (e) {
    var h = $(this).val();

    var options = "全球数字高程模型渲染";
    var options1 = "马里亚纳海沟，又称'马里亚纳群岛海沟'，是目前所知地球上最深的海沟，该海沟地处北太平洋西部海床，" +
        "靠近关岛的马里亚纳群岛的东方，该海沟为两个板块辐辏俯冲带，太平洋板块在这里俯冲到菲律宾板块（或细分出的马里亚纳板块）之下。" +
        "马里亚纳海沟在海平面以下的深度已经超过珠穆朗玛峰的海拔最高处。马里亚纳海沟位于11 °20′N，142°11.5′E，即于菲律宾东北、马里亚纳群岛附近的太平洋底，" +
        "亚洲大陆和澳大利亚之间，北起硫黄列岛、西南至雅浦岛附近。其北有阿留申、千岛、日本、小笠原等海沟，南有新不列颠和新赫布里底等海沟，" +
        "全长2550千米，为弧形，平均宽70千米，大部分水深在8000米以上。最深处在斐查兹海渊，为11095米，" +
        "是地球的最深点。这条海沟的形成据估计已有6000万年，是太平洋西部洋底一系列海沟的一部分。";
    var options2 = "冲绳海槽是位于东海大陆架外缘、东海陆架边缘隆褶带与琉球岛弧之间的一个狭长带状弧间盆地。" +
        " 是东海大陆架的边缘，位于琉球群岛和中国钓鱼岛之间，是因琉球海沟的岩石圈扩展而形成的弧后盆地，" +
        "大部分深度逾1,000米，最大深度2,716米。" +
        "冲绳海槽区是个大陆边缘盆地，它的基底具有过渡性地壳的特征，是东海大陆架的清楚外界。" +
        "中国大陆与日本琉球群岛之间的东海大陆架的天然分界，应位于冲绳海槽的中心线。冲绳海槽面积约24.6万平方公里，" +
        "地形的基本特点是呈长条状弧形展布，全长840公里，其上发育有海山、海丘、海山脊、地堑槽等多种构造地貌。 " +
        "水深自东北向西南增大，最大水深位于久米岛西南方槽底平原中心附近，水深2050米（海洋地质调查局已实测到的水深）。据其地形特征，" +
        "可进一步划分为西侧槽坡地形区，东侧槽坡地形区和槽底平原地形区。";
    var options3 = "南海为东北—西南走向，其南部边界在南纬3度，位于印度尼西亚的南苏门达腊和加里曼丹之间，北边至中国，" +
        "东北至台湾本岛，东至菲律宾群岛，且包含吕宋海峡西半侧，西南至越南与马来西亚，通过巴士海峡、苏禄海和马六甲海峡连接太平洋和印度洋。" +
        "整个南海几乎被大陆、半岛和岛屿所包围。其形状近似菱形，从四周呈阶梯状向中部加深。" +
        "南海为世界第三大陆缘海，仅次于珊瑚海和阿拉伯海，面积约356万平方公里。";
    var options4 = "全球数字高程模型渲染";


    globe.depthTestAgainstTerrain = true;
    var TerrainPoint = document.getElementById("TerrainPoint").value;
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

        var imageryLayers = viewer.imageryLayers;
        if (chongsheng) {
            //  alert("koko");
            viewer.imageryLayers.remove(chongsheng);
        }
        if (nanhai) {
            //  alert("koko");
            viewer.imageryLayers.remove(nanhai);
        }
        if (global01) {
            //  alert("koko");
            viewer.imageryLayers.remove(global01);
        }
        if (global02) {
            //  alert("koko");
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

        document.getElementById("imgTerLeg").src = "images/terLegML01.png";
        document.getElementById("terLegMin").innerText = "-10977";
        document.getElementById("terLegMax").innerText = "781";
    } else if (h == "chongsheng") {
        document.getElementById("ZoneIntroduce").innerHTML = options2;

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

        document.getElementById("imgTerLeg").src = "images/terLegCS01.png";
        document.getElementById("terLegMin").innerText = "-4960";
        document.getElementById("terLegMax").innerText = "4021";
    } else if (h == "nanhai") {
        document.getElementById("ZoneIntroduce").innerHTML = options3;
    }
    else if (h == "global02") {
        document.getElementById("ZoneIntroduce").innerHTML = options4;

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


        document.getElementById("imgTerLeg").src = "images/terLegGLB02.png";
        document.getElementById("terLegMin").innerText = "-10977";
        document.getElementById("terLegMax").innerText = "8848";
    }

});


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
            //  alert("koko");
            viewer.imageryLayers.remove(chongsheng);
        }
        if (maliyana) {
            //  alert("koko");
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
    else if (TerrainPoint == "maliyana") {
        var imageryLayers = viewer.imageryLayers;
        if (chongsheng) {
            //  alert("koko");
            viewer.imageryLayers.remove(chongsheng);
        }
        if (nanhai) {
            //  alert("koko");
            viewer.imageryLayers.remove(nanhai);
        }
        if (global01) {
            //  alert("koko");
            viewer.imageryLayers.remove(global01);
        }
        if (global02) {
            //  alert("koko");
            viewer.imageryLayers.remove(global02);
        }

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(138.9, 0.9310001, 2000000.1)
            ,
            orientation: {
                heading: Cesium.Math.toRadians(-1.0),
                pitch: Cesium.Math.toRadians(-50.0),
                roll: 0.0
            }
        });
        //viewer.camera.flyTo({
        //    destination: Cesium.Cartesian3.fromDegrees(140.9, 10.931, 800000.0)
        //});
        var czmlterrain = [{
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
                    6000, 142.614525919801395, 11.31616123368658, 80000,
                    7000, 143.148109097244088, 11.504831239156291, 80000,
                    8000, 143.646207439096287, 11.709474284894499, 80000,
                    9000, 144.070277476867489, 11.910361050692091, 80000,
                    10000, 144.456259134705306, 12.120299895872281, 80000,
                    11000, 144.807272716757893, 12.34090104105405, 80000,
                    12000, 145.114972355900505, 12.567317195212169, 80000,
                    13000, 145.450442172791895, 12.86142851070767, 80000,
                    14000, 145.764338608916887, 13.177377908570429, 80000,
                    15000, 146.042159451716998, 13.499249648681079, 80000,
                    16000, 146.287204934008514, 13.83004413877074, 80000,
                    17000, 146.528959426358995, 14.222701208501601, 80000,
                    18000, 146.731890853603801, 14.63400841417757, 80000,
                    19000, 146.899067824149, 15.06992411829828, 80000,
                    20000, 147.031739088120304, 15.533094584330581, 80000,
                    21000, 147.131661543948894, 16.03230102674889, 80000,
                    22000, 147.195269701323014, 16.555726320792999, 80000,
                    23000, 147.220749521633394, 17.089378738500539, 80000,
                    24000, 147.207106241810095, 17.62135006017186, 80000,
                    25000, 147.156272348277497, 18.121663855516619, 80000,
                    26000, 147.0697646016703, 18.59312717642732, 80000,
                    27000, 146.949301898136298, 19.02831752233843, 80000,
                    28000, 146.794338625126187, 19.42719165103987, 80000,
                    29000, 146.608750004877294, 19.77955549094445, 80000,
                    30000, 146.387907122861606, 20.095547174002419, 80000,
                    31000, 146.135547712207909, 20.368555332910681, 80000,
                    32000, 145.859423027621489, 20.590357863301332, 80000,
                    33000, 145.553806161611902, 20.761516734973579, 80000,
                    34000, 145.238659397902012, 20.866941772397379, 80000,
                    35000, 144.915604325074696, 20.90568902090914, 80000,
                    36000, 144.600210784715102, 20.875915977622331, 80000,
                    37000, 144.311310404242505, 20.780649846322579, 80000,
                    38000, 144.063837498601714, 20.624938880783699, 80000,
                    39000, 143.864150535529092, 20.413191737042229, 80000,
                    40000, 143.712234464470413, 20.14515039980974, 80000,
                    41000, 143.6379829099983, 19.941094125460818, 80000,
                    42000, 143.581557491367704, 19.713255156355121, 80000,
                    43000, 143.518411418160611, 19.171510605509852, 80000,
                    44000, 143.511059157720098, 18.629940264680091, 80000,
                    45000, 143.553189610839212, 17.252584740993719, 80000,
                    46000, 143.556817032174308, 16.57544577838501, 80000,
                    47000, 143.527795831715707, 15.89987801047309, 80000,
                    48000, 143.460858249281102, 15.291912589215411, 80000,
                    49000, 143.346885208495593, 14.70547605587273, 80000,
                    50000, 143.205097060907406, 14.24369317893664, 80000,
                    51000, 142.986580332628392, 13.77687992535934, 80000,
                    52000, 142.693456884272194, 13.31113840845741, 80000,
                    53000, 142.354847782959808, 12.88369965230032, 80000,
                    54000, 141.95772407909061, 12.47116278725052, 80000,
                    55000, 141.507851821110592, 12.079869366698709, 80000,
                    56000, 141.001799451822194, 11.70663883628821, 80000,
                    57000, 140.400523177132499, 11.33008870246193, 80000,
                    58000, 139.763014868079807, 10.993258336230159, 80000,
                    59000, 139.145750579992608, 10.73479654268497, 80000,
                    60000, 138.877820123069, 10.650491507974429, 80000
                ]
            }
        }];
        huhuhu1(czmlterrain);
    }
    else if (TerrainPoint == "chongsheng") {
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

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(122.583, 12.065, 2000000.1)
            ,
            orientation: {
                heading: Cesium.Math.toRadians(-1.0),
                pitch: Cesium.Math.toRadians(-50.0),
                roll: 0.0
            }
        });
        //viewer.camera.flyTo({
        //    destination: Cesium.Cartesian3.fromDegrees(122.583, 23.065, 800000.0)
        //});
        var czmlterrain = [{
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
                    5000, 127.508, 24.599, 80000,
                    6000, 128.293, 25.099, 80000,
                    7000, 129.114, 25.706, 80000,
                    8000, 129.65, 26.313, 80000,
                    9000, 130.435, 27.169, 80000,
                    10000, 131.113, 28.418, 80000,
                    11000, 131.684, 29.239, 80000

                ]
            }
        }];
        huhuhu1(czmlterrain);
    }
    else if (TerrainPoint == "nanhai") {
        var imageryLayers = viewer.imageryLayers;
        if (maliyana) {
            viewer.imageryLayers.remove(maliyana);
        }
        if (chongsheng) {
            viewer.imageryLayers.remove(chongsheng);
        }
        if (global01) {
            viewer.imageryLayers.remove(global01);
        }
        if (global02) {
            viewer.imageryLayers.remove(global02);
        }
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

        var czmlterrain = [{
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
            "name": "path of chongsheng",
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
                    4000, 112.698783203206503, 10.69899350181214, 80000,
                    5000, 112.541594482690201, 11.684766940564479, 80000,
                    6000, 112.463768491173894, 12.49025916378354, 80000,
                    7000, 112.447633783417004, 13.24677430363473, 80000,
                    8000, 112.482416379893294, 14.08643645868084, 80000,
                    9000, 112.570922549764106, 14.87914360800383, 80000,
                    10000, 112.7093808174115, 15.593838548495301, 80000,
                    11000, 112.891834713725899, 16.20761908130947, 80000,
                    12000, 113.000274649944998, 16.478586446635038, 80000,
                    13000, 113.119343925579898, 16.723301282029791, 80000,
                    14000, 113.250079378015499, 16.94388519374273, 80000,
                    15000, 113.388644910778396, 17.133991532399278, 80000,
                    16000, 113.535891554836994, 17.295620105662401, 80000,
                    17000, 113.694604378179406, 17.431852118044588, 80000,
                    18000, 113.866235641830201, 17.543670723679099, 80000,
                    19000, 114.049252644277999, 17.63017648429437, 80000,
                    20000, 114.244240506406896, 17.691336042810342, 80000,
                    21000, 114.448448834075293, 17.72592178925467, 80000,
                    22000, 114.659477443999805, 17.733745681100189, 80000,
                    23000, 114.873971795882099, 17.714822047696561, 80000,
                    24000, 115.116727169713897, 17.660851853472028, 80000,
                    25000, 115.3500343282833, 17.573675155294278, 80000,
                    26000, 115.571839961735094, 17.453913407348882, 80000,
                    27000, 115.778746195981199, 17.303276593411439, 80000,
                    28000, 115.963543621403602, 17.127158222662239, 80000,
                    29000, 116.125296533547797, 16.927312051049149, 80000,
                    30000, 116.264635033459797, 16.703694203547411, 80000,
                    31000, 116.381858720390397, 16.455787611729971, 80000,
                    32000, 116.477170957912193, 16.18410674448463, 80000,
                    33000, 116.552628222824794, 15.88334605089762, 80000,
                    34000, 116.608009639464399, 15.554852928587669, 80000,
                    35000, 116.644816771423905, 15.19106850285125, 80000,
                    36000, 116.662127050953899, 14.796424018513511, 80000,
                    37000, 116.659514795458193, 14.38115720059589, 80000,
                    38000, 116.594968622486505, 13.50313469616113, 80000,
                    39000, 116.456644028788801, 12.614709052291181, 80000,
                    40000, 116.251444007305807, 11.75259946275524, 80000,
                    41000, 116.041850820855004, 11.142406989624339, 80000,
                    42000, 115.742853794586196, 10.48297596750894, 80000,
                    43000, 115.532655408614204, 10.088938727487539, 80000,
                    44000, 115.304314257793195, 9.70384865740661, 80000,
                    45000, 114.796424304513906, 8.963950171523642, 80000,
                    46000, 114.511040950176493, 8.603635856403615, 80000,
                    47000, 114.217549512799394, 8.268986877675671, 80000,
                    48000, 113.917656617932195, 7.965628105648136, 80000
                ]
            }
        }];
        huhuhu1(czmlterrain);
    }
    else if (TerrainPoint == "global02") {
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
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(105.00, 24.00, 24000000.0)
        });

    }

});


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


/**
 *
 *  站位点热力图
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

        //arrSelVoyNameList.push(selVoyList[i].name);
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
    ;
    //ckbheatmap.checked = false;// 设置复选框为不选中状态

});

var callBackHeatStaList = function (heatStaList) {
    for (var i = 0; i < heatStaList.length; i++) {

        var datapoint = [];
        var northpoint = "90";
        var eastpoint = "180";
        var southpoint = "-90";
        var westpoint = "-180";
        //$.getJSON("Data/15.json", function (result) {
        var cesiumHeatmapInstance = CesiumHeatmap.create(viewer, {
            north: northpoint,
            east: eastpoint,
            south: southpoint,
            west: westpoint
        }, {radius: 7.5});
        for (var q = 0; q < heatStaList.length; q++) {
            //for (var j = 0; j < result[q].length; j++) {
            var lon = heatStaList[q].longitude;
            var lat = heatStaList[q].latitude;
            if (lon >= westpoint && lon <= eastpoint && lat >= southpoint && lat <= northpoint) {
                var pointheat = {};
                pointheat.x = lon;
                pointheat.y = lat;
                pointheat.value = 25;
                datapoint.push(pointheat);
            }

            //}
        }
    }
    cesiumHeatmapInstance.setWGS84Data(0, 100, datapoint);
}


var morph = "3D";//视图形态标记,默认3D


/**
 *
 *  切换到航次模块
 */
function hanciclick() {
    $('.nav-button1').css('background-image', "url(images/HangCi32.png)");
    $('.nav-button2').css('background-image', "url(images/PouMian30.png)");
    $('.nav-button3').css('background-image', "url(images/DiXing30.png)");
    $('.nav-button4').css('background-image', "url(images/YangLiu30.png)");
    $('.nav-button5').css('background-image', "url(images/ZhongXin30.png)");

    // 注释掉自动触发的tab点击，避免清除影像图层
    // sTab1.trigger('click');
    // voyagepage1.trigger('click');
    
    // 手动设置样式而不触发清理事件
    if (!sTab1.hasClass('active')) {
        sTab1.addClass('active');
        content1.addClass('in');
    }
    if (!voyagepage1.hasClass('active')) {
        voyagepage1.addClass('active');
    }
    // 注释掉容器调整代码，防止地球移动
    // mapDiv.css('left', '320px');
    // mapDiv.css('left', '0px');
    // var mapWidth = document.body.clientWidth - 320;
    // var mapWidth = document.body.clientWidth;
    // mapDiv.css('width', mapWidth);

    //navBarLeft.addClass('open');
    sideBarRight.removeClass('active');

    var treeDiv = $('#tree');
    var treeHeight = document.body.clientHeight - 325;
    treeDiv.css('height', treeHeight);
    $('.sidebar-left').addClass('active');
    //sideBarRight.addClass('active');
    menuBox.addClass('active');
    //settingBox.addClass('active');
    menuClickBox.addClass('active');
    //settingClickBox.addClass('active');
    markerBoxBack.addClass('on');
    legendBox.addClass('active');
    legendIcon.addClass('active');

    //$('.toggle').css('right', '-30px');
    $('.sidebar-left-close').css('right', '-30px');

    //RouteClick();
    AddAllRoute();
    //var strSQLVoyAll = "select * from VOYAGE t";
    //DatabaseOperationJS.QueryVoyageList(strSQLVoyAll, callBackVoyageList);
}

/**
 *
 *  切换到剖面模块
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
    //sideBarRight.css('height',sideBarRightHeight-36);
    var tabContent2Height = document.body.clientHeight;
    $('.infoTabs-content').css('height', tabContent2Height - 36);
    mapDiv.css('left', '0%');
    //var mapWidth = document.body.clientWidth - 450;
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

    //$('.toggle').css('right', '-0px');
    $('.sidebar-left-close').css('right', '-0px');

}

/**
 *
 *  切换到地形渲染模块
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
    //sideBarRight.css('height',sideBarRightHeight-36);
    var tabContent2Height = document.body.clientHeight;
    $('.infoTabs-content').css('height', tabContent2Height - 36);
    mapDiv.css('left', '0%');
    //var mapWidth = document.body.clientWidth - 450;
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

    //$('.toggle').css('right', '-0px');
    $('.sidebar-left-close').css('right', '-0px');
};


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
    //sideBarRight.css('height',sideBarRightHeight-36);
    var tabContent2Height = document.body.clientHeight;
    $('.infoTabs-content').css('height', tabContent2Height - 36);
    mapDiv.css('left', '0%');
    //var mapWidth = document.body.clientWidth - 450;
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

    //$('.toggle').css('right', '-0px');
    $('.sidebar-left-close').css('right', '-0px');
}

$("#info1Icon").click(function () {
    openerInfo.trigger('click');
    $("#info1-tab").trigger('click');
});

$("#info2Icon").click(function () {
    openerInfo.trigger('click');
    $("#info2-tab").trigger('click');
});

/**
 *
 *  关闭右侧信息面板
 */
$('.sidebar-close').click(function () {
    if (sideBarRight.hasClass('active')) {
        if ($('.sidebar-left').hasClass('active')) {
            sideBarRight.removeClass('active');
            //mapDiv.css('left', '320px');
            mapDiv.css('left', '0px');
            //var mapWidth = document.body.clientWidth - 320;
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
            //mapDiv.css('left', '320px');
            mapDiv.css('left', '0px');
            //var mapWidth = document.body.clientWidth - 320 - 450;
            //var mapWidth = document.body.clientWidth - 320 ;
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);

            map2dtoggle.addClass('active');
            map3dtoggle.addClass('active');
            $('.coorInfo').addClass('active');

        }
        else {
            sideBarRight.addClass('active');
            mapDiv.css('left', '0%');
            //var mapWidth = document.body.clientWidth - 450;
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);

            map2dtoggle.addClass('active');
            map3dtoggle.addClass('active');
            $('.coorInfo').addClass('active');

        }
    }


});


/**
 *
 *  左侧面板控制
 */
$('.sidebar-left-close').click(function () {
    if ($('.sidebar-left').hasClass('active')) {
        if (sideBarRight.hasClass('active')) {
            $('.sidebar-left').removeClass('active');
            mapDiv.css('left', '0px');
            //var mapWidth = document.body.clientWidth - 450;
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);
            menuBox.removeClass('active');
            settingBox.removeClass('active');
            //map2dtoggle.removeClass('active');
            //map3dtoggle.removeClass('active');
            //$('.coorInfo').removeClass('active');
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
            //map2dtoggle.removeClass('active');
            //map3dtoggle.removeClass('active');
            //$('.coorInfo').removeClass('active');
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
            //mapDiv.css('left', '320px');
            mapDiv.css('left', '0px');
            //var mapWidth = document.body.clientWidth - 450 - 320;
            //var mapWidth = document.body.clientWidth - 320;
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);
            menuBox.removeClass('active');
            settingBox.removeClass('active');
            //map2dtoggle.removeClass('active');
            //map3dtoggle.removeClass('active');
            //$('.coorInfo').removeClass('active');
            menuClickBox.removeClass('active');
            settingClickBox.removeClass('active');
            markerBoxBack.removeClass('on');
            legendBox.removeClass('active');
            legendIcon.removeClass('active');
        }
        else {
            $('.sidebar-left').addClass('active');
            //mapDiv.css('left', '320px');
            mapDiv.css('left', '0px');
            //var mapWidth = document.body.clientWidth - 320;
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);
            menuBox.removeClass('active');
            settingBox.removeClass('active');
            //map2dtoggle.removeClass('active');
            //map3dtoggle.removeClass('active');
            //$('.coorInfo').removeClass('active');
            menuClickBox.removeClass('active');
            settingClickBox.removeClass('active');
            markerBoxBack.removeClass('on');
            legendBox.removeClass('active');
            legendIcon.removeClass('active');
        }
    }


});

/**
 *
 *  左侧面板控制
 */
$('.toggle').click(function () {
    if ($('.navbar-left').hasClass('open')) {
        if (sideBarRight.hasClass('active')) {
            $('.navbar-left').removeClass('open');
            mapDiv.css('left', '0px');
            //var mapWidth = document.body.clientWidth - 450;
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);
            menuBox.removeClass('active');
            settingBox.removeClass('active');
            //map2dtoggle.removeClass('active');
            //map3dtoggle.removeClass('active');
            //$('.coorInfo').removeClass('active');
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
            //map2dtoggle.removeClass('active');
            //map3dtoggle.removeClass('active');
            //$('.coorInfo').removeClass('active');
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
            //mapDiv.css('left', '320px');
            mapDiv.css('left', '0px');
            //var mapWidth = document.body.clientWidth - 450 - 320;
            //var mapWidth = document.body.clientWidth - 320;
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);
            menuBox.removeClass('active');
            settingBox.removeClass('active');
            //map2dtoggle.removeClass('active');
            //map3dtoggle.removeClass('active');
            //$('.coorInfo').removeClass('active');
            menuClickBox.removeClass('active');
            settingClickBox.removeClass('active');
            markerBoxBack.removeClass('on');
            legendBox.removeClass('active');
            legendIcon.removeClass('active');
        }
        else {
            $('.navbar-left').addClass('open');
            //mapDiv.css('left', '320px');
            mapDiv.css('left', '0px');
            //var mapWidth = document.body.clientWidth - 320;
            var mapWidth = document.body.clientWidth;
            mapDiv.css('width', mapWidth);
            menuBox.removeClass('active');
            settingBox.removeClass('active');
            //map2dtoggle.removeClass('active');
            //map3dtoggle.removeClass('active');
            //$('.coorInfo').removeClass('active');
            menuClickBox.removeClass('active');
            settingClickBox.removeClass('active');
            markerBoxBack.removeClass('on');
            legendBox.removeClass('active');
            legendIcon.removeClass('active');
        }
    }


});

/**
 *
 *  清除表格
 */
function clearTable(tableid) {
    var tableRef = document.getElementById(tableid);
    while (tableRef.rows.length > 0) {
        tableRef.deleteRow(0);
    }

    //wt
    if (typeof tablezone != 'undefined')
        tablezone.clear();
    if (typeof tableyear != 'undefined')
        tableyear.clear();

};


var datasourceroute1;
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


    /*
     * 2016-11-17 xwj修改
     * 目的：增加所有航线站点显示在地球上
     * */

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
sTab2.click(function () {
    if (modular != 2) {
        TerrainMove();
        removedatasource();
        clearImageryLayers();
        ClearDynaMaps();
        viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
        viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
    }

    if (modular = 2)

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


/**
 *
 *  2D/3D切换
 */
$('.map2d').click(function () {
    //$('.slider-box').toggleClass('on');

    if (morph == "3D") {
        viewer._cesiumWidget.scene.morphTo2D(0);
        morph = "2D";

        $('.map2d').css('background-image', 'url(images/2d_on.png)');
        $('.map3d').css('background-image', 'url(images/3d_off.png)');
    }
    //else if (morph == "2D") {
    //    viewer._cesiumWidget.scene.morphTo3D(0);
    //    morph = "3D"
    //}


});


$('.map3d').click(function () {

    if (morph == "2D") {
        viewer._cesiumWidget.scene.morphTo3D(0);
        morph = "3D";
        $('.map2d').css('background-image', 'url(images/2d_off.png)');
        $('.map3d').css('background-image', 'url(images/3d_on.png)');
    }


});

$("#autoIcon").click(function (e) {
    var scon = $("#slider-container");
    if (scon.is(":hidden")) {
        scon.slideDown("fast");
    } else {
        scon.slideUp("fast");
    }
});


$('.legend-hide').click(function () {
    legendBox.addClass('off');
    legendIcon.removeClass('off');
});

$('#voyage-info-tab1').click(function () {

});


/**
 *
 *  删除数据源
 */
function removedatasource() {
    viewer.dataSources.removeAll();
    viewer.entities.removeAll();
};

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

// 独立的基础影像图层恢复函数
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
};


/**
 *
 *  显示经纬度基本信息
 */
var handlerShowCoor;
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
    
        layerCount: viewer.imageryLayers.length,
        hasPrimaryLayer: !!primaryLayerBackup,
        primaryLayerValid: hasValidPrimaryLayer
    });
    
    // 记录地形切换前的详细状态
        show: globe.show,
        baseColor: globe.baseColor.toString(),
        currentTerrainProvider: globe.terrainProvider.constructor.name,
        enableLighting: globe.enableLighting,
        depthTestAgainstTerrain: globe.depthTestAgainstTerrain
    });
    
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
            
                layerCount: currentLayerCount,
                primaryStillExists: primaryStillExists
            });
            
            // 检查地球本身的状态
                show: globe.show,
                baseColor: globe.baseColor.toString(),
                newTerrainProvider: globe.terrainProvider.constructor.name,
                enableLighting: globe.enableLighting,
                depthTestAgainstTerrain: globe.depthTestAgainstTerrain
            });
            
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
                    
                        show: currentShow,
                        alpha: currentAlpha,
                        ready: isReady,
                        provider: (window.primaryImageryLayer && 
                                 window.primaryImageryLayer.imageryProvider && 
                                 window.primaryImageryLayer.imageryProvider.constructor) ? 
                                window.primaryImageryLayer.imageryProvider.constructor.name : 'Unknown'
                    });
                    
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

            //       var cartographic = ellipsoid.cartesianToCartographic(cartesian);
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
                    //    posArray.push(distPosCarte[i]);
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

                //document.getElementById('idCoorInfo').innerText = "经度：" + showLong + "， 纬度：" + showLati + "， 海拔：" + currAlti.toFixed(0) + " 米";
                //document.getElementById('idCoorInfo').innerText = "经度：" + showLong + "， 纬度：" + showLati + "， 海拔：" + parseInt(currAlti) + " 米";
                //document.getElementById('idCoorInfo').innerText = "经度：" + showLong + "， 纬度：" + showLati;
                //document.getElementById('alti').innerText = "海拔：" +currAlti.toFixed(0)+" 米";
            }
        }
        else {
            document.getElementById('idCoorInfo').innerText = "经度： 无 " + "  ， 纬度： 无 ";
        }
//        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE, Cesium.KeyboardEventModifier.SHIFT);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

/**
 * 安全版本的AddAllRoute函数 - 通过影像图层管理器保护基础图层
 */
function AddAllRoute() {
    
    try {
        // 确保影像图层管理器存在
        if (!window.imageryManager) {
            console.warn('⚠️ 影像图层管理器不存在，尝试初始化...');
            if (window.viewer && typeof window.initializeImageryManager === 'function') {
                window.initializeImageryManager(window.viewer);
            } else {
                console.error('❌ 无法初始化影像图层管理器');
                // 仍然尝试执行原始功能，但增加保护
                return OriginalAddAllRoute();
            }
        }
        
        // 执行前强制确保影像图层安全
        if (window.imageryManager) {
            window.imageryManager.forceRestoreBaseImageryLayer();
            const statusBefore = window.imageryManager.getStatusReport();
        }
        
        // 执行数据库查询
        const strSQLVoyAll = "select * from VOYAGE t order by ID";
        
        // DWR就绪检查
        if (typeof DatabaseOperationJS === 'undefined') {
            console.error('DatabaseOperationJS is not available, retrying in 1 second...');
            setTimeout(AddAllRoute, 1000);
            return;
        }
        
        
        // 使用安全的错误处理
        try {
            // 采用 test_db.html 中成功的DWR调用方式（简单回调函数，而不是对象包装）
            DatabaseOperationJS.QueryVoyageList(strSQLVoyAll, 
                function(data) {
                    
                    // 在回调中也要保护影像图层
                    if (window.imageryManager) {
                        window.imageryManager.forceRestoreBaseImageryLayer();
                    }
                    
                    // 数据验证和处理
                    if (data && Array.isArray(data) && data.length > 0) {
                        callBackVoyageList(data);
                    } else {
                        console.error('❌ 航次数据为空或格式错误，请检查数据库连接和数据');
                        // 显示数据库连接错误信息
                        const tbody = document.getElementById('tbodyVoyageList');
                        if (tbody) {
                            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: red;">数据库连接失败或VOYAGE表中无数据</td></tr>';
                        }
                    }
                    
                    // 回调执行后再次检查影像图层
                    setTimeout(() => {
                        if (window.imageryManager) {
                            const statusAfterCallback = window.imageryManager.getStatusReport();
                            
                            if (!statusAfterCallback.baseLayerValid || !statusAfterCallback.baseLayerShow) {
                                console.warn('⚠️ 航次回调影响了影像图层，强制恢复...');
                                window.imageryManager.forceRestoreBaseImageryLayer();
                            }
                        }
                    }, 100);
                },
                function(error) {
                    console.error('❌ DWR航次查询失败:', error);
                        message: error.message,
                        type: error.type,
                        javaClassName: error.javaClassName
                    });
                    
                    // 错误时也要保护影像图层
                    if (window.imageryManager) {
                        window.imageryManager.forceRestoreBaseImageryLayer();
                    }
                    
                    // 显示错误信息给用户
                    const tbody = document.getElementById('tbodyVoyageList');
                    if (tbody) {
                        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: red;">
                            DWR调用失败: ${error.message || '未知错误'}<br>
                            请检查：<br>
                            1. 服务器是否运行<br>
                            2. 数据库连接是否正常 (192.168.101.38:1521:ORCL)<br>
                            3. DWR配置是否正确
                        </td></tr>`;
                    }
                    
                    // 尝试默认查询
                    try {
                        DatabaseOperationJS.QueryVoyageList('', 
                            function(data) {
                                if (window.imageryManager) {
                                    window.imageryManager.forceRestoreBaseImageryLayer();
                                }
                                if (data && Array.isArray(data) && data.length > 0) {
                                    callBackVoyageList(data);
                                } else {
                                    console.error('❌ 默认查询也返回空数据');
                                }
                            },
                            function(error2) {
                                console.error('❌ 默认查询也失败:', error2);
                                if (window.imageryManager) {
                                    window.imageryManager.forceRestoreBaseImageryLayer();
                                }
                                // 不调用callBackVoyageList([])，保持错误信息显示
                            }
                        );
                    } catch (retryError) {
                        console.error('❌ 重试查询时发生异常:', retryError);
                    }
                }
            );
        } catch (e) {
            console.error('安全AddAllRoute异常:', e);
            if (window.imageryManager) {
                window.imageryManager.forceRestoreBaseImageryLayer();
            }
            callBackVoyageList([]);
        }
        
        // 安全设置UI状态（不触发可能的清理事件）
        setUIStateSafely();
        
        // 执行后检查影像图层状态
        setTimeout(() => {
            if (window.imageryManager) {
                const statusAfter = window.imageryManager.getStatusReport();
                
                if (!statusAfter.baseLayerValid || !statusAfter.baseLayerShow) {
                    console.warn('⚠️ AddAllRoute执行影响了影像图层，强制恢复...');
                    window.imageryManager.forceRestoreBaseImageryLayer();
                } else {
                }
            }
        }, 200);
        
        
    } catch (error) {
        console.error('❌ 安全AddAllRoute执行失败:', error);
        
        // 异常时强制恢复影像图层
        if (window.imageryManager) {
            window.imageryManager.forceRestoreBaseImageryLayer();
        }
        
        // 作为备选，执行原始版本
        OriginalAddAllRoute();
    }
    
}

/**
 * 安全设置UI状态
 */
function setUIStateSafely() {
    try {
        
        // 手动设置样式而不触发可能的清理事件
        if (!sTab1.hasClass('active')) {
            sTab1.addClass('active');
            content1.addClass('in');
        }
        
        if (!voyagepage1.hasClass('active')) {
            voyagepage1.addClass('active');
        }
        
        // 设置地图容器样式
        mapDiv.css('left', '0px');
        const mapWidth = document.body.clientWidth;
        mapDiv.css('width', mapWidth);
        
        // 设置侧边栏状态
        $('.sidebar-left').addClass('active');
        sideBarRight.addClass('active');
        
        // 设置高度
        const sideBarRightHeight = document.body.clientHeight;
        const tabContent2Height = document.body.clientHeight;
        $('.infoTabs-content').css('height', tabContent2Height - 36);
        
        // 设置其他UI元素
        $('.setting-outbox').addClass('active');
        $('.map2d').addClass('active');
        $('.map3d').addClass('active');
        $('.coorInfo').addClass('active');
        
        
    } catch (error) {
        console.error('❌ UI状态设置失败:', error);
    }
}

/**
 * 显示右侧航次面板
 */
function showVoyagePanel() {
    try {
        
        // 确保右侧边栏可见
        const sideBarRight = document.getElementById('sidebar-right');
        if (sideBarRight) {
            sideBarRight.style.display = 'block';
            sideBarRight.classList.add('active');
        }
        
        // 激活航次站位标签
        const tab1 = document.getElementById('sidebar-tab1');
        if (tab1) {
            tab1.classList.add('active');
        }
        
        // 显示航次内容
        const content1 = document.getElementById('sidebar-content1');
        if (content1) {
            content1.classList.add('in');
            content1.style.display = 'block';
        }
        
        // 隐藏其他标签内容
        const otherTabs = ['sidebar-tab2', 'sidebar-tab3', 'sidebar-tab4'];
        const otherContents = ['sidebar-content2', 'sidebar-content3', 'sidebar-content4'];
        
        otherTabs.forEach(tabId => {
            const tab = document.getElementById(tabId);
            if (tab) {
                tab.classList.remove('active');
            }
        });
        
        otherContents.forEach(contentId => {
            const content = document.getElementById(contentId);
            if (content) {
                content.classList.remove('in');
                content.style.display = 'none';
            }
        });
        
        
    } catch (error) {
        console.error('❌ 显示航次面板失败:', error);
    }
}

