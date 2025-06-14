/**
 * 面板切换辅助函数
 * 用于处理新的面板结构的标签页切换
 */

// 切换到航次信息标签页
window.switchToVoyageInfoTab = function() {
    
    // 使用新的选择器
    const queryTab = document.getElementById('voyage-query-tab');
    const infoTab = document.getElementById('voyage-info-tab');
    const stationTab = document.getElementById('station-info-tab');
    
    const queryContent = document.getElementById('voyage-query-content');
    const infoContent = document.getElementById('voyage-info-content');
    const stationContent = document.getElementById('station-info-content');
    
    if (queryTab && infoTab && queryContent && infoContent) {
        // 移除所有active类
        queryTab.classList.remove('active');
        stationTab.classList.remove('active');
        queryContent.classList.remove('active');
        stationContent.classList.remove('active');
        
        // 激活航次信息标签
        infoTab.classList.add('active');
        infoContent.classList.add('active');
        
    } else {
        console.error('❌ 找不到标签页元素');
    }
};

// 切换到站点信息标签页
window.switchToStationInfoTab = function() {
    
    const queryTab = document.getElementById('voyage-query-tab');
    const infoTab = document.getElementById('voyage-info-tab');
    const stationTab = document.getElementById('station-info-tab');
    
    const queryContent = document.getElementById('voyage-query-content');
    const infoContent = document.getElementById('voyage-info-content');
    const stationContent = document.getElementById('station-info-content');
    
    if (queryTab && stationTab && queryContent && stationContent) {
        // 移除所有active类
        queryTab.classList.remove('active');
        infoTab.classList.remove('active');
        queryContent.classList.remove('active');
        infoContent.classList.remove('active');
        
        // 激活站点信息标签
        stationTab.classList.add('active');
        stationContent.classList.add('active');
        
    } else {
        console.error('❌ 找不到标签页元素');
    }
};

// 切换到航次查询标签页
window.switchToVoyageQueryTab = function() {
    
    const queryTab = document.getElementById('voyage-query-tab');
    const infoTab = document.getElementById('voyage-info-tab');
    const stationTab = document.getElementById('station-info-tab');
    
    const queryContent = document.getElementById('voyage-query-content');
    const infoContent = document.getElementById('voyage-info-content');
    const stationContent = document.getElementById('station-info-content');
    
    if (queryTab && queryContent) {
        // 移除所有active类
        infoTab.classList.remove('active');
        stationTab.classList.remove('active');
        infoContent.classList.remove('active');
        stationContent.classList.remove('active');
        
        // 激活查询标签
        queryTab.classList.add('active');
        queryContent.classList.add('active');
        
    }
};

// 绑定标签页点击事件的函数
function bindTabClickEvents() {
    
    const tabs = document.querySelectorAll('.sub-tab');
    
    tabs.forEach(tab => {
        // 移除已有的事件监听器（如果有的话）
        tab.removeEventListener('click', tabClickHandler);
        // 添加新的事件监听器
        tab.addEventListener('click', tabClickHandler);
    });
}

// 标签页点击处理函数
function tabClickHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const targetId = this.getAttribute('data-target');
    
    // 移除所有active类
    document.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.sub-content').forEach(c => c.classList.remove('active'));
    
    // 激活当前标签和内容
    this.classList.add('active');
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
        targetContent.classList.add('active');
    } else {
        console.error('❌ 找不到目标内容元素:', targetId);
    }
}

// 在多个时机尝试绑定事件
document.addEventListener('DOMContentLoaded', bindTabClickEvents);

// 延迟执行，确保其他脚本已加载
setTimeout(bindTabClickEvents, 1000);

// 导出绑定函数，以便其他模块可以调用
window.bindTabClickEvents = bindTabClickEvents;

