/**
 * @filename: init.js
 * @description: 初始化和全局变量模块
 * @version: 1.0
 * @date: 2025-01-01
 * @author: 系统重构
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

"use strict";

// 检查jQuery是否可用
if (typeof $ === 'undefined') {
    console.error('init.js: jQuery is not loaded yet!');
    // 尝试延迟重新加载
    setTimeout(function() {
        if (typeof $ !== 'undefined') {
            location.reload();
        }
    }, 1000);
    throw new Error('jQuery not loaded');
}

// 创建全局命名空间
window.IVSOSD = window.IVSOSD || {};

//===========================================
// DOM元素引用变量定义
//===========================================

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

//===========================================
// 全局状态变量定义
//===========================================

var selectedVoy = 0;
var selectedSta = 0;
var selectedPage = 3;
var modular = 1; // 当前模块标识

// 航次列表相关变量
var ctdURL;
var voyageTrajPathList = new Array();
var selNewVoyID;
var selOldVoyID;
var selOldVoyTrajPath;
var voyRows = [];
var voyageList2 = [];
var voyRowNumber = 15;
var curPageNumber = 1;

// 站点列表相关变量
var staRows = [];
var clickHandlerStationList;
var stationList2 = [];
var staRowNumber = 6;
var selRowStaName;
var staCurPageNumber = 1;
var staID;

// 地形渲染相关变量
var global01;
var global02;
var maliyana;
var chongsheng;
var nanhai;

// 坐标信息显示相关变量
var handlerShowCoor;

// 视图形态标记
var morph = "3D"; // 默认3D

// 数据源路由相关变量
var datasourceroute1;

//===========================================
// 工具函数
//===========================================

/**
 * 数组计数工具函数
 * @param {*} o - 要计数的对象
 * @returns {number|boolean} - 计数结果或false
 */
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
 * 清除表格
 * @param {string} tableid - 表格ID
 */
function clearTable(tableid) {
    var tableRef = document.getElementById(tableid);
    while (tableRef.rows.length > 0) {
        tableRef.deleteRow(0);
    }

    // wt - 清除表格区域
    if (typeof tablezone != 'undefined')
        tablezone.clear();
    if (typeof tableyear != 'undefined')
        tableyear.clear();
}

//===========================================
// 模块加载状态检查
//===========================================

// 标记初始化模块已加载
window.IVSOSD.initModuleLoaded = true;

console.log('✅ init.js 模块已加载');
