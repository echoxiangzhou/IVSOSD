/**
 * @filename: voyage-list.js
 * @description: 航次查询和列表管理模块
 * @version: 1.0
 * @date: 2025-01-01
 * @author: 系统重构
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

"use strict";

// 确保依赖的模块已加载
if (!window.IVSOSD || !window.IVSOSD.initModuleLoaded || !window.IVSOSD.uiControlsModuleLoaded) {
    throw new Error('voyage-list.js depends on init.js and ui-controls.js modules');
}

//===========================================
// 安全版本的AddAllRoute函数
//===========================================

/**
 * 添加全部航次 - 安全版本（带重试机制）
 * @param {number} retryCount - 当前重试次数
 */
function AddAllRoute(retryCount = 0) {
    const maxRetries = 3;
    const retryDelay = 1000; // 1秒
    
    
    // 显示加载中状态
    showLoadingState();
    
    try {
        // 确保影像图层管理器存在
        if (!window.imageryManager) {
            console.warn('⚠️ 影像图层管理器不存在，尝试初始化...');
            if (window.viewer && typeof window.initializeImageryManager === 'function') {
                window.initializeImageryManager(window.viewer);
            } else {
                console.error('❌ 无法初始化影像图层管理器');
                return OriginalAddAllRoute();
            }
        }
        
        // 执行前强制确保影像图层安全
        if (window.imageryManager) {
            window.imageryManager.forceRestoreBaseImageryLayer();
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
            // 设置DWR错误处理
            if (typeof dwr !== 'undefined' && dwr.engine) {
                dwr.engine.setErrorHandler(function(message, ex) {
                    console.error('DWR错误:', message, ex);
                    hideLoadingState();
                    showErrorMessage('DWR错误: ' + message);
                });
            }
            
            // 采用 test_db.html 中成功的DWR调用方式
            DatabaseOperationJS.QueryVoyageList(strSQLVoyAll, {
                callback: function(data) {
                    // 在回调中也要保护影像图层
                    if (window.imageryManager) {
                        window.imageryManager.forceRestoreBaseImageryLayer();
                    }
                    
                    // 隐藏加载状态
                    hideLoadingState();
                    
                    // 数据验证和处理
                    if (data && Array.isArray(data) && data.length > 0) {
                        callBackVoyageList(data);
                    } else {
                        console.error('❌ 航次数据为空或格式错误，请检查数据库连接和数据');
                        showErrorMessage('数据库连接失败或VOYAGE表中无数据');
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
                errorHandler: function(error) {
                    console.error('❌ DWR航次查询失败:', error);
                    hideLoadingState();
                    
                    // 添加详细的错误信息
                    if (error) {
                        console.error('错误详情:', {
                            message: error.message,
                            stack: error.stack,
                            type: typeof error,
                            errorObject: error
                        });
                    }
                    
                    // 错误时也要保护影像图层
                    if (window.imageryManager) {
                        window.imageryManager.forceRestoreBaseImageryLayer();
                    }
                    
                    // 检查是否需要重试
                    if (retryCount < maxRetries) {
                        showErrorMessage(`加载失败，正在重试... (${retryCount + 1}/${maxRetries})`);
                        
                        setTimeout(() => {
                            AddAllRoute(retryCount + 1);
                        }, retryDelay);
                    } else {
                        // 显示最终错误信息给用户
                        showErrorMessage(`
                            DWR调用失败: ${error.message || '未知错误'}<br>
                            请检查：<br>
                            1. 服务器是否运行<br>
                            2. 数据库连接是否正常 (192.168.101.38:1521:ORCL)<br>
                            3. DWR配置是否正确
                        `);
                    }
                    
                    // 尝试默认查询
                    try {
                        DatabaseOperationJS.QueryVoyageList('', {
                            callback: function(data) {
                                if (window.imageryManager) {
                                    window.imageryManager.forceRestoreBaseImageryLayer();
                                }
                                if (data && Array.isArray(data) && data.length > 0) {
                                    callBackVoyageList(data);
                                } else {
                                    console.error('❌ 默认查询也返回空数据');
                                }
                            },
                            errorHandler: function(error2) {
                                console.error('❌ 默认查询也失败:', error2);
                                if (window.imageryManager) {
                                    window.imageryManager.forceRestoreBaseImageryLayer();
                                }
                            }
                        });
                    } catch (retryError) {
                        console.error('❌ 重试查询时发生异常:', retryError);
                    }
                }
            });
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
 * 添加全部航次 - 原始版本（将被安全版本替代）
 */
function OriginalAddAllRoute() {
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
            DatabaseOperationJS.QueryVoyageList(strSQLVoyAll, {
                callback: function(data) {
                    callBackVoyageList(data);
                },
                errorHandler: function(error) {
                    console.error('❌ 原始航次数据查询失败:', error);
                    // Try with empty SQL to use default query
                    DatabaseOperationJS.QueryVoyageList('', {
                        callback: function(data) {
                            callBackVoyageList(data);
                        },
                        errorHandler: function(error2) {
                            console.error('❌ 默认查询也失败:', error2);
                            callBackVoyageList([]); // Call with empty array
                        }
                    });
                }
            });
        }
        
    } catch (e) {
        console.error('Exception calling voyage query methods:', e);
        callBackVoyageList([]); // Call with empty array
    }

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
    $('.sidebar-left').addClass('active');
    sideBarRight.addClass('active');
    var sideBarRightHeight = document.body.clientHeight;
    var tabContent2Height = document.body.clientHeight;
    $('.infoTabs-content').css('height', tabContent2Height - 36);
    $('.setting-outbox').addClass('active');
    $('.map2d').addClass('active');
    $('.map3d').addClass('active');
    $('.coorInfo').addClass('active');
}

//===========================================
// 加载状态管理
//===========================================

/**
 * 显示加载状态
 */
function showLoadingState() {
    var tbody = document.getElementById('tbodyVoyageList');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;"><img src="images/loading.gif" alt="加载中..." style="width: 20px; height: 20px;" /> 正在加载航次数据...</td></tr>';
    }
}

/**
 * 隐藏加载状态
 */
function hideLoadingState() {
    // 加载状态会被数据替换，这里可以做其他清理工作
}

/**
 * 显示错误信息
 */
function showErrorMessage(message) {
    var tbody = document.getElementById('tbodyVoyageList');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: #d9534f;">' + message + '</td></tr>';
    }
}

//===========================================
// 航次查询功能
//===========================================

/**
 * 航次查询
 */
function QueryRouteClick() {
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
    $('.sidebar-left').addClass('active');
    sideBarRight.addClass('active');
    var sideBarRightHeight = document.body.clientHeight;
    var tabContent2Height = document.body.clientHeight;
    $('.infoTabs-content').css('height', tabContent2Height - 36);
    $('.setting-outbox').addClass('active');
    $('.map2d').addClass('active');
    $('.map3d').addClass('active');
    $('.coorInfo').addClass('active');
}

// 绑定航次查询按钮事件
$('#SearchRoute1').click(function () {
    QueryRouteClick();
});

//===========================================
// 解析安全查询结果
//===========================================

/**
 * 解析安全查询返回的字符串结果
 * @param {string} resultString - 查询结果字符串
 * @returns {Array} 航次列表
 */
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

// 将函数暴露到全局命名空间
window.IVSOSD.AddAllRoute = AddAllRoute;
window.IVSOSD.OriginalAddAllRoute = OriginalAddAllRoute;
window.IVSOSD.QueryRouteClick = QueryRouteClick;
window.IVSOSD.parseSafeQueryResult = parseSafeQueryResult;
window.IVSOSD.showLoadingState = showLoadingState;
window.IVSOSD.hideLoadingState = hideLoadingState;
window.IVSOSD.showErrorMessage = showErrorMessage;

// 标记航次列表模块已加载
window.IVSOSD.voyageListModuleLoaded = true;

