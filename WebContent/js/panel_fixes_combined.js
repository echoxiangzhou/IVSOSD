/**
 * @filename: panel_fixes_combined.js
 * @description: 综合面板修复方案 - 整合所有面板相关修复功能
 * @version: 2.0
 * @date: 2024-12-13
 * @author: Claude Code
 * CopyRight (c) 2024 IVSOSD Project. All rights reserved.
 * 
 * 功能整合：
 * 1. 面板开启修复 (来自 panel_opener_fix.js)
 * 2. 地球移动防护 (来自 fix_earth_shift.js)
 * 3. content-area position 修复 (来自 ultimate_panel_fix.js)
 * 4. 面板内容强制修复 (来自 force_panel_fix.js)
 * 5. 面板背景色修复 (来自 panel_background_fix.js)
 */

/**
 * 综合面板修复管理器
 */
class CombinedPanelFixManager {
    constructor() {
        this.rightPanelVisible = false;
        this.leftPanelVisible = false;
        this.observers = {
            earth: null,
            contentArea: null,
            panel: null
        };
        
        this.init();
    }

    /**
     * 初始化所有修复
     */
    init() {
        
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAllFixes();
            });
        } else {
            this.setupAllFixes();
        }
    }

    /**
     * 设置所有修复
     */
    setupAllFixes() {
        // 1. 面板样式综合修复（先添加样式）
        this.addComprehensiveStyles();
        
        // 2. 面板开启功能修复
        this.createRightPanelOpener();
        this.fixNavigationButtons();
        this.bindKeyboardShortcuts();
        
        // 3. 地球移动防护
        this.preventEarthShift();
        this.setupEarthObserver();
        
        // 4. content-area position 监控
        this.fixContentAreaPosition();
        this.startContentAreaObserver();
        
    }

    /**
     * ==================== 面板开启功能 ====================
     * 来自 panel_opener_fix.js
     */
    
    /**
     * 创建右侧面板开启按钮
     */
    createRightPanelOpener() {
        // 检查是否已存在开启按钮
        if (document.getElementById('right-panel-opener')) {
            return;
        }
        
        // 创建右侧面板的关闭按钮（黄色竖条改为箭头）
        this.createRightPanelCloser();

        // 创建开启按钮
        const opener = document.createElement('div');
        opener.id = 'right-panel-opener';
        opener.className = 'panel-opener right-panel-opener';
        opener.innerHTML = `
            <div class="opener-arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 4L8 10L12 16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="opener-tooltip">打开右侧面板</div>
        `;

        // 设置样式
        opener.style.cssText = `
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            width: 30px;
            height: 60px;
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            border-radius: 15px 0 0 15px;
            cursor: pointer;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            opacity: 0.8;
        `;

        // 悬停效果
        opener.addEventListener('mouseenter', () => {
            opener.style.width = '35px';
            opener.style.opacity = '1';
            opener.style.boxShadow = '-4px 0 15px rgba(0, 0, 0, 0.3)';
        });

        opener.addEventListener('mouseleave', () => {
            opener.style.width = '30px';
            opener.style.opacity = '0.8';
            opener.style.boxShadow = '-2px 0 10px rgba(0, 0, 0, 0.2)';
        });

        // 点击事件
        opener.addEventListener('click', () => {
            this.toggleRightPanel();
        });

        // 添加到页面
        document.body.appendChild(opener);

    }
    
    /**
     * 创建右侧面板关闭按钮（替代原来的黄色竖条）
     */
    createRightPanelCloser() {
        // 检查是否已存在关闭按钮
        if (document.getElementById('right-panel-closer')) {
            return;
        }
        
        // 创建关闭按钮（放在右侧面板左边缘）
        const closer = document.createElement('div');
        closer.id = 'right-panel-closer';
        closer.className = 'panel-closer';
        closer.innerHTML = `
            <div class="closer-arrow">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M8 4L12 10L8 16" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        `;
        
        // 设置样式（固定在右侧面板左边缘）
        closer.style.cssText = `
            position: fixed;
            top: 50%;
            right: 450px; /* 初始位置在面板左边缘 */
            transform: translateY(-50%);
            width: 30px;
            height: 60px;
            background: #FFD700; /* 黄色背景 */
            border-radius: 15px 0 0 15px;
            cursor: pointer;
            z-index: 10001;
            display: none; /* 初始隐藏 */
            align-items: center;
            justify-content: center;
            box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        `;
        
        // 点击事件 - 关闭右侧面板
        closer.addEventListener('click', () => {
            this.hideRightPanel();
        });
        
        // 添加到页面
        document.body.appendChild(closer);
        
    }

    /**
     * 修复导航按钮
     */
    fixNavigationButtons() {
        const navigationButtons = [
            { element: '.nav-button1', handler: () => this.openVoyagePanel() },
            { element: '.nav-button2', handler: () => this.openProfilePanel() },
            { element: '.nav-button3', handler: () => this.openTerrainPanel() },
            { element: '.nav-button4', handler: () => this.openCurrentPanel() }
        ];

        navigationButtons.forEach(({ element, handler }) => {
            const btn = document.querySelector(element);
            if (btn) {
                // 移除原有事件
                btn.onclick = null;
                
                // 添加新的事件监听器
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handler();
                });

            }
        });
    }

    /**
     * 绑定键盘快捷键
     */
    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + Shift + R: 切换右侧面板
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                this.toggleRightPanel();
            }
            
            // Escape: 关闭所有面板
            if (e.key === 'Escape') {
                this.hideAllPanels();
            }
        });

    }

    /**
     * 切换右侧面板
     */
    toggleRightPanel() {
        if (this.rightPanelVisible) {
            this.hideRightPanel();
        } else {
            this.showRightPanel();
        }
    }

    /**
     * 显示右侧面板
     */
    showRightPanel() {
        const panel = document.getElementById('sidebar-right');
        const opener = document.getElementById('right-panel-opener');
        const closer = document.getElementById('right-panel-closer');
        const mapContainer = document.getElementById('vmap');

        if (panel) {
            panel.classList.add('active');
            this.rightPanelVisible = true;

            // 隐藏开启按钮
            if (opener) {
                opener.classList.add('hidden');
            }
            
            // 显示关闭按钮并调整位置
            if (closer) {
                closer.style.display = 'flex';
                closer.style.right = '450px'; // 面板宽度
            }

            // 调整地图容器
            if (mapContainer) {
                mapContainer.classList.add('panel-open');
            }

            // 修复面板样式和内容
            this.applyAllPanelFixes();

            // 尝试使用右侧面板管理器
            if (window.rightPanelManager && typeof window.rightPanelManager.showPanel === 'function') {
                window.rightPanelManager.showPanel();
            }

        }
    }

    /**
     * 隐藏右侧面板
     */
    hideRightPanel() {
        const panel = document.getElementById('sidebar-right');
        const opener = document.getElementById('right-panel-opener');
        const closer = document.getElementById('right-panel-closer');
        const mapContainer = document.getElementById('vmap');

        if (panel) {
            panel.classList.remove('active');
            this.rightPanelVisible = false;

            // 显示开启按钮
            if (opener) {
                opener.classList.remove('hidden');
            }
            
            // 隐藏关闭按钮
            if (closer) {
                closer.style.display = 'none';
            }

            // 恢复地图容器
            if (mapContainer) {
                mapContainer.classList.remove('panel-open');
            }

            // 尝试使用右侧面板管理器
            if (window.rightPanelManager && typeof window.rightPanelManager.hidePanel === 'function') {
                window.rightPanelManager.hidePanel();
            }

        }
    }

    /**
     * 打开航次面板
     */
    openVoyagePanel() {
        
        this.showRightPanel();
        
        // 切换到航次标签
        setTimeout(() => {
            const voyageTab = document.getElementById('sidebar-tab1');
            if (voyageTab) {
                voyageTab.click();
            }
            
            // 尝试使用导航管理器
            if (window.navigationManager && typeof window.navigationManager.navigateToVoyage === 'function') {
                window.navigationManager.navigateToVoyage();
            }
        }, 100);
    }

    /**
     * 打开剖面面板
     */
    openProfilePanel() {
        
        this.showRightPanel();
        
        // 切换到剖面标签
        setTimeout(() => {
            const profileTab = document.getElementById('sidebar-tab2');
            if (profileTab) {
                profileTab.click();
            }
            
            // 尝试使用导航管理器
            if (window.navigationManager && typeof window.navigationManager.navigateToProfile === 'function') {
                window.navigationManager.navigateToProfile();
            }
        }, 100);
    }

    /**
     * 打开地形面板
     */
    openTerrainPanel() {
        
        this.showRightPanel();
        
        // 切换到地形标签
        setTimeout(() => {
            const terrainTab = document.getElementById('sidebar-tab3');
            if (terrainTab) {
                terrainTab.click();
            }
            
            // 尝试使用导航管理器
            if (window.navigationManager && typeof window.navigationManager.navigateToTerrain === 'function') {
                window.navigationManager.navigateToTerrain();
            }
        }, 100);
    }

    /**
     * 打开洋流面板
     */
    openCurrentPanel() {
        
        this.showRightPanel();
        
        // 切换到洋流标签
        setTimeout(() => {
            const currentTab = document.getElementById('sidebar-tab4');
            if (currentTab) {
                currentTab.click();
            }
            
            // 尝试使用导航管理器
            if (window.navigationManager && typeof window.navigationManager.navigateToCurrent === 'function') {
                window.navigationManager.navigateToCurrent();
            }
        }, 100);
    }

    /**
     * 隐藏所有面板
     */
    hideAllPanels() {
        this.hideRightPanel();
        
        // 隐藏左侧面板
        const leftPanel = document.getElementById('sidebar-left');
        if (leftPanel) {
            leftPanel.classList.remove('active');
        }

    }

    /**
     * ==================== 地球移动防护 ====================
     * 来自 fix_earth_shift.js
     */
    
    /**
     * 防止地球容器被移动
     */
    preventEarthShift() {
        // 获取地球容器
        const earthContainer = document.querySelector('.earthContainer');
        const map2D = document.getElementById('2D');
        const map3D = document.getElementById('3D');
        
        if (earthContainer) {
            // 确保不会有transform
            earthContainer.style.transform = 'none';
            earthContainer.style.transition = 'none';
            earthContainer.style.position = 'relative';
            earthContainer.style.left = '0';
            earthContainer.style.right = '0';
        }
        
        // 防止2D/3D按钮移动
        if (map2D) {
            map2D.classList.remove('active');
            map2D.style.transform = 'none';
        }
        
        if (map3D) {
            map3D.classList.remove('active');
            map3D.style.transform = 'none';
        }
    }
    
    /**
     * 设置地球移动监控器
     */
    setupEarthObserver() {
        const earthContainer = document.querySelector('.earthContainer');
        const map2D = document.getElementById('2D');
        const map3D = document.getElementById('3D');
        
        const config = { attributes: true, attributeFilter: ['class', 'style'] };
        
        this.observers.earth = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active') || 
                    mutation.target.style.transform !== 'none') {
                    this.preventEarthShift();
                }
            });
        });
        
        if (earthContainer) this.observers.earth.observe(earthContainer, config);
        if (map2D) this.observers.earth.observe(map2D, config);
        if (map3D) this.observers.earth.observe(map3D, config);
    }

    /**
     * ==================== Content Area Position 修复 ====================
     * 来自 ultimate_panel_fix.js
     */
    
    /**
     * 修复 content-area 的 position 属性
     */
    fixContentAreaPosition() {
        const contentArea = document.querySelector('#sidebar-right .content-area');
        if (!contentArea) return;
        
        const currentPosition = window.getComputedStyle(contentArea).position;
        if (currentPosition !== 'relative') {
            
            // 保存现有样式
            const currentStyle = contentArea.getAttribute('style') || '';
            
            // 确保 position: relative
            if (!currentStyle.includes('position')) {
                contentArea.style.position = 'relative';
            } else {
                // 替换现有的 position 值
                contentArea.setAttribute('style', 
                    currentStyle.replace(/position:\s*\w+\s*(!important)?;?/gi, '') + 
                    ' position: relative !important;'
                );
            }
        }
    }
    
    /**
     * 监视 content-area 的样式变化
     */
    startContentAreaObserver() {
        const contentArea = document.querySelector('#sidebar-right .content-area');
        if (!contentArea) return;
        
        if (this.observers.contentArea) this.observers.contentArea.disconnect();
        
        this.observers.contentArea = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const position = window.getComputedStyle(contentArea).position;
                    if (position !== 'relative') {
                        this.fixContentAreaPosition();
                    }
                }
            });
        });
        
        this.observers.contentArea.observe(contentArea, {
            attributes: true,
            attributeFilter: ['style']
        });
    }

    /**
     * ==================== 面板内容和背景修复 ====================
     * 来自 force_panel_fix.js 和 panel_background_fix.js
     */
    
    /**
     * 应用所有面板修复
     */
    applyAllPanelFixes() {
        // 执行所有修复
        this.forcePanelContentFix();
        this.forceWhiteBackground();
        this.fixContentAreaPosition();
        this.preventEarthShift();
        
        // 延迟再次执行确保生效
        [100, 300, 500].forEach(delay => {
            setTimeout(() => {
                this.forcePanelContentFix();
                this.forceWhiteBackground();
                this.fixContentAreaPosition();
            }, delay);
        });
    }
    
    /**
     * 强制修复面板内容显示
     */
    forcePanelContentFix() {
        
        // 1. 获取所有关键元素
        const panel = document.getElementById('sidebar-right');
        const contentArea = panel ? panel.querySelector('.content-area') : null;
        const voyageContent = document.getElementById('voyage-content');
        const queryContent = document.getElementById('voyage-query-content');
        
        if (!panel || !contentArea) {
            console.error('❌ 找不到必要的面板元素');
            return;
        }
        
        // 2. 强制设置 content-area 的样式
        contentArea.style.cssText = `
            flex: 1 !important;
            background-color: #ffffff !important;
            background: #ffffff !important;
            position: relative !important;
            overflow: hidden !important;
            width: 100% !important;
            height: 100% !important;
        `;
        
        // 3. 修复 voyage-content 样式
        if (voyageContent) {
            voyageContent.style.cssText = `
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                background-color: #ffffff !important;
                background: #ffffff !important;
                visibility: visible !important;
                opacity: 1 !important;
                z-index: 1 !important;
            `;
        }
        
        // 4. 修复查询内容区域
        if (queryContent) {
            queryContent.style.cssText = `
                display: block !important;
                flex: 1 !important;
                padding: 15px !important;
                background-color: #ffffff !important;
                background: #ffffff !important;
                visibility: visible !important;
                opacity: 1 !important;
                overflow-y: auto !important;
            `;
        }
        
        // 5. 确保子标签页显示
        const subTabs = panel.querySelector('.sub-tabs');
        if (subTabs) {
            subTabs.style.cssText = `
                display: flex !important;
                background-color: #f5f5f5 !important;
                border-bottom: 1px solid #ddd !important;
                min-height: 40px !important;
            `;
        }
        
        // 6. 修复表格容器
        const tableContainer = panel.querySelector('.table-container');
        if (tableContainer) {
            tableContainer.style.cssText = `
                width: 100% !important;
                overflow-x: auto !important;
                background-color: #ffffff !important;
            `;
        }
        
    }
    
    /**
     * 强制设置白色背景
     */
    forceWhiteBackground() {
        
        const panel = document.getElementById('sidebar-right');
        if (panel) {
            // 移除所有可能的内联样式
            panel.removeAttribute('style');
            
            // 重新设置正确的样式
            panel.style.cssText = `
                position: fixed !important;
                top: 125px !important;
                right: ${panel.classList.contains('active') ? '0px' : '-450px'} !important;
                width: 450px !important;
                height: calc(100vh - 125px) !important;
                background-color: #ffffff !important;
                background: #ffffff !important;
                background-image: none !important;
                border-left: 2px solid #ddd !important;
                z-index: 9999 !important;
                display: flex !important;
                flex-direction: column !important;
                transform: none !important;
                transition: right 0.3s ease !important;
                box-shadow: -5px 0 15px rgba(0,0,0,0.3) !important;
                overflow: hidden !important;
            `;
            
            // 设置所有子元素背景
            const contentArea = panel.querySelector('.content-area');
            if (contentArea) {
                contentArea.style.backgroundColor = '#ffffff !important';
                contentArea.style.background = '#ffffff !important';
                contentArea.style.backgroundImage = 'none !important';
            }
            
            // 处理所有内容面板
            const allPanels = panel.querySelectorAll('.content-panel, .sub-content, .content-section');
            allPanels.forEach(elem => {
                elem.style.backgroundColor = '#ffffff !important';
                elem.style.background = '#ffffff !important';
                elem.style.backgroundImage = 'none !important';
            });
            
            // 特别处理航次相关内容
            const voyageElements = [
                'voyage-content',
                'voyage-query-content', 
                'voyage-info-content',
                'station-info-content'
            ];
            
            voyageElements.forEach(id => {
                const elem = document.getElementById(id);
                if (elem) {
                    elem.style.backgroundColor = '#ffffff !important';
                    elem.style.background = '#ffffff !important';
                    elem.style.backgroundImage = 'none !important';
                    
                    // 如果是active的子内容，确保显示
                    if (elem.classList.contains('active') || id === 'voyage-query-content') {
                        elem.style.display = 'block !important';
                    }
                }
            });
            
            // 处理表格
            const tables = panel.querySelectorAll('.data-table, .table-container');
            tables.forEach(table => {
                table.style.backgroundColor = '#ffffff !important';
                table.style.background = '#ffffff !important';
            });
            
            // 处理表格单元格
            const tableCells = panel.querySelectorAll('td, th');
            tableCells.forEach(cell => {
                if (!cell.closest('.section-header')) {
                    cell.style.backgroundColor = 'transparent !important';
                }
            });
            
            // 确保文字可见
            const textElements = panel.querySelectorAll('p, span, div, td, .info-value, .info-label');
            textElements.forEach(elem => {
                if (!elem.closest('.section-header') && !elem.closest('.sub-tab.active')) {
                    elem.style.color = '#212529 !important';
                }
            });
            
        }
    }

    /**
     * ==================== 样式管理 ====================
     */
    
    /**
     * 添加综合样式表
     */
    addComprehensiveStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 确保右侧面板可见性 */
            .sidebar {
                position: fixed !important;
                top: 72px !important;
                right: -450px !important;
                width: 450px !important;
                height: calc(100vh - 72px) !important;
                background-color: #f8f9fa !important;
                border-left: 2px solid #3498db !important;
                transition: right 0.3s ease !important;
                z-index: 9999 !important;
                overflow-y: auto !important;
                box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1) !important;
            }

            .sidebar.active {
                right: 0 !important;
            }

            /* 右侧面板开启按钮工具提示 */
            .panel-opener .opener-tooltip {
                position: absolute;
                right: 40px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .panel-opener:hover .opener-tooltip {
                opacity: 1;
            }

            /* 确保地图容器不被遮挡 */
            .vmap {
                transition: width 0.3s ease, right 0.3s ease !important;
            }

            /* 隐藏开启按钮当面板打开时 */
            .right-panel-opener.hidden {
                opacity: 0 !important;
                pointer-events: none !important;
            }
            
            /* 右侧面板关闭按钮样式 */
            #right-panel-closer {
                transition: right 0.3s ease !important;
            }
            
            /* 当面板活动时，关闭按钮跟随面板移动 */
            #sidebar-right.active ~ #right-panel-closer,
            body:has(#sidebar-right.active) #right-panel-closer {
                right: 450px !important;
            }

            /* 导航按钮增强 */
            .nav-button1, .nav-button2, .nav-button3, .nav-button4 {
                cursor: pointer !important;
                transition: all 0.2s ease !important;
            }

            .nav-button1:hover, .nav-button2:hover, .nav-button3:hover, .nav-button4:hover {
                transform: scale(1.05) !important;
                filter: brightness(1.1) !important;
            }

            .nav-button1:active, .nav-button2:active, .nav-button3:active, .nav-button4:active {
                transform: scale(0.95) !important;
            }
            
            /* 确保 content-area 正确定位 */
            #sidebar-right .content-area {
                position: relative !important;
            }
            
            /* 确保面板背景始终为白色 */
            #sidebar-right,
            #sidebar-right .content-area,
            #sidebar-right .content-panel,
            #sidebar-right .sub-content {
                background-color: #ffffff !important;
                background: #ffffff !important;
                background-image: none !important;
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * 获取面板状态
     */
    getPanelStatus() {
        return {
            rightPanel: this.rightPanelVisible,
            leftPanel: this.leftPanelVisible
        };
    }
}

/**
 * ==================== 全局初始化 ====================
 */

// 全局变量
let combinedPanelFixManager = null;

/**
 * 初始化综合面板修复管理器
 */
function initializeCombinedPanelFix() {
    if (combinedPanelFixManager) {
        return combinedPanelFixManager;
    }
    
    combinedPanelFixManager = new CombinedPanelFixManager();
    
    // 将管理器绑定到全局作用域
    window.combinedPanelFixManager = combinedPanelFixManager;
    
    return combinedPanelFixManager;
}

// 立即初始化
initializeCombinedPanelFix();

/**
 * ==================== 兼容性函数 ====================
 * 确保原有的函数能正常工作
 */

// 覆盖原有的 openVoyagePanel 函数
const originalOpenVoyagePanel = window.openVoyagePanel;
window.openVoyagePanel = function() {
    
    // 使用综合修复管理器
    if (combinedPanelFixManager) {
        combinedPanelFixManager.openVoyagePanel();
    } else {
        // 如果管理器不存在，调用原函数
        if (typeof originalOpenVoyagePanel === 'function') {
            originalOpenVoyagePanel.apply(this, arguments);
        }
    }
};

// 兼容性函数
window.hanciclick = function() {
    if (combinedPanelFixManager) {
        combinedPanelFixManager.openVoyagePanel();
    }
};

window.poumianclick = function() {
    if (combinedPanelFixManager) {
        combinedPanelFixManager.openProfilePanel();
    }
};

window.dixingclick = function() {
    if (combinedPanelFixManager) {
        combinedPanelFixManager.openTerrainPanel();
    }
};

window.yangliuclick = function() {
    if (combinedPanelFixManager) {
        combinedPanelFixManager.openCurrentPanel();
    }
};

// 监控 hanciclick 函数
if (typeof window.hanciclick !== 'undefined') {
    const originalHanciclick = window.hanciclick;
    window.hanciclick = function() {
        
        // 调用原函数
        if (typeof originalHanciclick === 'function' && originalHanciclick !== window.hanciclick) {
            originalHanciclick.apply(this, arguments);
        }
        
        // 防止地球移动
        if (combinedPanelFixManager) {
            combinedPanelFixManager.preventEarthShift();
        }
    };
}

// 提供全局函数
window.preventEarthShift = function() {
    if (combinedPanelFixManager) {
        combinedPanelFixManager.preventEarthShift();
    }
};

window.fixContentAreaPosition = function() {
    if (combinedPanelFixManager) {
        combinedPanelFixManager.fixContentAreaPosition();
    }
};

window.forcePanelContentFix = function() {
    if (combinedPanelFixManager) {
        combinedPanelFixManager.forcePanelContentFix();
    }
};

window.forceWhiteBackground = function() {
    if (combinedPanelFixManager) {
        combinedPanelFixManager.forceWhiteBackground();
    }
};

// 导出管理器类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CombinedPanelFixManager;
}

