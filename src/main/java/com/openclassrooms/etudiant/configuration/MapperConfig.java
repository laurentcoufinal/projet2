package com.openclassrooms.etudiant.configuration;

import com.openclassrooms.etudiant.mapper.ManualUserDtoMapper;
import com.openclassrooms.etudiant.mapper.UserDtoMapper;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {

    /**
     * Fournit un bean UserDtoMapper si MapStruct n'a pas généré UserDtoMapperImpl
     * (ex. avant mvn compile ou si les sources générées ne sont pas sur le classpath).
     */
    @Bean
    @ConditionalOnMissingBean(UserDtoMapper.class)
    public UserDtoMapper userDtoMapper() {
        return new ManualUserDtoMapper();
    }
}
