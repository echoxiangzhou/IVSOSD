package interpolation;

import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import javax.swing.text.*;

import DWRService.ServiceClass.InteReplies;

import java.awt.geom.*;
import java.io.*;
import java.util.Vector;
import java.util.StringTokenizer;
import java.text.*;
import java.util.Properties;
import java.net.URL;
import java.awt.image.*;

/**
 * 
 * 三维插值算法代码主要由国家海洋局专业人员编写，主要参考附件文献
 * 《A Java application for quality weighted 3-d interpolation》，
 * 建议修改此部分代码的人员阅读此文献了解算法原理，有助于理解代码。
 *  
 */

/**
 * @classname: StartInterpolation
 * @description:  开始三维插值计算
 * @version: 
 * @date: 2016-11-19
 * @author: liujin
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

public class StartInterpolation {

	double depth;

	URL url;
	// 数据行数和列数最大值
	int ni, nj;

	public static double[] phi;
	// 数据权重
	public static boolean b_weighting = false;
	double[][][] newt;
	// 索引
	int x, y, z, i, j, k;;
	/** variable: the total number of grid nodes in x/y/z-direction */
	// xyz方向上样点数量
	int nx, ny, nz;
	double[] xv, yv, zv;

	// 工作目录
	public static String Directory;
	// 待读取的文件名称
	public static String Filename;

	// 读取到的数据
	double[][] data1;
	double[][] dAllValues;
	// 临时变量
	double[] scr0;
	double[] scr1;
	double[] scr2;
	double[] scr3;
	double[] scr4;
	int i_dummy = 3;
	int count = 0;
	int count2 = 0;

	public int nrofmeasureddata, nrofmodeldata, nrofnewt;
	public double minx = 0.F, maxx = 0.F, miny = 0.F, maxy = 0.F, minz = 0.F, maxz = 0.F;
	// 计算结果X Y Z 方向的宽度
	double dx = 0.F, dy = 0.F, dz = 0.F;
	double min_x, min_y, min_z, max_x, max_y, max_z, dSumT, dMeanT;
	// 边界参数
	int nr_x, nr_y, nr_z;
	// 搜索半径
	double search_x, search_y, search_z;
	public boolean b_extract_slices;
	public String slice_filename;
	static final boolean debug = false;
	int nr_of_slices;
	// 归一化变量
	double relation_y, relation_z;
	// 结果缺失默认值
	static int assign_missing_value_when_lower_than = 0;
	static double missingvalue = 1.70141E38;

	// 反距离权重中的指数
	double beta = 3.5;

	// 反距离权重中的平滑系数
	double delta = 0.;
	static boolean surfer_grd = true;
	static boolean skip_first_line = false;

	// 是否归一化
	int i_normalize = 1;
	// 是否只在Z方向计算归一化
	static boolean normalize_only_z;
	// 是否删除空间趋势面
	static boolean b_trend = false;
	boolean b_blank2 = false;
	// 趋势修正的函数值
	double X1 = 1.0, X2 = 1.0;
	// 是否采用八向搜索法
	static boolean b_Octant_search = true;
	// 八向搜索变量
	public int NR_EMPTY_OCT = 7, NR_DATA_OCT = 12;
	// 右方
	double[] re;
	// 上方
	double[] ho;
	// 下方
	double[] de;
	double[] temp;
	// 数据中的最大最小值
	double min_re, min_ho, min_de, min_temp, max_re, max_ho, max_de, max_temp;
	// 剖面类型
	String proType;
	// 默认最大最小值
	public double maxValue = -100;
	public double minValue = 100;

	public StartInterpolation() {

	}

	/**
	 * 
	 * @param profType
	 *            剖面类型
	 * @param profLoca
	 *            剖面位置
	 * @param inteReplies
	 *            返回值
	 */
	public void loadData(String profType, int profLoca, InteReplies inteReplies) {

		proType = profType;
		OpenData();

		// 开始插值算法计算
		InterpolationAlgorithm algorithm = new InterpolationAlgorithm(debug, re, ho, de, temp, phi, ni, nx, ny, nz,
				b_trend, b_blank2, X1, X2, min_x, max_x, min_y, max_y, min_z, max_z, normalize_only_z, i_normalize,
				beta, delta, assign_missing_value_when_lower_than, missingvalue, b_Octant_search, surfer_grd, min_temp,
				max_temp, b_extract_slices, slice_filename, dSumT, dMeanT, NR_EMPTY_OCT, NR_DATA_OCT, profType,
				profLoca, inteReplies);
	}

	protected void getdata(int ni, int nj, double data[][]) {
		int nip1 = ni + 1;
		scr0 = new double[nip1];
		scr1 = new double[nip1];
		scr2 = new double[nip1];
		scr3 = new double[nip1];
		if (b_weighting)
			scr4 = new double[nip1];

		for (i = 0; i <= ni; i++) {
			scr0[i] = data[i][0];
			scr1[i] = data[i][1];
			scr2[i] = data[i][2];
			scr3[i] = data[i][3];
			if (b_weighting)
				scr4[i] = data[i][4];
		}

	}

	// 获取边界设置
	public void getBoundarys(String min_x_new, String max_x_new, String nr_x_new, double search_x_new, String min_y_new,
			String max_y_new, String nr_y_new, double search_y_new, String min_z_new, String max_z_new, String nr_z_new,
			double search_z_new, boolean b_extract_slices_new, String slice_filename_new, double new_beta,
			double new_delta, double new_missingvalue, int assign_missing_value_when_lower_than2, int new_normalize,
			boolean normalize_only_z2, boolean b_Octantsearch2, boolean write_surfer_grd, boolean b_trend_dlg,
			double X1_dlg, double X2_dlg, boolean b_blank2_dlg, int NR_EMPTY_OCT2, int NR_DATA_OCT2) {

		NumberFormat nf = NumberFormat.getNumberInstance();
		try {
			min_x = nf.parse(min_x_new).doubleValue();
			min_y = nf.parse(min_y_new).doubleValue();
			min_z = nf.parse(min_z_new).doubleValue();

			max_x = nf.parse(max_x_new).doubleValue();
			max_y = nf.parse(max_y_new).doubleValue();
			max_z = nf.parse(max_z_new).doubleValue();

			nx = nf.parse(nr_x_new).intValue();
			ny = nf.parse(nr_y_new).intValue();
			nz = nf.parse(nr_z_new).intValue();
		} catch (ParseException pe) {

		}
		beta = new_beta;
		delta = new_delta;
		missingvalue = new_missingvalue;
		assign_missing_value_when_lower_than = assign_missing_value_when_lower_than2;
		i_normalize = new_normalize;
		normalize_only_z = normalize_only_z2;
		b_Octant_search = b_Octantsearch2;
		surfer_grd = write_surfer_grd;
		b_blank2 = b_blank2_dlg;
		b_trend = b_trend_dlg;
		X1 = X1_dlg;
		X2 = X2_dlg;
		NR_EMPTY_OCT = NR_EMPTY_OCT2;
		NR_DATA_OCT = NR_DATA_OCT2;

		b_extract_slices = b_extract_slices_new;
		slice_filename = slice_filename_new;

	}

	// 打开数据
	public void OpenData() {

		// Filename = "original-3D.dat";
		URL classUrl = Thread.currentThread().getContextClassLoader().getResource("");
		String strClassURL = classUrl.toString().replace("file:/", "");
		String Directory = strClassURL + "interpolation/Data/CTD/";//
		if (Directory != null) {
			GetValues gv = new GetValues(this, proType);
		} else {
			return;
		}
	}

	public void getReadData(int new_ni, int nj, double[][] dAllValues_new) {

		ni = new_ni;

		data1 = new double[ni + 1][nj + 1];
		for (i = 0; i <= ni; i++) {
			for (j = 0; j <= nj; j++) {
				data1[i][j] = dAllValues_new[i][j];
			}
		}

		getdata(ni, nj, data1);

		nrofmeasureddata = ni;
		re = new double[nrofmeasureddata + 1];
		ho = new double[nrofmeasureddata + 1];
		de = new double[nrofmeasureddata + 1];
		temp = new double[nrofmeasureddata + 1];
		phi = new double[nrofmeasureddata + 1];

		min_re = (double) (+1.E+64);
		min_ho = (double) (+1.E+64);
		min_de = (double) (+1.E+64);
		min_temp = (double) (+1.E+64);
		max_re = (double) (-1.E+64);
		max_ho = (double) (-1.E+64);
		max_de = (double) (-1.E+64);
		max_temp = (double) (-1.E+64);

		dSumT = 0.0;

		for (k = 0; k <= ni; k++) {

			re[k] = scr0[k];
			ho[k] = scr1[k];
			de[k] = scr2[k];
			temp[k] = scr3[k];
			if (b_weighting) {
				phi[k] = scr4[k];
			} else {
				phi[k] = 1.0;
			}
			min_re = Math.min(min_re, re[k]);
			min_ho = Math.min(min_ho, ho[k]);
			min_de = Math.min(min_de, de[k]);
			min_temp = Math.min(min_temp, temp[k]);

			max_re = Math.max(max_re, re[k]);
			max_ho = Math.max(max_ho, ho[k]);
			max_de = Math.max(max_de, de[k]);
			max_temp = Math.max(max_temp, temp[k]);
			dSumT = dSumT + temp[k];
		}
		dMeanT = dSumT / (ni + 1);

		// 计算半变异函数
		SemiVariogram v = new SemiVariogram(this, re, ho, de, temp, min_re, max_re, min_ho, max_ho, min_de, max_de, ni);
	}

	// 计算相关长度
	public void getCorrelationLength() {
		SetBoundarys b = new SetBoundarys(this, "grid boundarys", ni, min_re, min_ho, min_de, min_temp, max_re, max_ho,
				max_de, max_temp, beta, delta, missingvalue, assign_missing_value_when_lower_than, i_normalize,
				surfer_grd, NR_EMPTY_OCT, NR_DATA_OCT, b_Octant_search, proType);
	}

	public void reset() {

	}
}
