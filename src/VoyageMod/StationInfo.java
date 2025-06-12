package VoyageMod;

/**
 * @classname: StationInfo
 * @description:  StationInfo 站点信息
 * @version: 
 * @date: 2016-10-18
 * @author: wangtuo
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

/**
 * id 记录ID
 * name 站点名称
 * longitude 站点经度
 * latitude 站点纬度
 * deep 深度最大值
 * infoPath 数据文件路径
 * date 日期
 * voyageID 所属航线编号
 *voyageName 航线名称
 *type  站点类型
 */
public class StationInfo {
	private String id;
	private String name;
	private String longitude;
	private String latitude;
	private String deep;
	private String infoPath;
	private String date;
	private String voyageID;
	private String voyageName;	
	private String type;

	public String getID() {
		return id;
	}

	public void setID(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLongitude() {
		return longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	public String getDeep() {
		return deep;
	}

	public void setDeep(String deep) {
		this.deep = deep;
	}
	public String getLatitude() {
		return latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}
	public String getInfoPath() {
		return infoPath;
	}

	public void setInfoPath(String infoPath) {
		this.infoPath = infoPath;
	}
	
	
	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}
	
	public String getVoyageID() {
		return voyageID;
	}

	public void setVoyageID(String voyageID) {
		this.voyageID = voyageID;
	}
	
	public String getVoyageName() {
		return voyageName;
	}

	public void setVoyageName(String voyageName) {
		this.voyageName = voyageName;
	}
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	
	
	
}
