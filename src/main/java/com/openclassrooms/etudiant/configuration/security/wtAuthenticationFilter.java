package com.openclassrooms.etudiant.configuration.security;

import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.ServletException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;
import jakarta.servlet.FilterChain;
import com.openclassrooms.etudiant.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class wtAuthenticationFilter extends OncePerRequestFilter implements Ordered {

    private static final Path DEBUG_LOG = Path.of("/home/laurent/projet2/projet2/backend/.cursor/debug.log");

    private static void agentLog(String location, String message, String dataJson, String hypothesisId) {
        try {
            String line = "{\"location\":\"" + location + "\",\"message\":\"" + message.replace("\"", "\\\"") + "\",\"data\":" + dataJson + ",\"timestamp\":" + System.currentTimeMillis() + ",\"sessionId\":\"debug-session\",\"hypothesisId\":\"" + hypothesisId + "\"}\n";
            Files.writeString(DEBUG_LOG, line, StandardCharsets.UTF_8, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (Exception ignored) {}
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    private static final RequestAttributeSecurityContextRepository SECURITY_CONTEXT_REPOSITORY =
            new RequestAttributeSecurityContextRepository();

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    public wtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // #region agent log
        String uri = request.getRequestURI();
        String authHeader = request.getHeader("Authorization");
        boolean hasBearer = authHeader != null && authHeader.startsWith("Bearer ");
        agentLog("wtAuthenticationFilter.java:entry", "filter entry", "{\"uri\":\"" + uri + "\",\"hasBearer\":" + hasBearer + "}", "H8");
        // #endregion

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        if (username != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(authToken);
                SecurityContext context = SecurityContextHolder.getContext();
                SECURITY_CONTEXT_REPOSITORY.saveContext(context, request, response);
                // #region agent log
                agentLog("wtAuthenticationFilter.java:setAuth", "auth set + saved to request", "{\"uri\":\"" + uri + "\"}", "H7");
                // #endregion
            }
        }

        // #region agent log
        boolean authInContext = SecurityContextHolder.getContext().getAuthentication() != null;
        agentLog("wtAuthenticationFilter.java:beforeChain", "before doFilter", "{\"uri\":\"" + uri + "\",\"authInContext\":" + authInContext + "}", "H7");
        // #endregion

        filterChain.doFilter(request, response);
    }
}
