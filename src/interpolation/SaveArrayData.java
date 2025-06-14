package interpolation;

import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintStream;
import java.net.URL;
import java.text.DecimalFormat;

/**
 * @classname: SaveArrayData
 * @description:  保存输出计算结果
 * @version: 
 * @date: 2016-12-28
 * @author: liujin
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

public class SaveArrayData {
	/**
	 * 
	 * @param strArray 存储结算结果的数组
	 * @param filePath 保存路径
	 */
	public static void SaveData(String[][] strArray, String filePath) {
		FileWriter fw = null;
		try {
			fw = new FileWriter(filePath, true);
			int rowLength = strArray.length;
			int colLength = strArray[0].length;
			for (int i = 0; i < rowLength; i++) {
				String rowTemp = "";
				for (int j = 0; j < colLength; j++) {
					rowTemp = rowTemp + strArray[i][j].toString() + " ";
				}
				String c = rowTemp + "\r\n";
				fw.write(c);
			}

			fw.close();
		} catch (IOException e1) {
			e1.printStackTrace();
			System.exit(-1);
		}
	}

	
	
}
