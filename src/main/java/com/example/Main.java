package com.example;

/**
 * Run this model in Java
 * 
 * Required Dependencies (for Maven):
 *   <dependency>
 *     <groupId>com.openai</groupId>
 *     <artifactId>openai-java</artifactId>
 *     <version>3.1.2</version>
 *   </dependency>
 * 
 * How to build and run with Maven:
 *   mvn compile      # Compile the project
 *   mvn exec:java    # Run the project
 */

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.*;
import com.openai.models.chat.completions.*;
import com.openai.core.JsonValue;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Main {
    private static final Logger LOGGER = Logger.getLogger(Main.class.getName());
    private static final String API_KEY = System.getenv("OPENAI_API_KEY");

    // TODO: Add Jackson / OpenAI SDK dependencies to use real JSON parsing and the OpenAI client.
    // - Jackson: com.fasterxml.jackson.core:jackson-databind
    // - OpenAI Java SDK: add the official SDK or your chosen client
    //
    // Example Maven coordinates:
    // <dependency>
    //   <groupId>com.fasterxml.jackson.core</groupId>
    //   <artifactId>jackson-databind</artifactId>
    //   <version>2.15.2</version>
    // </dependency>
    //
    // Official OpenAI Java SDKs differ; follow the project's README for coordinates.

    public static void main(String[] args) {
        try {
            // TODO: Create OpenAI client once you've added the SDK dependency.
            // Example placeholder:
            // OpenAIClient client = OpenAIOkHttpClient.builder().apiKey(API_KEY).build();

            LOGGER.info("Starting application");

            // Build and send a chat completion request to the OpenAI REST API using the OPENAI_API_KEY.
            // If the key is not set, fall back to the local simulated tool call.
            String result;
            if (API_KEY == null || API_KEY.isEmpty()) {
                LOGGER.warning("OPENAI_API_KEY not set; using simulated response");
                result = simulateToolCall();
            } else {
                try {
                    java.net.URL url = new java.net.URL("https://api.openai.com/v1/chat/completions");
                    java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setDoOutput(true);
                    conn.setRequestProperty("Authorization", "Bearer " + API_KEY);
                    conn.setRequestProperty("Content-Type", "application/json");
                    conn.setConnectTimeout(10000);
                    conn.setReadTimeout(20000);

                    // Build payload
                    Map<String, Object> payload = new HashMap<>();
                    payload.put("model", "gpt-3.5-turbo");
                    List<Map<String, String>> messages = new ArrayList<>();
                    Map<String, String> sys = new HashMap<>();
                    sys.put("role", "system");
                    sys.put("content", "You are a helpful assistant.");
                    messages.add(sys);
                    Map<String, String> userMsg = new HashMap<>();
                    userMsg.put("role", "user");
                    userMsg.put("content", "Say hello from Java client.");
                    messages.add(userMsg);
                    payload.put("messages", messages);

                    String body = new ObjectMapper().writeValueAsString(payload);

                    try (java.io.OutputStream os = conn.getOutputStream()) {
                        os.write(body.getBytes(java.nio.charset.StandardCharsets.UTF_8));
                    }

                    int status = conn.getResponseCode();
                    java.io.InputStream is = status >= 200 && status < 300 ? conn.getInputStream() : conn.getErrorStream();
                    StringBuilder sb = new StringBuilder();
                    try (java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(is, java.nio.charset.StandardCharsets.UTF_8))) {
                        String line;
                        while ((line = br.readLine()) != null) {
                            sb.append(line);
                        }
                    }
                    String resp = sb.toString();

                    if (status >= 200 && status < 300) {
                        // Parse the response and extract the assistant message content if present.
                        Map<String, Object> respMap = new ObjectMapper().readValue(resp, new TypeReference<Map<String, Object>>() {});
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> choices = (List<Map<String, Object>>) respMap.get("choices");
                        if (choices != null && !choices.isEmpty()) {
                            Map<String, Object> first = choices.get(0);
                            @SuppressWarnings("unchecked")
                            Map<String, Object> message = (Map<String, Object>) first.get("message");
                            if (message != null && message.get("content") != null) {
                                result = message.get("content").toString();
                            } else {
                                result = resp;
                            }
                        } else {
                            result = resp;
                        }
                    } else {
                        result = "error: http " + status + " - " + resp;
                    }
                } catch (Exception e) {
                    LOGGER.log(Level.SEVERE, "Error calling OpenAI API", e);
                    result = "error: exception: " + e.getMessage();
                }
            }

            if (result == null) {
                LOGGER.warning("No result returned from tool call");
            } else if (result.startsWith("error")) {
                LOGGER.severe("Tool returned an error: " + result);
            } else {
                LOGGER.info("Tool returned success: " + result);
            }

        } catch (Exception e) {
            // replaced System.err with logger
            LOGGER.log(Level.SEVERE, "Unhandled exception in main", e);
        }
    }

    // Removed: private parseJsonString(...) - it was unused per your request.

    // Example: switch -> if/else replacement (original switch not provided).
    // If you had:
    // switch (type) {
    //   case "a": doA(); break;
    //   case "b": doB(); break;
    //   default: doDefault();
    // }
    //
    // Replace with:
    private static void handleType(String type) {
        if ("a".equals(type)) {
            doA();
        } else if ("b".equals(type)) {
            doB();
        } else {
            doDefault();
        }
    }

    private static void doA() { LOGGER.info("doA"); }
    private static void doB() { LOGGER.info("doB"); }
    private static void doDefault() { LOGGER.info("doDefault"); }

    // Small simulated helper so file compiles without OpenAI SDK.
    private static String simulateToolCall() {
        // originally you had a useless assignment like: String toolResult = ...; then never used it.
        // Removed the useless local assignment and return directly.
        return "ok: simulated response";
    }
}
