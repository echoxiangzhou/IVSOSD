package interpolation;

/**
 * @classname: TrendSurface
 * @description: 空间趋势面计算
 * @version: 
 * @date: 2016-11-09
 * @author: liujin
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

public class TrendSurface extends StartInterpolation {

	/** 在空间插值开始计算之前删除空间趋势面 */
   public static double[] removeTrend(   double[] temp, double[] de,
                                       double X1, double X2, int ni) {

      for(int i= 0; i<=ni;i++) {
      temp[i] = (temp[i] - X1) / (X2 * de[i]);
      }
   return temp;
   }
   /** 在空间插值之后加上之前删掉的趋势面 */
   public static double[][][] addTrend(double[][][] newt, double[] zv,
                                       double X1, double X2, int nx, int ny, int nz,
                                       double missingvalue) {
      for(int x= 0; x<=nx;x++) {
      for(int y= 0; y<=ny;y++) {
      for(int z= 0; z<=nz;z++) {
         if(newt[x][y][z]!=missingvalue) {
         newt[x][y][z] = (newt[x][y][z] * (X2* zv[z]))+ X1;
         }
      }}}
      return newt;
   }
}
