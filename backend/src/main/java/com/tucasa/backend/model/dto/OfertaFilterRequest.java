package com.tucasa.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfertaFilterRequest {
    private Map<String, String> filtros = new HashMap<>();
    private List<String> orderBy = new ArrayList<>();
}
