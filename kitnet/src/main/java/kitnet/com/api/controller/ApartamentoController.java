package kitnet.com.api.controller;

import kitnet.com.api.dto.apartamento.ApartamentoPostDTO;
import kitnet.com.api.dto.apartamento.ApartamentoResponseDTO;
import kitnet.com.domain.service.ApartamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping(value = "apartamentos", produces = MediaType.APPLICATION_JSON_VALUE)
public class ApartamentoController {

    @Autowired
    private ApartamentoService apartamentoService;

    @PostMapping
    public ResponseEntity<ApartamentoResponseDTO> create(@RequestBody ApartamentoPostDTO apartamentoPost) {
        return ResponseEntity.status(HttpStatus.CREATED).body(apartamentoService.create(apartamentoPost));
    }
}
