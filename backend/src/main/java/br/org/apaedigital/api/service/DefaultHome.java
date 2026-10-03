package br.org.apaedigital.api.service;

import br.org.apaedigital.api.dto.home.HomeCampaignDto;
import br.org.apaedigital.api.dto.home.HomeContentDto;
import br.org.apaedigital.api.dto.home.HomeDonationDto;
import br.org.apaedigital.api.dto.home.HomeDonationTierDto;
import br.org.apaedigital.api.dto.home.HomeHeroDto;
import br.org.apaedigital.api.dto.home.HomeImpactDto;
import br.org.apaedigital.api.dto.home.HomeStatDto;

import java.util.List;

/**
 * Conteudo padrao (fallback) da Home quando um tenant ainda nao personalizou.
 * Espelha o default do front (src/content/home/index.ts).
 */
public final class DefaultHome {

    private DefaultHome() {
    }

    public static HomeContentDto forTenant(String tenant, String name, String city) {
        String displayName = name != null ? name : "APAE";
        HomeHeroDto hero = new HomeHeroDto(
                city != null ? city : "Brasil",
                "Cada conquista aqui começa com",
                "alguém que apoia",
                displayName + " oferece educação, saúde e assistência social gratuitas para pessoas "
                        + "com deficiência intelectual e múltipla — e caminha junto com suas famílias todos os dias.",
                "",
                "Quero doar",
                "Ver o que está acontecendo",
                0,
                "pessoas atendidas neste ano com o apoio da comunidade"
        );

        HomeImpactDto impact = new HomeImpactDto(
                "Nosso impacto",
                "Números que são histórias de vida",
                "Atrás de cada número existe uma pessoa que passou a se comunicar, a caminhar sozinha, "
                        + "a estudar ou a trabalhar. E uma família que deixou de caminhar sozinha.",
                List.of()
        );

        HomeDonationDto donation = new HomeDonationDto(
                "Doação",
                "Sua doação vira transporte, terapia e futuro",
                displayName + " é uma entidade sem fins lucrativos. Doações mensais garantem a continuidade "
                        + "dos atendimentos gratuitos e a manutenção da estrutura.",
                List.of(
                        new HomeDonationTierDto("peca", "R$ 30/mês", "Materiais para uma oficina terapêutica"),
                        new HomeDonationTierDto("van", "R$ 100/mês", "Transporte de um aluno por um mês"),
                        new HomeDonationTierDto("maos", "R$ 250/mês", "Uma sessão semanal de fisioterapia")
                ),
                new HomeCampaignDto("", 0L, 0L, 0)
        );

        return new HomeContentDto(hero, impact, donation);
    }
}
