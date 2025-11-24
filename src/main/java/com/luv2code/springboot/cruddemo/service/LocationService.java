package com.luv2code.springboot.cruddemo.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

@Service
public class LocationService {

    public double[] getCoordinates(String locationName) {
        try {
            String encodedLocation = URLEncoder.encode(locationName, "UTF-8");
            String urlString = "https://nominatim.openstreetmap.org/search?q=" + encodedLocation + "&format=json&limit=1";

            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "SpringBootApp");

            BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

            JSONArray jsonArray = new JSONArray(response.toString());
            if (jsonArray.isEmpty()) {
                throw new RuntimeException("Location not found: " + locationName);
            }

            JSONObject jsonObject = jsonArray.getJSONObject(0);
            double lat = jsonObject.getDouble("lat");
            double lon = jsonObject.getDouble("lon");

            return new double[]{lat, lon};
        } catch (Exception e) {
            throw new RuntimeException("Error fetching coordinates for location: " + locationName, e);
        }
    }
}
