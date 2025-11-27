package com.tucasa.backend.model.service.implement;

import com.tucasa.backend.model.dto.FavoritoRequestDto;
import com.tucasa.backend.model.entity.Favorito;
import com.tucasa.backend.model.repository.FavoritoRepository;
import com.tucasa.backend.model.repository.OfertaRepository;
import com.tucasa.backend.model.repository.UsuarioRepository;
import com.tucasa.backend.model.service.interfaces.FavoritoService;
import com.tucasa.backend.payload.ApiResponse;
// import com.tucasa.backend.payload.ResponseSuccess;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class FavoritoServiceImpl implements FavoritoService {

    // private final ResponseSuccess responseSuccess;

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private OfertaRepository ofertaRepository;

    @Autowired
    private ApiResponse apiResponse;

    // FavoritoServiceImpl(ResponseSuccess responseSuccess) {
    //     this.responseSuccess = responseSuccess;
    // }

        @Override
    @Transactional
    public ResponseEntity<?> create(FavoritoRequestDto favoritoRequestDto, String userEmail) {
        var usuarioOpt = usuarioRepository.findByCorreo(userEmail);
        if (usuarioOpt.isEmpty()) {
            return apiResponse.responseNotFoundError("Usuario no encontrado", null);
        }
        var ofertaOpt = ofertaRepository.findById(favoritoRequestDto.getOfertaId());
        if (ofertaOpt.isEmpty()) {
            return apiResponse.responseNotFoundError("Oferta no encontrada", null);
        }
        var usuario = usuarioOpt.get();
        if (favoritoRepository.existsByUsuarioIdAndOfertaId(usuario.getId(), favoritoRequestDto.getOfertaId())) {
            return apiResponse.responseDataError("La oferta ya está en favoritos", null);
        }
        favoritoRepository.save(new Favorito(usuario, ofertaOpt.get()));
        return apiResponse.responseCreate("Añadido a favoritos", null);
    }

    @Override
    @Transactional
    public ResponseEntity<?> delete(FavoritoRequestDto favoritoRequestDto, String userEmail) {
        var usuarioOpt = usuarioRepository.findByCorreo(userEmail);
        if (usuarioOpt.isEmpty()) {
            return apiResponse.responseNotFoundError("Usuario no encontrado", null);
        }
        var usuario = usuarioOpt.get();
        var favoritoOpt = favoritoRepository.findByUsuarioIdAndOfertaId(usuario.getId(), favoritoRequestDto.getOfertaId());
        if (favoritoOpt.isEmpty()) {
            return apiResponse.responseNotFoundError("Favorito no existe", null);
        }
        favoritoRepository.delete(favoritoOpt.get());
        return apiResponse.responseSuccess("Eliminado de favoritos",null);
    }

    @Override
    public ResponseEntity<?> findByUsuarioEmail(String userEmail) {
        var usuarioOpt = usuarioRepository.findByCorreo(userEmail);
        if (usuarioOpt.isEmpty()) {
            return apiResponse.responseNotFoundError("Usuario no encontrado", null);
        }
        var favoritos = favoritoRepository.findByUsuarioId(usuarioOpt.get().getId());
        return apiResponse.responseSuccess("Favoritos encontrados", favoritos);
    }
}