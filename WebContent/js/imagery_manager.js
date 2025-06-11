/**
 * @filename: imagery_manager.js
 * @description: 专用影像图层管理系统 - 完全规避图层消失问题
 * @version: 1.0
 * @date: 2024-12-11
 * @author: Claude
 */

console.log('=== 加载专用影像图层管理系统 ===');

/**
 * 核心影像图层管理器
 * 设计原则：
 * 1. 绝对不删除基础影像图层
 * 2. 所有科学数据图层独立管理
 * 3. 提供强制恢复机制
 * 4. 监控和自动修复
 */
class ImageryLayerManager {
    constructor(viewer) {
        this.viewer = viewer;
        this.baseImageryLayer = null;
        this.scienceImageryLayers = new Map(); // 科学数据图层管理
        this.isInitialized = false;
        this.monitoringInterval = null;
        
        console.log('🗺️ ImageryLayerManager构造器初始化');
        this.initialize();
    }
    
    /**
     * 初始化影像图层管理系统
     */
    initialize() {
        try {
            console.log('🚀 初始化影像图层管理系统...');
            
            // 确保基础影像图层存在
            this.ensureBaseImageryLayer();
            
            // 启动监控系统
            this.startMonitoring();
            
            this.isInitialized = true;
            console.log('✅ 影像图层管理系统初始化完成');
            
        } catch (error) {
            console.error('❌ 影像图层管理系统初始化失败:', error);
        }
    }
    
    /**
     * 确保基础影像图层存在且正常
     */
    ensureBaseImageryLayer() {
        try {
            console.log('🔍 检查基础影像图层状态...');
            
            const currentLayerCount = this.viewer.imageryLayers.length;
            let needCreateBase = false;
            
            if (currentLayerCount === 0) {
                console.warn('⚠️ 没有影像图层，需要创建基础图层');
                needCreateBase = true;
            } else {
                // 检查现有的第一个图层是否为基础图层
                const firstLayer = this.viewer.imageryLayers.get(0);
                if (!firstLayer._isBaseLayer || !firstLayer.show || firstLayer.alpha < 0.5) {
                    console.warn('⚠️ 第一个图层不是有效的基础图层，需要重新创建');
                    needCreateBase = true;
                } else {
                    console.log('✅ 发现有效的基础影像图层');
                    this.baseImageryLayer = firstLayer;
                }
            }
            
            if (needCreateBase) {
                this.createBaseImageryLayer();
            }
            
            // 设置全局引用
            window.primaryImageryLayer = this.baseImageryLayer;
            window.CESIUM_BASE_IMAGERY_PROTECTED = true;
            
        } catch (error) {
            console.error('❌ 基础影像图层检查失败:', error);
            this.createBaseImageryLayer(); // 强制创建
        }
    }
    
    /**
     * 创建基础影像图层
     */
    createBaseImageryLayer() {
        try {
            console.log('🗺️ 创建基础ArcGIS卫星影像图层...');
            
            // 先清除所有可能有问题的图层
            const layersToRemove = [];
            for (let i = 0; i < this.viewer.imageryLayers.length; i++) {
                const layer = this.viewer.imageryLayers.get(i);
                if (!layer._isScienceLayer) { // 只移除非科学数据图层
                    layersToRemove.push(layer);
                }
            }
            
            layersToRemove.forEach(layer => {
                this.viewer.imageryLayers.remove(layer);
                console.log('🗑️ 移除了有问题的基础图层');
            });
            
            // 创建新的ArcGIS卫星影像基础图层
            const arcgisProvider = new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
                maximumLevel: 18
            });
            
            const baseLayer = this.viewer.imageryLayers.addImageryProvider(arcgisProvider, 0); // 强制作为第一个图层
            
            // 标记为基础图层
            baseLayer._isBaseLayer = true;
            baseLayer._cesiumProtected = true;
            baseLayer._createdByManager = true;
            baseLayer._createTime = new Date().toISOString();
            
            // 确保可见
            baseLayer.show = true;
            baseLayer.alpha = 1.0;
            
            this.baseImageryLayer = baseLayer;
            console.log('✅ 基础ArcGIS卫星影像图层创建完成');
            
            // 强制渲染
            this.viewer.scene.requestRender();
            
        } catch (error) {
            console.error('❌ 基础影像图层创建失败:', error);
        }
    }
    
    /**
     * 添加科学数据图层（安全方法）
     */
    addScienceImageryLayer(provider, layerId, options = {}) {
        try {
            console.log(`🔬 添加科学数据图层: ${layerId}`);
            
            // 确保基础图层存在
            this.ensureBaseImageryLayer();
            
            // 创建科学数据图层
            const scienceLayer = this.viewer.imageryLayers.addImageryProvider(provider);
            
            // 标记为科学数据图层
            scienceLayer._isScienceLayer = true;
            scienceLayer._layerId = layerId;
            scienceLayer._createdByManager = true;
            scienceLayer._createTime = new Date().toISOString();
            
            // 应用选项
            if (options.alpha !== undefined) {
                scienceLayer.alpha = options.alpha;
            }
            if (options.show !== undefined) {
                scienceLayer.show = options.show;
            }
            
            // 保存到管理器
            this.scienceImageryLayers.set(layerId, scienceLayer);
            
            console.log(`✅ 科学数据图层 ${layerId} 添加完成`);
            return scienceLayer;
            
        } catch (error) {
            console.error(`❌ 科学数据图层 ${layerId} 添加失败:`, error);
            return null;
        }
    }
    
    /**
     * 移除科学数据图层
     */
    removeScienceImageryLayer(layerId) {
        try {
            console.log(`🗑️ 移除科学数据图层: ${layerId}`);
            
            const layer = this.scienceImageryLayers.get(layerId);
            if (layer) {
                this.viewer.imageryLayers.remove(layer);
                this.scienceImageryLayers.delete(layerId);
                console.log(`✅ 科学数据图层 ${layerId} 移除完成`);
            } else {
                console.warn(`⚠️ 科学数据图层 ${layerId} 不存在`);
            }
            
        } catch (error) {
            console.error(`❌ 科学数据图层 ${layerId} 移除失败:`, error);
        }
    }
    
    /**
     * 清除所有科学数据图层（保留基础图层）
     */
    clearAllScienceImageryLayers() {
        try {
            console.log('🧹 清除所有科学数据图层...');
            
            // 移除所有科学数据图层
            this.scienceImageryLayers.forEach((layer, layerId) => {
                try {
                    this.viewer.imageryLayers.remove(layer);
                    console.log(`✅ 移除科学数据图层: ${layerId}`);
                } catch (e) {
                    console.warn(`⚠️ 移除科学数据图层 ${layerId} 时出错:`, e);
                }
            });
            
            this.scienceImageryLayers.clear();
            
            // 确保基础图层仍然存在
            this.ensureBaseImageryLayer();
            
            console.log('✅ 所有科学数据图层已清除，基础图层保持完好');
            
        } catch (error) {
            console.error('❌ 清除科学数据图层失败:', error);
        }
    }
    
    /**
     * 强制恢复基础影像图层
     */
    forceRestoreBaseImageryLayer() {
        try {
            console.log('🆘 强制恢复基础影像图层...');
            
            // 检查当前基础图层状态
            const currentBaseValid = this.baseImageryLayer && 
                                   this.viewer.imageryLayers.indexOf(this.baseImageryLayer) !== -1 &&
                                   this.baseImageryLayer.show;
            
            if (!currentBaseValid) {
                console.warn('⚠️ 基础图层无效，强制重新创建...');
                this.createBaseImageryLayer();
            } else {
                console.log('✅ 基础图层有效，强制确保可见性...');
                this.baseImageryLayer.show = true;
                this.baseImageryLayer.alpha = 1.0;
                this.viewer.scene.requestRender();
            }
            
        } catch (error) {
            console.error('❌ 强制恢复基础影像图层失败:', error);
        }
    }
    
    /**
     * 启动监控系统
     */
    startMonitoring() {
        try {
            console.log('👁️ 启动影像图层监控系统...');
            
            // 清除之前的监控
            if (this.monitoringInterval) {
                clearInterval(this.monitoringInterval);
            }
            
            // 每3秒检查一次
            this.monitoringInterval = setInterval(() => {
                this.performHealthCheck();
            }, 3000);
            
            console.log('✅ 影像图层监控系统已启动');
            
        } catch (error) {
            console.error('❌ 影像图层监控系统启动失败:', error);
        }
    }
    
    /**
     * 执行健康检查
     */
    performHealthCheck() {
        try {
            if (!this.isInitialized) return;
            
            const totalLayers = this.viewer.imageryLayers.length;
            const baseLayerValid = this.baseImageryLayer && 
                                 this.viewer.imageryLayers.indexOf(this.baseImageryLayer) !== -1 &&
                                 this.baseImageryLayer.show;
            
            // 静默检查，只在问题时输出
            if (totalLayers === 0 || !baseLayerValid) {
                console.warn(`🚨 影像图层健康检查失败: 图层数=${totalLayers}, 基础图层有效=${baseLayerValid}`);
                this.forceRestoreBaseImageryLayer();
            }
            
        } catch (error) {
            console.error('❌ 影像图层健康检查失败:', error);
        }
    }
    
    /**
     * 获取状态报告
     */
    getStatusReport() {
        try {
            const totalLayers = this.viewer.imageryLayers.length;
            const scienceLayerCount = this.scienceImageryLayers.size;
            const baseLayerValid = this.baseImageryLayer && 
                                 this.viewer.imageryLayers.indexOf(this.baseImageryLayer) !== -1;
            
            return {
                totalLayers,
                scienceLayerCount,
                baseLayerValid,
                baseLayerShow: this.baseImageryLayer ? this.baseImageryLayer.show : false,
                baseLayerAlpha: this.baseImageryLayer ? this.baseImageryLayer.alpha : 0,
                isInitialized: this.isInitialized,
                monitoringActive: !!this.monitoringInterval
            };
            
        } catch (error) {
            console.error('❌ 获取状态报告失败:', error);
            return { error: error.message };
        }
    }
    
    /**
     * 停止监控系统
     */
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
            console.log('⏹️ 影像图层监控系统已停止');
        }
    }
    
    /**
     * 销毁管理器
     */
    destroy() {
        this.stopMonitoring();
        this.scienceImageryLayers.clear();
        this.baseImageryLayer = null;
        this.isInitialized = false;
        console.log('💥 影像图层管理器已销毁');
    }
}

// 全局影像图层管理器实例
window.ImageryLayerManager = ImageryLayerManager;
window.imageryManager = null;

// 初始化函数
window.initializeImageryManager = function(viewer) {
    try {
        if (window.imageryManager) {
            console.log('⚠️ 影像图层管理器已存在，销毁旧实例...');
            window.imageryManager.destroy();
        }
        
        window.imageryManager = new ImageryLayerManager(viewer);
        console.log('✅ 全局影像图层管理器已初始化');
        return window.imageryManager;
        
    } catch (error) {
        console.error('❌ 全局影像图层管理器初始化失败:', error);
        return null;
    }
};

// 便捷函数
window.getImageryManagerStatus = function() {
    if (window.imageryManager) {
        return window.imageryManager.getStatusReport();
    }
    return { error: '影像图层管理器未初始化' };
};

window.forceRestoreBaseImagery = function() {
    if (window.imageryManager) {
        window.imageryManager.forceRestoreBaseImageryLayer();
    } else {
        console.error('❌ 影像图层管理器未初始化');
    }
};

console.log('✅ 专用影像图层管理系统加载完成');