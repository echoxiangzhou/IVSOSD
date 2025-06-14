/**
 * @filename: main-loader.js
 * @description: 模块加载器 - 替代原始main.js文件
 * @version: 1.0
 * @date: 2025-01-01
 * @author: 系统重构
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

"use strict";

//===========================================
// 模块加载顺序和依赖管理
//===========================================

/**
 * 模块加载配置
 */
const MODULE_CONFIG = {
    // 模块加载顺序（按依赖关系排序）
    loadOrder: [
        'init.js',                    // 1. 初始化和全局变量
        'ui-controls.js',             // 2. UI控制和标签页切换
        'voyage-list.js',             // 3. 航次查询和列表管理
        'voyage-callbacks.js',        // 4. 航次回调和分页管理
        'voyage-info.js',             // 5. 航次信息和轨迹
        'station-management.js',      // 6. 站点管理
        'terrain-rendering.js',       // 7. 地形渲染
        'utilities.js',               // 8. 工具和辅助功能
        'navigation.js'               // 9. 模块切换和导航
    ],
    
    // 基础路径配置
    basePath: 'js/',
    
    // 超时配置（毫秒）
    loadTimeout: 10000,
    
    // 重试配置
    maxRetries: 3
};

//===========================================
// 模块加载器类
//===========================================

class ModuleLoader {
    constructor(config) {
        this.config = config;
        this.loadedModules = new Set();
        this.failedModules = new Set();
        this.loadPromises = new Map();
        this.retryCount = new Map();
    }

    /**
     * 加载单个模块
     * @param {string} moduleName - 模块文件名
     * @returns {Promise} 加载Promise
     */
    loadModule(moduleName) {
        // 如果已经在加载中，返回现有的Promise
        if (this.loadPromises.has(moduleName)) {
            return this.loadPromises.get(moduleName);
        }

        // 如果已经加载成功，直接返回resolved Promise
        if (this.loadedModules.has(moduleName)) {
            return Promise.resolve();
        }

        const loadPromise = this._createLoadPromise(moduleName);
        this.loadPromises.set(moduleName, loadPromise);
        
        return loadPromise;
    }

    /**
     * 创建模块加载Promise
     * @param {string} moduleName - 模块文件名
     * @returns {Promise} 加载Promise
     */
    _createLoadPromise(moduleName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = this.config.basePath + moduleName;
            script.async = false; // 保证加载顺序

            // 设置超时
            const timeoutId = setTimeout(() => {
                script.remove();
                this._handleLoadError(moduleName, new Error(`模块 ${moduleName} 加载超时`), resolve, reject);
            }, this.config.loadTimeout);

            script.onload = () => {
                clearTimeout(timeoutId);
                this.loadedModules.add(moduleName);
                resolve();
            };

            script.onerror = (error) => {
                clearTimeout(timeoutId);
                script.remove();
                this._handleLoadError(moduleName, error, resolve, reject);
            };

            document.head.appendChild(script);
        });
    }

    /**
     * 处理加载错误
     * @param {string} moduleName - 模块名称
     * @param {Error} error - 错误对象
     * @param {Function} resolve - Promise resolve函数
     * @param {Function} reject - Promise reject函数
     */
    _handleLoadError(moduleName, error, resolve, reject) {
        const currentRetries = this.retryCount.get(moduleName) || 0;
        
        if (currentRetries < this.config.maxRetries) {
            this.retryCount.set(moduleName, currentRetries + 1);
            console.warn(`⚠️ 模块 ${moduleName} 加载失败，尝试重试 (${currentRetries + 1}/${this.config.maxRetries}):`, error);
            
            // 清除当前的Promise，准备重试
            this.loadPromises.delete(moduleName);
            
            // 延迟重试
            setTimeout(() => {
                this.loadModule(moduleName).then(resolve, reject);
            }, 1000 * (currentRetries + 1)); // 递增延迟
        } else {
            this.failedModules.add(moduleName);
            console.error(`❌ 模块 ${moduleName} 加载失败，已达最大重试次数:`, error);
            reject(error);
        }
    }

    /**
     * 按顺序加载所有模块
     * @returns {Promise} 加载完成Promise
     */
    async loadAllModules() {
        
        const startTime = Date.now();
        
        try {
            // 依次加载每个模块
            for (const moduleName of this.config.loadOrder) {
                await this.loadModule(moduleName);
                
                // 验证模块是否正确加载
                await this._validateModuleLoad(moduleName);
            }
            
            const loadTime = Date.now() - startTime;
            
            if (this.failedModules.size > 0) {
                console.warn(`⚠️ 失败模块: ${Array.from(this.failedModules).join(', ')}`);
            }
            
            // 执行加载完成后的初始化
            this._initializeSystem();
            
        } catch (error) {
            console.error('❌ 模块系统加载失败:', error);
            this._handleSystemLoadFailure(error);
            throw error;
        }
    }

    /**
     * 验证模块加载
     * @param {string} moduleName - 模块名称
     */
    async _validateModuleLoad(moduleName) {
        // 根据模块名称检查对应的加载标志
        // 转换为驼峰命名: ui-controls.js -> uiControlsModuleLoaded
        const baseName = moduleName.replace('.js', '');
        const parts = baseName.split('-');
        const camelCaseName = parts[0] + parts.slice(1).map(part => 
            part.charAt(0).toUpperCase() + part.slice(1)
        ).join('');
        const moduleKey = camelCaseName + 'ModuleLoaded';
        
        // 等待一小段时间让模块初始化
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (!window.IVSOSD || !window.IVSOSD[moduleKey]) {
            throw new Error(`模块 ${moduleName} 加载验证失败: 未找到加载标志 ${moduleKey}`);
        }
    }

    /**
     * 初始化系统
     */
    _initializeSystem() {
        
        // 检查必要的全局对象
        if (typeof window.IVSOSD !== 'object') {
            console.error('❌ IVSOSD命名空间未正确创建');
            return;
        }

        // 标记系统已完全加载
        window.IVSOSD.systemLoaded = true;
        window.IVSOSD.loadTimestamp = new Date().toISOString();
        
        // 触发系统就绪事件
        if (typeof window.dispatchEvent === 'function') {
            const event = new CustomEvent('ivsosdSystemReady', {
                detail: {
                    loadedModules: Array.from(this.loadedModules),
                    failedModules: Array.from(this.failedModules),
                    loadTimestamp: window.IVSOSD.loadTimestamp
                }
            });
            window.dispatchEvent(event);
        }

        
        // 执行初始化后的操作
        if (typeof AddAllRoute === 'function') {
            AddAllRoute();
        }
    }

    /**
     * 处理系统加载失败
     * @param {Error} error - 错误对象
     */
    _handleSystemLoadFailure(error) {
        // 显示用户友好的错误信息
        const errorMessage = `
            IVSOSD系统加载失败！
            
            错误信息: ${error.message}
            
            可能的解决方案:
            1. 检查网络连接
            2. 刷新页面重试
            3. 清除浏览器缓存
            4. 联系技术支持
        `;
        
        console.error('💥 系统加载失败详情:', {
            error: error,
            loadedModules: Array.from(this.loadedModules),
            failedModules: Array.from(this.failedModules)
        });

        // 如果有UI可用，显示错误对话框
        if (typeof alert === 'function') {
            alert(errorMessage);
        }

        // 标记系统加载失败
        window.IVSOSD = window.IVSOSD || {};
        window.IVSOSD.systemLoadFailed = true;
        window.IVSOSD.lastError = error;
    }

    /**
     * 获取加载状态报告
     * @returns {Object} 状态报告
     */
    getLoadStatus() {
        return {
            totalModules: this.config.loadOrder.length,
            loadedModules: Array.from(this.loadedModules),
            failedModules: Array.from(this.failedModules),
            loadedCount: this.loadedModules.size,
            failedCount: this.failedModules.size,
            isComplete: this.loadedModules.size + this.failedModules.size === this.config.loadOrder.length,
            isAllSuccess: this.failedModules.size === 0 && this.loadedModules.size === this.config.loadOrder.length
        };
    }
}

//===========================================
// 模块系统启动
//===========================================

/**
 * 启动模块加载系统
 */
async function startModuleSystem() {
    try {
        // 初始化全局命名空间
        window.IVSOSD = window.IVSOSD || {};
        
        // 创建模块加载器
        const loader = new ModuleLoader(MODULE_CONFIG);
        
        // 将加载器实例暴露到全局，便于调试
        window.IVSOSD.moduleLoader = loader;
        
        // 开始加载所有模块
        await loader.loadAllModules();
        
        // 系统加载完成，可以开始正常使用
        
    } catch (error) {
        console.error('💥 IVSOSD系统启动失败:', error);
        
        // 即使模块加载失败，也要确保基本的错误处理机制可用
        window.IVSOSD = window.IVSOSD || {};
        window.IVSOSD.systemStartupFailed = true;
        window.IVSOSD.startupError = error;
        
        // 可以在这里添加降级处理逻辑
        handleSystemStartupFailure(error);
    }
}

/**
 * 处理系统启动失败
 * @param {Error} error - 启动错误
 */
function handleSystemStartupFailure(error) {
    console.error('🔥 系统启动失败，尝试降级处理...');
    
    // 这里可以添加降级逻辑，比如：
    // 1. 尝试加载原始的main.js
    // 2. 显示错误页面
    // 3. 启用安全模式
    
    const errorDisplay = document.getElementById('error-display');
    if (errorDisplay) {
        errorDisplay.innerHTML = `
            <div style="color: red; padding: 20px; border: 1px solid red; margin: 20px;">
                <h3>系统加载失败</h3>
                <p>错误: ${error.message}</p>
                <p>请尝试刷新页面或联系管理员</p>
            </div>
        `;
        errorDisplay.style.display = 'block';
    }
}

//===========================================
// 系统启动
//===========================================

// 当DOM就绪时启动模块系统
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startModuleSystem);
} else {
    // DOM已经就绪，立即启动
    startModuleSystem();
}

// 导出模块加载器类，供其他地方使用
window.ModuleLoader = ModuleLoader;

