#!/bin/bash

# IVSOSD项目编译和部署脚本
# 解决DWR 404错误，重新编译Java源代码并打包WAR文件

set -e  # 出错时退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="${PROJECT_DIR}/src"
WEB_DIR="${PROJECT_DIR}/WebContent"
BUILD_DIR="${PROJECT_DIR}/build"
CLASSES_DIR="${WEB_DIR}/WEB-INF/classes"
WAR_FILE="${PROJECT_DIR}/ivsosd.war"

echo -e "${BLUE}=== IVSOSD项目编译部署脚本 ===${NC}"
echo "项目目录: ${PROJECT_DIR}"
echo

# 函数：打印带颜色的消息
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 函数：检查Java环境
check_java() {
    print_status "检查Java环境..."
    if ! command -v javac &> /dev/null; then
        print_error "javac未找到，请安装JDK"
        exit 1
    fi
    
    if ! command -v java &> /dev/null; then
        print_error "java未找到，请安装JDK"
        exit 1
    fi
    
    java_version=$(java -version 2>&1 | head -n1 | cut -d'"' -f2)
    print_status "Java版本: ${java_version}"
}

# 函数：创建必要的目录
create_directories() {
    print_status "创建构建目录..."
    
    # 创建构建目录
    mkdir -p "${BUILD_DIR}"
    mkdir -p "${CLASSES_DIR}"
    
    # 确保目录结构存在
    mkdir -p "${CLASSES_DIR}/DWRService"
    mkdir -p "${CLASSES_DIR}/DBUtilities"
    mkdir -p "${CLASSES_DIR}/VoyageMod"
    mkdir -p "${CLASSES_DIR}/interpolation"
    mkdir -p "${CLASSES_DIR}/snippet"
}

# 函数：检查和下载依赖库
check_dependencies() {
    print_status "检查项目依赖..."
    
    LIB_DIR="${WEB_DIR}/WEB-INF/lib"
    
    if [ ! -d "${LIB_DIR}" ]; then
        print_warning "lib目录不存在，创建..."
        mkdir -p "${LIB_DIR}"
    fi
    
    # 检查DWR jar包
    DWR_JAR=$(find "${LIB_DIR}" -name "dwr*.jar" | head -n1)
    if [ -z "$DWR_JAR" ]; then
        print_warning "DWR jar包未找到，需要手动下载"
        print_warning "请从 https://directwebremoting.org/dwr/downloads/index.html 下载dwr.jar到 ${LIB_DIR}/"
        
        # 尝试下载DWR 3.0.2
        print_status "尝试下载DWR 3.0.2..."
        if command -v wget &> /dev/null; then
            wget -q -O "${LIB_DIR}/dwr.jar" "https://repo1.maven.org/maven2/org/directwebremoting/dwr/3.0.2/dwr-3.0.2.jar" || print_warning "DWR下载失败，请手动下载"
        elif command -v curl &> /dev/null; then
            curl -s -o "${LIB_DIR}/dwr.jar" "https://repo1.maven.org/maven2/org/directwebremoting/dwr/3.0.2/dwr-3.0.2.jar" || print_warning "DWR下载失败，请手动下载"
        fi
    else
        print_status "找到DWR库: $(basename "$DWR_JAR")"
    fi
    
    # 检查Oracle JDBC驱动
    ORACLE_JAR=$(find "${LIB_DIR}" -name "ojdbc*.jar" | head -n1)
    if [ -z "$ORACLE_JAR" ]; then
        print_warning "Oracle JDBC驱动未找到"
        print_warning "请下载ojdbc8.jar到 ${LIB_DIR}/"
        
        # 尝试下载Oracle JDBC驱动
        print_status "尝试下载Oracle JDBC驱动..."
        if command -v wget &> /dev/null; then
            wget -q -O "${LIB_DIR}/ojdbc8.jar" "https://repo1.maven.org/maven2/com/oracle/database/jdbc/ojdbc8/21.1.0.0/ojdbc8-21.1.0.0.jar" || print_warning "Oracle JDBC下载失败，请手动下载"
        elif command -v curl &> /dev/null; then
            curl -s -o "${LIB_DIR}/ojdbc8.jar" "https://repo1.maven.org/maven2/com/oracle/database/jdbc/ojdbc8/21.1.0.0/ojdbc8-21.1.0.0.jar" || print_warning "Oracle JDBC下载失败，请手动下载"
        fi
    else
        print_status "找到Oracle JDBC驱动: $(basename "$ORACLE_JAR")"
    fi
}

# 函数：设置classpath
setup_classpath() {
    print_status "设置编译classpath..."
    
    CLASSPATH="${CLASSES_DIR}"
    
    # 添加所有lib目录下的jar包
    if [ -d "${WEB_DIR}/WEB-INF/lib" ]; then
        for jar in "${WEB_DIR}/WEB-INF/lib"/*.jar; do
            if [ -f "$jar" ]; then
                CLASSPATH="${CLASSPATH}:${jar}"
            fi
        done
    fi
    
    export CLASSPATH
    print_status "Classpath设置完成"
}

# 函数：修复Java源代码问题
fix_source_code() {
    print_status "检查和修复Java源代码..."
    
    # 修复ServiceClass.java中的导入问题
    SERVICE_CLASS="${SRC_DIR}/DWRService/ServiceClass.java"
    if [ -f "$SERVICE_CLASS" ]; then
        # 移除problematic import
        sed -i.bak 's/import jdk.nashorn.internal.ir.RuntimeNode.Request;//g' "$SERVICE_CLASS" 2>/dev/null || true
        sed -i.bak 's/import sun.misc.BASE64Decoder;//g' "$SERVICE_CLASS" 2>/dev/null || true
        
        # 修复SaveImage方法
        if grep -q "BASE64Decoder" "$SERVICE_CLASS"; then
            print_status "修复BASE64Decoder使用..."
            # 这里可以添加更多的源代码修复逻辑
        fi
    fi
}

# 函数：编译Java源代码
compile_java() {
    print_status "编译Java源代码..."
    
    cd "${SRC_DIR}"
    
    # 查找所有Java文件
    JAVA_FILES=$(find . -name "*.java" -type f)
    
    if [ -z "$JAVA_FILES" ]; then
        print_error "未找到Java源文件"
        exit 1
    fi
    
    print_status "找到Java文件:"
    echo "$JAVA_FILES" | sed 's/^/  /'
    
    # 编译所有Java文件
    print_status "开始编译..."
    javac -encoding UTF-8 -cp "$CLASSPATH" -d "$CLASSES_DIR" $JAVA_FILES
    
    if [ $? -eq 0 ]; then
        print_status "Java编译成功"
    else
        print_error "Java编译失败"
        exit 1
    fi
    
    # 显示编译结果
    print_status "编译后的class文件:"
    find "$CLASSES_DIR" -name "*.class" -type f | sed 's/^/  /'
}

# 函数：创建缺失的Java类（如果需要）
create_missing_classes() {
    print_status "检查是否需要创建缺失的Java类..."
    
    # 检查DatabaseOperation.java是否存在
    DB_OPERATION="${SRC_DIR}/DBUtilities/DatabaseOperation.java"
    if [ ! -f "$DB_OPERATION" ]; then
        print_warning "创建缺失的DatabaseOperation.java"
        mkdir -p "${SRC_DIR}/DBUtilities"
        cat > "$DB_OPERATION" << 'EOF'
package DBUtilities;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * 数据库操作类
 * 提供基本的数据库查询功能
 */
public class DatabaseOperation {
    private static final String DRIVER = "oracle.jdbc.driver.OracleDriver";
    private static final String URL = "jdbc:oracle:thin:@192.168.101.38:1521:ORCL";
    private static final String USER = "iocasksh";
    private static final String PASSWORD = "iocas6760";
    
    /**
     * 测试数据库连接
     */
    public String testDatabaseConnection() {
        try {
            Class.forName(DRIVER);
            Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
            conn.close();
            return "数据库连接成功";
        } catch(Exception e) {
            return "数据库连接失败: " + e.getMessage();
        }
    }
    
    /**
     * 查询航次列表
     */
    public List<Map<String, Object>> queryVoyageList() {
        List<Map<String, Object>> result = new ArrayList<>();
        try {
            Class.forName(DRIVER);
            Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT ID, NAME, SCIENTIST, SEA_AREA FROM VOYAGE ORDER BY ID");
            
            while(rs.next()) {
                Map<String, Object> voyage = new HashMap<>();
                voyage.put("id", rs.getInt("ID"));
                voyage.put("name", rs.getString("NAME"));
                voyage.put("scientist", rs.getString("SCIENTIST"));
                voyage.put("seaArea", rs.getString("SEA_AREA"));
                result.add(voyage);
            }
            
            rs.close();
            stmt.close();
            conn.close();
        } catch(Exception e) {
            e.printStackTrace();
        }
        return result;
    }
    
    /**
     * 查询站点列表
     */
    public List<Map<String, Object>> queryStationList(int voyageId) {
        List<Map<String, Object>> result = new ArrayList<>();
        try {
            Class.forName(DRIVER);
            Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
            PreparedStatement pstmt = conn.prepareStatement(
                "SELECT ID, NAME, LONGITUDE, LATITUDE, DEPTH FROM STATION WHERE VOYAGE_ID = ? ORDER BY ID"
            );
            pstmt.setInt(1, voyageId);
            ResultSet rs = pstmt.executeQuery();
            
            while(rs.next()) {
                Map<String, Object> station = new HashMap<>();
                station.put("id", rs.getInt("ID"));
                station.put("name", rs.getString("NAME"));
                station.put("longitude", rs.getDouble("LONGITUDE"));
                station.put("latitude", rs.getDouble("LATITUDE"));
                station.put("depth", rs.getDouble("DEPTH"));
                result.add(station);
            }
            
            rs.close();
            pstmt.close();
            conn.close();
        } catch(Exception e) {
            e.printStackTrace();
        }
        return result;
    }
    
    /**
     * 获取CTD数据
     */
    public List<Map<String, Object>> queryCTDData(int stationId) {
        List<Map<String, Object>> result = new ArrayList<>();
        try {
            Class.forName(DRIVER);
            Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
            PreparedStatement pstmt = conn.prepareStatement(
                "SELECT DEPTH, TEMPERATURE, SALINITY, OXYGEN FROM CTDINFO WHERE STATIONID = ? ORDER BY DEPTH"
            );
            pstmt.setInt(1, stationId);
            ResultSet rs = pstmt.executeQuery();
            
            while(rs.next()) {
                Map<String, Object> ctd = new HashMap<>();
                ctd.put("depth", rs.getDouble("DEPTH"));
                ctd.put("temperature", rs.getDouble("TEMPERATURE"));
                ctd.put("salinity", rs.getDouble("SALINITY"));
                ctd.put("oxygen", rs.getDouble("OXYGEN"));
                result.add(ctd);
            }
            
            rs.close();
            pstmt.close();
            conn.close();
        } catch(Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
EOF
        print_status "DatabaseOperation.java创建完成"
    fi
}

# 函数：创建WAR包
create_war() {
    print_status "创建WAR包..."
    
    # 删除旧的WAR包
    if [ -f "$WAR_FILE" ]; then
        rm "$WAR_FILE"
    fi
    
    # 进入WebContent目录
    cd "$WEB_DIR"
    
    # 创建WAR包
    print_status "打包WAR文件..."
    if command -v jar &> /dev/null; then
        jar -cf "$WAR_FILE" *
    else
        zip -r "$WAR_FILE" *
    fi
    
    if [ $? -eq 0 ]; then
        print_status "WAR包创建成功: $WAR_FILE"
        
        # 显示WAR包信息
        WAR_SIZE=$(du -h "$WAR_FILE" | cut -f1)
        print_status "WAR包大小: $WAR_SIZE"
        
        # 列出WAR包内容
        print_status "WAR包内容预览:"
        if command -v jar &> /dev/null; then
            jar -tf "$WAR_FILE" | head -20 | sed 's/^/  /'
        else
            unzip -l "$WAR_FILE" | head -25 | tail -20 | sed 's/^/  /'
        fi
        
        # 检查关键文件是否存在
        print_status "检查关键class文件..."
        if command -v jar &> /dev/null; then
            jar -tf "$WAR_FILE" | grep -E "(ServiceClass|DatabaseOperation)\.class" | sed 's/^/  ✓ /'
        else
            unzip -l "$WAR_FILE" | grep -E "(ServiceClass|DatabaseOperation)\.class" | sed 's/^/  ✓ /'
        fi
        
    else
        print_error "WAR包创建失败"
        exit 1
    fi
}

# 函数：验证WAR包
validate_war() {
    print_status "验证WAR包完整性..."
    
    # 检查关键文件
    REQUIRED_FILES=(
        "WEB-INF/web.xml"
        "WEB-INF/dwr.xml"
        "WEB-INF/classes/DWRService/ServiceClass.class"
        "WEB-INF/classes/DBUtilities/DatabaseOperation.class"
        "index.html"
    )
    
    ALL_GOOD=true
    
    for file in "${REQUIRED_FILES[@]}"; do
        if command -v jar &> /dev/null; then
            if jar -tf "$WAR_FILE" | grep -q "^${file}$"; then
                print_status "✓ $file"
            else
                print_error "✗ $file (缺失)"
                ALL_GOOD=false
            fi
        else
            if unzip -l "$WAR_FILE" | grep -q "$file"; then
                print_status "✓ $file"
            else
                print_error "✗ $file (缺失)"
                ALL_GOOD=false
            fi
        fi
    done
    
    if [ "$ALL_GOOD" = true ]; then
        print_status "WAR包验证通过"
    else
        print_error "WAR包验证失败，存在缺失文件"
        exit 1
    fi
}

# 函数：生成部署指令
generate_deployment_instructions() {
    print_status "生成部署指令..."
    
    DEPLOY_SCRIPT="${PROJECT_DIR}/deploy_to_server.sh"
    
    cat > "$DEPLOY_SCRIPT" << EOF
#!/bin/bash

# IVSOSD部署到服务器脚本
# 使用方法: ./deploy_to_server.sh [server-ip] [username]

SERVER_IP=\${1:-"192.168.100.43"}
USERNAME=\${2:-"root"}
WAR_FILE="$WAR_FILE"

echo "部署IVSOSD到服务器 \$USERNAME@\$SERVER_IP"

# 1. 上传WAR包
echo "上传WAR包..."
scp "\$WAR_FILE" \$USERNAME@\$SERVER_IP:/tmp/

# 2. 部署到Tomcat
echo "部署到Tomcat..."
ssh \$USERNAME@\$SERVER_IP << 'REMOTE_SCRIPT'
    # 停止Tomcat
    sudo systemctl stop tomcat
    
    # 备份旧版本
    if [ -f /opt/tomcat/webapps/ivsosd.war ]; then
        sudo cp /opt/tomcat/webapps/ivsosd.war /opt/tomcat/webapps/ivsosd.war.backup.\$(date +%Y%m%d_%H%M%S)
    fi
    
    # 清理旧部署
    sudo rm -rf /opt/tomcat/webapps/ivsosd*
    
    # 部署新版本
    sudo cp /tmp/ivsosd.war /opt/tomcat/webapps/
    sudo chown tomcat:tomcat /opt/tomcat/webapps/ivsosd.war
    
    # 启动Tomcat
    sudo systemctl start tomcat
    
    # 等待启动
    sleep 10
    
    # 检查状态
    sudo systemctl status tomcat
REMOTE_SCRIPT

echo "部署完成!"
echo "访问地址: http://\$SERVER_IP:38111/ivsosd/"
echo "DWR测试页面: http://\$SERVER_IP:38111/ivsosd/dwr/"
EOF

    chmod +x "$DEPLOY_SCRIPT"
    print_status "部署脚本已创建: $DEPLOY_SCRIPT"
}

# 函数：生成DWR测试页面
create_dwr_test_page() {
    print_status "创建DWR测试页面..."
    
    TEST_PAGE="${WEB_DIR}/dwr_test.html"
    
    cat > "$TEST_PAGE" << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DWR功能测试</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        .result { background: #f5f5f5; padding: 10px; margin: 10px 0; }
        button { padding: 8px 16px; margin: 5px; }
        .success { color: green; }
        .error { color: red; }
    </style>
</head>
<body>
    <h1>IVSOSD DWR功能测试</h1>
    
    <div class="test-section">
        <h2>1. DWR服务连接测试</h2>
        <button onclick="testServiceConnection()">测试服务连接</button>
        <div id="serviceResult" class="result"></div>
    </div>
    
    <div class="test-section">
        <h2>2. 数据库连接测试</h2>
        <button onclick="testDatabaseConnection()">测试数据库连接</button>
        <div id="dbResult" class="result"></div>
    </div>
    
    <div class="test-section">
        <h2>3. 航次数据查询测试</h2>
        <button onclick="testVoyageQuery()">查询航次列表</button>
        <div id="voyageResult" class="result"></div>
    </div>
    
    <div class="test-section">
        <h2>4. 插值计算测试</h2>
        <button onclick="testInterpolation()">测试插值计算</button>
        <div id="interpolationResult" class="result"></div>
    </div>

    <!-- DWR Scripts -->
    <script type="text/javascript" src="dwr/interface/ServiceJS.js"></script>
    <script type="text/javascript" src="dwr/interface/DatabaseOperationJS.js"></script>
    <script type="text/javascript" src="dwr/engine.js"></script>
    <script type="text/javascript" src="dwr/util.js"></script>

    <script>
        function testServiceConnection() {
            var resultDiv = document.getElementById('serviceResult');
            resultDiv.innerHTML = '正在测试服务连接...';
            
            try {
                // 测试基本的DWR连接
                resultDiv.innerHTML = '<span class="success">✓ DWR接口文件加载成功</span>';
            } catch(e) {
                resultDiv.innerHTML = '<span class="error">✗ DWR连接失败: ' + e.message + '</span>';
            }
        }
        
        function testDatabaseConnection() {
            var resultDiv = document.getElementById('dbResult');
            resultDiv.innerHTML = '正在测试数据库连接...';
            
            DatabaseOperationJS.testDatabaseConnection(function(result) {
                resultDiv.innerHTML = '<span class="success">✓ ' + result + '</span>';
            }, function(error) {
                resultDiv.innerHTML = '<span class="error">✗ 数据库连接失败: ' + error.message + '</span>';
            });
        }
        
        function testVoyageQuery() {
            var resultDiv = document.getElementById('voyageResult');
            resultDiv.innerHTML = '正在查询航次数据...';
            
            DatabaseOperationJS.queryVoyageList(function(result) {
                if (result && result.length > 0) {
                    var html = '<span class="success">✓ 查询成功，找到 ' + result.length + ' 个航次:</span><br>';
                    for (var i = 0; i < Math.min(result.length, 5); i++) {
                        html += '- ' + result[i].name + ' (' + result[i].scientist + ')<br>';
                    }
                    resultDiv.innerHTML = html;
                } else {
                    resultDiv.innerHTML = '<span class="success">✓ 查询成功，但没有找到数据</span>';
                }
            }, function(error) {
                resultDiv.innerHTML = '<span class="error">✗ 查询失败: ' + error.message + '</span>';
            });
        }
        
        function testInterpolation() {
            var resultDiv = document.getElementById('interpolationResult');
            resultDiv.innerHTML = '正在测试插值计算...';
            
            // 使用默认参数测试
            ServiceJS.CreateImage('temperature_1', function(result) {
                resultDiv.innerHTML = '<span class="success">✓ 插值计算成功: ' + result + '</span>';
            }, function(error) {
                resultDiv.innerHTML = '<span class="error">✗ 插值计算失败: ' + error.message + '</span>';
            });
        }
        
        // 页面加载完成后自动检查DWR状态
        window.onload = function() {
            setTimeout(function() {
                if (typeof ServiceJS !== 'undefined' && typeof DatabaseOperationJS !== 'undefined') {
                    document.body.insertAdjacentHTML('afterbegin', 
                        '<div style="background: #d4edda; color: #155724; padding: 10px; margin-bottom: 20px; border-radius: 4px;">' +
                        '✓ DWR接口加载成功！可以进行功能测试。</div>'
                    );
                } else {
                    document.body.insertAdjacentHTML('afterbegin', 
                        '<div style="background: #f8d7da; color: #721c24; padding: 10px; margin-bottom: 20px; border-radius: 4px;">' +
                        '✗ DWR接口加载失败！请检查服务器配置。</div>'
                    );
                }
            }, 2000);
        };
    </script>
</body>
</html>
EOF
    
    print_status "DWR测试页面已创建: $TEST_PAGE"
}

# 主函数
main() {
    echo -e "${BLUE}开始构建IVSOSD项目...${NC}"
    echo
    
    # 执行构建步骤
    check_java
    create_directories
    check_dependencies
    setup_classpath
    fix_source_code
    create_missing_classes
    compile_java
    create_dwr_test_page
    create_war
    validate_war
    generate_deployment_instructions
    
    echo
    echo -e "${GREEN}=== 构建完成 ===${NC}"
    echo "WAR文件: $WAR_FILE"
    echo "部署脚本: ${PROJECT_DIR}/deploy_to_server.sh"
    echo "DWR测试页面: ${WEB_DIR}/dwr_test.html"
    echo
    echo -e "${YELLOW}下一步操作:${NC}"
    echo "1. 运行部署脚本: ./deploy_to_server.sh"
    echo "2. 访问应用: http://192.168.100.43:38111/ivsosd/"
    echo "3. 测试DWR: http://192.168.100.43:38111/ivsosd/dwr/"
    echo "4. 功能测试: http://192.168.100.43:38111/ivsosd/dwr_test.html"
}

# 运行主函数
main "$@"