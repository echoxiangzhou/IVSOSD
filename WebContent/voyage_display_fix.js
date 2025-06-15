/**
 * 航次显示修复脚本
 * 用于解决航次列表不显示的问题
 */

(function() {
    'use strict';
    
    console.log('===== 航次显示修复脚本开始执行 =====');
    
    // 修复1: 确保ctdInfoTable被定义
    if (typeof window.ctdInfoTable === 'undefined') {
        window.ctdInfoTable = [];
        console.log('✓ 已创建 ctdInfoTable');
    }
    
    // 修复2: 重写callBackVoyageList函数，添加更多错误处理
    const originalCallBackVoyageList = window.callBackVoyageList;
    
    window.callBackVoyageListFixed = function(voyageList) {
        console.log('[callBackVoyageListFixed] 接收到数据:', voyageList);
        
        try {
            // 调用原始函数
            if (originalCallBackVoyageList) {
                originalCallBackVoyageList(voyageList);
            }
        } catch (error) {
            console.error('原始callBackVoyageList执行出错:', error);
            
            // 备用显示逻辑
            displayVoyageListFallback(voyageList);
        }
        
        // 确保右侧面板显示
        ensureRightPanelVisible();
    };
    
    // 备用的航次显示函数
    function displayVoyageListFallback(voyageList) {
        console.log('使用备用显示逻辑...');
        
        if (!voyageList || !Array.isArray(voyageList)) {
            console.error('航次数据无效');
            return;
        }
        
        // 保存到全局变量
        window.voyageList2 = voyageList;
        
        // 获取表格body
        const tbody = document.getElementById('tbodyVoyageList');
        if (!tbody) {
            console.error('找不到 tbodyVoyageList');
            return;
        }
        
        // 清空表格
        tbody.innerHTML = '';
        
        // 计算分页
        const voyRowNumber = window.voyRowNumber || 20;
        const curPageNumber = window.curPageNumber || 1;
        const startIndex = (curPageNumber - 1) * voyRowNumber;
        const endIndex = Math.min(startIndex + voyRowNumber, voyageList.length);
        
        console.log(`显示第 ${startIndex + 1} 到 ${endIndex} 条记录（共 ${voyageList.length} 条）`);
        
        // 创建表格行
        for (let i = startIndex; i < endIndex; i++) {
            const voyage = voyageList[i];
            const row = createVoyageRowSimple(i + 1, voyage);
            tbody.appendChild(row);
        }
        
        console.log('✓ 航次列表显示完成');
    }
    
    // 创建简单的航次行
    function createVoyageRowSimple(index, voyage) {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        
        // 序号
        const td1 = document.createElement('td');
        td1.textContent = index;
        td1.style.width = '48px';
        
        // 航次名称
        const td2 = document.createElement('td');
        const name = voyage.name || voyage.NAME || '未知航次';
        td2.textContent = name.length > 16 ? name.substring(0, 16) + '...' : name;
        td2.title = name;
        
        // 海域
        const td3 = document.createElement('td');
        const seaArea = voyage.seaArea || voyage.SEA_AREA || '未知海域';
        td3.textContent = seaArea.length > 10 ? seaArea.substring(0, 10) + '...' : seaArea;
        td3.style.width = '80px';
        
        // 开始日期
        const td4 = document.createElement('td');
        const vStart = voyage.vStart || voyage.VStart || voyage.V_START || '';
        td4.textContent = vStart ? vStart.substring(0, 10) : '';
        td4.style.width = '100px';
        
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        
        // 添加点击事件
        tr.onclick = function() {
            console.log('点击航次:', voyage);
            
            // 高亮选中行
            const allRows = tbody.getElementsByTagName('tr');
            for (let row of allRows) {
                row.style.backgroundColor = '';
            }
            tr.style.backgroundColor = '#e3f2fd';
            
            // 触发航次选择事件
            if (window.DatabaseOperationJS) {
                const voyageId = voyage.ID || voyage.id;
                const strSQLVoyInfo = "select * from VOYAGE where ID=?";
                DatabaseOperationJS.QueryVoyageInfo(strSQLVoyInfo, voyageId, window.callBackVoyageInfo);
                
                const strSQLStaList = "select * from STATION where VOYAGE_ID=? order by ID";
                DatabaseOperationJS.QueryStationList(strSQLStaList, voyageId, window.callBackStationList);
            }
        };
        
        return tr;
    }
    
    // 确保右侧面板可见
    function ensureRightPanelVisible() {
        const sidebarRight = document.getElementById('sidebar-right');
        if (sidebarRight) {
            sidebarRight.style.display = 'block';
            sidebarRight.classList.add('active');
            
            // 确保有正确的宽度
            if (!sidebarRight.style.width || sidebarRight.style.width === '0px') {
                sidebarRight.style.width = '400px';
            }
            
            console.log('✓ 右侧面板已显示');
        }
        
        // 确保航次标签页是活动的
        const tab1 = document.getElementById('sidebar-tab1');
        if (tab1 && !tab1.classList.contains('active')) {
            tab1.classList.add('active');
        }
        
        const content1 = document.getElementById('sidebar-content1');
        if (content1 && !content1.classList.contains('active')) {
            content1.classList.add('active');
            content1.classList.add('in');
        }
    }
    
    // 测试函数
    window.testVoyageDisplay = function() {
        console.log('===== 测试航次显示 =====');
        
        // 检查元素
        console.log('右侧面板:', document.getElementById('sidebar-right'));
        console.log('航次表格:', document.getElementById('tbodyVoyageList'));
        console.log('航次数据:', window.voyageList2);
        
        // 如果有数据，尝试重新显示
        if (window.voyageList2 && window.voyageList2.length > 0) {
            displayVoyageListFallback(window.voyageList2);
            ensureRightPanelVisible();
        }
    };
    
    console.log('===== 航次显示修复脚本加载完成 =====');
    console.log('可以使用 testVoyageDisplay() 函数进行测试');
    
})();