package interpolation;

import javax.swing.*;

import java.awt.*;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.awt.image.*;
import java.io.*;


/**
 * @classname: InterpolationAlgorithm
 * @description: 三维空间插值算法
 * @version:
 * @date: 2016-11-05
 * @author: liujin
 * @JDK: 1.8 CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

public class InterpolationAlgorithm {

	StartInterpolation parent;
	long current;
	double deltax = 0.0, deltay = 0.0, deltaz = 0.0;
	double omega = 0.0, tau = 0.0, vecdist = 0.0;
	long scr11 = 0, scr12 = 0;
	double wx, wy, wz;
	double[][][] newt;
	double D_TOL;
	double maxValue;
	double minValue;


	/**
	 * 
	 * 三维插值算法代码主要由国家海洋局专业人员编写，主要参考附件文献
	 * 《A Java application for quality weighted 3-d interpolation》，
	 * 建议修改此部分代码的人员阅读此文献了解算法原理，有助于理解代码。
	 *  
	 */
	// 变量含义详见StartInterpolation中变量说明
	public InterpolationAlgorithm(boolean debug, double[] XC, double[] YC, double[] ZC, double[] temp, double[] phi,
			int ni, int nx, int ny, int nz, boolean b_trend, boolean b_blank2, double X1, double X2, double min_x,
			double max_x, double min_y, double max_y, double min_z, double max_z, boolean normalize_only_z,
			int i_normalize, double beta, double delta, int assign_missing_value_when_lower_than, double missingvalue,
			boolean b_Octant_search, boolean surfer_grd, double min_temp, double max_temp, boolean b_extract_slices,
			String slice_filename, double dSumT, double dMeanT, int NR_EMPTY_OCT, int NR_DATA_OCT, String proType,
			int proLoca, DWRService.ServiceClass.InteReplies inteReplies) {

		Image image;
		image = null;

		D_TOL = Math
				.sqrt(Math.pow((max_x - min_x), 2.0) + Math.pow((max_y - min_y), 2.0) + Math.pow((max_z - min_z), 2.0));
		D_TOL = D_TOL * 1.E-12;

		double dx = ((max_x - min_x) / nx);
		double dy = ((max_y - min_y) / ny);
		double dz = ((max_z - min_z) / nz);

		double relation_y, relation_z;
		double width_XC = max_x - min_x;
		double width_YC = max_y - min_y;
		double width_ZC = max_z - min_z;

		if (i_normalize == 1) {
			if (normalize_only_z == false) {
				relation_y = dx / dy;
			} else {
				relation_y = 1.;
			}
			relation_z = dx / dz;
		}

		else if (i_normalize == 2) {
			if (normalize_only_z == false) {
				relation_y = width_XC / width_YC;
			} else {
				relation_y = 1.;
			}
			relation_z = width_XC / width_ZC;
		} else if (i_normalize == 3) {

			if (normalize_only_z == false) {
				relation_y = (dx / dy) * (width_XC / width_YC);
			} else {
				relation_y = 1.;
			}
			relation_z = (dx / dz) * (width_XC / width_ZC);
		}

		else {
			relation_y = 1.0;
			relation_z = 1.0;
		}

		// 生成计算结果矩阵
		double[] xv = CteateMatrix.xv(dx, nx, min_x);
		double[] yv = CteateMatrix.yv(dy, ny, min_y);
		// double[] zv = makegrid.zv(dz, nz, min_z);
		double[] zv = new double[1];

		zv[0] = proLoca;

		nz = 0;

		newt = new double[nx + 1][ny + 1][nz + 1];

		wx = 1.;
		wy = 1.;
		wz = 1.;

		if (SetBoundarys.search_x_new != 0.0) {
			if (proType.equals("Deep")) {
				wx = 45;
			} else if (proType.equals("Longitude")) {
				wx = 200;
			} else if (proType.equals("Latitude")) {
				wx = 45;
			}

		} else {
			wx = 2.0 * (max_x - min_x);
		}
		if (SetBoundarys.search_y_new != 0.0) {

			if (proType.equals("Deep")) {
				wy = 45;
			} else if (proType.equals("Longitude")) {
				wy = 45;
			} else if (proType.equals("Latitude")) {
				wy = 200;
			}
		} else {
			wy = 2.0 * (max_y - min_y);
		}
		if (SetBoundarys.search_z_new != 0.0) {

			if (proType.equals("Deep")) {
				wz = 200;
			} else if (proType.equals("Longitude")) {
				wz = 45;
			} else if (proType.equals("Latitude")) {
				wz = 45;
			}
		} else {
			wz = 2.0 * (max_z - min_z);
		}

		double scattered_data_vecdist;
		long sum = 0;
		double nr_of_indizes = 1.0 / (double) (((ni + 1) * (nx + 1) * (ny + 1) * (nz + 1)) / 100.);
		long scr_progress = (long) (((ni + 1) * (nx + 1) * (ny + 1) * (nz + 1)) / 1000.);
		long begin = System.currentTimeMillis();
		if (debug) {
			double min_phi = +2.;
			double max_phi = +0.;
			for (int i = 0; i <= ni; i++) {
				min_phi = Math.min(phi[i], min_phi);
				max_phi = Math.max(phi[i], max_phi);
			}

		}
		// 是否计算空间趋势面
		if (b_trend) {
			TrendSurface.removeTrend(temp, ZC, X1, X2, ni);
		}
		// 是否采用Octant search algorithm 进行搜索样点
		if (b_Octant_search) {

			for (int z = 0; z <= nz; z++) {
				for (int y = 0; y <= ny; y++) {
					for (int x = 0; x <= nx; x++) {
						omega = 0.0;
						tau = 0.0;
						OctantSearchPoint.OctantSearch(debug, XC, YC, ZC, temp, phi, xv[x], yv[y], zv[z], ni,
								relation_y, relation_z, wx, wy, wz, delta, beta, NR_EMPTY_OCT, NR_DATA_OCT, D_TOL);
						sum = sum + (ni + 1);
						current = (long) (Math.round((sum) * nr_of_indizes));

						newt[x][y][z] = OctantSearchPoint.newphi;
					} // x
				} // y
			} // z
		} else {

			if (SetBoundarys.search_x_new == 0.0 && SetBoundarys.search_y_new == 0.0
					&& SetBoundarys.search_z_new == 0.0) {

				for (int z = 0; z <= nz; z++) {
					for (int y = 0; y <= ny; y++) {
						for (int x = 0; x <= nx; x++) {
							omega = 0.0;
							tau = 0.0;
							boolean b_identic = false;
							identic: for (int i = 0; i <= ni; i++) {
								sum++;
								if (sum % scr_progress == 0) {
									current = (long) (Math.round(sum * nr_of_indizes));

								}
								deltax = Math.pow((XC[i] - xv[x]), 2.0);
								deltay = Math.pow(((YC[i] - yv[y]) * relation_y), 2.0);
								deltaz = Math.pow(((ZC[i] - zv[z]) * relation_z), 2.0);
								scattered_data_vecdist = Math.sqrt(deltax + deltay + deltaz);
								//

								if (Math.abs(scattered_data_vecdist) <= 0.0) {
									b_identic = true;
									newt[x][y][z] = temp[i];
									break identic;
								}
								vecdist = Math.sqrt(Math.pow(scattered_data_vecdist, 2.0) + Math.pow(delta, 2.0));
								omega = omega + ((phi[i] * temp[i]) / Math.pow(vecdist, beta));
								tau = tau + ((phi[i] * 1.0) / Math.pow(vecdist, beta));
							} // i
							if (b_identic == false)
								newt[x][y][z] = omega / tau;
						} // x
					} // y
				} // z
			} // end
			else {

				double search_distance = Math
						.sqrt(Math.pow(wx, 2.0) + Math.pow((wy * relation_y), 2.0) + Math.pow((wz * relation_z), 2.0));
				for (int z = 0; z <= nz; z++) {
					for (int y = 0; y <= ny; y++) {
						for (int x = 0; x <= nx; x++) {
							omega = 0.0;
							tau = 0.0;
							scr11 = 0;
							boolean b_identic = false;
							identic: for (int i = 0; i <= ni; i++) {
								sum++;
								if (sum % scr_progress == 0) {
									current = (long) (Math.round(sum * nr_of_indizes));

								}
								deltax = Math.pow((XC[i] - xv[x]), 2.0);
								deltay = Math.pow(((YC[i] - yv[y]) * relation_y), 2.0);
								deltaz = Math.pow(((ZC[i] - zv[z]) * relation_z), 2.0);
								scattered_data_vecdist = Math.sqrt(deltax + deltay + deltaz);

								if (Math.abs(scattered_data_vecdist) <= 0.0) {
									b_identic = true;

									// Math.abs(scattered_data_vecdist));
									newt[x][y][z] = temp[i];
									break identic;
								}
								double A = Math.pow(wx, 2);
								double B = Math.pow((wy * relation_y), 2.0);
								double C = Math.pow((wz * relation_z), 2.0);
								double ellipsoid = deltax / A + deltay / B + deltaz / C;
								if (ellipsoid <= 1.0) {
									vecdist = Math.sqrt(Math.pow(scattered_data_vecdist, 2.0) + Math.pow(delta, 2.0));
									omega = omega + ((phi[i] * temp[i]) / Math.pow(vecdist, beta));
									tau = tau + ((phi[i] * 1.0) / Math.pow(vecdist, beta));
									scr11++;
								}
							} // i
							if (b_identic == false) {
								newt[x][y][z] = omega / tau;

								if (scr11 <= assign_missing_value_when_lower_than) {
									newt[x][y][z] = missingvalue;
									scr12++;
								}
							}
						} // z
					} // y
				} // x
			}
		} // end
			// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

		long end = System.currentTimeMillis();

		if (b_trend) {
			// 计算空间趋势面
			TrendSurface.addTrend(newt, zv, X1, X2, nx, ny, nz, missingvalue);

		}

		// 记录计算结果的最大最小值
		double imageArray[][] = new double[newt.length][newt[0].length];
		for (int i = 0; i < newt.length; i++) {
			// for (int i = newt.length - 1; i >= 0; i--) {
			for (int j = 0; j < newt[0].length; j++) {
				imageArray[i][j] = newt[i][j][0];
				if (imageArray[i][j] > inteReplies.getMaxValue() && imageArray[i][j] < 10000) {
					inteReplies.setMaxValue(imageArray[i][j]);
				}
				if (imageArray[i][j] < inteReplies.getMinValue() && imageArray[i][j] > -10000) {
					inteReplies.setMinValue(imageArray[i][j]);
				}
			}

		}

		maxValue = inteReplies.getMaxValue();
		minValue = inteReplies.getMinValue();
		// 计算深度剖面
		if (proType.equals("Deep")) {

			URL classUrl = Thread.currentThread().getContextClassLoader().getResource("");
			String strClassURL = classUrl.toString().replace("file:/", "");

			strClassURL = strClassURL.replace("WEB-INF/classes/", "");
			SimpleDateFormat tempDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

			String datetime = Long.toString(System.currentTimeMillis());
			String savePath = strClassURL + "images/deep" + datetime + ".jpg";

			double deepImageArray[][] = new double[imageArray[0].length][imageArray.length];

			for (int i = 0; i < imageArray.length; i++) {
				for (int j = 0; j < imageArray[0].length; j++) {
					deepImageArray[i][j] = imageArray[i][imageArray.length - 1 - j];
				}
			}

			try {
				SaveMatrixImage.createMatrixImage(deepImageArray, savePath, minValue, maxValue);
			} catch (IOException e) {
				e.printStackTrace();
			}
			inteReplies.setResultPath("deep" + datetime + ".jpg");
		}
		// 计算经度剖面
		else if (proType.equals("Longitude")) {
			URL classUrl = Thread.currentThread().getContextClassLoader().getResource("");
			String strClassURL = classUrl.toString().replace("file:/", "");
			strClassURL = strClassURL.replace("WEB-INF/classes/", "");
			SimpleDateFormat tempDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String datetime = Long.toString(System.currentTimeMillis());
			String savePath1 = strClassURL + "images/long01" + datetime + ".jpg";
			String savePath2 = strClassURL + "images/long02" + datetime + ".jpg";
			double longImageArray[][] = new double[imageArray[0].length][imageArray.length];

			for (int i = 0; i < imageArray[0].length; i++) {
				for (int j = 0; j < imageArray.length; j++) {
					longImageArray[i][j] = imageArray[j][imageArray[0].length - 1 - i];
				}
			}

			double longImageArray02[][] = new double[longImageArray.length][longImageArray[0].length];
			for (int i = 0; i < longImageArray.length; i++) {
				for (int j = 0; j < longImageArray[0].length; j++) {
					longImageArray02[i][j] = longImageArray[longImageArray[0].length - 1 - i][j];
				}
			}

			try {
				SaveMatrixImage.createMatrixImage(longImageArray, savePath1, minValue, maxValue);
				SaveMatrixImage.createMatrixImage(longImageArray02, savePath2, minValue, maxValue);
			} catch (IOException e) {

				e.printStackTrace();
			}

			inteReplies.setResultPath("long01" + datetime + ".jpg" + "_" + "long02" + datetime + ".jpg");

		}
		// 计算纬度剖面
		else if (proType.equals("Latitude")) {
			URL classUrl = Thread.currentThread().getContextClassLoader().getResource("");
			String strClassURL = classUrl.toString().replace("file:/", "");
			strClassURL = strClassURL.replace("WEB-INF/classes/", "");
			SimpleDateFormat tempDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String datetime = Long.toString(System.currentTimeMillis());
			String savePath1 = strClassURL + "images/lati01" + datetime + ".jpg";
			String savePath2 = strClassURL + "images/lati02" + datetime + ".jpg";
			double latiImageArray02[][] = new double[imageArray.length][imageArray[0].length];
			for (int i = 0; i < imageArray.length; i++) {
				for (int j = 0; j < imageArray[0].length; j++) {
					latiImageArray02[i][j] = imageArray[imageArray[0].length - 1 - i][j];

				}
			}

			try {
				SaveMatrixImage.createMatrixImage(imageArray, savePath1, minValue, maxValue);
				SaveMatrixImage.createMatrixImage(latiImageArray02, savePath2, minValue, maxValue);
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			inteReplies.setResultPath("lati01" + datetime + ".jpg" + "_" + "lati02" + datetime + ".jpg");

		}

	}

}
