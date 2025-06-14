#!/bin/bash

# IVSOSD部署到服务器脚本
# 使用方法: ./deploy_to_server.sh [server-ip] [username]


# 1. 上传WAR包
echo "上传WAR包..."

scp -P 8008 ./ivsosd.war msdc@192.168.100.43:/home/msdc/IVSOSD

echo "部署完成!"
