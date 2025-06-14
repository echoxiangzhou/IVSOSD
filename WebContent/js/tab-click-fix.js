/**
 * 标签页点击修复
 * 确保标签页点击事件正常工作
 */

// 全局函数：切换到指定的标签页
window.switchToTab = function(tabId) {
    
    // 获取所有标签和内容
    const allTabs = document.querySelectorAll('.sub-tab');
    const allContents = document.querySelectorAll('.sub-content');
    
    // 移除所有active
    allTabs.forEach(tab => tab.classList.remove('active'));
    allContents.forEach(content => content.classList.remove('active'));
    
    // 根据标签ID激活对应的标签和内容
    let targetContentId = null;
    switch(tabId) {
        case 'voyage-query-tab':
            targetContentId = 'voyage-query-content';
            break;
        case 'voyage-info-tab':
            targetContentId = 'voyage-info-content';
            break;
        case 'station-info-tab':
            targetContentId = 'station-info-content';
            break;
    }
    
    // 激活标签
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // 激活内容
    const targetContent = document.getElementById(targetContentId);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
};

// 初始化函数
function initTabClicks() {
    
    // 获取所有标签
    const queryTab = document.getElementById('voyage-query-tab');
    const infoTab = document.getElementById('voyage-info-tab');
    const stationTab = document.getElementById('station-info-tab');
    
    // 绑定点击事件
    if (queryTab) {
        queryTab.style.cursor = 'pointer';
        queryTab.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            switchToTab('voyage-query-tab');
        };
    }
    
    if (infoTab) {
        infoTab.style.cursor = 'pointer';
        infoTab.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            switchToTab('voyage-info-tab');
        };
    }
    
    if (stationTab) {
        stationTab.style.cursor = 'pointer';
        stationTab.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            switchToTab('station-info-tab');
        };
    }
}

// 在多个时机尝试初始化
document.addEventListener('DOMContentLoaded', initTabClicks);
window.addEventListener('load', initTabClicks);
setTimeout(initTabClicks, 500);
setTimeout(initTabClicks, 1500);
setTimeout(initTabClicks, 3000);

// 导出函数供其他模块使用
window.initTabClicks = initTabClicks;

