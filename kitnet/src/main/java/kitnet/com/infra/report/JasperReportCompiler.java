package kitnet.com.infra.report;

import net.sf.jasperreports.engine.JasperCompileManager;

import java.io.File;

/**
 * Utilitário para compilar relatórios JRXML em JASPER
 */
public class JasperReportCompiler {

    public static void main(String[] args) {
        try {
            String reportName = args.length > 0 ? args[0] : "relatorio-gerencial";
            compileReport(reportName);
        } catch (Exception e) {
            System.err.println("✗ Erro ao compilar relatório:");
            e.printStackTrace();
            System.exit(1);
        }
    }

    public static void compileReport(String reportName) throws Exception {
        String basePath = "src/main/resources/relatorios/";
        String sourceFile = basePath + reportName + ".jrxml";
        String destFile = basePath + reportName + ".jasper";
        
        File source = new File(sourceFile);
        if (!source.exists()) {
            throw new RuntimeException("Arquivo não encontrado: " + sourceFile);
        }
        
        
        long startTime = System.currentTimeMillis();
        JasperCompileManager.compileReportToFile(sourceFile, destFile);
        long endTime = System.currentTimeMillis();
        
    }
}
