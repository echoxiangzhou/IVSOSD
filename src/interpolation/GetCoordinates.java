package interpolation;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.Vector;

/**
 * @classname: GetCoordinates
 * @description: 读取采样点坐标文件并解析，获取每个采样点的经纬度坐标
 * @version: 
 * @date: 2016-12-10
 * @author: liujin
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

public class GetCoordinates {
/**
 * 
 * @param filePath 文件路径
 * @return 经纬度坐标二维数组
 */
	public static String[][] readFile(String filePath) {
		try {
			String encoding = "GBK";
			File file = new File(filePath);
			if (file.isFile() && file.exists()) { 
				InputStreamReader read = new InputStreamReader(new FileInputStream(file), encoding);
				BufferedReader bufferedReader = new BufferedReader(read);
				String lineTxt = null;
				int n = 0;//
				bufferedReader.mark((int) file.length());
				while ((lineTxt = bufferedReader.readLine()) != null) {
					//判断真正数据行起始位置
					if (!lineTxt.startsWith("*") && !lineTxt.startsWith("#")) {
						n++;
					}
				}

				String[][] Values = new String[n][5];
				read.close();

				read = new InputStreamReader(new FileInputStream(file), encoding);
				bufferedReader = new BufferedReader(read);
				int i = 0;
				while ((lineTxt = bufferedReader.readLine()) != null) {
					//判断真正数据行起始位置
					if (!lineTxt.startsWith("*") && !lineTxt.startsWith("#")) {
						String[] lineValues = lineTxt.trim().split("\\s+");
						int vL = lineValues.length;
						for (int j = 0; j < vL; j++) {
							Values[i][j] = lineValues[j];
						}

						i++;
					}
				}
				read.close();
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
