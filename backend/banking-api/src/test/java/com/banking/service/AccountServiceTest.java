package com.banking.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AccountServiceTest {

    @Test
    void testAddition() {

        int a = 10;
        int b = 20;

        int result = a + b;

        assertEquals(30, result);
    }
}