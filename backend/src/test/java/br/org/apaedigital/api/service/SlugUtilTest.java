package br.org.apaedigital.api.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SlugUtilTest {

    @Test
    void removeAcentosEEspacos() {
        assertThat(SlugUtil.slugify("Campanha do Agasalho")).isEqualTo("campanha-do-agasalho");
    }

    @Test
    void trataAcentosECaracteresEspeciais() {
        assertThat(SlugUtil.slugify("Educação & Inclusão!")).isEqualTo("educacao-inclusao");
    }

    @Test
    void removeHifensDasBordas() {
        assertThat(SlugUtil.slugify("  --Olá--  ")).isEqualTo("ola");
    }

    @Test
    void retornaVazioParaNuloOuEmBranco() {
        assertThat(SlugUtil.slugify(null)).isEmpty();
        assertThat(SlugUtil.slugify("   ")).isEmpty();
    }
}
