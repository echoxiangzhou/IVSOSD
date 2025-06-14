package interpolation;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.Vector;

/**
 * @classname: GetCTDData
 * @description:  读取CTD信息
 * @version: 
 * @date: 2016-10-21
 * @author: liujin
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */
 
public class GetCTDData {

	/**
	 * 
	 * @param filePath CTD文件路径
	 * @return 海洋要素数据值（温度、盐度...）
	 */
	public static String[][] readFile(String filePath) {
		try {
			String encoding = "GBK";
			File file = new File(filePath);
			if (file.isFile() && file.exists()) {
				InputStreamReader read = new InputStreamReader(new FileInputStream(file), encoding);
				BufferedReader bufferedReader = new BufferedReader(read);
				String lineTxt = null;
				int n = 0;
				bufferedReader.mark((int) file.length());
				while ((lineTxt = bufferedReader.readLine()) != null) {
					if (!lineTxt.startsWith("*") && !lineTxt.startsWith("#")) {
						for (int si = 0; si < 50; si++) {
							bufferedReader.readLine();
						}
						n++;
					}
				}
				read.close();

				InputStreamReader read2 = new InputStreamReader(new FileInputStream(file), encoding);
				BufferedReader bufferedReader2 = new BufferedReader(read2);

				String[][] Values = new String[(int) Math.floor(n / 2)][18];
				int i = 0;
				while ((lineTxt = bufferedReader2.readLine()) != null) {
					for (int si = 0; si < 50; si++) {
						bufferedReader2.readLine();
					}

					if (!lineTxt.startsWith("*") && !lineTxt.startsWith("#")) {
						String[] lineValues = lineTxt.trim().split("\\s+");
						int vL = lineValues.length;
						for (int j = 0; j < vL; j++) {
							Values[i][j] = lineValues[j];
						}
						i++;
						if (i >= (int) Math.floor(n / 2)) {
							break;
						}
					}
				}
				read2.close();
				return Values;

			} else {
			}

		} catch (

		Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
