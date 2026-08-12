
package com.banking.api.service.impl;

import com.banking.api.dto.request.LoginRequest;
import com.banking.api.dto.request.RegisterRequest;
import com.banking.api.dto.response.AuthResponse;
import com.banking.api.entity.Role;
import com.banking.api.entity.User;
import com.banking.api.repository.RoleRepository;
import com.banking.api.repository.UserRepository;
import com.banking.api.security.CustomUserDetailsService;
import com.banking.api.security.JwtUtil;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthServiceImpl authService;


    // ==========================================
    // TEST 1: Successful Registration
    // ==========================================

    @Test
    void shouldRegisterUserSuccessfully() {

        RegisterRequest request = new RegisterRequest();

        request.setFullName("Rahul S");
        request.setEmail("rahul@example.com");
        request.setPassword("password123");
        request.setPhoneNumber("9876543210");

        Role role = Role.builder()
                .name("ROLE_USER")
                .build();

        UserDetails userDetails =
                mock(UserDetails.class);

        when(userRepository.existsByEmail("rahul@example.com"))
                .thenReturn(false);

        when(userRepository.existsByPhoneNumber("9876543210"))
                .thenReturn(false);

        when(roleRepository.findByName("ROLE_USER"))
                .thenReturn(Optional.of(role));

        when(passwordEncoder.encode("password123"))
                .thenReturn("encodedPassword");

        when(userDetailsService.loadUserByUsername("rahul@example.com"))
                .thenReturn(userDetails);

        when(jwtUtil.generateToken(userDetails))
                .thenReturn("test-jwt-token");

        AuthResponse response =
                authService.register(request);

        assertNotNull(response);

        assertEquals(
                "test-jwt-token",
                response.getToken()
        );

        assertNotNull(response.getUser());

        assertEquals(
                "Rahul S",
                response.getUser().getFullName()
        );

        assertEquals(
                "rahul@example.com",
                response.getUser().getEmail()
        );

        verify(userRepository)
                .existsByEmail("rahul@example.com");

        verify(userRepository)
                .existsByPhoneNumber("9876543210");

        verify(userRepository)
                .save(any(User.class));

        verify(passwordEncoder)
                .encode("password123");

        verify(jwtUtil)
                .generateToken(userDetails);
    }


    // ==========================================
    // TEST 2: Email Already Exists
    // ==========================================

    @Test
    void shouldRejectRegistrationWhenEmailAlreadyExists() {

        RegisterRequest request = new RegisterRequest();

        request.setFullName("Rahul S");
        request.setEmail("rahul@example.com");
        request.setPassword("password123");
        request.setPhoneNumber("9876543210");

        when(userRepository.existsByEmail("rahul@example.com"))
                .thenReturn(true);

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> authService.register(request)
                );

        assertEquals(
                "Email already registered",
                exception.getMessage()
        );

        verify(userRepository)
                .existsByEmail("rahul@example.com");

        verify(userRepository, never())
                .save(any(User.class));
    }


    // ==========================================
    // TEST 3: Phone Number Already Exists
    // ==========================================

    @Test
    void shouldRejectRegistrationWhenPhoneAlreadyExists() {

        RegisterRequest request = new RegisterRequest();

        request.setFullName("Rahul S");
        request.setEmail("rahul@example.com");
        request.setPassword("password123");
        request.setPhoneNumber("9876543210");

        when(userRepository.existsByEmail("rahul@example.com"))
                .thenReturn(false);

        when(userRepository.existsByPhoneNumber("9876543210"))
                .thenReturn(true);

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> authService.register(request)
                );

        assertEquals(
                "Phone number already registered",
                exception.getMessage()
        );

        verify(userRepository)
                .existsByEmail("rahul@example.com");

        verify(userRepository)
                .existsByPhoneNumber("9876543210");

        verify(userRepository, never())
                .save(any(User.class));
    }


    // ==========================================
    // TEST 4: Successful Login
    // ==========================================

    @Test
    void shouldLoginSuccessfully() {

        LoginRequest request = new LoginRequest();

        request.setEmail("rahul@example.com");
        request.setPassword("password123");

        Role role = Role.builder()
                .name("ROLE_USER")
                .build();

        User user = User.builder()
                .id(1L)
                .fullName("Rahul S")
                .email("rahul@example.com")
                .phoneNumber("9876543210")
                .password("encodedPassword")
                .roles(Set.of(role))
                .build();

        UserDetails userDetails =
                mock(UserDetails.class);

        when(userRepository.findByEmail("rahul@example.com"))
                .thenReturn(Optional.of(user));

        when(userDetailsService.loadUserByUsername("rahul@example.com"))
                .thenReturn(userDetails);

        when(jwtUtil.generateToken(userDetails))
                .thenReturn("login-jwt-token");

        AuthResponse response =
                authService.login(request);

        assertNotNull(response);

        assertEquals(
                "login-jwt-token",
                response.getToken()
        );

        assertNotNull(response.getUser());

        assertEquals(
                "Rahul S",
                response.getUser().getFullName()
        );

        assertEquals(
                "rahul@example.com",
                response.getUser().getEmail()
        );

        verify(authenticationManager)
                .authenticate(any());

        verify(userRepository)
                .findByEmail("rahul@example.com");

        verify(userDetailsService)
                .loadUserByUsername("rahul@example.com");

        verify(jwtUtil)
                .generateToken(userDetails);
    }
}
