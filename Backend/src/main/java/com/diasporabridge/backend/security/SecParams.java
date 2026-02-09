package com.diasporabridge.backend.security;

/*
public interface SecParams {
	
	public static final long EXP_TIME = 24 * 60 * 60 * 1000;
	public static final String SECRET = "change_this_to_a_long_secret_key_123456789"; 
	public static final String PREFIX = "Bearer ";
}
*/

public final class SecParams {
  public static final long EXP_TIME = 24 * 60 * 60 * 1000;
  public static final String PREFIX = "Bearer ";

  public static final String SECRET = read();

  private static String read() {
    String s = System.getenv("JWT_SECRET");
    if (s == null || s.isBlank()) throw new IllegalStateException("JWT_SECRET missing");
    return s;
  }
}
