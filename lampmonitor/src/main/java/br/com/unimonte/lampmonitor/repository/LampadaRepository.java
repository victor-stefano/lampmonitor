package br.com.unimonte.lampmonitor.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.unimonte.lampmonitor.model.LampadaDados;

public interface LampadaRepository extends JpaRepository<LampadaDados, Long> {
    List<LampadaDados> findByTipo(int tipo);
}
