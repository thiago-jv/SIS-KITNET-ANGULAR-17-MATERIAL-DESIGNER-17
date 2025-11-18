package kitnet.com.api.controller;

import kitnet.com.api.dto.apartamento.ApartamentoFilterDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPostDTO;
import kitnet.com.api.dto.apartamento.ApartamentoPutDTO;
import kitnet.com.api.dto.apartamento.ApartamentoResponseDTO;
import kitnet.com.domain.service.ApartamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    @GetMapping("/filter")
    public ResponseEntity<Page<ApartamentoResponseDTO>> filter(ApartamentoFilterDTO apartamentoFilterDTO, Pageable pageable) {
        Page<ApartamentoResponseDTO> apartamentoPage = apartamentoService.filter(apartamentoFilterDTO, pageable);
        return ResponseEntity.status(HttpStatus.OK).body(apartamentoPage);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable Long id) {
        apartamentoService.remove(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApartamentoResponseDTO> findById(@PathVariable Long id) throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(apartamentoService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApartamentoResponseDTO> update(@PathVariable Long id, @RequestBody ApartamentoPutDTO apartamentoPut) {
        ApartamentoResponseDTO apartamentoAtualizado = apartamentoService.update(apartamentoPut, id);
        return ResponseEntity.status(HttpStatus.OK).body(apartamentoAtualizado);
    }
}
