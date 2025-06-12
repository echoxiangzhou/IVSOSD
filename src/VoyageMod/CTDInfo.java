package VoyageMod;

/**
 * @classname: CTDInfo
 * @description: CTD信息
 * @version: 
 * @date: 2016-10-26
 * @author: wangtuo
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

public class CTDInfo {
	private String id;
	private String metadataID;
	private String stationID;
	private String depth;
	private String temperature;
	private String salinity;

	/**
	 * 
	 * @return id 记录ID
	 */
	public String getID() {
		return id;
	}

	/**
	 * 
	 * @param id记录ID
	 */
	public void setID(String id) {
		this.id = id;
	}

	/**
	 * 
	 * @return metadataID 元数据ID
	 */
	public String getMetadataID() {
		return metadataID;
	}
	/**
	 * 
	 * @param metadataID元数据ID
	 */
	public void setMetadataID(String metadataID) {
		this.metadataID = metadataID;
	}

	/**
	 * 
	 * @return stationID 站点ID
	 */
	public String getStationID() {
		return stationID;
	}
	/**
	 * 
	 * @param stationID站点ID
	 */
	public void setStationID(String stationID) {
		this.stationID = stationID;
	}

	/**
	 * 
	 * @return depth 深度
	 */
	public String getDepth() {
		return depth;
	}
	/**
	 * 
	 * @param depth深度
	 */
	public void setDepth(String depth) {
		this.depth = depth;
	}

	/**
	 * 
	 * @return temperature 温度
	 */
	public String getTemperature() {
		return temperature;
	}
	/**
	 * 
	 * @param temperature温度
	 */
	public void setTemperature(String temperature) {
		this.temperature = temperature;
	}

	/**
	 * 
	 * @return salinity 盐度
	 */
	public String getSalinity() {
		return salinity;
	}
	/**
	 * 
	 * @param salinity盐度
	 */
	public void setSalinity(String salinity) {
		this.salinity = salinity;
	}

}
