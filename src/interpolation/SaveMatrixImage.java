package interpolation;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.imageio.ImageIO;

/**
 * @classname: SaveMatrixImage
 * @description:  矩阵转图片
 * @version: 
 * @date: 2016-12-24
 * @author: liujin
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

public class SaveMatrixImage {
 
	/**
	 * 
	 * @param matrix 二维矩阵计算结果
	 * @param filedir 文件路径
	 * @param minValue 最小值
	 * @param maxValue 最大值
	 * @throws IOException
	 */
	public static void createMatrixImage(double[][] matrix, String filedir,double minValue,double maxValue) throws IOException {
		int cx = matrix.length;
		int cy = matrix[0].length;
		OutputStream output = new FileOutputStream(new File(filedir));
 
		BufferedImage bufferedImage = new BufferedImage(cx, cy, BufferedImage.TYPE_INT_RGB);
		for (int i = 0; i < cx; i++) {
			for (int j = 0; j < cy; j++) {
				if (matrix[i][j] > maxValue) {
					maxValue = matrix[i][j];
				}
				if (matrix[i][j] < minValue) {
					minValue = matrix[i][j];
				}
			}
		}
		int r = 255;
		int g = 255;
		int b = 255;
		for (int i = 0; i < cx; i++) {
			for (int j = cy - 1; j >= 0; j--) {
				double value = 255 * (matrix[i][j] - minValue) / (maxValue - minValue);
				if (value >= 0 && value < 85) {
					r = (int) 0;
					g = (int) value*3;
					b = (int) 255;
				} else if (value >= 85 && value < 170) {
					r = (int) (value-85)*3;
					g = (int) 255;
					b = (int) (170-value)*3;
				} else if (value >= 170 && value <=255) {
					r = (int) 255;
					g = 255-(int) (value-170)*3;
					b = (int) 0;
				}

				int rgb = ((r << 16) | (g << 8) | b) & 0xffffff;
				bufferedImage.setRGB(i, j, rgb);
			}
		}

		bufferedImage.flush();
		
		ImageIO.write(bufferedImage, "jpeg", output);
	}
	
	
	

}