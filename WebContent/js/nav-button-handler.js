/**
 * Navigation Button Handler
 * 导航按钮点击处理器 - 确保按钮功能正常工作
 */

(function() {
    'use strict';
    
    console.log('🚀 导航按钮处理器初始化...');
    
    // 定义全局导航函数（如果还未定义）
    window.handleNavButtonClick = function(buttonType) {
        console.log('📍 导航按钮点击:', buttonType);
        
        // 等待系统就绪
        if (!window.IVSOSD || !window.IVSOSD.navigationModuleLoaded) {
            console.warn('⏳ 系统尚未就绪，等待1秒后重试...');
            setTimeout(function() {
                handleNavButtonClick(buttonType);
            }, 1000);
            return;
        }
        
        try {
            switch(buttonType) {
                case 'hanci':
                    if (typeof window.hanciclick === 'function') {
                        window.hanciclick();
                    } else if (window.IVSOSD && typeof window.IVSOSD.hanciclick === 'function') {
                        window.IVSOSD.hanciclick();
                    } else {
                        console.error('❌ hanciclick 函数不可用');
                    }
                    break;
                    
                case 'poumian':
                    if (typeof window.poumianclick === 'function') {
                        window.poumianclick();
                    } else if (window.IVSOSD && typeof window.IVSOSD.poumianclick === 'function') {
                        window.IVSOSD.poumianclick();
                    } else {
                        console.error('❌ poumianclick 函数不可用');
                    }
                    break;
                    
                case 'dixing':
                    if (typeof window.dixingclick === 'function') {
                        window.dixingclick();
                    } else if (window.IVSOSD && typeof window.IVSOSD.dixingclick === 'function') {
                        window.IVSOSD.dixingclick();
                    } else {
                        console.error('❌ dixingclick 函数不可用');
                    }
                    break;
                    
                case 'yangliu':
                    if (typeof window.yangliuclick === 'function') {
                        window.yangliuclick();
                    } else if (window.IVSOSD && typeof window.IVSOSD.yangliuclick === 'function') {
                        window.IVSOSD.yangliuclick();
                    } else {
                        console.error('❌ yangliuclick 函数不可用');
                    }
                    break;
                    
                case 'zhongxin':
                    window.open('http://msdc.qdio.ac.cn/');
                    break;
                    
                default:
                    console.error('❌ 未知的按钮类型:', buttonType);
            }
        } catch (error) {
            console.error('❌ 执行导航函数时出错:', error);
            alert('功能暂时不可用，请刷新页面后重试');
        }
    };
    
    // 为 openVoyagePanel 创建别名
    window.openVoyagePanel = function() {
        window.handleNavButtonClick('hanci');
    };
    
    // 创建直接调用的全局函数
    window.poumianclick = function() {
        window.handleNavButtonClick('poumian');
    };
    
    window.dixingclick = function() {
        window.handleNavButtonClick('dixing');
    };
    
    window.yangliuclick = function() {
        window.handleNavButtonClick('yangliu');
    };
    
    // 系统就绪后，重新绑定函数
    window.addEventListener('ivsosdSystemReady', function() {
        console.log('✅ 系统就绪，检查导航函数...');
        
        // 如果IVSOSD命名空间中有这些函数，直接使用它们
        if (window.IVSOSD) {
            if (window.IVSOSD.hanciclick) {
                window.hanciclick = window.IVSOSD.hanciclick;
                window.openVoyagePanel = window.IVSOSD.hanciclick;
                console.log('✅ hanciclick 函数已绑定');
            }
            
            if (window.IVSOSD.poumianclick) {
                window.poumianclick = window.IVSOSD.poumianclick;
                console.log('✅ poumianclick 函数已绑定');
            }
            
            if (window.IVSOSD.dixingclick) {
                window.dixingclick = window.IVSOSD.dixingclick;
                console.log('✅ dixingclick 函数已绑定');
            }
            
            if (window.IVSOSD.yangliuclick) {
                window.yangliuclick = window.IVSOSD.yangliuclick;
                console.log('✅ yangliuclick 函数已绑定');
            }
        }
    });
    
    // 添加调试功能
    window.testNavigation = function() {
        console.log('🧪 测试导航功能...');
        console.log('IVSOSD:', window.IVSOSD);
        console.log('navigationModuleLoaded:', window.IVSOSD ? window.IVSOSD.navigationModuleLoaded : 'N/A');
        console.log('hanciclick:', typeof window.hanciclick);
        console.log('poumianclick:', typeof window.poumianclick);
        console.log('dixingclick:', typeof window.dixingclick);
        console.log('yangliuclick:', typeof window.yangliuclick);
        
        if (window.IVSOSD) {
            console.log('IVSOSD.hanciclick:', typeof window.IVSOSD.hanciclick);
            console.log('IVSOSD.poumianclick:', typeof window.IVSOSD.poumianclick);
            console.log('IVSOSD.dixingclick:', typeof window.IVSOSD.dixingclick);
            console.log('IVSOSD.yangliuclick:', typeof window.IVSOSD.yangliuclick);
        }
    };
    
    console.log('✅ 导航按钮处理器已加载');
    console.log('💡 使用 testNavigation() 测试导航功能');
    
})();