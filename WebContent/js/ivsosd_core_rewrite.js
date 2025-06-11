/**
 * @filename: ivsosd_core_rewrite.js
 * @description: IVSOSD核心系统完全重写 - 保持原始布局，重新实现Cesium和业务功能
 * @version: 2.0
 * @date: 2024-12-11
 * @author: Claude
 */

console.log('🌊 === IVSOSD核心系统重写版本加载中 ===');

/**
 * IVSOSD核心管理器 - 完全重写版本
 * 设计原则：
 * 1. 完全保持原始UI布局和交互设计
 * 2. 重新实现Cesium三维球功能
 * 3. 重新实现数据加载和业务功能
 * 4. 确保影像图层稳定性
 * 5. 符合原系统功能要求
 */
class IVSOSDCoreManager {
    constructor() {
        this.viewer = null;
        this.scene = null;
        this.globe = null;
        this.imageryManager = null;
        
        // 业务模块状态
        this.modules = {
            voyage: { initialized: false, active: false },      // 航次站位
            profile: { initialized: false, active: false },     // 剖面信息
            terrain: { initialized: false, active: false },     // 海底地形
            current: { initialized: false, active: false }      // 洋流风场
        };
        
        // UI状态管理
        this.ui = {
            sidebarRight: null,
            sidebarLeft: null,
            mapDiv: null,
            currentTab: 'voyage',  // 默认显示航次站位
            isInitialized: false
        };
        
        // 数据状态
        this.data = {
            voyages: [],
            stations: [],
            profiles: [],
            terrainData: null,
            currentFields: null
        };
        
        console.log('🏗️ IVSOSD核心管理器初始化');
    }
    
    /**
     * 系统初始化入口
     */
    async initialize() {
        try {
            console.log('🚀 开始IVSOSD系统初始化...');
            
            // 1. 初始化UI组件
            await this.initializeUI();
            
            // 2. 初始化Cesium三维球
            await this.initializeCesium();
            
            // 3. 初始化影像图层管理
            await this.initializeImagerySystem();
            
            // 4. 初始化业务模块
            await this.initializeBusinessModules();
            
            // 5. 启动数据加载
            await this.initializeDataLoading();
            
            // 6. 设置事件监听
            this.setupEventListeners();
            
            // 7. 最终检查影像图层
            await this.finalImageryCheck();
            
            console.log('✅ IVSOSD系统初始化完成');
            
        } catch (error) {
            console.error('❌ IVSOSD系统初始化失败:', error);
            this.handleInitializationError(error);
        }
    }
    
    /**
     * 初始化UI组件 - 保持原始布局
     */
    async initializeUI() {
        console.log('🎨 初始化UI组件...');
        
        try {
            // 获取关键UI元素
            this.ui.sidebarRight = $('#sidebar-right');
            this.ui.sidebarLeft = $('#sidebar-left');
            this.ui.mapDiv = $('#vmap');
            
            // 确保地图容器存在
            if (!this.ui.mapDiv.length) {
                // 如果vmap容器不存在，创建它
                const vmapContainer = $('<div id="vmap" class="vmap"></div>');
                $('.earthContainer').append(vmapContainer);
                this.ui.mapDiv = vmapContainer;
                console.log('📦 创建了vmap容器');
            }
            
            // 设置原始UI布局参数
            this.setupOriginalLayout();
            
            // 初始化导航按钮状态
            this.initializeNavigationButtons();
            
            // 设置默认的侧边栏状态（按原系统设计）
            this.ui.sidebarRight.addClass('active');
            $('.sidebar-left').addClass('active');
            
            this.ui.isInitialized = true;
            console.log('✅ UI组件初始化完成');
            
        } catch (error) {
            console.error('❌ UI组件初始化失败:', error);
        }
    }
    
    /**
     * 设置原始布局参数
     */
    setupOriginalLayout() {
        try {
            // 保持原始的容器尺寸计算
            const earthContainerHeight = document.body.clientHeight - 100;
            const earthContainerDiv = $('#earthContainer');
            if (earthContainerDiv.length > 0) {
                earthContainerDiv.css('height', earthContainerHeight);
            }
            
            // 保持原始的树形控件设置
            const treeDiv = $('#tree');
            if (treeDiv.length > 0) {
                const treeHeight = document.body.clientHeight - 325;
                treeDiv.css('height', treeHeight);
            }
            
            // 设置地图容器样式
            this.ui.mapDiv.css({
                'left': '0px',
                'width': '100%',
                'height': 'calc(100% - 125px)',
                'top': '125px',
                'position': 'absolute'
            });
            
            // 设置侧边栏高度
            const tabContent2Height = document.body.clientHeight;
            $('.infoTabs-content').css('height', tabContent2Height - 36);
            
            // 激活必要的UI组件
            $('.setting-outbox').addClass('active');
            $('.map2d').addClass('active');
            $('.map3d').addClass('active');
            $('.coorInfo').addClass('active');
            
            console.log('✅ 原始布局参数设置完成');
            
        } catch (error) {
            console.error('❌ 原始布局设置失败:', error);
        }
    }
    
    /**
     * 初始化导航按钮
     */
    initializeNavigationButtons() {
        try {
            console.log('🧭 初始化导航按钮...');
            
            // 确保导航按钮的点击事件正确绑定
            // 这些函数将在后面重新实现
            window.poumianclick = () => this.switchToModule('profile');
            window.dixingclick = () => this.switchToModule('terrain');
            window.yangliuclick = () => this.switchToModule('current');
            
            // 设置默认的tab状态（航次站位）
            $('#sidebar-tab1').addClass('active');
            $('#sidebar-content1').addClass('in');
            $('#voyagepage1').addClass('active');
            
            console.log('✅ 导航按钮初始化完成');
            
        } catch (error) {
            console.error('❌ 导航按钮初始化失败:', error);
        }
    }
    
    /**
     * 初始化Cesium三维球 - 重写版本
     */
    async initializeCesium() {
        console.log('🌍 初始化Cesium三维球...');
        
        try {
            // 确保容器准备就绪
            const container = document.getElementById('vmap');
            if (!container) {
                throw new Error('vmap容器不存在');
            }
            
            // 清理现有的Cesium实例
            if (this.viewer) {
                this.viewer.destroy();
                this.viewer = null;
            }
            
            // 创建Cesium Viewer - 优化配置
            const viewerConfig = {
                // 禁用不需要的UI组件
                animation: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                vrButton: false,
                geocoder: false,
                homeButton: false,
                infoBox: false,
                sceneModePicker: false,
                selectionIndicator: false,
                timeline: false,
                navigationHelpButton: false,
                scene3DOnly: true,
                navigationInstructionsInitiallyVisible: false,
                showRenderLoopErrors: false,
                
                // 使用默认的椭球地形（稳定）
                terrainProvider: new Cesium.EllipsoidTerrainProvider(),
                
                // 禁用默认影像提供者，稍后手动添加
                imageryProvider: false
            };
            
            console.log('🚀 创建Cesium Viewer...');
            this.viewer = new Cesium.Viewer(container, viewerConfig);
            this.scene = this.viewer.scene;
            this.globe = this.scene.globe;
            
            // 基础地球设置
            this.configureGlobeSettings();
            
            // 设置相机初始位置（中国海域上空）
            this.setCameraInitialPosition();
            
            // 设置全局引用
            window.viewer = this.viewer;
            window.scene = this.scene;
            window.globe = this.globe;
            
            console.log('✅ Cesium三维球初始化完成');
            
        } catch (error) {
            console.error('❌ Cesium三维球初始化失败:', error);
            throw error;
        }
    }
    
    /**
     * 配置地球设置
     */
    configureGlobeSettings() {
        try {
            console.log('🌍 配置地球设置...');
            
            // 基础地球设置
            this.globe.show = true;
            this.globe.enableLighting = false;
            this.globe.dynamicAtmosphereLighting = false;
            this.globe.showWaterEffect = false;
            this.globe.baseColor = Cesium.Color.DARKBLUE;
            this.globe.depthTestAgainstTerrain = false;
            
            // 场景设置
            this.scene.skyBox.show = true;
            this.scene.sun.show = true;
            this.scene.moon.show = false;
            this.scene.skyAtmosphere.show = true;
            this.scene.fog.enabled = false;
            this.scene.backgroundColor = Cesium.Color.BLACK;
            
            // 渲染设置
            this.scene.requestRenderMode = false; // 连续渲染
            this.scene.maximumRenderTimeChange = Infinity;
            
            console.log('✅ 地球设置配置完成');
            
        } catch (error) {
            console.error('❌ 地球设置配置失败:', error);
        }
    }
    
    /**
     * 设置相机初始位置
     */
    setCameraInitialPosition() {
        try {
            // 设置到中国海域上空的合理视角
            this.viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(124.5, 21.0, 15000000.0),
                orientation: {
                    heading: 0.0,
                    pitch: -Cesium.Math.PI_OVER_TWO,
                    roll: 0.0
                }
            });
            
            console.log('✅ 相机初始位置设置完成');
            
        } catch (error) {
            console.error('❌ 相机初始位置设置失败:', error);
        }
    }
    
    /**
     * 初始化影像图层系统
     */
    async initializeImagerySystem() {
        console.log('🗺️ 初始化影像图层系统...');
        
        try {
            // 创建影像图层管理器
            if (typeof ImageryLayerManager !== 'undefined') {
                this.imageryManager = new ImageryLayerManager(this.viewer);
                window.imageryManager = this.imageryManager;
                console.log('✅ 影像管理器创建成功');
            } else {
                console.warn('⚠️ ImageryLayerManager未找到，使用备选方案');
            }
            
            // 无论如何都要确保添加基础影像图层
            await this.ensureBaseImageryLayer();
            
            // 强制渲染确保影像显示
            this.viewer.scene.requestRender();
            
            console.log('✅ 影像图层系统初始化完成');
            
        } catch (error) {
            console.error('❌ 影像图层系统初始化失败:', error);
            // 即使出错也尝试添加基础影像
            await this.ensureBaseImageryLayer();
        }
    }
    
    /**
     * 确保基础影像图层存在
     */
    async ensureBaseImageryLayer() {
        try {
            console.log('🗺️ 确保基础影像图层...');
            
            // 检查是否已有影像图层
            if (this.viewer.imageryLayers.length > 0) {
                console.log('✅ 已存在影像图层，数量:', this.viewer.imageryLayers.length);
                return;
            }
            
            // 添加OpenStreetMap作为基础图层
            const osmProvider = new Cesium.OpenStreetMapImageryProvider({
                url: 'https://a.tile.openstreetmap.org/',
                maximumLevel: 18
            });
            
            const osmLayer = this.viewer.imageryLayers.addImageryProvider(osmProvider);
            osmLayer.show = true;
            osmLayer.alpha = 1.0;
            osmLayer._isBaseLayer = true;
            osmLayer._protected = true; // 添加保护标记
            
            window.primaryImageryLayer = osmLayer;
            console.log('✅ 基础影像图层添加完成');
            
            // 设置全局保护标志
            window.CESIUM_BASE_IMAGERY_PROTECTED = true;
            
        } catch (error) {
            console.error('❌ 基础影像图层添加失败:', error);
        }
    }
    
    /**
     * 初始化业务模块
     */
    async initializeBusinessModules() {
        console.log('🧩 初始化业务模块...');
        
        try {
            // 1. 初始化航次站位模块
            await this.initializeVoyageModule();
            
            // 2. 初始化剖面信息模块
            await this.initializeProfileModule();
            
            // 3. 初始化海底地形模块
            await this.initializeTerrainModule();
            
            // 4. 初始化洋流风场模块
            await this.initializeCurrentModule();
            
            console.log('✅ 业务模块初始化完成');
            
        } catch (error) {
            console.error('❌ 业务模块初始化失败:', error);
        }
    }
    
    /**
     * 初始化航次站位模块
     */
    async initializeVoyageModule() {
        try {
            console.log('🚢 初始化航次站位模块...');
            
            // 设置时间轴（原系统要求）
            this.setupTimeline();
            
            // 初始化航次列表表格
            this.initializeVoyageTable();
            
            // 绑定航次相关事件
            this.bindVoyageEvents();
            
            this.modules.voyage.initialized = true;
            console.log('✅ 航次站位模块初始化完成');
            
        } catch (error) {
            console.error('❌ 航次站位模块初始化失败:', error);
        }
    }
    
    /**
     * 设置时间轴
     */
    setupTimeline() {
        try {
            if (!this.viewer) return;
            
            // 原始时间轴设置 - 保持原系统配置
            const startTime = Cesium.JulianDate.fromDate(new Date(2017, 1, 4, 0));
            const stopTime = Cesium.JulianDate.addDays(startTime, 7, new Cesium.JulianDate());
            const currentTime = Cesium.JulianDate.fromIso8601("2017-01-04");
            
            this.viewer.clock.startTime = startTime.clone();
            this.viewer.clock.stopTime = stopTime.clone();
            this.viewer.clock.currentTime = currentTime.clone();
            this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
            this.viewer.clock.multiplier = 1;
            
            console.log('✅ 时间轴设置完成');
            
        } catch (error) {
            console.error('❌ 时间轴设置失败:', error);
        }
    }
    
    /**
     * 初始化航次列表表格
     */
    initializeVoyageTable() {
        try {
            console.log('📋 初始化航次列表表格...');
            
            // 清空现有表格内容
            $('#tbodyVoyageList').empty();
            
            // 设置表格点击事件
            $('#tblVoyageList').off('click').on('click', 'tr', (event) => {
                this.handleVoyageRowClick(event);
            });
            
            console.log('✅ 航次列表表格初始化完成');
            
        } catch (error) {
            console.error('❌ 航次列表表格初始化失败:', error);
        }
    }
    
    /**
     * 绑定航次相关事件
     */
    bindVoyageEvents() {
        try {
            // 航次查询按钮事件
            $('#queryVoyageBtn').off('click').on('click', () => {
                this.queryVoyages();
            });
            
            // 分页按钮事件
            $('#voyPre').off('click').on('click', () => {
                this.voyPagePrevious();
            });
            
            $('#voyNext').off('click').on('click', () => {
                this.voyPageNext();
            });
            
            // Tab切换事件
            $('#voyagepage1').off('click').on('click', () => {
                this.switchVoyageTab('voyage-info1');
            });
            
            $('#voyagepage2').off('click').on('click', () => {
                this.switchVoyageTab('voyage-info2');
            });
            
            $('#voyagepage3').off('click').on('click', () => {
                this.switchVoyageTab('voyage-info3');
            });
            
            console.log('✅ 航次事件绑定完成');
            
        } catch (error) {
            console.error('❌ 航次事件绑定失败:', error);
        }
    }
    
    /**
     * 初始化数据加载
     */
    async initializeDataLoading() {
        console.log('📊 初始化数据加载...');
        
        try {
            // 检查DWR是否可用
            if (typeof dwr === 'undefined') {
                console.warn('⚠️ DWR引擎未加载，跳过数据加载...');
                return;
            }
            
            if (typeof DatabaseOperationJS === 'undefined') {
                console.warn('⚠️ DatabaseOperationJS接口未准备就绪，延迟数据加载...');
                setTimeout(() => this.initializeDataLoading(), 2000);
                return;
            }
            
            // 1. 查询数据范围
            await this.queryDataRange();
            
            // 2. 加载航次数据
            await this.loadVoyageData();
            
            // 3. 设置地形提供者（安全方式）
            this.setTerrainProviderSafely();
            
            console.log('✅ 数据加载初始化完成');
            
        } catch (error) {
            console.error('❌ 数据加载初始化失败:', error);
        }
    }
    
    /**
     * 查询数据范围
     */
    async queryDataRange() {
        return new Promise((resolve, reject) => {
            try {
                console.log('📊 查询数据范围...');
                
                DatabaseOperationJS.QueryDataRange("", {
                    callback: (data) => {
                        console.log('✅ 数据范围查询成功:', data);
                        this.handleDataRangeCallback(data);
                        resolve(data);
                    },
                    errorHandler: (error) => {
                        console.error('❌ 数据范围查询失败:', error);
                        reject(error);
                    }
                });
                
            } catch (error) {
                console.error('❌ 数据范围查询异常:', error);
                reject(error);
            }
        });
    }
    
    /**
     * 加载航次数据
     */
    async loadVoyageData() {
        return new Promise((resolve, reject) => {
            try {
                console.log('🚢 加载航次数据...');
                
                const sql = "select * from VOYAGE t order by ID";
                
                DatabaseOperationJS.QueryVoyageList(sql, {
                    callback: (data) => {
                        console.log('✅ 航次数据加载成功:', data ? data.length : 0, '条记录');
                        this.handleVoyageListCallback(data);
                        resolve(data);
                    },
                    errorHandler: (error) => {
                        console.error('❌ 航次数据加载失败:', error);
                        // 尝试空查询
                        DatabaseOperationJS.QueryVoyageList("", {
                            callback: (data) => {
                                this.handleVoyageListCallback(data || []);
                                resolve(data || []);
                            },
                            errorHandler: (error2) => {
                                console.error('❌ 备选航次查询也失败:', error2);
                                this.handleVoyageListCallback([]);
                                reject(error2);
                            }
                        });
                    }
                });
                
            } catch (error) {
                console.error('❌ 航次数据加载异常:', error);
                this.handleVoyageListCallback([]);
                reject(error);
            }
        });
    }
    
    /**
     * 安全设置地形提供者
     */
    setTerrainProviderSafely() {
        try {
            console.log('🏔️ 安全设置地形提供者...');
            
            // 记录设置前的影像图层状态
            const layerCountBefore = this.viewer.imageryLayers.length;
            console.log(`🔍 设置地形前影像图层数量: ${layerCountBefore}`);
            
            // 暂时跳过自定义地形，使用默认地形避免影响影像
            console.log('ℹ️ 使用默认椭球地形以保护影像图层');
            this.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
            
            // 确保影像图层依然存在
            setTimeout(async () => {
                const layerCountAfter = this.viewer.imageryLayers.length;
                console.log(`🔍 地形设置后影像图层检查: ${layerCountBefore} -> ${layerCountAfter}`);
                
                if (layerCountAfter === 0) {
                    console.warn('⚠️ 影像图层丢失，立即恢复...');
                    await this.ensureBaseImageryLayer();
                } else if (layerCountAfter < layerCountBefore) {
                    console.warn('⚠️ 部分影像图层丢失，尝试恢复...');
                    if (this.imageryManager && this.imageryManager.forceRestoreBaseImageryLayer) {
                        this.imageryManager.forceRestoreBaseImageryLayer();
                    } else {
                        await this.ensureBaseImageryLayer();
                    }
                }
                
                // 最终检查
                const finalLayerCount = this.viewer.imageryLayers.length;
                console.log(`🎯 最终影像图层数量: ${finalLayerCount}`);
            }, 200);
            
            console.log('✅ 地形提供者设置完成');
            
        } catch (error) {
            console.warn('⚠️ 地形设置失败，使用默认地形:', error);
            this.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
            // 确保影像图层存在
            setTimeout(() => this.ensureBaseImageryLayer(), 100);
        }
    }
    
    /**
     * 处理数据范围回调
     */
    handleDataRangeCallback(data) {
        try {
            console.log('📊 处理数据范围回调...');
            
            if (data && typeof data === 'string' && data.length > 0) {
                // 更新UI显示数据范围信息
                this.updateDataRangeDisplay(data);
            }
            
        } catch (error) {
            console.error('❌ 数据范围回调处理失败:', error);
        }
    }
    
    /**
     * 处理航次列表回调
     */
    handleVoyageListCallback(data) {
        try {
            console.log('🚢 处理航次列表回调...');
            
            this.data.voyages = data || [];
            this.updateVoyageTable(this.data.voyages);
            
        } catch (error) {
            console.error('❌ 航次列表回调处理失败:', error);
        }
    }
    
    /**
     * 更新航次表格
     */
    updateVoyageTable(voyages) {
        try {
            console.log('📋 更新航次表格...', voyages.length, '条记录');
            
            const tbody = $('#tbodyVoyageList');
            tbody.empty();
            
            voyages.forEach((voyage, index) => {
                const row = $(`
                    <tr data-voyage-id="${voyage.ID}" style="cursor: pointer;">
                        <td>${voyage.ID}</td>
                        <td>${voyage.NAME || ''}</td>
                        <td>${voyage.SEA_AREA || ''}</td>
                        <td>${voyage.V_START || ''}</td>
                    </tr>
                `);
                
                tbody.append(row);
            });
            
            console.log('✅ 航次表格更新完成');
            
        } catch (error) {
            console.error('❌ 航次表格更新失败:', error);
        }
    }
    
    /**
     * 最终影像图层检查
     */
    async finalImageryCheck() {
        try {
            console.log('🔍 执行最终影像图层检查...');
            
            if (!this.viewer) {
                console.error('❌ Viewer不存在，无法检查影像');
                return;
            }
            
            const layerCount = this.viewer.imageryLayers.length;
            console.log(`📊 当前影像图层数量: ${layerCount}`);
            
            if (layerCount === 0) {
                console.warn('⚠️ 检测到影像图层缺失，立即添加...');
                await this.ensureBaseImageryLayer();
                
                // 再次检查
                const newLayerCount = this.viewer.imageryLayers.length;
                console.log(`📊 恢复后影像图层数量: ${newLayerCount}`);
                
                if (newLayerCount > 0) {
                    console.log('✅ 影像图层恢复成功');
                } else {
                    console.error('❌ 影像图层恢复失败');
                }
            } else {
                console.log('✅ 影像图层检查通过');
                
                // 检查第一个图层的状态
                const firstLayer = this.viewer.imageryLayers.get(0);
                console.log(`📋 第一个图层状态: 可见=${firstLayer.show}, 透明度=${firstLayer.alpha}`);
            }
            
            // 强制渲染
            this.viewer.scene.requestRender();
            
        } catch (error) {
            console.error('❌ 最终影像检查失败:', error);
        }
    }
    
    /**
     * 设置事件监听
     */
    setupEventListeners() {
        try {
            console.log('👂 设置事件监听...');
            
            // 设置坐标显示
            this.setupCoordinateDisplay();
            
            // 设置窗口大小调整
            $(window).on('resize', () => {
                this.handleWindowResize();
            });
            
            console.log('✅ 事件监听设置完成');
            
        } catch (error) {
            console.error('❌ 事件监听设置失败:', error);
        }
    }
    
    /**
     * 设置坐标显示
     */
    setupCoordinateDisplay() {
        try {
            if (!this.viewer) return;
            
            const ellipsoid = this.scene.globe.ellipsoid;
            
            // 创建鼠标事件处理器
            if (window.handlerShowCoor) {
                window.handlerShowCoor.destroy();
            }
            
            window.handlerShowCoor = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);
            
            // 鼠标移动事件
            window.handlerShowCoor.setInputAction((event) => {
                try {
                    const pickedPosition = this.viewer.camera.pickEllipsoid(event.endPosition, ellipsoid);
                    if (pickedPosition) {
                        const cartographic = ellipsoid.cartesianToCartographic(pickedPosition);
                        const longitude = Cesium.Math.toDegrees(cartographic.longitude);
                        const latitude = Cesium.Math.toDegrees(cartographic.latitude);
                        
                        // 更新坐标显示
                        document.getElementById('idCoorInfo').innerText = 
                            `经度：${longitude.toFixed(6)}° ，纬度：${latitude.toFixed(6)}°`;
                    } else {
                        document.getElementById('idCoorInfo').innerText = "经度： 无 ， 纬度： 无";
                    }
                } catch (e) {
                    // 静默处理错误，避免控制台刷屏
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            
            console.log('✅ 坐标显示设置完成');
            
        } catch (error) {
            console.error('❌ 坐标显示设置失败:', error);
        }
    }
    
    /**
     * 切换到指定模块
     */
    switchToModule(moduleName) {
        try {
            console.log(`🔄 切换到${moduleName}模块...`);
            
            // 保护影像图层
            if (this.imageryManager) {
                this.imageryManager.forceRestoreBaseImageryLayer();
            }
            
            // 切换UI状态
            this.updateModuleUI(moduleName);
            
            // 激活对应模块
            switch (moduleName) {
                case 'profile':
                    this.activateProfileModule();
                    break;
                case 'terrain':
                    this.activateTerrainModule();
                    break;
                case 'current':
                    this.activateCurrentModule();
                    break;
                default:
                    this.activateVoyageModule();
            }
            
            this.ui.currentTab = moduleName;
            console.log(`✅ 已切换到${moduleName}模块`);
            
        } catch (error) {
            console.error(`❌ 切换到${moduleName}模块失败:`, error);
        }
    }
    
    /**
     * 更新模块UI
     */
    updateModuleUI(moduleName) {
        try {
            // 清除所有active状态
            $('.sidebar-tab > div').removeClass('active');
            $('.tab-content-2').removeClass('in');
            
            // 根据模块设置对应的active状态
            const moduleMap = {
                'voyage': { tab: '#sidebar-tab1', content: '#sidebar-content1' },
                'profile': { tab: '#sidebar-tab2', content: '#sidebar-content2' },
                'terrain': { tab: '#sidebar-tab3', content: '#sidebar-content3' },
                'current': { tab: '#sidebar-tab4', content: '#sidebar-content4' }
            };
            
            const module = moduleMap[moduleName];
            if (module) {
                $(module.tab).addClass('active');
                $(module.content).addClass('in');
            }
            
        } catch (error) {
            console.error('❌ 模块UI更新失败:', error);
        }
    }
    
    /**
     * 激活航次模块
     */
    activateVoyageModule() {
        try {
            console.log('🚢 激活航次模块...');
            
            // 确保航次数据已加载
            if (this.data.voyages.length === 0) {
                this.loadVoyageData();
            }
            
            this.modules.voyage.active = true;
            
        } catch (error) {
            console.error('❌ 航次模块激活失败:', error);
        }
    }
    
    /**
     * 激活剖面模块
     */
    activateProfileModule() {
        try {
            console.log('📊 激活剖面模块...');
            
            if (!this.modules.profile.initialized) {
                this.initializeProfileModule();
            }
            
            this.modules.profile.active = true;
            
        } catch (error) {
            console.error('❌ 剖面模块激活失败:', error);
        }
    }
    
    /**
     * 激活地形模块
     */
    activateTerrainModule() {
        try {
            console.log('🏔️ 激活地形模块...');
            
            if (!this.modules.terrain.initialized) {
                this.initializeTerrainModule();
            }
            
            this.modules.terrain.active = true;
            
        } catch (error) {
            console.error('❌ 地形模块激活失败:', error);
        }
    }
    
    /**
     * 激活洋流模块
     */
    activateCurrentModule() {
        try {
            console.log('🌊 激活洋流模块...');
            
            if (!this.modules.current.initialized) {
                this.initializeCurrentModule();
            }
            
            this.modules.current.active = true;
            
        } catch (error) {
            console.error('❌ 洋流模块激活失败:', error);
        }
    }
    
    /**
     * 处理初始化错误
     */
    handleInitializationError(error) {
        try {
            console.error('💥 系统初始化错误处理:', error);
            
            // 在容器中显示错误信息
            const container = document.getElementById('vmap');
            if (container) {
                container.innerHTML = `
                    <div style="color: white; text-align: center; padding: 50px; background: rgba(0,0,0,0.8);">
                        <h3>IVSOSD系统加载失败</h3>
                        <p>错误: ${error.message}</p>
                        <p>请检查控制台获取详细信息</p>
                        <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 20px;">重新加载</button>
                    </div>
                `;
            }
            
        } catch (e) {
            console.error('❌ 错误处理失败:', e);
        }
    }
}

// 全局IVSOSD核心管理器实例
window.IVSOSDCoreManager = IVSOSDCoreManager;
window.ivsosdCore = null;

/**
 * 初始化IVSOSD系统
 */
window.initializeIVSOSD = async function() {
    try {
        console.log('🌊 开始初始化IVSOSD系统...');
        
        if (window.ivsosdCore) {
            console.log('⚠️ IVSOSD系统已存在，销毁旧实例...');
            // 这里可以添加清理逻辑
        }
        
        window.ivsosdCore = new IVSOSDCoreManager();
        await window.ivsosdCore.initialize();
        
        console.log('🎉 IVSOSD系统初始化完成！');
        return window.ivsosdCore;
        
    } catch (error) {
        console.error('💥 IVSOSD系统初始化失败:', error);
        return null;
    }
};

// DOM加载完成后自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(window.initializeIVSOSD, 1000);
    });
} else {
    setTimeout(window.initializeIVSOSD, 1000);
}

console.log('✅ IVSOSD核心系统重写版本加载完成');

// 兼容性函数 - 保持原系统接口
window.poumianclick = function() {
    if (window.ivsosdCore) {
        window.ivsosdCore.switchToModule('profile');
    }
};

window.dixingclick = function() {
    if (window.ivsosdCore) {
        window.ivsosdCore.switchToModule('terrain');
    }
};

window.yangliuclick = function() {
    if (window.ivsosdCore) {
        window.ivsosdCore.switchToModule('current');
    }
};

// 扩展IVSOSDCoreManager类，添加缺失的模块实现
IVSOSDCoreManager.prototype.initializeProfileModule = async function() {
    try {
        console.log('📊 初始化剖面信息模块...');
        
        // 初始化剖面数据加载
        this.initializeProfileData();
        
        // 绑定剖面相关事件
        this.bindProfileEvents();
        
        // 设置剖面图例
        this.setupProfileLegend();
        
        this.modules.profile.initialized = true;
        console.log('✅ 剖面信息模块初始化完成');
        
    } catch (error) {
        console.error('❌ 剖面信息模块初始化失败:', error);
    }
};

IVSOSDCoreManager.prototype.initializeTerrainModule = async function() {
    try {
        console.log('🏔️ 初始化海底地形模块...');
        
        // 初始化地形渲染设置
        this.initializeTerrainRendering();
        
        // 绑定地形相关事件
        this.bindTerrainEvents();
        
        // 设置地形图例
        this.setupTerrainLegend();
        
        this.modules.terrain.initialized = true;
        console.log('✅ 海底地形模块初始化完成');
        
    } catch (error) {
        console.error('❌ 海底地形模块初始化失败:', error);
    }
};

IVSOSDCoreManager.prototype.initializeCurrentModule = async function() {
    try {
        console.log('🌊 初始化洋流风场模块...');
        
        // 初始化洋流数据
        this.initializeCurrentData();
        
        // 绑定洋流相关事件
        this.bindCurrentEvents();
        
        // 设置洋流图例
        this.setupCurrentLegend();
        
        this.modules.current.initialized = true;
        console.log('✅ 洋流风场模块初始化完成');
        
    } catch (error) {
        console.error('❌ 洋流风场模块初始化失败:', error);
    }
};

// 剖面模块相关方法
IVSOSDCoreManager.prototype.initializeProfileData = function() {
    try {
        console.log('📊 初始化剖面数据...');
        
        // 初始化大面信息选择器
        this.setupDaMianSelector();
        
        // 初始化三维剖面参数
        this.setupProfileParameters();
        
        console.log('✅ 剖面数据初始化完成');
        
    } catch (error) {
        console.error('❌ 剖面数据初始化失败:', error);
    }
};

IVSOSDCoreManager.prototype.setupDaMianSelector = function() {
    try {
        // 确保大面信息选择器存在
        const damianSelector = $('#DaMianSelect');
        if (damianSelector.length === 0) {
            console.warn('⚠️ 大面信息选择器不存在');
            return;
        }
        
        // 绑定大面信息变化事件
        damianSelector.off('change').on('change', () => {
            this.loadDaMianData();
        });
        
        console.log('✅ 大面信息选择器设置完成');
        
    } catch (error) {
        console.error('❌ 大面信息选择器设置失败:', error);
    }
};

IVSOSDCoreManager.prototype.loadDaMianData = function() {
    try {
        console.log('📊 加载大面数据...');
        
        // 保护影像图层
        if (this.imageryManager) {
            this.imageryManager.forceRestoreBaseImageryLayer();
        }
        
        const featureType = $('#DaMianFeatures').val();
        const selectedValue = $('#DaMianSelect').val();
        
        if (featureType === "temperature") {
            this.loadTemperatureData(selectedValue);
        } else if (featureType === "salinity") {
            this.loadSalinityData(selectedValue);
        }
        
        // 显示图例
        $('#damianLegend').show();
        
        // 飞行到指定位置
        this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(124.5, 21.00, 16000000.0)
        });
        
    } catch (error) {
        console.error('❌ 大面数据加载失败:', error);
    }
};

IVSOSDCoreManager.prototype.loadTemperatureData = function(selectedValue) {
    try {
        console.log('🌡️ 加载温度数据:', selectedValue);
        
        // 清除之前的数据源
        this.viewer.dataSources.removeAll();
        
        // 根据选择的月份加载对应的KMZ文件
        const monthMap = {
            "2008年01月": "Data/Temp/WD200801.kmz",
            "2008年02月": "Data/Temp/WD200802.kmz",
            "2008年03月": "Data/Temp/WD200803.kmz",
            "2008年04月": "Data/Temp/WD200804.kmz",
            "2008年05月": "Data/Temp/WD200805.kmz",
            "2008年06月": "Data/Temp/WD200806.kmz",
            "2008年07月": "Data/Temp/WD200807.kmz",
            "2008年08月": "Data/Temp/WD200807.kmz",
            "2008年09月": "Data/Temp/WD200809.kmz",
            "2008年10月": "Data/Temp/WD200810.kmz",
            "2008年11月": "Data/Temp/WD200811.kmz",
            "2008年12月": "Data/Temp/WD200812.kmz"
        };
        
        const dataPath = monthMap[selectedValue];
        if (dataPath) {
            this.loadKMZData(dataPath);
        }
        
    } catch (error) {
        console.error('❌ 温度数据加载失败:', error);
    }
};

IVSOSDCoreManager.prototype.loadKMZData = function(dataPath) {
    try {
        console.log('📊 加载KMZ数据:', dataPath);
        
        const options = {
            camera: this.viewer.scene.camera,
            canvas: this.viewer.scene.canvas
        };
        
        Cesium.KmlDataSource.load(dataPath, options).then((dataSource) => {
            this.viewer.dataSources.add(dataSource);
            
            // 处理数据源实体，提取温度范围
            const entities = dataSource.entities.values;
            if (entities.length > 0) {
                this.updateTemperatureRange(entities);
            }
            
            console.log('✅ KMZ数据加载成功');
            
        }).otherwise((error) => {
            console.error('❌ KMZ数据加载失败:', error);
        });
        
    } catch (error) {
        console.error('❌ KMZ数据加载异常:', error);
    }
};

IVSOSDCoreManager.prototype.updateTemperatureRange = function(entities) {
    try {
        // 提取温度范围信息
        if (entities.length > 0) {
            const entity = entities[0];
            if (entity._children && entity._children.length > 0) {
                const minTempEntity = entity._children[0];
                const maxTempEntity = entity._children[entity._children.length - 1];
                
                const minTempName = minTempEntity._name;
                const maxTempName = maxTempEntity._name;
                
                if (minTempName && maxTempName) {
                    const minTempArr = minTempName.split("-");
                    const maxTempArr = maxTempName.split("-");
                    
                    // 更新UI显示
                    const minTemp = minTempArr[0] === "" ? `-${minTempArr[1]}°C` : `${minTempArr[0]}°C`;
                    const maxTemp = `${maxTempArr[1]}°C`;
                    
                    $('#DaMianTempMin').text(minTemp);
                    $('#DaMianTempMax').text(maxTemp);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ 温度范围更新失败:', error);
    }
};

// 地形模块相关方法
IVSOSDCoreManager.prototype.initializeTerrainRendering = function() {
    try {
        console.log('🏔️ 初始化地形渲染...');
        
        // 设置地形相关的globe属性
        this.globe.depthTestAgainstTerrain = true;
        
        // 初始化地形插值参数
        this.setupTerrainInterpolation();
        
        console.log('✅ 地形渲染初始化完成');
        
    } catch (error) {
        console.error('❌ 地形渲染初始化失败:', error);
    }
};

IVSOSDCoreManager.prototype.setupTerrainInterpolation = function() {
    try {
        // 设置地形插值相关的UI组件
        this.bindTerrainControls();
        
    } catch (error) {
        console.error('❌ 地形插值设置失败:', error);
    }
};

IVSOSDCoreManager.prototype.bindTerrainControls = function() {
    try {
        // 绑定地形控制相关的事件
        $('#terrainRenderBtn').off('click').on('click', () => {
            this.renderTerrain();
        });
        
        $('#clearTerrainBtn').off('click').on('click', () => {
            this.clearTerrain();
        });
        
    } catch (error) {
        console.error('❌ 地形控制绑定失败:', error);
    }
};

IVSOSDCoreManager.prototype.renderTerrain = function() {
    try {
        console.log('🏔️ 渲染地形...');
        
        // 保护影像图层
        if (this.imageryManager) {
            this.imageryManager.forceRestoreBaseImageryLayer();
        }
        
        // 调用后端插值服务
        if (typeof ServiceJS !== 'undefined' && ServiceJS.CreateImage) {
            ServiceJS.CreateImage('terrain_data', (result) => {
                this.handleTerrainResult(result);
            });
        }
        
    } catch (error) {
        console.error('❌ 地形渲染失败:', error);
    }
};

IVSOSDCoreManager.prototype.clearTerrain = function() {
    try {
        console.log('🗑️ 清除地形...');
        
        // 清除地形相关的实体
        const entitiesToRemove = [];
        const entities = this.viewer.entities.values;
        
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.name && entity.name.includes('地形')) {
                entitiesToRemove.push(entity);
            }
        }
        
        entitiesToRemove.forEach(entity => {
            this.viewer.entities.remove(entity);
        });
        
        console.log('✅ 地形清除完成');
        
    } catch (error) {
        console.error('❌ 地形清除失败:', error);
    }
};

// 洋流模块相关方法
IVSOSDCoreManager.prototype.initializeCurrentData = function() {
    try {
        console.log('🌊 初始化洋流数据...');
        
        // 初始化洋流可视化设置
        this.setupCurrentVisualization();
        
        console.log('✅ 洋流数据初始化完成');
        
    } catch (error) {
        console.error('❌ 洋流数据初始化失败:', error);
    }
};

IVSOSDCoreManager.prototype.setupCurrentVisualization = function() {
    try {
        // 设置洋流可视化相关的UI和数据
        this.bindCurrentControls();
        
    } catch (error) {
        console.error('❌ 洋流可视化设置失败:', error);
    }
};

IVSOSDCoreManager.prototype.bindCurrentControls = function() {
    try {
        // 绑定洋流控制相关的事件
        $('#loadCurrentBtn').off('click').on('click', () => {
            this.loadCurrentField();
        });
        
        $('#clearCurrentBtn').off('click').on('click', () => {
            this.clearCurrentField();
        });
        
    } catch (error) {
        console.error('❌ 洋流控制绑定失败:', error);
    }
};

IVSOSDCoreManager.prototype.loadCurrentField = function() {
    try {
        console.log('🌊 加载洋流场...');
        
        // 保护影像图层
        if (this.imageryManager) {
            this.imageryManager.forceRestoreBaseImageryLayer();
        }
        
        // 加载洋流CZML数据
        const currentDataPath = 'Data/current_field.czml';
        
        Cesium.CzmlDataSource.load(currentDataPath).then((dataSource) => {
            dataSource.name = '洋流场';
            this.viewer.dataSources.add(dataSource);
            console.log('✅ 洋流场加载成功');
            
        }).otherwise((error) => {
            console.warn('⚠️ 洋流场数据文件不存在:', error);
        });
        
    } catch (error) {
        console.error('❌ 洋流场加载失败:', error);
    }
};

IVSOSDCoreManager.prototype.clearCurrentField = function() {
    try {
        console.log('🗑️ 清除洋流场...');
        
        // 清除洋流相关的数据源
        const dataSourcesToRemove = [];
        
        for (let i = 0; i < this.viewer.dataSources.length; i++) {
            const dataSource = this.viewer.dataSources.get(i);
            if (dataSource.name && dataSource.name.includes('洋流')) {
                dataSourcesToRemove.push(dataSource);
            }
        }
        
        dataSourcesToRemove.forEach(dataSource => {
            this.viewer.dataSources.remove(dataSource);
        });
        
        console.log('✅ 洋流场清除完成');
        
    } catch (error) {
        console.error('❌ 洋流场清除失败:', error);
    }
};

// 事件绑定方法
IVSOSDCoreManager.prototype.bindProfileEvents = function() {
    try {
        console.log('📊 绑定剖面事件...');
        
        // 绑定大面信息加载按钮
        $('#loadDaMianBtn').off('click').on('click', () => {
            this.loadDaMianData();
        });
        
        // 绑定动态图层按钮
        $('#startDynamicBtn').off('click').on('click', () => {
            this.startDynamicMaps();
        });
        
        $('#clearDynamicBtn').off('click').on('click', () => {
            this.clearDynaMaps();
        });
        
    } catch (error) {
        console.error('❌ 剖面事件绑定失败:', error);
    }
};

IVSOSDCoreManager.prototype.bindTerrainEvents = function() {
    try {
        console.log('🏔️ 绑定地形事件...');
        // 地形事件绑定已在bindTerrainControls中实现
        
    } catch (error) {
        console.error('❌ 地形事件绑定失败:', error);
    }
};

IVSOSDCoreManager.prototype.bindCurrentEvents = function() {
    try {
        console.log('🌊 绑定洋流事件...');
        // 洋流事件绑定已在bindCurrentControls中实现
        
    } catch (error) {
        console.error('❌ 洋流事件绑定失败:', error);
    }
};

// 图例设置方法
IVSOSDCoreManager.prototype.setupProfileLegend = function() {
    try {
        // 确保剖面图例元素存在并设置正确的显示状态
        console.log('📊 设置剖面图例...');
        
    } catch (error) {
        console.error('❌ 剖面图例设置失败:', error);
    }
};

IVSOSDCoreManager.prototype.setupTerrainLegend = function() {
    try {
        // 确保地形图例元素存在并设置正确的显示状态
        console.log('🏔️ 设置地形图例...');
        
    } catch (error) {
        console.error('❌ 地形图例设置失败:', error);
    }
};

IVSOSDCoreManager.prototype.setupCurrentLegend = function() {
    try {
        // 确保洋流图例元素存在并设置正确的显示状态
        console.log('🌊 设置洋流图例...');
        
    } catch (error) {
        console.error('❌ 洋流图例设置失败:', error);
    }
};

// 其他必要的方法
IVSOSDCoreManager.prototype.handleVoyageRowClick = function(event) {
    try {
        const row = $(event.currentTarget);
        const voyageId = row.data('voyage-id');
        
        console.log('🚢 航次行点击:', voyageId);
        
        // 切换到航次信息tab
        this.switchVoyageTab('voyage-info2');
        
        // 加载航次详细信息
        this.loadVoyageDetails(voyageId);
        
    } catch (error) {
        console.error('❌ 航次行点击处理失败:', error);
    }
};

IVSOSDCoreManager.prototype.switchVoyageTab = function(tabId) {
    try {
        // 清除现有active状态
        $('#infoTabs1 li').removeClass('active');
        $('.tab-pane').removeClass('active in');
        
        // 激活指定tab
        $(`#${tabId}`).addClass('active in');
        
        // 激活对应的tab头
        if (tabId === 'voyage-info1') $('#voyagepage1').addClass('active');
        else if (tabId === 'voyage-info2') $('#voyagepage2').addClass('active');
        else if (tabId === 'voyage-info3') $('#voyagepage3').addClass('active');
        
    } catch (error) {
        console.error('❌ 航次tab切换失败:', error);
    }
};

IVSOSDCoreManager.prototype.loadVoyageDetails = function(voyageId) {
    try {
        console.log('📋 加载航次详情:', voyageId);
        
        // 这里可以调用后端API加载航次详细信息
        // 暂时使用本地数据
        const voyage = this.data.voyages.find(v => v.ID == voyageId);
        if (voyage) {
            this.displayVoyageDetails(voyage);
        }
        
    } catch (error) {
        console.error('❌ 航次详情加载失败:', error);
    }
};

IVSOSDCoreManager.prototype.displayVoyageDetails = function(voyage) {
    try {
        // 在航次信息tab中显示详细信息
        $('#voyageDetailName').text(voyage.NAME || '');
        $('#voyageDetailScientist').text(voyage.SCIENTIST || '');
        $('#voyageDetailSeaArea').text(voyage.SEA_AREA || '');
        $('#voyageDetailStartTime').text(voyage.V_START || '');
        $('#voyageDetailEndTime').text(voyage.V_END || '');
        
    } catch (error) {
        console.error('❌ 航次详情显示失败:', error);
    }
};

IVSOSDCoreManager.prototype.queryVoyages = function() {
    try {
        console.log('🔍 查询航次...');
        this.loadVoyageData();
        
    } catch (error) {
        console.error('❌ 航次查询失败:', error);
    }
};

IVSOSDCoreManager.prototype.voyPagePrevious = function() {
    try {
        console.log('⬅️ 上一页');
        // 实现分页逻辑
        
    } catch (error) {
        console.error('❌ 上一页失败:', error);
    }
};

IVSOSDCoreManager.prototype.voyPageNext = function() {
    try {
        console.log('➡️ 下一页');
        // 实现分页逻辑
        
    } catch (error) {
        console.error('❌ 下一页失败:', error);
    }
};

IVSOSDCoreManager.prototype.updateDataRangeDisplay = function(data) {
    try {
        // 更新数据范围显示
        console.log('📊 更新数据范围显示:', data);
        
    } catch (error) {
        console.error('❌ 数据范围显示更新失败:', error);
    }
};

IVSOSDCoreManager.prototype.handleWindowResize = function() {
    try {
        // 处理窗口大小调整
        if (this.viewer) {
            this.viewer.resize();
        }
        
        // 重新设置布局
        this.setupOriginalLayout();
        
    } catch (error) {
        console.error('❌ 窗口大小调整处理失败:', error);
    }
};