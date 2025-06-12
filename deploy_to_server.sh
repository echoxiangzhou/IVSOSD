#!/bin/bash

# IVSOSD部署到服务器脚本
# 使用方法: ./deploy_to_server.sh [server-ip] [username]

SERVER_IP=${1:-"192.168.100.43"}
USERNAME=${2:-"root"}
WAR_FILE="/Users/echo/Desktop/工作/部门管理/数据中心管理工作/软件源代码-交接/材料/交互式可视化/源代码及说明文件20180109/源代码及说明文件/IVSOSD/ivsosd.war"

echo "部署IVSOSD到服务器 $USERNAME@$SERVER_IP"

# 1. 上传WAR包
echo "上传WAR包..."
scp "$WAR_FILE" $USERNAME@$SERVER_IP:/tmp/

# 2. 部署到Tomcat
echo "部署到Tomcat..."
ssh $USERNAME@$SERVER_IP << 'REMOTE_SCRIPT'
    # 停止Tomcat
    sudo systemctl stop tomcat
    
    # 备份旧版本
    if [ -f /opt/tomcat/webapps/ivsosd.war ]; then
        sudo cp /opt/tomcat/webapps/ivsosd.war /opt/tomcat/webapps/ivsosd.war.backup.$(date +%Y%m%d_%H%M%S)
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
echo "访问地址: http://$SERVER_IP:38111/ivsosd/"
echo "DWR测试页面: http://$SERVER_IP:38111/ivsosd/dwr/"
