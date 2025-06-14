package DBUtilities;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.soap.Node;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import VoyageMod.CTDInfo;
import VoyageMod.DataRange;
import VoyageMod.MetadataInfo;
import VoyageMod.StationInfo;
import VoyageMod.VoyageInfo;

/**
 * @classname: DatabaseOperation
 * @description: 数据库连接和SQL数据查询
 * @version: 
 * @date: 2016-10-29
 * @author: wangtuo
 * @JDK: 1.8
 * CopyRight (c) 2016-2017 FocusMap.Co.Ltd. All rights reserved.
 */

public class DatabaseOperation {

	Connection con = null;
	PreparedStatement pre = null;
	String url;
	String user;
	String password;

	/**
	 * 
	 * @description 连接数据库
	 * @return con数据库连接信息
	 */
	public Connection TryConnection() throws SAXException, IOException {
		
		try {
			Class.forName("oracle.jdbc.driver.OracleDriver");
		} catch (ClassNotFoundException e) {
			System.err.println("✗ Oracle JDBC驱动加载失败: " + e.getMessage());
			e.printStackTrace();
			throw new RuntimeException("Oracle JDBC驱动加载失败", e);
		}

		
		try {
			URL classUrl = Thread.currentThread().getContextClassLoader().getResource("");
			if (classUrl == null) {
				throw new RuntimeException("无法获取类路径");
			}
			
			String strClassURL = classUrl.toString();
			
			// 更可靠的路径处理
			if (strClassURL.startsWith("file:")) {
				strClassURL = strClassURL.substring(5); // 移除 "file:"
			}
			
			// 处理Windows和Unix路径差异
			if (strClassURL.startsWith("/") && System.getProperty("os.name").toLowerCase().contains("windows")) {
				strClassURL = strClassURL.substring(1);
			}
			
			// 确保路径以WEB-INF/classes/结尾，然后构建web.xml路径
			if (strClassURL.endsWith("WEB-INF/classes/")) {
				strClassURL = strClassURL.substring(0, strClassURL.length() - "classes/".length());
			} else if (strClassURL.endsWith("classes/")) {
				strClassURL = strClassURL.replace("classes/", "");
			} else if (strClassURL.endsWith("classes")) {
				strClassURL = strClassURL.replace("classes", "");
			}
			
			// 确保路径以/结尾
			if (!strClassURL.endsWith("/")) {
				strClassURL += "/";
			}
			
			String webConPath = strClassURL + "web.xml";

			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();
			
			File file = new File(webConPath);
			if (!file.exists()) {
				throw new RuntimeException("web.xml文件不存在: " + webConPath);
			}
			
			Document document = db.parse(file);
			NodeList bookList = document.getElementsByTagName("database-con");
			
			if (bookList.getLength() == 0) {
				throw new RuntimeException("web.xml中未找到database-con配置");
			}
			
			Map<String, Object> DBParaMap = new HashMap<String, Object>();
			for (int i = 0; i < bookList.getLength(); i++) {
				org.w3c.dom.Node book = bookList.item(i);
				NodeList childNodes = book.getChildNodes();
				for (int k = 0; k < childNodes.getLength(); k++) {
					if (childNodes.item(k).getNodeType() == Node.ELEMENT_NODE) {
						String nodeName = childNodes.item(k).getNodeName();
						String nodeValue = childNodes.item(k).getFirstChild() != null ? 
							childNodes.item(k).getFirstChild().getNodeValue() : "";
						DBParaMap.put(nodeName, nodeValue);
					}
				}
			}
			
			url = (String) DBParaMap.get("url");
			user = (String) DBParaMap.get("user");
			password = (String) DBParaMap.get("password");
			
			if (url == null || user == null || password == null) {
				throw new RuntimeException("数据库配置不完整: url=" + url + ", user=" + user + ", password=" + (password != null ? "****" : "null"));
			}
			

		} catch (ParserConfigurationException e1) {
			System.err.println("✗ XML解析配置异常: " + e1.getMessage());
			e1.printStackTrace();
			throw new RuntimeException("XML解析配置失败", e1);
		} catch (Exception e) {
			System.err.println("✗ 配置解析异常: " + e.getMessage());
			e.printStackTrace();
			throw new RuntimeException("配置解析失败", e);
		}

		
		try {
			con = DriverManager.getConnection(url, user, password);
			if (con != null && !con.isClosed()) {
			} else {
				throw new SQLException("连接建立后状态异常");
			}
		} catch (SQLException e) {
			System.err.println("✗ 数据库连接失败: " + e.getMessage());
			System.err.println("   SQL状态: " + e.getSQLState());
			System.err.println("   错误代码: " + e.getErrorCode());
			e.printStackTrace();
			throw new RuntimeException("数据库连接失败: " + e.getMessage(), e);
		}

		return con;
	}
	
	/**
	 * 简化的数据库连接方法，用于测试
	 */
	public Connection getConnection() throws Exception {
		return TryConnection();
	}
	
	/**
	 * DWR安全测试方法 - 不抛出异常，返回状态字符串
	 */
	public String testDatabaseConnection() {
		try {
			return testConnection();
		} catch (Exception e) {
			System.err.println("DWR testDatabaseConnection 异常: " + e.getMessage());
			e.printStackTrace();
			return "DWR调用失败: " + e.getClass().getSimpleName() + " - " + e.getMessage();
		}
	}
	
	/**
	 * 超级安全的航次查询 - 用于DWR调用，避免序列化问题
	 */
	public String queryVoyageListSafe() {
		
		try {
			// 步骤1：检查Oracle驱动
			try {
				Class.forName("oracle.jdbc.driver.OracleDriver");
			} catch (Exception e) {
				String msg = "数据库驱动加载失败: " + e.getMessage();
				System.err.println("✗ " + msg);
				return msg;
			}
			
			// 步骤2：硬编码数据库连接参数
			String dbUrl = "jdbc:oracle:thin:@192.168.101.38:1521:ORCL";
			String dbUser = "iocasksh";
			String dbPassword = "iocas6760";
			
			
			// 步骤3：尝试连接
			Connection testCon = null;
			try {
				testCon = DriverManager.getConnection(dbUrl, dbUser, dbPassword);
				
				if (testCon == null) {
					return "数据库连接失败: 连接返回null";
				}
				
				if (testCon.isClosed()) {
					return "数据库连接失败: 连接已关闭";
				}
				
				
				// 步骤4：测试航次查询
				try {
					String testQuery = "SELECT ID, NAME, SEA_AREA, V_START FROM VOYAGE WHERE ROWNUM <= 3 ORDER BY ID";
					PreparedStatement pstmt = testCon.prepareStatement(testQuery);
					ResultSet rs = pstmt.executeQuery();
					
					StringBuilder result = new StringBuilder();
					result.append("查询成功！航次数据:\n");
					
					int count = 0;
					while (rs.next()) {
						count++;
						String id = rs.getString("ID");
						String name = rs.getString("NAME");
						String seaArea = rs.getString("SEA_AREA");
						String vStart = rs.getString("V_START");
						
						result.append("航次").append(count).append(": ");
						result.append("ID=").append(id != null ? id : "null").append(", ");
						result.append("NAME=").append(name != null ? name : "null").append(", ");
						result.append("SEA_AREA=").append(seaArea != null ? seaArea : "null").append(", ");
						result.append("V_START=").append(vStart != null ? vStart : "null").append("\n");
						
					}
					
					if (count == 0) {
						result.append("VOYAGE表中没有数据");
					} else {
						result.append("共找到 ").append(count).append(" 条航次记录");
					}
					
					rs.close();
					pstmt.close();
					testCon.close();
					
					return result.toString();
					
				} catch (SQLException sqle) {
					System.err.println("✗ 航次查询异常: " + sqle.getMessage());
					return "航次查询失败: " + sqle.getMessage() + " (错误代码: " + sqle.getErrorCode() + ")";
				}
				
			} catch (SQLException e) {
				System.err.println("✗ 数据库连接异常: " + e.getMessage());
				return "数据库连接失败: " + e.getMessage() + " (错误代码: " + e.getErrorCode() + ")";
			} finally {
				if (testCon != null) {
					try {
						testCon.close();
					} catch (SQLException e) {
						System.err.println("关闭连接时出错: " + e.getMessage());
					}
				}
			}
			
		} catch (Exception e) {
			System.err.println("✗ 未预期异常: " + e.getClass().getSimpleName() + " - " + e.getMessage());
			e.printStackTrace();
			return "测试失败: " + e.getClass().getSimpleName() + " - " + e.getMessage();
		}
	}

	/**
	 * 超级安全的数据库连接测试 - 用于DWR调用
	 */
	public String testConnectionSafe() {
		
		try {
			// 步骤1：检查Oracle驱动
			try {
				Class.forName("oracle.jdbc.driver.OracleDriver");
			} catch (Exception e) {
				String msg = "数据库驱动加载失败: " + e.getMessage();
				System.err.println("✗ " + msg);
				return msg;
			}
			
			// 步骤2：硬编码数据库连接参数（避免解析web.xml的问题）
			String dbUrl = "jdbc:oracle:thin:@192.168.101.38:1521:ORCL";
			String dbUser = "iocasksh";
			String dbPassword = "iocas6760";
			
			
			// 步骤3：尝试连接
			Connection testCon = null;
			try {
				testCon = DriverManager.getConnection(dbUrl, dbUser, dbPassword);
				
				if (testCon == null) {
					return "数据库连接失败: 连接返回null";
				}
				
				if (testCon.isClosed()) {
					return "数据库连接失败: 连接已关闭";
				}
				
				
				// 步骤4：测试简单查询
				try {
					String testQuery = "SELECT COUNT(*) as CNT FROM USER_TABLES WHERE TABLE_NAME = 'VOYAGE'";
					PreparedStatement pstmt = testCon.prepareStatement(testQuery);
					ResultSet rs = pstmt.executeQuery();
					
					if (rs.next()) {
						int tableCount = rs.getInt("CNT");
						
						if (tableCount > 0) {
							// 测试VOYAGE表数据
							String dataQuery = "SELECT COUNT(*) as DATA_CNT FROM VOYAGE";
							PreparedStatement dataPstmt = testCon.prepareStatement(dataQuery);
							ResultSet dataRs = dataPstmt.executeQuery();
							
							if (dataRs.next()) {
								int dataCount = dataRs.getInt("DATA_CNT");
								
								dataRs.close();
								dataPstmt.close();
								rs.close();
								pstmt.close();
								testCon.close();
								
								return "数据库连接测试成功! VOYAGE表存在，包含 " + dataCount + " 条数据";
							}
						} else {
							rs.close();
							pstmt.close();
							testCon.close();
							return "数据库连接成功，但VOYAGE表不存在";
						}
					}
					
					rs.close();
					pstmt.close();
					testCon.close();
					return "数据库连接成功，但查询失败";
					
				} catch (SQLException sqle) {
					System.err.println("✗ 数据库查询异常: " + sqle.getMessage());
					return "数据库查询失败: " + sqle.getMessage() + " (错误代码: " + sqle.getErrorCode() + ")";
				}
				
			} catch (SQLException e) {
				System.err.println("✗ 数据库连接异常: " + e.getMessage());
				return "数据库连接失败: " + e.getMessage() + " (错误代码: " + e.getErrorCode() + ")";
			} finally {
				if (testCon != null) {
					try {
						testCon.close();
					} catch (SQLException e) {
						System.err.println("关闭连接时出错: " + e.getMessage());
					}
				}
			}
			
		} catch (Exception e) {
			System.err.println("✗ 未预期异常: " + e.getClass().getSimpleName() + " - " + e.getMessage());
			e.printStackTrace();
			return "测试失败: " + e.getClass().getSimpleName() + " - " + e.getMessage();
		}
	}
	
	/**
	 * 简单的DWR测试方法
	 */
	public String sayHello() {
		return "Hello from DatabaseOperation! 当前时间: " + new java.util.Date();
	}


	/**
	 * 
	 * @description 查询航次列表
	 * @param strSQL 查询航次列表的SQL条件
	 * @return  航次信息列表
	 */
	// Enhanced test method with detailed diagnostics
	public String testConnection() {
		try {
			
			// Test 1: Check Oracle driver
			try {
				Class.forName("oracle.jdbc.driver.OracleDriver");
			} catch (ClassNotFoundException e) {
				System.err.println("✗ Oracle JDBC驱动加载失败: " + e.getMessage());
				return "数据库驱动加载失败：" + e.getMessage();
			}
			
			// Test 2: Try connection
			con = TryConnection();
			if (con == null) {
				System.err.println("✗ 数据库连接返回null");
				return "数据库连接失败：连接返回null";
			}
			
			if (con.isClosed()) {
				System.err.println("✗ 数据库连接已关闭");
				return "数据库连接失败：连接已关闭";
			}
			
			
			// Test 3: Test basic query
			try {
				String testQuery = "SELECT COUNT(*) as count FROM USER_TABLES WHERE TABLE_NAME = 'VOYAGE'";
				PreparedStatement pstmt = con.prepareStatement(testQuery);
				ResultSet rs = pstmt.executeQuery();
				
				if (rs.next()) {
					int tableCount = rs.getInt("count");
					
					if (tableCount > 0) {
						// Test 4: Test data query
						String dataQuery = "SELECT COUNT(*) as data_count FROM VOYAGE";
						PreparedStatement dataPstmt = con.prepareStatement(dataQuery);
						ResultSet dataRs = dataPstmt.executeQuery();
						
						if (dataRs.next()) {
							int dataCount = dataRs.getInt("data_count");
							
							// Test 5: Sample data query
							if (dataCount > 0) {
								String sampleQuery = "SELECT ID, NAME, SEA_AREA FROM VOYAGE WHERE ROWNUM <= 1";
								PreparedStatement samplePstmt = con.prepareStatement(sampleQuery);
								ResultSet sampleRs = samplePstmt.executeQuery();
								
								if (sampleRs.next()) {
									String sampleId = sampleRs.getString("ID");
									String sampleName = sampleRs.getString("NAME");
									String sampleArea = sampleRs.getString("SEA_AREA");
								}
								sampleRs.close();
								samplePstmt.close();
							}
							
							dataRs.close();
							dataPstmt.close();
							rs.close();
							pstmt.close();
							con.close();
							
							return "数据库连接测试成功！VOYAGE表存在，包含 " + dataCount + " 条数据";
						}
					} else {
						rs.close();
						pstmt.close();
						con.close();
						System.err.println("✗ VOYAGE表不存在");
						return "数据库连接成功，但VOYAGE表不存在。请检查数据库结构。";
					}
				}
				
				rs.close();
				pstmt.close();
				con.close();
				return "数据库连接成功，但无法查询表信息";
			} catch (SQLException sqle) {
				System.err.println("✗ 数据库查询异常: " + sqle.getMessage());
				System.err.println("   SQL状态: " + sqle.getSQLState());
				System.err.println("   错误代码: " + sqle.getErrorCode());
				return "数据库查询失败: " + sqle.getMessage() + " (SQL状态: " + sqle.getSQLState() + ")";
			}
			
		} catch (Exception e) {
			System.err.println("✗ 数据库连接测试异常: " + e.getClass().getSimpleName() + " - " + e.getMessage());
			e.printStackTrace();
			return "数据库连接失败：" + e.getClass().getSimpleName() + " - " + e.getMessage();
		} finally {
			// Ensure connection is closed
			try {
				if (con != null && !con.isClosed()) {
					con.close();
				}
			} catch (SQLException e) {
				System.err.println("关闭连接时出错: " + e.getMessage());
			}
		}
	}
	
	public ArrayList<VoyageInfo> QueryVoyageList(String strSQL) {
		ResultSet result = null;
		ArrayList<VoyageMod.VoyageInfo> voyList = new ArrayList<VoyageMod.VoyageInfo>();
		Connection con = null; // 将 con 的声明移到这里
		PreparedStatement pre = null; // 将 pre 的声明移到这里

		try {
			
			// Test connection first with safer approach
			try {
				con = TryConnection();
			} catch (Exception connException) {
				System.err.println("✗ TryConnection异常: " + connException.getMessage());
				connException.printStackTrace();
				// 向DWR抛出明确的异常
				throw new RuntimeException("数据库连接失败: " + connException.getMessage(), connException);
			}
			
			if (con == null || con.isClosed()) {
				System.err.println("✗ 数据库连接无效，返回空列表");
				throw new RuntimeException("数据库连接无效");
			}
			
			
			// Use default query if strSQL is empty or null
			String sql = (strSQL == null || strSQL.trim().isEmpty()) 
				? "SELECT ID, NAME, SEA_AREA, V_START, V_END, SCIENTIST, PROJECT, VOYAGEREPORTINFO, TRAJ_PATH FROM VOYAGE ORDER BY ID" 
				: strSQL;
			
			
			pre = con.prepareStatement(sql);
			result = pre.executeQuery();
			
			int rowCount = 0;
			while (result.next()) {
				rowCount++;
				VoyageMod.VoyageInfo voyInfo = new VoyageMod.VoyageInfo();
				
				try {
					// Add null checks for database fields with detailed logging
					String id = result.getString("ID");
					String name = result.getString("NAME");
					String seaArea = result.getString("SEA_AREA");
					String vStart = result.getString("V_START");
					String vEnd = null;
					String scientist = null;
					String project = null;
					String voyageReportInfo = null;
					String trajPath = result.getString("TRAJ_PATH");
					
					// 尝试读取其他字段（可能不在某些查询中）
					try {
						vEnd = result.getString("V_END");
						scientist = result.getString("SCIENTIST");
						project = result.getString("PROJECT");
						voyageReportInfo = result.getString("VOYAGEREPORTINFO");
					} catch (SQLException e) {
						// 忽略，这些字段可能不在查询结果中
					}
					
					
					// 为每个字段提供默认值
					voyInfo.setID(id != null ? id : "0");
					voyInfo.setName(name != null ? name : "未知航次");
					voyInfo.setSeaArea(seaArea != null ? seaArea : "未知区域");
					voyInfo.setVStart(vStart != null ? vStart : "1900-01-01");
					voyInfo.setVEnd(vEnd != null ? vEnd : "");
					voyInfo.setScientist(scientist != null ? scientist : "");
					voyInfo.setProject(project != null ? project : "");
					voyInfo.setReportInfo(voyageReportInfo != null ? voyageReportInfo : "");
					voyInfo.setTrajPath(trajPath != null ? trajPath : "");

					// Always add voyage info, even if trajPath is null
					voyList.add(voyInfo);
					
				} catch (SQLException rowException) {
					System.err.println("✗ 处理第" + rowCount + "行数据时出错: " + rowException.getMessage());
					// Continue processing other rows
				}
			}
			
			
		} catch (SQLException sqle) {
			System.err.println("✗ SQL查询异常: " + sqle.getMessage());
			System.err.println("   SQL状态: " + sqle.getSQLState());
			System.err.println("   错误代码: " + sqle.getErrorCode());
			sqle.printStackTrace();
			// 可以选择向上抛出自定义异常，以便DWR更好地处理
			throw new RuntimeException("数据库查询失败: " + sqle.getMessage(), sqle);
			
		} catch (Exception e) {
			System.err.println("✗ 查询航次列表时发生未知异常: " + e.getClass().getSimpleName() + " - " + e.getMessage());
			e.printStackTrace();
			// 向上抛出异常
			throw new RuntimeException("处理航次列表时发生未知错误", e);
			
		} finally {
			try {
				if (result != null) {
					result.close();
				}
				if (pre != null) {
					pre.close();
				}
				if (con != null) {
					con.close();
				}
			} catch (Exception e) {
				System.err.println("关闭数据库资源时出错: " + e.getMessage());
				e.printStackTrace();
			}
			
		}
		return voyList;
	}


	/**
	 * 
	 * @description 查询航次列表
	 * @param strSQL 查询航次列表的SQL条件
	 * @return  航次列表
	 */
	public ArrayList<VoyageInfo> QueryVoyageList2(String strSQLMeta) {
		ResultSet result = null;
		String reply = "";
		ArrayList<VoyageMod.MetadataInfo> metaList = new ArrayList<VoyageMod.MetadataInfo>();
		ArrayList<VoyageMod.VoyageInfo> voyInfoList = new ArrayList<VoyageMod.VoyageInfo>();
		ArrayList<String> voyNameList = new ArrayList<String>();

		try {
			con = TryConnection();
			pre = con.prepareStatement(strSQLMeta);
			result = pre.executeQuery();
			while (result.next()) {
				String voyName = result.getString("VOYAGEID");

				for (int i = 0; i < voyNameList.size(); i++) {
					if (voyNameList.get(i) == voyName) {
						break;
					} else {
						voyNameList.add(voyName);
					}
				}

			}

			String strSQLVoy = "select * from VOYAGE where NAME=";
			for (int i = 0; i < voyNameList.size(); i++) {
				strSQLVoy = strSQLVoy + " or NAME= " + voyNameList.get(i);
			}

			pre = con.prepareStatement(strSQLVoy);
			result = pre.executeQuery();
			while (result.next()) {
				VoyageMod.VoyageInfo voyInfo = new VoyageMod.VoyageInfo();
				voyInfo.setName(result.getString("name"));
				voyInfo.setSeaArea(result.getString("SEA_AREA"));
				voyInfo.setVStart(result.getString("V_START"));
				voyInfo.setElement(result.getString("ELEMENT"));
				voyInfo.setTrajPath(result.getString("TRAJ_PATH"));

				if (voyInfo.getTrajPath() != null) {
					voyInfoList.add(voyInfo);
				}

			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (result != null)
					result.close();
				if (pre != null)
					pre.close();
				if (con != null)
					con.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return voyInfoList;
	}

	
	/**
	 * 
	 * @description 查询航次信息
	 * @param strSQL 查询航次信息的SQL条件
	 * @param voyageID 查询航次ID
	 * @return  航次信息
	 */
	public VoyageInfo QueryVoyageInfo(String strSQL, String voyageID) {
		ResultSet result = null;
		String reply = "";
		VoyageMod.VoyageInfo voyInfo = new VoyageMod.VoyageInfo();
		try {
			con = TryConnection();
			String sql = strSQL;
			pre = con.prepareStatement(sql);
			pre.setString(1, voyageID);

			result = pre.executeQuery();
			while (result.next()) {
				voyInfo.setID(result.getString("id"));
				voyInfo.setName(result.getString("name"));
				voyInfo.setVStart(result.getString("V_START"));
				voyInfo.setVEnd(result.getString("V_END"));
				voyInfo.setSeaArea(result.getString("SEA_AREA"));
				voyInfo.setScientist(result.getString("SCIENTIST"));
				voyInfo.setProject(result.getString("PROJECT"));
				voyInfo.setTrajPath(result.getString("TRAJ_PATH"));
			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (result != null)
					result.close();
				if (pre != null)
					pre.close();
				if (con != null)
					con.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return voyInfo;
	}

	
	/**
	 * 
	 * @description 查询站点列表
	 * @param strSQL 查询站点信息的SQL条件
	 * @param voyageID 查询站点所属航次ID
	 * @return  站点列表
	 */
	public ArrayList<StationInfo> QueryStationList(String strSQL, String voyageID) {
		ResultSet result = null;
		ArrayList<VoyageMod.StationInfo> staList = new ArrayList<VoyageMod.StationInfo>();
		try {
			VoyageMod.VoyageInfo voyInfo = new VoyageMod.VoyageInfo();

			String strSQLVoyName = "select * from VOYAGE where ID=?";
			voyInfo = QueryVoyageInfo(strSQLVoyName, voyageID);

			con = TryConnection();
			
			// 判断是否使用参数化查询
			boolean useParameter = (strSQL == null || strSQL.trim().isEmpty() || strSQL.contains("?"));
			
			// 使用传入的SQL或默认SQL
			String sql = (strSQL == null || strSQL.trim().isEmpty()) 
				? "select * from STATION where VOYAGE_ID=? order by ID" 
				: strSQL;
			
			pre = con.prepareStatement(sql);
			
			// 只有当SQL包含参数占位符时才设置参数
			if (useParameter && voyageID != null) {
				pre.setString(1, voyageID);
			}
			
			result = pre.executeQuery();
			
			
			int count = 0;
			while (result.next()) {
				count++;
				VoyageMod.StationInfo staInfo = new VoyageMod.StationInfo();
				
				try {
					// 使用大写字段名（根据数据库表结构）
					String id = result.getString("ID");
					String name = result.getString("NAME");
					String longitude = result.getString("LONGITUDE");
					String latitude = result.getString("LATITUDE");
					String deep = result.getString("DEEP");
					String sDate = result.getString("S_DATE");
					String voyId = result.getString("VOYAGE_ID");
					
					staInfo.setID(id);
					staInfo.setName(name);
					staInfo.setLongitude(longitude);
					staInfo.setLatitude(latitude);
					staInfo.setDeep(deep);
					staInfo.setDate(sDate);
					staInfo.setVoyageID(voyId);
					staInfo.setVoyageName(voyInfo != null ? voyInfo.getName() : "");
					
					// STA_TYPE可能不存在，安全处理
					try {
						staInfo.setType(result.getString("STA_TYPE"));
					} catch (SQLException e) {
						// 忽略，字段可能不存在
					}
				} catch (SQLException e) {
					System.err.println("处理站点数据时出错: " + e.getMessage());
					e.printStackTrace();
					// 继续处理下一条记录
					continue;
				}

				staList.add(staInfo);
			}
			

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (result != null)
					result.close();
				if (pre != null)
					pre.close();
				if (con != null)
					con.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return staList;
	}


	/**
	 * 
	 * @description 查询站点列表
	 * @param strSQL 查询站点信息的SQL条件
	 * @return  站点列表
	 */
	public ArrayList<StationInfo> QueryStationList2(String strSQL) {
		ResultSet result = null;
		ArrayList<VoyageMod.StationInfo> staList = new ArrayList<VoyageMod.StationInfo>();
		try {
			con = TryConnection();
			pre = con.prepareStatement(strSQL);
			result = pre.executeQuery();
			while (result.next()) {
				VoyageMod.StationInfo staInfo = new VoyageMod.StationInfo();
				staInfo.setID(result.getString("id"));
				staInfo.setName(result.getString("name"));
				staInfo.setLongitude(result.getString("LONGITUDE"));
				staInfo.setLatitude(result.getString("LATITUDE"));
				staInfo.setDeep(result.getString("DEEP"));
				staInfo.setDate(result.getString("S_DATE"));
				staInfo.setVoyageID(result.getString("VOYAGE_ID"));
				staInfo.setType(result.getString("STA_TYPE"));

				staList.add(staInfo);
			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (result != null)
					result.close();
				if (pre != null)
					pre.close();
				if (con != null)
					con.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return staList;
	}


	/**
	 * 
	 * @description 查询站点信息
	 * @param strSQL 查询站点信息的SQL条件
	 * @param stationName 查询站点名字
	 * @return  站点信息
	 */
	public StationInfo QueryStationInfo(String strSQL, String stationName) {
		ResultSet result = null;
		VoyageMod.StationInfo staInfo = new VoyageMod.StationInfo();
		try {
			con = TryConnection();
			// String sql = strSQL;
			String sql = "select * from STATION where NAME=?";
			pre = con.prepareStatement(sql);
			pre.setString(1, stationName);
			result = pre.executeQuery();
			while (result.next()) {

				staInfo.setID(result.getString("id"));
				staInfo.setName(result.getString("name"));
				staInfo.setLongitude(result.getString("LONGITUDE"));
				staInfo.setLatitude(result.getString("LATITUDE"));
				staInfo.setDeep(result.getString("DEEP"));
				staInfo.setDate(result.getString("S_DATE"));
				staInfo.setVoyageID(result.getString("VOYAGE_ID"));
				staInfo.setType(result.getString("STA_TYPE"));
				staInfo.setInfoPath(result.getString("INFO_PATH"));
				// staList.add(staInfo);
			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (result != null)
					result.close();
				if (pre != null)
					pre.close();
				if (con != null)
					con.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		VoyageMod.VoyageInfo voyInfo = new VoyageMod.VoyageInfo();
		String strSQLVoyName = "select * from VOYAGE where ID=?";
		voyInfo = QueryVoyageInfo(strSQLVoyName, staInfo.getVoyageID());
		staInfo.setVoyageName(voyInfo.getName());

		return staInfo;
	}

	/**
	 * 
	 * @description 查询元数据列表
	 * @param strSQL 查询元数据信息的SQL条件
	 * @return  元数据信息列表
	 */
	public ArrayList<MetadataInfo> QueryMetadataList(String strSQL) {
		ResultSet result = null;
		String reply = "";
		ArrayList<VoyageMod.MetadataInfo> metaList = new ArrayList<VoyageMod.MetadataInfo>();

		try {

			con = TryConnection();

			String sql = strSQL;
			// String sql = "select * from VOYAGE where NAME=?";
			pre = con.prepareStatement(sql);

			result = pre.executeQuery();
			while (result.next()) {
				VoyageMod.MetadataInfo metadata = new VoyageMod.MetadataInfo();
				metadata.setID(result.getString("ID"));
				metadata.setVoyageID(result.getString("VOYAGEID"));
				metaList.add(metadata);

			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (result != null)
					result.close();
				if (pre != null)
					pre.close();
				if (con != null)
					con.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return metaList;
	}


	/**
	 * 
	 * @description 查询数据日期范围
	 * @param strsql 查询日期范围的SQL条件
	 * @return  日期范围
	 */
	public DataRange QueryDataRange(String strsql) {

		String strSQL = "select * from VOYAGE";
		ResultSet result = null;
		String allStart = "9999-12-31 23:59:59";
		String allEnd = "1000-01-01 00:00:00";

		VoyageMod.DataRange dataRange = new VoyageMod.DataRange();
		try {
			con = TryConnection();
			pre = con.prepareStatement(strSQL);
			result = pre.executeQuery();

			while (result.next()) {
				String tempStart = result.getString("V_START");
				String tempEnd = result.getString("V_END");
				if (java.sql.Date.valueOf(allStart.substring(0, 10))
						.after(java.sql.Date.valueOf(tempStart.substring(0, 10)))) {
					allStart = tempStart;
				}
				if (java.sql.Date.valueOf(tempEnd.substring(0, 10))
						.after(java.sql.Date.valueOf(allEnd.substring(0, 10)))) {
					allEnd = tempEnd;
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (result != null)
					result.close();
				if (pre != null)
					pre.close();
				if (con != null)
					con.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		dataRange.setStartDate(allStart.substring(0, 10));
		dataRange.setEndDate(allEnd.substring(0, 10));
		return dataRange;

	}


	/**
	 * 
	 * @description  查询CTD数据列表
	 * @param strSQL 查询CTD数据的SQL条件
	 * @param staID 查询站点ID
	 * @return  CTD数据列表
	 */
	public ArrayList<CTDInfo> QueryCTDList(String strSQL, String staID) {
		ResultSet result = null;
		ArrayList<VoyageMod.CTDInfo> CTDList = new ArrayList<VoyageMod.CTDInfo>();
		try {
			con = TryConnection();
			String sql = "select * from CTDINFO where STATIONID=? order by to_number(DEPTH) desc";
			pre = con.prepareStatement(sql);
			pre.setString(1, staID);
			result = pre.executeQuery();
			while (result.next()) {
				VoyageMod.CTDInfo ctdInfo = new VoyageMod.CTDInfo();
				ctdInfo.setDepth(result.getString("DEPTH"));
				ctdInfo.setTemperature(result.getString("TEMPERATURE"));
				ctdInfo.setSalinity(result.getString("SALINITY"));
				CTDList.add(ctdInfo);
			}

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (result != null)
					result.close();
				if (pre != null)
					pre.close();
				if (con != null)
					con.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		return CTDList;
	}

}
