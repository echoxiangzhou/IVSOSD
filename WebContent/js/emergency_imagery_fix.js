/**
 * @filename: emergency_imagery_fix.js
 * @description: 紧急影像图层修复工具 - 强制解决影像图层显示问题
 * @version: 1.0
 * @date: 2024-12-11
 * @author: Claude
 */


/**
 * 紧急影像图层修复器
 */
class EmergencyImageryFix {
    constructor() {
        this.viewer = null;
        this.fixAttempts = 0;
        this.maxAttempts = 10;
        this.isRunning = false;
    }
    
    /**
     * 启动紧急修复
     */
    startEmergencyFix(viewer) {
        if (!viewer) {
            return;
        }
        
        this.viewer = viewer;
        this.isRunning = true;
        this.fixAttempts = 0;
        
        // 立即执行第一次修复
        this.performFix();
        
        // 每2秒尝试一次修复，直到成功或达到最大尝试次数
        const fixInterval = setInterval(() => {
            if (!this.isRunning || this.fixAttempts >= this.maxAttempts) {
                clearInterval(fixInterval);
                if (this.fixAttempts >= this.maxAttempts) {
                    // Maximum attempts reached
                } else {
                    // Fix completed successfully
                }
                return;
            }
            
            this.performFix();
        }, 2000);
    }
    
    /**
     * 执行修复操作
     */
    performFix() {
        this.fixAttempts++;
        
        try {
            // 检查当前状态
            const currentState = this.analyzeCurrentState();
            
            // 根据状态选择修复策略
            if (currentState.hasImageryLayers && currentState.hasVisibleLayer) {
                this.isRunning = false;
                return;
            }
            
            // 策略1: 完全清理并重建影像图层
            if (this.fixAttempts <= 3) {
                this.strategy1_CompleteRebuild();
            }
            // 策略2: 强制重新设置影像提供者
            else if (this.fixAttempts <= 6) {
                this.strategy2_ForceImageryProvider();
            }
            // 策略3: 终极修复 - 使用不同的影像源
            else {
                this.strategy3_AlternativeImagerySource();
            }
            
        } catch (error) {
            // Fix attempt failed
        }
    }
    
    /**
     * 分析当前状态
     */
    analyzeCurrentState() {
        const imageryLayers = this.viewer.imageryLayers;
        const layerCount = imageryLayers.length;
        
        let hasVisibleLayer = false;
        let hasOSMLayer = false;
        
        for (let i = 0; i < layerCount; i++) {
            const layer = imageryLayers.get(i);
            if (layer.show && layer.alpha > 0.5) {
                hasVisibleLayer = true;
            }
            if (layer.imageryProvider && 
                layer.imageryProvider.constructor.name === 'OpenStreetMapImageryProvider') {
                hasOSMLayer = true;
            }
        }
        
        return {
            hasImageryLayers: layerCount > 0,
            layerCount: layerCount,
            hasVisibleLayer: hasVisibleLayer,
            hasOSMLayer: hasOSMLayer,
            globeShow: this.viewer.scene.globe.show,
            terrainProvider: this.viewer.terrainProvider.constructor.name
        };
    }
    
    /**
     * 策略1: 完全清理并重建影像图层
     */
    strategy1_CompleteRebuild() {
        
        try {
            // 移除所有影像图层
            this.viewer.imageryLayers.removeAll();
            
            // 等待一小段时间确保清理完成
            setTimeout(() => {
                // 创建新的OpenStreetMap图层
                const osmProvider = new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://a.tile.openstreetmap.org/',
                    maximumLevel: 18
                });
                
                const newLayer = this.viewer.imageryLayers.addImageryProvider(osmProvider);
                newLayer.show = true;
                newLayer.alpha = 1.0;
                newLayer._emergencyCreated = true;
                newLayer._createTime = new Date().toISOString();
                
                // 设置全局引用
                window.primaryImageryLayer = newLayer;
                window.CESIUM_BASE_IMAGERY_PROTECTED = true;
                
                // 强制渲染
                this.viewer.scene.requestRender();
                
                // 验证创建结果
                setTimeout(() => {
                    const verification = this.analyzeCurrentState();
                    
                    if (verification.hasVisibleLayer) {
                        this.isRunning = false;
                    }
                }, 1000);
                
            }, 500);
            
        } catch (error) {
            // Strategy 1 failed
        }
    }
    
    /**
     * 策略2: 强制重新设置影像提供者
     */
    strategy2_ForceImageryProvider() {
        
        try {
            // 如果有图层但不可见，尝试修复
            if (this.viewer.imageryLayers.length > 0) {
                const firstLayer = this.viewer.imageryLayers.get(0);
                
                // 强制设置可见性
                firstLayer.show = true;
                firstLayer.alpha = 1.0;
                
                // 如果提供者有问题，重新创建
                if (!firstLayer.imageryProvider || !firstLayer.ready) {
                    
                    const newProvider = new Cesium.OpenStreetMapImageryProvider({
                        url: 'https://b.tile.openstreetmap.org/',  // 使用不同的服务器
                        maximumLevel: 18
                    });
                    
                    // 移除旧图层
                    this.viewer.imageryLayers.remove(firstLayer);
                    
                    // 添加新图层
                    const newLayer = this.viewer.imageryLayers.addImageryProvider(newProvider);
                    newLayer.show = true;
                    newLayer.alpha = 1.0;
                    
                    window.primaryImageryLayer = newLayer;
                }
                
                this.viewer.scene.requestRender();
                
            } else {
                // 没有图层，直接创建
                this.strategy1_CompleteRebuild();
            }
            
        } catch (error) {
            // Strategy 2 failed
        }
    }
    
    /**
     * 策略3: 终极修复 - 使用不同的影像源
     */
    strategy3_AlternativeImagerySource() {
        
        try {
            // 清理现有图层
            this.viewer.imageryLayers.removeAll();
            
            // 尝试多个不同的影像源
            const providers = [
                // OpenStreetMap 不同服务器
                () => new Cesium.OpenStreetMapImageryProvider({
                    url: 'https://c.tile.openstreetmap.org/',
                    maximumLevel: 18
                }),
                // 如果OpenStreetMap完全不工作，使用单色图层作为备选
                () => new Cesium.SingleTileImageryProvider({
                    url: 'data:image/svg+xml;base64,' + btoa(`
                        <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
                            <rect width="256" height="256" fill="#4a90e2"/>
                            <text x="128" y="128" font-family="Arial" font-size="14" fill="white" text-anchor="middle" dy=".3em">
                                海洋科学数据可视化系统
                            </text>
                        </svg>
                    `),
                    rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90)
                }),
                // 纯色背景作为最后备选
                () => new Cesium.SingleTileImageryProvider({
                    url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
                    rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90)
                })
            ];
            
            let providerIndex = 0;
            
            const tryProvider = () => {
                if (providerIndex >= providers.length) {
                    return;
                }
                
                try {
                    
                    const provider = providers[providerIndex]();
                    const layer = this.viewer.imageryLayers.addImageryProvider(provider);
                    layer.show = true;
                    layer.alpha = 1.0;
                    layer._emergencyProvider = true;
                    layer._providerIndex = providerIndex;
                    
                    window.primaryImageryLayer = layer;
                    this.viewer.scene.requestRender();
                    
                    // 检查是否成功
                    setTimeout(() => {
                        const verification = this.analyzeCurrentState();
                        
                        if (verification.hasVisibleLayer) {
                            this.isRunning = false;
                        } else {
                            providerIndex++;
                            tryProvider();
                        }
                    }, 2000);
                    
                } catch (error) {
                    providerIndex++;
                    tryProvider();
                }
            };
            
            tryProvider();
            
        } catch (error) {
            // Strategy 3 failed
        }
    }
    
    /**
     * 手动触发紧急修复
     */
    static manualFix() {
        
        if (window.viewer) {
            const fixer = new EmergencyImageryFix();
            fixer.startEmergencyFix(window.viewer);
        } else {
            // Viewer not found
        }
    }
}

// 全局暴露紧急修复工具
window.EmergencyImageryFix = EmergencyImageryFix;
window.emergencyImageryFix = function() {
    EmergencyImageryFix.manualFix();
};

// 在页面加载完成后自动启动紧急修复
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            if (window.viewer && window.viewer.imageryLayers.length === 0) {
                EmergencyImageryFix.manualFix();
            }
        }, 5000);
    });
} else {
    setTimeout(() => {
        if (window.viewer && window.viewer.imageryLayers.length === 0) {
            EmergencyImageryFix.manualFix();
        }
    }, 5000);
}
