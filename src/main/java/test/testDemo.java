package test;

import com.aventstack.extentreports.*;
import com.aventstack.extentreports.reporter.ExtentHtmlReporter;
import com.aventstack.extentreports.reporter.configuration.ChartLocation;
import com.aventstack.extentreports.reporter.configuration.Theme;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;

/**
 * Created by qingping.niu on 2018/4/17.
 */
public class testDemo {
    Logger logger = LoggerFactory.getLogger(testDemo.class);
    private static final String OUTPUT_FOLDER = "test-output/";
    private static final String FILE_NAME = "Extent.html";
   // private ExtentReports extent;

//    public static void main(String[] args) throws IOException {
//        File reportDir= new File(OUTPUT_FOLDER);
//        if(!reportDir.exists()&& !reportDir .isDirectory()){
//            reportDir.mkdir();
//        }
//        // start reporters
//        ExtentHtmlReporter htmlReporter = new ExtentHtmlReporter(OUTPUT_FOLDER + FILE_NAME);
//        htmlReporter.config().setDocumentTitle("自动化测试报告");
//        htmlReporter.config().setReportName("Joy Lockscreen自动化测试报告");
//        htmlReporter.config().setChartVisibilityOnOpen(true);//图表可见
//        htmlReporter.config().setTestViewChartLocation(ChartLocation.TOP); //图表显位置
//        htmlReporter.config().setTheme(Theme.STANDARD); //主题
//        htmlReporter.config().setCSS(".node.level-1  ul{ display:none;} .node.level-1.active ul{display:block;}");
//        htmlReporter.config().setResourceCDN(ResourceCDN.EXTENTREPORTS);
//        htmlReporter.config().setEncoding("utf-8");
//        htmlReporter.setAppendExisting(false);//是否追加测试结果;
//        htmlReporter.config().setTimeStampFormat("yyyy-MM-dd HH:mm:ss");
//        // create ExtentReports and attach reporter(s)
//        ExtentReports extent = new ExtentReports();
//        extent.attachReporter(htmlReporter);
//        extent.setReportUsesManualConfiguration(true);
//
//
//        // creates a toggle for the given test, adds all log events under it
//        ExtentTest test = extent.createTest("MyFirstTest", "Sample description");
//
//        // log(Status, details)
//        test.log(Status.INFO, "This step shows usage of log(status, details)");
//
//        // info(details)
//        test.info("This step shows usage of info(details)");
//
//        // log with snapshot
//        test.fail("details", MediaEntityBuilder.createScreenCaptureFromPath("../test-output/image/screenshot.png").build());
//
//        // test with snapshot
//        test.addScreenCaptureFromPath("../test-output/image/screenshot.png");
//
//        // calling flush writes everything to the log file
//        extent.flush();
//    }

//    private void init() {
//        //文件夹不存在的话进行创建
//        File reportDir= new File(OUTPUT_FOLDER);
//        if(!reportDir.exists()&& !reportDir .isDirectory()){
//            reportDir.mkdir();
//        }
//        logger.info(OUTPUT_FOLDER + FILE_NAME);
//        ExtentHtmlReporter htmlReporter = new ExtentHtmlReporter(OUTPUT_FOLDER + FILE_NAME);
//        htmlReporter.config().setDocumentTitle("自动化测试报告");
//        htmlReporter.config().setReportName("Joy Lockscreen自动化测试报告");
//        htmlReporter.config().setChartVisibilityOnOpen(true);//图表可见
//        htmlReporter.config().setTestViewChartLocation(ChartLocation.TOP); //图表显位置
//        htmlReporter.config().setTheme(Theme.STANDARD); //主题
//        htmlReporter.config().setCSS(".node.level-1  ul{ display:none;} .node.level-1.active ul{display:block;}");
//        htmlReporter.config().setResourceCDN(ResourceCDN.EXTENTREPORTS);
//        htmlReporter.config().setEncoding("utf-8");
//        htmlReporter.setAppendExisting(false);//是否追加测试结果;
//        extent = new ExtentReports();
//        extent.attachReporter(htmlReporter);
//        extent.setReportUsesManualConfiguration(true);
//    }
}
