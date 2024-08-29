package br.com.unimonte.lampmonitor.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.unimonte.lampmonitor.model.LampadaDados;
import br.com.unimonte.lampmonitor.service.LampadaService;

@RestController
@RequestMapping("/api/lampadas")
@CrossOrigin(origins = "http://localhost:4200")
public class LampadaController {

	@Autowired
    private final LampadaService lampadaService;

    @Value("${esp32.endpoint}")
    private String esp32Endpoint;

    private final RestTemplate restTemplate;

    private int lampadaTipo;
    
    public LampadaController(LampadaService lampadaService) {
        this.lampadaService = lampadaService;
        this.restTemplate = new RestTemplate();
    }

    @PostMapping("/tipo/{tipo}")
    public ResponseEntity<?> setLampadaTipo(@PathVariable Integer tipo) {
    	Map<String, String> response = new HashMap<>();
    	this.lampadaTipo = tipo;
        if (tipo != null) {
        	response.put("message", "Tipo de lâmpada atualizado.");
        	return ResponseEntity.status(200).body(response);
        } else {
        	response.put("error", "Tipo da lampada deve ser especificado.");
        	return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/dados/salvar")
    public ResponseEntity<?> coletarDados() {
    	Map<String, String> responseJson = new HashMap<>();
        try {
            // Faz a requisição ao ESP32
            String response = restTemplate.getForObject(esp32Endpoint, String.class);

            Map<String, Object> responseMap = new ObjectMapper().readValue(response, Map.class);

            float voltage = ((Number) responseMap.get("voltage")).floatValue();
            float current = ((Number) responseMap.get("current")).floatValue();
            float temperature = ((Number) responseMap.get("temperature")).floatValue();
            float power = ((Number) responseMap.get("power")).floatValue();

            // Salva os dados no banco de dados
            lampadaService.salvarDadosLampada(lampadaTipo, voltage, current, temperature, power);
            
            responseJson.put("message", "Dados salvos com sucesso.");
            return ResponseEntity.status(200).body(responseJson);
        } catch (Exception e) {
        	e.printStackTrace();
        	responseJson.put("error", "Tipo da lampada deve ser especificado.");
        	return ResponseEntity.badRequest().body(responseJson);
        }
    }

    @GetMapping("/dados/{tipo}")
    public ResponseEntity<?> getDadosPorTipo(@PathVariable int tipo) {
    	Map<String, String> responseJson = new HashMap<>();
        List<LampadaDados> dados = lampadaService.buscarDadosPorTipo(tipo);
        if (dados.isEmpty()) {
        	responseJson.put("error", "Não há dados para serem mostrados.");
        	return ResponseEntity.badRequest().body(responseJson);
        }
        return ResponseEntity.status(200).body(dados);
    }
}
