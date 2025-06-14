package interpolation;

/**
 * @classname: CteateMatrix
 * @description: 根据计算结果生成矩阵
 * @version: 
 * @date: 2016-12-16
 * @author: liujin
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */


public class CteateMatrix {
  /**
   * 经度剖面计算结果
   */
public static double[] xv(double dx, int nx, double min_x){
  double[] xv = new double[nx+1];
    xv[0] = min_x;
    for (int x = 1; x <= nx; x++){
    xv[x]=xv[x-1]+dx;
    }
return xv;
}   
/**
 * 纬度剖面计算结果
 */     
public static double[] yv(double dy, int ny, double min_y){  
  double[] yv = new double[ny+1];
  yv[0] = min_y;  
    for (int y = 1; y <= ny; y++){
    yv[y]=yv[y-1]+dy;
    }
return yv;
}    
/**
 * 深度剖面计算结果
 */
public static double[] zv(double dz, int nz, double min_z){  
  double[] zv = new double[nz+1];
  zv[0] = min_z;
    for (int z = 1; z <= nz; z++){
    zv[z]=zv[z-1]+dz;
    }
return zv;
}
}
