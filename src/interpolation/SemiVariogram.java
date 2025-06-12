package interpolation;

import java.awt.*;
import javax.swing.*;

/**
 * @classname: SemiVariogram
 * @description:  计算半变异函数
 * @version: 
 * @date: 2016-11-05
 * @author: liujin
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

public class SemiVariogram extends StartInterpolation {
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	StartInterpolation parent;
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	static final boolean NEAR_OK = false;
	public double min_Temp, max_Temp, min_X, max_X, min_Y, max_Y, min_Z, max_Z;//临时变量、最大最小值
	public double[] normTemp;
	public double[] normX; //归一化X
	public double[] normY;//归一化Y
	public double[] normZ;//归一化Z
	public double[] alpha;
	public double[] beta;
	public double[] X;
	public double[] Y;
	public double[] Z;
	public double[] Temp;
	public static double correlation_length_x; //相关长度X
	public static double correlation_length_y;//相关长度Y
	public static double correlation_length_z;//相关长度Z
	public static double[][] allData;
	// ---------------------------------------------------------------------------------------

	/**
	 * 
	 * @param X0 X方向初始值
	 * @param Y0 Y方向初始值
	 * @param Z0 Z方向初始值
	 * @param Temp0 临时变量
	 * @param min_X0  X方向最小值
	 * @param max_X0 X方向最大值
	 * @param min_Y0 Y方向最小值
	 * @param max_Y0 Y方向最大值
	 * @param min_Z0 Z方向最小值
	 * @param max_Z0 Z方向最大值
	 * @param ni0
	 */
	public SemiVariogram(StartInterpolation interpxyz, double[] X0, double[] Y0, double[] Z0,
			double[] Temp0, double min_X0, double max_X0, double min_Y0, double max_Y0, double min_Z0, double max_Z0,
			int ni0) {

		ni = ni0;
		
		
		min_X = min_X0;
		max_X = max_X0;
		min_Y = min_Y0;
		max_Y = max_Y0;
		min_Z = min_Z0;
		max_Z = max_Z0;

		X = new double[ni + 1];
		Y = new double[ni + 1];
		Z = new double[ni + 1];
		Temp = new double[ni + 1];

		for (int i = 0; i <= ni0; i++) {
			X[i] = X0[i];
			Y[i] = Y0[i];
			Z[i] = Z0[i];
			Temp[i] = Temp0[i];
		}

		parent = (StartInterpolation) interpxyz;
		semiVariogram sv = new semiVariogram(debug, X, Y, Z, Temp, min_X, max_X, min_Y, max_Y, min_Z, max_Z, ni);
	}

	class semiVariogram {
		/**
		 * 准备基础统计数据：
		 * 期望值、线性回归
		 */
		public semiVariogram(boolean debug, double[] X, double[] Y, double[] Z, double[] Temp, double min_X,
				double max_X, double min_Y, double max_Y, double min_Z, double max_Z, int ni) {

			int ni2 = ni;
			int nj2 = ni;
			j = nj2;
			int maxl = 20;
			allData = new double[maxl][6];

			double nr_of_indizes = 1.0 / (double) (maxl) / 100.;
			int current;

			double[] gamma_X = new double[ni + 1];
			double[] h_X = new double[ni + 1];
			double[] gamma_Y = new double[ni + 1];
			double[] h_Y = new double[ni + 1];
			double[] gamma_Z = new double[ni + 1];
			double[] h_Z = new double[ni + 1];
			double dist_X = (max_X - min_X) / maxl;
			double dist_Y = (max_Y - min_Y) / maxl;
			double dist_Z = (max_Z - min_Z) / maxl;

			double X_TOL = Math.abs((max_X - min_X) / maxl);

			double Y_TOL = Math.abs((max_Y - min_Y) / maxl);

			double Z_TOL = Math.abs((max_Z - min_Z) / maxl);

			double hk_X[] = new double[maxl + 1];
			double hk_Y[] = new double[maxl + 1];
			double hk_Z[] = new double[maxl + 1];

			for (int l = 1; l <= maxl; l++) {
				double gammasum_X = 0.0;
				double hsum_X = 0.0;
				double gammasum_Y = 0.0;
				double hsum_Y = 0.0;
				double gammasum_Z = 0.0;
				double hsum_Z = 0.0;
				int k_X = 0;
				h_X[0] = 0.0;
				h_X[l] = dist_X + h_X[l - 1];
				int k_Y = 0;
				h_Y[0] = 0.0;
				h_Y[l] = dist_Y + h_Y[l - 1];
				int k_Z = 0;
				h_Z[0] = 0.0;
				h_Z[l] = dist_Z + h_Z[l - 1];

				current = (int) (Math.round((l) * nr_of_indizes));


				j = nj2;
				for (j = nj2; j >= 0; j--) {
					for (i = 0; i <= ni2; i++) {
						if (j != i) {
							double deltax = (X[i] - X[j]);
							double deltay = (Y[i] - Y[j]);
							double deltaz = (Z[i] - Z[j]);
							double theta = 20.0 * Math.PI / 180.0;
							double XLTOL = dist_X / 2.0;

							if (h_X[l - 1] - XLTOL <= deltax && deltax <= h_X[l] + XLTOL) {
								if (deltay < Y_TOL && deltaz < Z_TOL) {

									if (deltax < 0.5 * X_TOL) {
										double point_angle_XY = Math.atan(deltax / deltay);
										double point_angle_XZ = Math.atan(deltax / deltaz);
										if ((point_angle_XY < theta && point_angle_XZ < theta) | NEAR_OK) {
											hsum_X = hsum_X + deltax;
											gammasum_X = gammasum_X + Math.pow((Temp[i] - Temp[j]), 2);
											k_X++;
										}
									}

									else {
										hsum_X = hsum_X + deltax;
										gammasum_X = gammasum_X + Math.pow((Temp[i] - Temp[j]), 2);
										k_X++;
									}
								}
							}

							double YLTOL = dist_Y / 2.0;
							if (h_Y[l - 1] - YLTOL <= deltay && deltay <= h_Y[l] + YLTOL) {
								if (deltax < X_TOL && deltaz < Z_TOL) {

									if (deltay < 0.5 * Y_TOL) {

										double point_angle_YX = Math.atan(deltay / deltax);

										double point_angle_YZ = Math.atan(deltay / deltaz);
										if ((point_angle_YX < theta && point_angle_YZ < theta) | NEAR_OK) {
											if (h_Y[l - 1] <= deltay && deltay < h_Y[l]) {
												hsum_Y = hsum_Y + deltay;
												gammasum_Y = gammasum_Y + Math.pow((Temp[i] - Temp[j]), 2);
												k_Y++;
											}
										}
									}

									else if (deltay >= 0.5 * Y_TOL) {
										if (h_Y[l - 1] <= deltay && deltay < h_Y[l]) {
											hsum_Y = hsum_Y + deltay;
											gammasum_Y = gammasum_Y + Math.pow((Temp[i] - Temp[j]), 2);
											k_Y++;
										}
									}
								}
							}

							double ZLTOL = dist_Z / 2.0;
							if (h_Z[l - 1] - ZLTOL <= deltaz && deltaz <= h_Z[l] + ZLTOL) {
								if (deltax < X_TOL && deltay < Y_TOL) {

									if (deltaz < 0.5 * Z_TOL) {

										double point_angle_ZY = Math.atan(deltaz / deltay);

										double point_angle_ZX = Math.atan(deltaz / deltax);
										if ((point_angle_ZX < theta && point_angle_ZY < theta) | NEAR_OK) {
											if (h_Z[l - 1] <= deltaz && delta < h_Z[l]) {
												hsum_Z = hsum_Z + deltaz;
												gammasum_Z = gammasum_Z + Math.pow((Temp[i] - Temp[j]), 2);
												k_Z++;
											}
										}
									}

									else if (deltaz >= 0.5 * Z_TOL) {
										if (h_Z[l - 1] <= deltaz && deltaz < h_Z[l]) {
											hsum_Z = hsum_Z + deltaz;
											gammasum_Z = gammasum_Z + Math.pow((Temp[i] - Temp[j]), 2);
											k_Z++;
										}
									}
								}
							}
							// ---------------------------------------------------------------------
						}
					}
				}
				if (k_X >= 30) {
					hk_X[l] = hsum_X / (k_X);

					gamma_X[l] = 1.0 / (2.0 * (k_X)) * gammasum_X;
				} else {
					hk_X[l] = 0.0;
					gamma_X[l] = 0.0;
				}
				if (k_Y >= 30) {
					hk_Y[l] = hsum_Y / (k_Y);
					gamma_Y[l] = 1.0 / (2.0 * (k_Y)) * gammasum_Y;
				} else {
					hk_Y[l] = 0.0;
					gamma_Y[l] = 0.0;
				}
				if (k_Z >= 30) {
					hk_Z[l] = hsum_Z / (k_Z);
					gamma_Z[l] = 1.0 / (2.0 * (k_Z)) * gammasum_Z;
				} else {
					hk_Z[l] = 0.0;
					gamma_Z[l] = 0.0;
				}
			}

			for (int l = 1; l <= maxl; l++) {
				allData[l - 1][0] = hk_X[l];
				allData[l - 1][1] = gamma_X[l];
				allData[l - 1][2] = hk_Y[l];
				allData[l - 1][3] = gamma_Y[l];
				allData[l - 1][4] = hk_Z[l];
				allData[l - 1][5] = gamma_Z[l];
			}

			double max_hk_X = -1.E64, max_hk_Y = -1.E-64, max_hk_Z = -1.E-64;
			for (int l = 1; l <= maxl / 2.; l++) {
				max_hk_X = Math.max(max_hk_X, hk_X[l]);
				max_hk_Y = Math.max(max_hk_Y, hk_Y[l]);
				max_hk_Z = Math.max(max_hk_Z, hk_Z[l]);
			}
			
			//协方差计算
			int xc = 0, yc = 0, zc = 0;
			for (int l = 1; l < maxl / 2.; l++) {
				if (gamma_X[l] >= gamma_X[l + 1]) {
					correlation_length_x = hk_X[l];
					xc++;
					break;
				}
			}
			for (int l = 1; l < maxl / 2.; l++) {
				if (gamma_Y[l] >= gamma_Y[l + 1]) {
					correlation_length_y = hk_Y[l];
					yc++;
					break;
				}
			}
			for (int l = 1; l < maxl / 2.; l++) {
				if (gamma_Z[l] >= gamma_Z[l + 1]) {
					correlation_length_z = hk_Z[l];
					zc++;
					break;
				}
			}
			if (xc == 0)
				correlation_length_x = max_hk_X;
			if (yc == 0)
				correlation_length_y = max_hk_Y;
			if (zc == 0)
				correlation_length_z = max_hk_Z;
			String clx = correlation_length_x + "";
			String cly = correlation_length_y + "";
			String clz = correlation_length_z + "";
			if (clx.equals("NaN"))
				correlation_length_x = Math.abs(max_X - min_X);
			if (cly.equals("NaN"))
				correlation_length_y = Math.abs(max_Y - min_Y);
			if (clz.equals("NaN"))
				correlation_length_z = Math.abs(max_Z - min_Z);

			parent.getCorrelationLength();

		}

	}
}
