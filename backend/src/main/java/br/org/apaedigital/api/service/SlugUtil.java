package br.org.apaedigital.api.service;

import java.text.Normalizer;
import java.util.Locale;

/** Gera slugs a partir de titulos (sem acento, minusculo, com hifens). */
public final class SlugUtil {

    private SlugUtil() {
    }

    public static String slugify(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return normalized
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }
}
