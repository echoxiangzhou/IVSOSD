package DWRService;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;

import interpolation.StartInterpolation;




/**
 * @classname: ServiceClass
 * @description: 前端和后台参数传递与交互
 * @version: 
 * @date: 2016-10-26
 * @author: wangtuo
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

public class ServiceClass {
	// 生成插值计算结果图片
	public String CreateImage(String paras) {
		StartInterpolation xyz = new StartInterpolation();
		String[] arrParas = paras.split("_");
		String proType = arrParas[0];
		int proLoca = Integer.valueOf(arrParas[1]);
		InteReplies inteReplies = new InteReplies();
		inteReplies.setMaxValue(-10000.00);
		inteReplies.setMinValue(10000.00);
		inteReplies.setResultPath("");

		xyz.loadData(proType, proLoca, inteReplies);
		String reply = Double.toString(inteReplies.getMaxValue()) + "_" + Double.toString(inteReplies.getMinValue())
				+ "_" + inteReplies.getResultPath();
		return reply;
	}

	// 保存图片
	public void  SaveImage(String imageBase64, String imagePath) {

		URL classUrl = Thread.currentThread().getContextClassLoader().getResource("");
		String strClassURL = classUrl.toString().replace("file:/", "");
		strClassURL = strClassURL.replace("WEB-INF/classes/", "");
		String tempImagePath = strClassURL + "images/" + imagePath;

		File file = new File(strClassURL + "images/");
		if (file.exists()) {
			File[] files = file.listFiles();
			for (File image : files) {
				String fileName = image.getName();
				String pre14 = imagePath.substring(0, 14);
				if (fileName.startsWith("image") && (!fileName.startsWith(pre14))) {
					image.delete();
				}
			}
		}

	}

	// 返回到前端的信息，剖面计算的最大值，最小值，结果文件路径
	public class InteReplies {
		private double maxValue;
		private double minValue;
		private String resultPath;

		public double getMaxValue() {
			return maxValue;
		}

		public void setMaxValue(double maxValue) {
			this.maxValue = maxValue;
		}

		public double getMinValue() {
			return minValue;
		}

		public void setMinValue(double minValue) {
			this.minValue = minValue;
		}

		public String getResultPath() {
			return resultPath;
		}

		public void setResultPath(String resultPath) {
			this.resultPath = resultPath;
		}

	}


}
