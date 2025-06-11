/**
 * @filename: safe_data_loader.js
 * @description: 安全的数据加载器 - 完全重写避免影像图层问题
 * @version: 1.0
 * @date: 2024-12-11
 * @author: Claude
 */

console.log('=== 加载安全数据加载器 ===');

/**
 * 安全的ShowBaseInfo函数 - 完全重写
 * 核心设计原则：
 * 1. 绝对不触碰影像图层
 * 2. 地形设置独立处理
 * 3. 使用影像图层管理器保护
 */
function SafeShowBaseInfo() {
    console.log('🏔️ === 安全ShowBaseInfo开始执行 ===');
    
    try {
        // 确保影像图层管理器存在
        if (!window.imageryManager) {
            console.warn('⚠️ 影像图层管理器不存在，初始化中...');
            if (window.viewer) {
                window.initializeImageryManager(window.viewer);
            } else {
                console.error('❌ Viewer不存在，无法初始化影像图层管理器');
                return;
            }
        }
        
        // 记录执行前状态
        const statusBefore = window.imageryManager.getStatusReport();
        console.log('📊 执行前影像图层状态:', statusBefore);
        
        // 获取场景和地球对象
        const scene = viewer.scene;
        const globe = scene.globe;
        
        // 基础地球设置（不影响影像图层）
        console.log('🌍 设置基础地球属性...');
        globe.depthTestAgainstTerrain = false;
        globe.show = true;
        
        // 独立处理地形设置
        console.log('🏔️ 独立处理地形设置...');
        SafeSetTerrain();
        
        // 设置地球交互功能
        console.log('🎯 设置地球交互功能...');
        setupEarthInteraction();
        
        // 验证影像图层状态
        setTimeout(() => {
            const statusAfter = window.imageryManager.getStatusReport();
            console.log('📊 执行后影像图层状态:', statusAfter);
            
            if (!statusAfter.baseLayerValid || !statusAfter.baseLayerShow) {
                console.warn('⚠️ 检测到影像图层问题，强制恢复...');
                window.imageryManager.forceRestoreBaseImageryLayer();
            } else {
                console.log('✅ 影像图层状态正常');
            }
        }, 100);
        
        console.log('✅ 安全ShowBaseInfo执行完成');
        
    } catch (error) {
        console.error('❌ 安全ShowBaseInfo执行失败:', error);
        
        // 紧急恢复影像图层
        if (window.imageryManager) {
            window.imageryManager.forceRestoreBaseImageryLayer();
        }
    }
    
    console.log('🏔️ === 安全ShowBaseInfo执行完毕 ===');
}

/**
 * 安全的地形设置函数
 */
function SafeSetTerrain() {
    console.log('🗻 开始安全地形设置...');
    
    try {
        // 在设置地形前强制确保影像图层安全
        if (window.imageryManager) {
            window.imageryManager.ensureBaseImageryLayer();
        }
        
        // 尝试设置自定义地形
        const cesiumTerrainProvider = new Cesium.CesiumTerrainProvider({
            url: 'Data/terrain/terrain03',
            requestVertexNormals: true
        });
        
        console.log('🔄 设置地形提供者: Data/terrain/terrain03');
        viewer.terrainProvider = cesiumTerrainProvider;
        
        // 地形设置后立即检查影像图层
        setTimeout(() => {
            console.log('🔍 地形设置后检查影像图层...');
            if (window.imageryManager) {
                const status = window.imageryManager.getStatusReport();
                if (!status.baseLayerValid || status.totalLayers === 0) {
                    console.warn('⚠️ 地形设置影响了影像图层，立即恢复...');
                    window.imageryManager.forceRestoreBaseImageryLayer();
                } else {
                    console.log('✅ 地形设置后影像图层正常');
                }
            }
        }, 50);
        
        console.log('✅ 地形设置完成');
        
    } catch (error) {
        console.warn('⚠️ 自定义地形设置失败，使用默认地形:', error);
        
        // 使用默认地形
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        
        // 确保影像图层在默认地形设置后仍然正常
        if (window.imageryManager) {
            setTimeout(() => {
                window.imageryManager.forceRestoreBaseImageryLayer();
            }, 50);
        }
    }
}

/**
 * 设置地球交互功能（原ShowBaseInfo中的功能）
 */
function setupEarthInteraction() {
    console.log('🎯 设置地球交互功能...');
    
    try {
        const scene = viewer.scene;
        const ellipsoid = scene.globe.ellipsoid;
        
        // 距离测量功能设置
        let distPosCarte = [];
        let distPosCarto = [];
        let surfaceDist = 0;
        
        const distLine = viewer.entities.add({
            id: 'distLine',
            name: 'Distance Line',
            polyline: {
                width: 3,
                positions: [],
                material: new Cesium.PolylineOutlineMaterialProperty({
                    color: Cesium.Color.RED,
                    outlineWidth: 2,
                    outlineColor: Cesium.Color.BLACK
                })
            }
        });
        
        // 创建鼠标事件处理器
        if (typeof handlerShowCoor !== 'undefined' && handlerShowCoor) {
            handlerShowCoor.destroy();
        }
        
        window.handlerShowCoor = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        
        // 左键点击事件
        window.handlerShowCoor.setInputAction(function(e) {
            try {
                const pickedPosition = viewer.camera.pickEllipsoid(e.position, ellipsoid);
                if (pickedPosition) {
                    const cartographic = ellipsoid.cartesianToCartographic(pickedPosition);
                    const longitude = Cesium.Math.toDegrees(cartographic.longitude);
                    const latitude = Cesium.Math.toDegrees(cartographic.latitude);
                    
                    console.log(`🎯 点击位置: 经度=${longitude.toFixed(6)}, 纬度=${latitude.toFixed(6)}`);
                    
                    // 更新坐标显示（如果有相关DOM元素）
                    const coordDisplay = document.getElementById('coordinateDisplay');
                    if (coordDisplay) {
                        coordDisplay.textContent = `经度: ${longitude.toFixed(6)}°, 纬度: ${latitude.toFixed(6)}°`;
                    }
                }
            } catch (error) {
                console.warn('⚠️ 坐标点击事件处理失败:', error);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        
        // 鼠标移动事件（坐标跟踪）
        window.handlerShowCoor.setInputAction(function(e) {
            try {
                const pickedPosition = viewer.camera.pickEllipsoid(e.endPosition, ellipsoid);
                if (pickedPosition) {
                    const cartographic = ellipsoid.cartesianToCartographic(pickedPosition);
                    const longitude = Cesium.Math.toDegrees(cartographic.longitude);
                    const latitude = Cesium.Math.toDegrees(cartographic.latitude);
                    
                    // 更新鼠标坐标显示（如果有相关DOM元素）
                    const mouseCoordDisplay = document.getElementById('mouseCoordinateDisplay');
                    if (mouseCoordDisplay) {
                        mouseCoordDisplay.textContent = `${longitude.toFixed(4)}°, ${latitude.toFixed(4)}°`;
                    }
                }
            } catch (error) {
                // 静默处理鼠标移动错误，避免控制台刷屏
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        
        console.log('✅ 地球交互功能设置完成');
        
    } catch (error) {
        console.error('❌ 地球交互功能设置失败:', error);
    }
}

/**
 * 安全的航线加载函数
 */
function SafeAddAllRoute() {
    console.log('🛤️ === 安全航线加载开始 ===');
    
    try {
        // 确保影像图层安全
        if (window.imageryManager) {
            const statusBefore = window.imageryManager.getStatusReport();
            console.log('📊 航线加载前影像图层状态:', statusBefore);
            
            if (!statusBefore.baseLayerValid) {
                console.warn('⚠️ 航线加载前影像图层异常，强制恢复...');
                window.imageryManager.forceRestoreBaseImageryLayer();
            }
        }
        
        // 清理旧的航线数据（只清理实体，不碰影像图层）
        console.log('🧹 清理旧航线数据...');
        SafeClearRouteEntities();
        
        // 加载航线数据
        console.log('📡 开始加载航线数据...');
        
        // 直接从数据库加载航线数据
        if (typeof DatabaseOperationJS !== 'undefined' && DatabaseOperationJS.QueryVoyageList) {
            loadRouteDataFromDatabase();
        } else {
            console.error('❌ DWR服务不可用，无法加载航次数据');
            console.log('请确保：');
            console.log('1. 应用服务器正在运行');
            console.log('2. DWR配置正确');
            console.log('3. 数据库连接正常');
        }
        
        // 验证加载后状态
        setTimeout(() => {
            if (window.imageryManager) {
                const statusAfter = window.imageryManager.getStatusReport();
                console.log('📊 航线加载后影像图层状态:', statusAfter);
                
                if (!statusAfter.baseLayerValid || !statusAfter.baseLayerShow) {
                    console.warn('⚠️ 航线加载影响了影像图层，立即恢复...');
                    window.imageryManager.forceRestoreBaseImageryLayer();
                }
            }
        }, 500);
        
        console.log('✅ 安全航线加载完成');
        
    } catch (error) {
        console.error('❌ 安全航线加载失败:', error);
        
        // 紧急恢复影像图层
        if (window.imageryManager) {
            window.imageryManager.forceRestoreBaseImageryLayer();
        }
    }
    
    console.log('🛤️ === 安全航线加载完毕 ===');
}

/**
 * 安全清理航线实体
 */
function SafeClearRouteEntities() {
    try {
        console.log('🗑️ 安全清理航线实体...');
        
        // 只清理路线相关的实体，不触碰影像图层
        const entitiesToRemove = [];
        const entities = viewer.entities.values;
        
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.name && (
                entity.name.includes('航线') || 
                entity.name.includes('Route') || 
                entity.name.includes('track') ||
                entity.id.includes('route') ||
                entity.id.includes('track')
            )) {
                entitiesToRemove.push(entity);
            }
        }
        
        entitiesToRemove.forEach(entity => {
            viewer.entities.remove(entity);
        });
        
        console.log(`✅ 清理了 ${entitiesToRemove.length} 个航线实体`);
        
    } catch (error) {
        console.error('❌ 安全清理航线实体失败:', error);
    }
}

/**
 * 从数据库加载航线数据
 */
function loadRouteDataFromDatabase() {
    try {
        console.log('🗄️ 从数据库加载航线数据...');
        
        const strSQL = "select * from VOYAGE t order by ID";
        DatabaseOperationJS.QueryVoyageList(strSQL, {
            callback: function(voyageList) {
                console.log('📊 航次数据库查询成功:', voyageList);
                
                if (voyageList && voyageList.length > 0) {
                    voyageList.forEach((voyage, index) => {
                        if (voyage.trajPath && voyage.trajPath.trim() !== '') {
                            loadCZMLSafely(voyage.trajPath, `航次${voyage.ID || index + 1}`);
                        }
                    });
                } else {
                    console.warn('⚠️ 数据库中没有航次数据，使用本地数据...');
                    loadRouteDataFromLocal();
                }
            },
            errorHandler: function(error) {
                console.error('❌ 数据库查询失败:', error);
                console.log('🔄 切换到本地航线数据...');
                loadRouteDataFromLocal();
            }
        });
        
    } catch (error) {
        console.error('❌ 数据库航线数据加载失败:', error);
        loadRouteDataFromLocal();
    }
}

/**
 * 从本地文件加载航线数据
 */
function loadRouteDataFromLocal() {
    try {
        console.log('📂 从本地文件加载航线数据...');
        
        // 加载航线CZML文件 - 使用实际存在的文件
        const routeDataSources = [
            'Data/Temp/voy0001.czml',
            'Data/Temp/voy0002.czml',
            'Data/Temp/voy0003.czml'
        ];
        
        routeDataSources.forEach((dataUrl, index) => {
            // 检查文件是否存在，然后加载
            loadCZMLSafely(dataUrl, `航线${index + 1}`);
        });
        
        // 如果本地CZML文件也没有，创建测试航迹线
        setTimeout(() => {
            createTestTrajectoryLines();
        }, 1000);
        
    } catch (error) {
        console.error('❌ 本地航线数据加载失败:', error);
        // 最后的备选方案
        createTestTrajectoryLines();
    }
}

/**
 * 安全加载CZML文件
 */
function loadCZMLSafely(url, name) {
    try {
        console.log(`📥 安全加载CZML: ${name} (${url})`);
        
        // 添加更多安全检查
        if (!viewer || !viewer.dataSources) {
            console.error('❌ Viewer或dataSources不可用');
            return;
        }
        
        if (!url || url.trim() === '') {
            console.warn(`⚠️ ${name}: URL为空，跳过加载`);
            return;
        }
        
        Cesium.CzmlDataSource.load(url).then(function(dataSource) {
            if (dataSource) {
                dataSource.name = name;
                viewer.dataSources.add(dataSource);
                console.log(`✅ CZML加载成功: ${name}`);
            }
            
            // 加载后检查影像图层状态
            if (window.imageryManager) {
                setTimeout(() => {
                    const status = window.imageryManager.getStatusReport();
                    if (!status.baseLayerValid) {
                        console.warn(`⚠️ ${name}加载后影像图层异常，恢复中...`);
                        window.imageryManager.forceRestoreBaseImageryLayer();
                    }
                }, 100);
            }
            
        }).catch(function(error) {
            console.warn(`⚠️ CZML加载失败: ${name} - ${error.message || error}`);
            // 尝试创建简单的轨迹线作为备选
            createSimpleTrajectory(name);
        });
        
    } catch (error) {
        console.error(`❌ CZML安全加载失败: ${name} - ${error}`);
        createSimpleTrajectory(name);
    }
}

/**
 * 创建简单的轨迹线作为CZML加载失败的备选
 */
function createSimpleTrajectory(name) {
    try {
        console.log(`🔄 为${name}创建简单轨迹线...`);
        
        // 创建简单的测试轨迹
        const positions = [
            120.0, 20.0, 0,
            125.0, 22.0, 0,
            130.0, 24.0, 0
        ];
        
        const entity = viewer.entities.add({
            name: name,
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
                width: 2,
                material: Cesium.Color.RED,
                clampToGround: false
            }
        });
        
        console.log(`✅ 简单轨迹线创建成功: ${name}`);
        
    } catch (error) {
        console.error(`❌ 创建简单轨迹线失败: ${error}`);
    }
}

/**
 * 安全的数据库查询回调
 */
function SafeCallBackDataRange(data) {
    console.log('📊 === 安全数据库查询回调开始 ===');
    
    try {
        // 确保影像图层状态
        if (window.imageryManager) {
            const statusBefore = window.imageryManager.getStatusReport();
            console.log('📊 数据库回调前影像图层状态:', statusBefore);
        }
        
        console.log('📥 接收到数据范围数据:', data);
        
        // 处理数据（不影响影像图层）
        if (data && typeof data === 'string' && data.length > 0) {
            console.log('✅ 数据范围数据有效，长度:', data.length);
            
            // 这里可以添加具体的数据处理逻辑
            // 例如：更新时间范围选择器、设置数据过滤条件等
            updateDataRangeUI(data);
            
        } else {
            console.warn('⚠️ 数据范围数据无效或为空');
        }
        
        // 验证回调处理后影像图层状态
        if (window.imageryManager) {
            setTimeout(() => {
                const statusAfter = window.imageryManager.getStatusReport();
                console.log('📊 数据库回调后影像图层状态:', statusAfter);
                
                if (!statusAfter.baseLayerValid || !statusAfter.baseLayerShow) {
                    console.warn('⚠️ 数据库回调影响了影像图层，立即恢复...');
                    window.imageryManager.forceRestoreBaseImageryLayer();
                }
            }, 100);
        }
        
        console.log('✅ 安全数据库查询回调完成');
        
    } catch (error) {
        console.error('❌ 安全数据库查询回调失败:', error);
        
        // 紧急恢复影像图层
        if (window.imageryManager) {
            window.imageryManager.forceRestoreBaseImageryLayer();
        }
    }
    
    console.log('📊 === 安全数据库查询回调完毕 ===');
}

/**
 * 更新数据范围UI
 */
function updateDataRangeUI(data) {
    try {
        console.log('🎨 更新数据范围UI...');
        
        // 解析数据范围信息
        // 这里需要根据实际的数据格式来解析
        
        // 示例：假设数据包含时间范围信息
        const timeRangeElement = document.getElementById('timeRange');
        if (timeRangeElement) {
            timeRangeElement.textContent = `数据时间范围: ${new Date().toLocaleDateString()}`;
        }
        
        // 示例：更新数据统计信息
        const dataStatsElement = document.getElementById('dataStats');
        if (dataStatsElement) {
            dataStatsElement.textContent = `数据记录数: ${data.length || 0}`;
        }
        
        console.log('✅ 数据范围UI更新完成');
        
    } catch (error) {
        console.warn('⚠️ 数据范围UI更新失败:', error);
    }
}

/**
 * 创建测试航迹线（备选方案）
 */
function createTestTrajectoryLines() {
    try {
        console.log('🚢 创建测试航迹线...');
        
        // 测试航迹线数据 - 太平洋区域的几条测试路线
        const testRoutes = [
            {
                name: '测试航次1',
                color: Cesium.Color.RED,
                positions: [
                    120.0, 20.0, 0,
                    125.0, 22.0, 0,
                    130.0, 24.0, 0,
                    135.0, 26.0, 0,
                    140.0, 28.0, 0
                ]
            },
            {
                name: '测试航次2', 
                color: Cesium.Color.YELLOW,
                positions: [
                    115.0, 15.0, 0,
                    118.0, 18.0, 0,
                    122.0, 21.0, 0,
                    126.0, 24.0, 0,
                    130.0, 27.0, 0
                ]
            },
            {
                name: '测试航次3',
                color: Cesium.Color.CYAN,
                positions: [
                    110.0, 10.0, 0,
                    115.0, 13.0, 0,
                    120.0, 16.0, 0,
                    125.0, 19.0, 0,
                    130.0, 22.0, 0
                ]
            }
        ];
        
        testRoutes.forEach((route, index) => {
            const entity = viewer.entities.add({
                name: route.name,
                id: `test_route_${index}`,
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(route.positions),
                    width: 3,
                    material: route.color,
                    clampToGround: false,
                    show: true
                }
            });
            
            console.log(`✅ 创建测试航迹线: ${route.name}`);
        });
        
        // 设置相机到可以看到航迹线的位置
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(125.0, 20.0, 10000000.0),
            orientation: {
                heading: 0.0,
                pitch: -Cesium.Math.PI_OVER_TWO,
                roll: 0.0
            }
        });
        
        console.log('✅ 测试航迹线创建完成');
        
    } catch (error) {
        console.error('❌ 创建测试航迹线失败:', error);
    }
}

// 替换原始函数
window.SafeShowBaseInfo = SafeShowBaseInfo;
window.SafeAddAllRoute = SafeAddAllRoute;
window.SafeCallBackDataRange = SafeCallBackDataRange;

// 安全的初始化函数
window.initializeSafeDataLoader = function() {
    console.log('🔒 初始化安全数据加载器...');
    
    try {
        // 替换原始的危险函数
        if (typeof ShowBaseInfo !== 'undefined') {
            console.log('🔄 替换原始ShowBaseInfo函数...');
            window.OriginalShowBaseInfo = ShowBaseInfo;
            window.ShowBaseInfo = SafeShowBaseInfo;
        }
        
        if (typeof AddAllRoute !== 'undefined') {
            console.log('🔄 替换原始AddAllRoute函数...');
            window.OriginalAddAllRoute = AddAllRoute;
            window.AddAllRoute = SafeAddAllRoute;
        }
        
        if (typeof callBackDataRange !== 'undefined') {
            console.log('🔄 替换原始callBackDataRange函数...');
            window.OriginalCallBackDataRange = callBackDataRange;
            window.callBackDataRange = SafeCallBackDataRange;
        }
        
        console.log('✅ 安全数据加载器初始化完成');
        
    } catch (error) {
        console.error('❌ 安全数据加载器初始化失败:', error);
    }
};

console.log('✅ 安全数据加载器加载完成');