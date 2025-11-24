package com.luv2code.springboot.cruddemo.util;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

public class PasswordResetTokenUtil {

    private static final SecureRandom random = new SecureRandom();
    private static final long EXPIRY_TIME = 10 * 60 * 1000;


    private static final Map<String, TokenData> tokenStore = new HashMap<>();

    public static String generateToken(String email) {
        String token;
        do {
            int tokenInt = 100000 + random.nextInt(900000); // 6-digit numeric
            token = String.valueOf(tokenInt);
        } while (tokenStore.containsKey(token));

        long expiry = System.currentTimeMillis() + EXPIRY_TIME;
        tokenStore.put(token, new TokenData(email, expiry));

        return token;
    }

    public static String validateToken(String token) {
        TokenData data = tokenStore.get(token);
        if (data == null) return null;

        if (System.currentTimeMillis() > data.expiry) {
            tokenStore.remove(token);
            return null;
        }

        // Optional: remove token after use
        tokenStore.remove(token);
        return data.email;
    }

    // Inner class to store token data
    private static class TokenData {
        String email;
        long expiry;

        TokenData(String email, long expiry) {
            this.email = email;
            this.expiry = expiry;
        }
    }
}
