package kitnet.com.infra.report;

import net.sf.jasperreports.engine.JasperCompileManager;
import java.io.InputStream;
import java.io.FileOutputStream;

/**
 * Classe utilitária para compilar arquivos JRXML em JASPER
 * Executar: mvn exec:java -Dexec.mainClass="kitnet.com.infra.report.CompileJasper"
 */
public class CompileJasper {

    public static void main(String[] args) {
        // Configurar modo headless para JasperReports
        System.setProperty("java.awt.headless", "true");
        
        try {
            // Caminho do arquivo JRXML
            String jrxmlPath = "/relatorios/relatorio-gerencial.jrxml";
            String jasperPath = "src/main/resources/relatorios/relatorio-gerencial.jasper";
            
            // Carregar o arquivo JRXML
            InputStream jrxmlInputStream = CompileJasper.class.getResourceAsStream(jrxmlPath);
            
            if (jrxmlInputStream == null) {
                System.err.println("Erro: Arquivo JRXML não encontrado em " + jrxmlPath);
                return;
            }
            
            // Compilar
            var jasperReport = JasperCompileManager.compileReport(jrxmlInputStream);
            
            // Salvar o arquivo compilado
            FileOutputStream fos = new FileOutputStream(jasperPath);
            net.sf.jasperreports.engine.util.JRSaver.saveObject(jasperReport, fos);
            fos.close();
            
        } catch (Exception e) {
            System.err.println("❌ Erro ao compilar o relatório:");
            e.printStackTrace();
        }
    }
}
