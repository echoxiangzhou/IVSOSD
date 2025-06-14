/**
 * @filename: voyage-callbacks.js
 * @description: 航次回调和分页管理模块
 * @version: 1.0
 * @date: 2025-01-01
 * @author: 系统重构
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

"use strict";

// 确保依赖的模块已加载
if (!window.IVSOSD || !window.IVSOSD.voyageListModuleLoaded) {
    throw new Error('voyage-callbacks.js depends on voyage-list.js module');
}

//===========================================
// 航次列表回调处理
//===========================================

/**
 * 航次列表回调函数
 * @param {Array} voyageList - 航次列表数据
 */
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

    // 设置分页按钮状态
    updatePaginationButtons(sumPageNumber);

    document.getElementById("tblVoyageList").rows[0].cells[0].style.width = 48 + "px";
    document.getElementById("tblVoyageList").rows[0].cells[2].style.width = 80 + "px";
    document.getElementById("tblVoyageList").rows[0].cells[3].style.width = 100 + "px";

    var startIndex = (curPageNumber - 1) * voyRowNumber;
    var endIndex = ( 1 + curPageNumber - 1) * voyRowNumber;
    if (curPageNumber == sumPageNumber) {
        endIndex = (curPageNumber - 1) * voyRowNumber + voyageList2.length - (sumPageNumber - 1) * voyRowNumber;
    }
    
    // 首先添加所有航次轨迹
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

    // 然后显示当前页的航次列表
    for (var i = startIndex; i < endIndex; i++) {
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

        voyRows = [];
        voyRows.push({
            rowid: (i + 1).toString(),
            voyid: voyageId,
            name: nameSubstr,
            seaArea: seaAreaSubstr,
            VStart: startDateStr
        });

        var row = createVoyageRow(i + 1, nameSubstr, seaAreaSubstr, startDateStr, voyageName, seaAreaName, startIndex);
        voyageTrajPathList.push(trajPath);

        var obody = document.getElementById("tbodyVoyageList");
        obody.appendChild(row);
    }
};

//===========================================
// 航次表格行创建
//===========================================

/**
 * 创建航次表格行
 * @param {number} rowNumber - 行号
 * @param {string} nameSubstr - 航次名称缩写
 * @param {string} seaAreaSubstr - 海域缩写
 * @param {string} startDateStr - 开始日期
 * @param {string} voyageName - 完整航次名称
 * @param {string} seaAreaName - 完整海域名称
 * @param {number} startIndex - 起始索引
 * @returns {HTMLTableRowElement} 表格行元素
 */
function createVoyageRow(rowNumber, nameSubstr, seaAreaSubstr, startDateStr, voyageName, seaAreaName, startIndex) {
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    var cell1 = document.createElement("td");
    var cell2 = document.createElement("td");
    var cell3 = document.createElement("td");
    
    cell.appendChild(document.createTextNode(rowNumber.toString()));
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

    row.onclick = function () {
        clearTable("tbodyStationList");
        
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
    
    return row;
}

//===========================================
// 分页控制函数
//===========================================

/**
 * 更新分页按钮状态
 * @param {number} sumPageNumber - 总页数
 */
function updatePaginationButtons(sumPageNumber) {
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
}

/**
 * 航次列表下一页
 */
function voyPageNext() {
    var sumPageNumber = Math.ceil(voyageList2.length / voyRowNumber);
    if (curPageNumber < sumPageNumber) {
        curPageNumber++;
    }

    updatePaginationButtons(sumPageNumber);
    
    var startIndex = (curPageNumber - 1) * voyRowNumber;
    var endIndex = ( 1 + curPageNumber - 1) * voyRowNumber;

    if (curPageNumber == sumPageNumber) {
        endIndex = (curPageNumber - 1) * voyRowNumber + voyageList2.length - (sumPageNumber - 1) * voyRowNumber;
    }

    // 重新添加轨迹
    for (var voyIndex = 0; voyIndex < voyageList2.length; voyIndex++) {
        AddRouteCZML2(voyageList2[voyIndex].trajPath, voyageList2[voyIndex].ID);
    }

    clearTable("tbodyVoyageList");
    
    for (var i = startIndex; i < endIndex; i++) {
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

        var row = createVoyageRowForPagination(i + 1, nameSubstr, seaAreaSubstr, voyageList2[i].VStart.substring(0, 10), voyageList2[i].name, voyageList2[i].seaArea, startIndex);
        voyageTrajPathList.push(voyageList2[i].trajPath);

        var obody = document.getElementById("tbodyVoyageList");
        obody.appendChild(row);
    }
}

/**
 * 航次列表上一页
 */
function voyPagePrevious() {
    var sumPageNumber = Math.ceil(voyageList2.length / voyRowNumber);
    if (curPageNumber > 1) {
        curPageNumber--;
    }

    updatePaginationButtons(sumPageNumber);
    
    var startIndex = (curPageNumber - 1) * voyRowNumber;
    var endIndex = ( 1 + curPageNumber - 1) * voyRowNumber;

    if (curPageNumber == sumPageNumber) {
        endIndex = (curPageNumber - 1) * voyRowNumber + voyageList2.length - (sumPageNumber - 1) * voyRowNumber;
    }

    // 重新添加轨迹
    for (var voyIndex = 0; voyIndex < voyageList2.length; voyIndex++) {
        AddRouteCZML2(voyageList2[voyIndex].trajPath, voyageList2[voyIndex].ID);
    }

    clearTable("tbodyStationList");
    
    for (var i = startIndex; i < endIndex; i++) {
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

        var row = createVoyageRowForPagination(i + 1, nameSubstr, seaAreaSubstr, voyageList2[i].VStart.substring(0, 10), voyageList2[i].name, voyageList2[i].seaArea, startIndex);

        var obody = document.getElementById("tbodyVoyageList");
        obody.appendChild(row);
    }
}

/**
 * 为分页创建航次表格行
 */
function createVoyageRowForPagination(rowNumber, nameSubstr, seaAreaSubstr, startDateStr, voyageName, seaAreaName, startIndex) {
    var row = document.createElement("tr");
    var cell = document.createElement("td");
    var cell1 = document.createElement("td");
    var cell2 = document.createElement("td");
    var cell3 = document.createElement("td");
    
    cell.appendChild(document.createTextNode(rowNumber.toString()));
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

    row.onclick = function () {
        clearTable("tbodyStationList");
        
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
    
    return row;
}

//===========================================
// 辅助功能
//===========================================

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

// 将函数暴露到全局命名空间
window.IVSOSD.callBackVoyageList = callBackVoyageList;
window.IVSOSD.voyPageNext = voyPageNext;
window.IVSOSD.voyPagePrevious = voyPagePrevious;
window.IVSOSD.updatePaginationButtons = updatePaginationButtons;
window.IVSOSD.setUIStateSafely = setUIStateSafely;
window.IVSOSD.showVoyagePanel = showVoyagePanel;

// 标记航次回调模块已加载
window.IVSOSD.voyageCallbacksModuleLoaded = true;

console.log('✅ voyage-callbacks.js 模块已加载');
