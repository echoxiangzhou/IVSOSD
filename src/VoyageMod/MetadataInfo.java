package VoyageMod;

/**
 * @classname: MetadataInfo
 * @description:  MetadataInfo 元数据信息
 * @version: 
 * @date: 2016-10-26
 * @author: wangtuo
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

/**
 * id 数据记录ID
 * voyageID  航线编号
 * dataName 数据名称
 * keyword 关键字
 * dataID 数据ID
 * dataSubject 数据集学科分类
 * element 采集要素种类
 */

public class MetadataInfo {

	private String id;
	private String voyageID;
	private String dataName;
	private String keyword;
	private String dataID;
	private String dataSubject;
	private String element;
	
	public String getID() {
		return id;
	}

	public void setID(String id) {
		this.id = id;
	}
	public String getVoyageID() {
		return voyageID;
	}

	public void setVoyageID(String voyageID) {
		this.voyageID = voyageID;
	}

	public String getDataName() {
		return dataName;
	}

	public void setDataName(String dataName) {
		this.dataName = dataName;
	}
	
	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}
	
	public String getDataID() {
		return dataID;
	}

	public void setDataID(String dataID) {
		this.dataID = dataID;
	}
	
	
	public String getDataSubject() {
		return dataSubject;
	}

	public void setDataSubject(String dataSubject) {
		this.dataSubject = dataSubject;
	}
	
	public String getElement() {
		return element;
	}

	public void setElement(String element) {
		this.element = element;
	}
	

	
}
