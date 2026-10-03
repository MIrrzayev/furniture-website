package com.huseyn.mebelsayti.config;

import com.huseyn.mebelsayti.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        //Login
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()

                        //Admin management — SUPER_ADMIN only
                        .requestMatchers(HttpMethod.POST, "/admin").hasRole("SUPER_ADMIN")
                        .requestMatchers(HttpMethod.GET, "/admin", "/admin/**").hasRole("SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/admin/**").hasRole("SUPER_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/admin/**").hasRole("SUPER_ADMIN")

                        //products
                        .requestMatchers(HttpMethod.GET,"/products", "/products/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/products").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/products/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/products/**").hasAnyRole("ADMIN", "SUPER_ADMIN")

                        //services
                        .requestMatchers(HttpMethod.GET, "/services", "/services/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/services").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/services/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/services/**").hasAnyRole("ADMIN", "SUPER_ADMIN")

                        //messages
                        .requestMatchers(HttpMethod.POST, "/message").permitAll()
                        .requestMatchers(HttpMethod.GET, "/message", "/message/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/message/**").hasAnyRole("ADMIN", "SUPER_ADMIN")

                        //swagger
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs", "/swagger-ui.html", "/v3/api-docs/**").permitAll()

                        //other requests
                        .anyRequest().authenticated()
        );
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception{
        return configuration.getAuthenticationManager();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5500",
                "http://127.0.0.1:5500"
        ));
        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));
        configuration.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
