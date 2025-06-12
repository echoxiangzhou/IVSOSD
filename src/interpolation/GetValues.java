package interpolation;

import java.awt.Frame;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.text.ParseException;

/**
 * @classname: StartInterpolation
 * @description:  获取采样点数据，包括坐标位置信息和样点数据信息
 * @version: 
 * @date: 2016-11-16
 * @author: liujin
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */
 

public class GetValues extends StartInterpolation {
	StartInterpolation parent;

	public GetValues(StartInterpolation interpxyz, String profType) {
		parent = (StartInterpolation) interpxyz;

		// 读取坐标文件
		URL classUrl = Thread.currentThread().getContextClassLoader().getResource("");
		String coorPath = classUrl + "interpolation/Data/CTD/coordinates.txt";
		coorPath = coorPath.replace("file:/", "");
		// 读取坐标文件
		String[][] coordinates = GetCoordinates.readFile(coorPath);
		String newFilePath = classUrl + "interpolation/Data/CTD/";
		newFilePath = newFilePath.replace("file:/", "");
		File dir = new File(newFilePath);

		File[] files = dir.listFiles();
		int dataLength = 0;
		int fk = 0;

		if (files != null) {
			for (int i = 0; i < files.length; i++) {
				String fileName = files[i].getName();

				if (fileName.endsWith("cnv")) {
					String strFileName = files[i].getAbsolutePath();
					String[][] data = GetCTDData.readFile(strFileName);
					dataLength = dataLength + data.length;
				} else {
					continue;
				}
			}
		}

		double[][] values = new double[dataLength][4];
		int vi = 0;
		if (files != null) {
			for (int fn = 0; fn < files.length; fn++) {
				String fileName = files[fn].getName();

				if (fileName.endsWith("cnv")) {
					String strFileName = files[fn].getAbsolutePath();
					String[][] data = GetCTDData.readFile(strFileName);
					for (int di = 0; di < data.length; di++) {
						if (data[di][0] != null) {
							if (profType.equals("Deep")) {

								values[vi][0] = Double.valueOf(coordinates[fn][2]);
								values[vi][1] = Double.valueOf(coordinates[fn][3]);
								values[vi][2] = Double.valueOf(data[di][0]);
								values[vi][3] = Double.valueOf(data[di][1]);
							} else if (profType.equals("Longitude")) {

								values[vi][2] = Double.valueOf(coordinates[fn][2]);
								values[vi][1] = Double.valueOf(coordinates[fn][3]);
								values[vi][0] = Double.valueOf(data[di][0]);
								values[vi][3] = Double.valueOf(data[di][1]);
							} else if (profType.equals("Latitude")) {

								values[vi][0] = Double.valueOf(coordinates[fn][2]);
								values[vi][2] = Double.valueOf(coordinates[fn][3]);
								values[vi][1] = Double.valueOf(data[di][0]);
								values[vi][3] = Double.valueOf(data[di][1]);
							}
							vi++;
						}
					}

				} else {
					continue;
				}
			}
		}

		String[][] tempStringArray = new String[values.length][4];
		for (int i = 0; i < values.length; i++) {
			for (int j = 0; j < 4; j++) {
				tempStringArray[i][j] = Double.toString(values[i][j]);
			}
		}

		// String savePath= classUrl +
		// "interpolation/Data/testdata/outTemp.txt";
		// savePath = savePath.replace("file:/", "");
		// SaveArrayData.SaveArray01(tempStringArray,savePath);

		parent.getReadData(dataLength - 1, 3, values); // !!!

	}
}
