package interpolation;

import java.awt.*;
import java.awt.event.*;
import java.util.*;
import java.text.*;
import javax.swing.*;

/**
 * @classname: SetBoundarys
 * @description:  设置边界条件
 * @version: 
 * @date: 2016-11-15
 * @author: liujin
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */


public class SetBoundarys {

	String min_x_new, max_x_new, min_y_new, max_y_new, min_z_new, max_z_new;
	String s_df = null;

	String nr_x_new = null;
	String nr_y_new = null;
	String nr_z_new = null;
	String slice_filename_new;

	
	boolean normalize_only_z = false;
	boolean b_octant_search;
	boolean b_extract_slices = true;
	int i;
	int my_ni;
	double min_x, min_y, min_z;
	double max_x, max_y, max_z;
	int nr_x, nr_y, nr_z;
	double dx, dy, dz;
	double new_beta, new_delta, new_missingvalue;
	double wx, wy, wz;
	int new_normalize;
	int nr_assign_missingvalue;
	public static final int MAX_ENTRY = 1500;

	long YourNormjobTime = 0;
	long YourWorkTime = 0;
	boolean write_surfer_grd, b_blank2, b_trend;
	double X1, X2;
	double correlation_length_x, correlation_length_y, correlation_length_z;
	public static double search_x_new, search_y_new, search_z_new;
	int new_NR_EMPTY_OCT, new_NR_DATA_OCT;

	DecimalFormat df = new DecimalFormat();
	static final DecimalFormat df_E = new DecimalFormat("0.00E00");
	static final DecimalFormat df_F = new DecimalFormat("0.0####");
	static final NumberFormat nf = NumberFormat.getNumberInstance();

	StartInterpolation parent;

	public SetBoundarys(StartInterpolation interpxyz, String title,  int ni, double min_re, double min_ho,
			double min_de, double min_temp, double max_re, double max_ho, double max_de, double max_temp, double beta,
			double delta, double missingvalue, int assign_missing_value_when_lower_than, int normalize,
			boolean surfer_grd, int NR_EMPTY_OCT, int NR_DATA_OCT, boolean b_octant_search_old, String proType) {

		parent = (StartInterpolation) interpxyz;

		b_octant_search = b_octant_search_old;
		write_surfer_grd = surfer_grd;
		nr_assign_missingvalue = assign_missing_value_when_lower_than;
		new_normalize = normalize;
		search_x_new = SemiVariogram.correlation_length_x;
		search_y_new = SemiVariogram.correlation_length_y;
		search_z_new = SemiVariogram.correlation_length_z;

		my_ni = ni;
		new_beta = beta;
		new_delta = delta;
		new_missingvalue = missingvalue;
		new_NR_EMPTY_OCT = NR_EMPTY_OCT;
		new_NR_DATA_OCT = NR_DATA_OCT;


		Panel p0 = new Panel();
		p0.setLayout(new GridLayout(5, 6));


		int a;
		double deziDimX = 10., deziDimY = 10., deziDimZ = 10.;

		for (a = 0; a <= 20; a++) {
			if (Math.pow(10., a) >= (max_re - min_re)) {
				deziDimX = (double) Math.pow(10, a);
				deziDimX = (double) (deziDimX / 1000.);
				break;
			}
		}
		for (a = 0; a <= 20; a++) {
			if (Math.pow(10., a) >= (max_ho - min_ho)) {
				deziDimY = (double) Math.pow(10, a);
				deziDimY = (double) (deziDimY / 1000.);
				break;
			}
		}
		for (a = 0; a <= 20; a++) {
			if (Math.pow(10., a) >= (max_de - min_de)) {
				deziDimZ = (double) Math.pow(10, a);
				deziDimZ = (double) (deziDimZ / 1000.);
				break;
			}
		}
		min_x = deziDimX * Math.floor(min_re / deziDimX);
		max_x = deziDimX * Math.ceil(max_re / deziDimX);
		nr_x_new = "" + 20;
		min_y = deziDimY * Math.floor(min_ho / deziDimY);
		max_y = deziDimY * Math.ceil(max_ho / deziDimY);
		double relxy = (max_ho - min_ho) / (max_re - min_re);
		int scr = (int) Math.round(20.F * relxy);
		nr_y_new = "" + scr;
		min_z = deziDimZ * Math.floor(min_de / deziDimZ);
		max_z = deziDimZ * Math.ceil(max_de / deziDimZ);
		nr_z_new = "" + 20;


		if (Math.abs(min_x) > 1.E+08 || Math.abs(min_x) < 1.E-08 && min_x != 0.0) {
			s_df = (df_E.format(min_x));
		} else {
			s_df = (df_F.format(min_x));
		}

		min_x_new = Double.toString(min_x);

		if (Math.abs(max_x) > 1.E+08 || Math.abs(max_x) < 1.E-08 && max_x != 0.0) {
			s_df = (df_E.format(max_x));
		} else {
			s_df = (df_F.format(max_x));
		}
  

		Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
		int xPos, yPos; 

	try {
			if (nf.parse(nr_x_new).intValue() > MAX_ENTRY | nf.parse(nr_y_new).intValue() > MAX_ENTRY
					| nf.parse(nr_z_new).intValue() > MAX_ENTRY) {

			}
		} catch (ParseException pe) {
			System.out.println(pe);
		}
		// 如果用户选择了深度剖面
		if (proType.equals("Deep")) {
			parent.getBoundarys("120", "130", "150", 45, "20", "30", "150", 45, "0", "1500", "1", 200, b_extract_slices,
					slice_filename_new, new_beta, 0.99, new_missingvalue, nr_assign_missingvalue, new_normalize,
					normalize_only_z, b_octant_search, write_surfer_grd, b_trend, X1, X2, b_blank2, new_NR_EMPTY_OCT,
					120);

		}
		// 如果用户选择了经度剖面
		else if (proType.equals("Longitude")) {

			parent.getBoundarys("0", "1500", "150", 200, "20", "30", "150", 45, "120", "130", "1", 45, b_extract_slices,
					slice_filename_new, 5, new_delta, new_missingvalue, nr_assign_missingvalue, new_normalize,
					normalize_only_z, false, write_surfer_grd, b_trend, X1, X2, b_blank2, new_NR_EMPTY_OCT, 120);

		}
		// 如果用户选择了维度剖面
		else if (proType.equals("Latitude")) {

			parent.getBoundarys("120", "130", "150", 45, "0", "1500", "150", 200, "20", "30", "150", 45,
					b_extract_slices, slice_filename_new, 5, new_delta, new_missingvalue, nr_assign_missingvalue,
					new_normalize, normalize_only_z, false, write_surfer_grd, b_trend, X1, X2, b_blank2,
					new_NR_EMPTY_OCT, 120);
		}
	}

	public void actionPerformed(ActionEvent e) {

	}

	// 高级设置
	protected void getAdvanced(double beta, double delta, double missingvalue, int nr_of_missingvalues,
			boolean b_octant_search2, boolean bblank2, boolean btrend, double a, double b, int NR_EMPTY_OCT2,
			int NR_DATA_OCT2, double search_x2, double search_y2, double search_z2) {

	}
}
