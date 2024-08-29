package br.com.unimonte.lampmonitor.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import br.com.unimonte.lampmonitor.model.LampadaDados;
import br.com.unimonte.lampmonitor.repository.LampadaRepository;

@Service
public class LampadaService {

    private final LampadaRepository lampadaRepository;

    public LampadaService(LampadaRepository lampadaRepository) {
        this.lampadaRepository = lampadaRepository;
    }

    public LampadaDados salvarDadosLampada(int tipo, float voltage, float current, float temperature, float power) {
    	LampadaDados lampada = new LampadaDados();
        lampada.setTipo(tipo);
        lampada.setVoltage(voltage);
        lampada.setCurrent(current);
        lampada.setTemperature(temperature);
        lampada.setPower(power);
        lampada.setTimestamp(LocalDateTime.now());
        System.out.println(lampada.getId());
        return lampadaRepository.save(lampada);
    }

    public List<LampadaDados> buscarDadosPorTipo(int tipo) {
        return lampadaRepository.findByTipo(tipo);
    }
}