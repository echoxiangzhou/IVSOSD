package VoyageMod;

/**
 * @classname: VoyageInfo
 * @description: 航次信息
 * @version: 
 * @date: 2016-10-22
 * @author: wangtuo
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

/**
 *  * 
 * id 航次编号
 * name 航次名称
 * vStart 航次开始日期
 * vEnd 航次结束日期
 * seaArea 航次调查海域
 * scientist 首席科学家
 * voyagereportinfo  航次报告存储路径
 * trajPath 航次轨迹文件路径
 * project  学科分类
 * element 采集要素种类
 */
public class VoyageInfo {
	private String id;
	private String name;	
	private String vStart;
	private String vEnd;
	private String seaArea;
	private String scientist;
	private String voyagereportinfo;
	private String trajPath;
	private String project;
	private String element;
	

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

	public String getSeaArea() {
		return seaArea;
	}

	public void setSeaArea(String seaArea) {
		this.seaArea = seaArea;
	}


	public String getVStart() {
		return vStart;
	}

	public void setVStart(String vStart) {
		this.vStart = vStart;
	}

	
	public String getVEnd() {
		return vEnd;
	}

	public void setVEnd(String vEnd) {
		this.vEnd = vEnd;
	}
		
	public String getScientist() {
		return scientist;
	}

	public void setScientist(String scientist) {
		this.scientist = scientist;
	}
		
	public String getTrajPath() {
		return trajPath;
	}

	public void setTrajPath(String trajPath) {
		this.trajPath = trajPath;
	}
	
	public String getReportInfo() {
		return voyagereportinfo;
	}

	public void setReportInfo(String voyagereportinfo) {
		this.voyagereportinfo = voyagereportinfo;
	}
	
	
	public String getProject() {
		return project;
	}

	public void setProject(String project) {
		this.project = project;
	}


	public String getElement() {
		return element;
	}

	public void setElement(String element) {
		this.element = element;
	}

	
	
	
}
