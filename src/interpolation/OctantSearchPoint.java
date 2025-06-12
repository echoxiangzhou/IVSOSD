package interpolation;

/**
 * @classname: OctantSearchPoint
 * @description:  Octant search algorithm 八向搜索算法
 * @version: 
 * @date: 2016-11-16
 * @author: liujin
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

public class OctantSearchPoint extends StartInterpolation {

	//临时变量
	private double[] X;
	private double[] Y;
	private double[] Z;
	private double[] Temp;
	public static int q1, q2, q3, q4, q5, q6, q7, q8;
	public static double[][] d, p, T;
	public double[] dd1, dd2, dd3, dd4, dd5, dd6, dd7, dd8;
	static boolean[] bd_all = new boolean[8];
	public static double newphi;
	public static double D_TOL;

	public static void OctantSearch(boolean debug, double[] X, double[] Y, double[] Z, double[] Temp, double[] phi,
			double xvv, double yvv, double zvv, int ni, double relation_y, double relation_z, double search_x,
			double search_y, double search_z, double delta, double beta, int NR_EMPTY_OCT, int NR_DATA_OCT,
			double D_TOL) {
		double tau = 0.0, omega = 0.0;
		double sum_dist = 0.0;
		double[] d_All = new double[NR_DATA_OCT * 8];
		double[] T_All = new double[NR_DATA_OCT * 8];
		double[] phi_All = new double[NR_DATA_OCT * 8];

		boolean b_identic = false;

		q1 = 0;
		q2 = 0;
		q3 = 0;
		q4 = 0;
		q5 = 0;
		q6 = 0;
		q7 = 0;
		q8 = 0;
		d = new double[8][ni + 1];
		p = new double[8][ni + 1];
		T = new double[8][ni + 1];
		identic: for (int i = 0; i <= ni; ++i) {
			double dx = (xvv - X[i]);
			double dy = (yvv - Y[i]) * relation_y;
			double dz = (zvv - Z[i]) * relation_z;
			double d_tmp = Math.sqrt(Math.pow(dx, 2.) + Math.pow(dy, 2.) + Math.pow(dz, 2.));

			// 如果一个采样点的距离非常近，则忽略其他采样点
			if (Math.abs(d_tmp) <= 0.0) {
				b_identic = true;
				if (debug)
					System.out.println("identic " + Math.abs(d_tmp));
				newphi = Temp[i];
				break identic;
			}

			double A2 = Math.pow(search_x, 2.0);
			double B2 = Math.pow((search_y * relation_y), 2.0);
			double C2 = Math.pow((search_z * relation_z), 2.0);
			double deltax2 = Math.pow(dx, 2.0);
			double deltay2 = Math.pow(dy, 2.0);
			double deltaz2 = Math.pow(dz, 2.0);
			double ellipsoid = deltax2 / A2 + deltay2 / B2 + deltaz2 / C2;
			if (ellipsoid <= 1.0) {
				// 1. Octant: NorthWest方向
				if (dx <= 0.0 && dy > 0.0 && dz <= 0.0) {
					d[0][q1] = d_tmp;
					p[0][q1] = phi[i];
					T[0][q1] = Temp[i];
					q1++;
				}
				// 2. Octant: NorthEest方向
				else if (dx > 0.0 && dy > 0.0 && dz <= 0.0) {
					d[1][q2] = d_tmp;
					p[1][q2] = phi[i];
					T[1][q2] = Temp[i];
					q2++;
				}
				// 3. Octant: SouthEest方向
				else if (dx > 0.0 && dy <= 0.0 && dz <= 0.0) {
					d[2][q3] = d_tmp;
					p[2][q3] = phi[i];
					T[2][q3] = Temp[i];
					q3++;
				}
				// 4. Octant: SouthWest方向
				else if (dx <= 0.0 && dy <= 0.0 && dz <= 0.0) {
					d[3][q4] = d_tmp;
					p[3][q4] = phi[i];
					T[3][q4] = Temp[i];
					q4++;
				}
				// 5. Octant: NorthWest方向
				if (dx <= 0.0 && dy > 0.0 && dz > 0.0) {
					d[4][q5] = d_tmp;
					p[4][q5] = phi[i];
					T[4][q5] = Temp[i];
					q5++;
				}
				// 6. Octant: NorthEest方向
				else if (dx > 0.0 && dy > 0.0 && dz > 0.0) {
					d[5][q6] = d_tmp;
					p[5][q6] = phi[i];
					T[5][q6] = Temp[i];
					q6++;
				}
				// 7. Octant: SouthEest方向
				else if (dx > 0.0 && dy <= 0.0 && dz > 0.0) {
					d[6][q7] = d_tmp;
					p[6][q7] = phi[i];
					T[6][q7] = Temp[i];
					q7++;
				}
				// 8. Octant: SouthWest方向
				else if (dx <= 0.0 && dy <= 0.0 && dz > 0.0) {
					d[7][q8] = d_tmp;
					p[7][q8] = phi[i];
					T[7][q8] = Temp[i];
					q8++;
				}
			}
		}

		if (b_identic == false) {
			int i2 = 0;
			int empty_OCT = 0;

			int qq[] = new int[8];
			qq[0] = q1;
			qq[1] = q2;
			qq[2] = q3;
			qq[3] = q4;
			qq[4] = q5;
			qq[5] = q6;
			qq[6] = q7;
			qq[7] = q8;

			for (int a = 0; a < 8; a++) {
				if (qq[a] >= NR_DATA_OCT) {

					// 简单排序算法， 对dd_tmp、T_tmp、 phi_tmp升序排列
					double a2, b2, c2;
					for (int j = 1; j < qq[a]; j++) {
						int i = 0;
						a2 = d[a][j];
						b2 = T[a][j];
						c2 = p[a][j];
						finish: for (i = j - 1; i >= 0; i--) {
							if (d[a][i] <= a2)
								break finish;
							d[a][i + 1] = d[a][i];
							T[a][i + 1] = T[a][i];
							p[a][i + 1] = p[a][i];
						}
						d[a][i + 1] = a2;
						T[a][i + 1] = b2;
						p[a][i + 1] = c2;
					}

					for (int i = 0; i < NR_DATA_OCT; i++) {
						d_All[i2] = d[a][i];
						T_All[i2] = T[a][i];
						phi_All[i2] = p[a][i];
						i2++;
					}
					bd_all[a] = false;
				} else if (qq[a] < NR_DATA_OCT && qq[a] > 0) {
					bd_all[a] = true;
					for (int i = 0; i < qq[a]; i++) {
						d_All[i2] = d[a][i];
						T_All[i2] = T[a][i];
						phi_All[i2] = p[a][i];
						i2++;
					}
				} else {
					empty_OCT++;
				}
			}
			// 反距离权重计算
			tau = 0.0;
			omega = 0.0;
			for (int i = 0; i < i2; i++) {
				double vecdist = Math.sqrt(Math.pow(d_All[i], 2.0) + Math.pow(delta, 2.0));
				if (vecdist > 0.0) {
					omega = omega + ((phi_All[i] * T_All[i]) / Math.pow(vecdist, beta));
					tau = tau + (phi_All[i] / Math.pow(vecdist, beta));
				} else {
					if (debug)
						System.out.println(
								" vecdist = " + vecdist + " i=" + i + " i2=" + i2 + " SUM emptyOCT = " + empty_OCT);
				}
			}
			newphi = omega / tau;
			if (omega == 0.0 | tau == 0.0)
				newphi = missingvalue;

			if (empty_OCT > NR_EMPTY_OCT)
				newphi = missingvalue;
		}
	}

	public double newphi() {
		return newphi;
	}
}
