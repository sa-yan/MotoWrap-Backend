package com.sayan.motowrapbackend.util;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Serves static legal pages required for Play Store listing:
 * a privacy policy and an account-deletion instructions page.
 */
@RestController
public class LegalController {

    private static final String STYLE = """
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                     max-width: 720px; margin: 0 auto; padding: 24px 16px; line-height: 1.6;
                     color: #1a1a1a; background: #fff; }
              h1 { font-size: 1.6rem; margin-bottom: 0.25rem; }
              h2 { font-size: 1.15rem; margin-top: 1.5rem; }
              p, li { font-size: 1rem; }
              .muted { color: #666; font-size: 0.9rem; }
              a { color: #0b5fff; }
            </style>
            """;

    @GetMapping(value = "/privacy", produces = MediaType.TEXT_HTML_VALUE)
    public String privacyPolicy() {
        return "<title>MotoWrap Privacy Policy</title>" + STYLE + """
                <h1>MotoWrap Privacy Policy</h1>
                <p class="muted">Effective date: July 2, 2026</p>

                <p>MotoWrap is a motorcycle ride-tracking app developed and operated by a solo
                developer, Sayan Mondal. This policy explains what data MotoWrap collects,
                why, and what happens to it.</p>

                <h2>Data we collect</h2>
                <ul>
                  <li><strong>Account data:</strong> your email address, name, and password.
                      Passwords are never stored in plain text &mdash; they are hashed with BCrypt.</li>
                  <li><strong>Motorcycle details:</strong> information you enter about your bikes
                      (nickname, make, model, year, engine capacity, color, license plate).</li>
                  <li><strong>Ride and location data:</strong> precise GPS location traces
                      (latitude, longitude, altitude, and speed), recorded <strong>only while you are
                      actively recording a ride</strong>. MotoWrap does not track your location in the
                      background or at any other time.</li>
                </ul>

                <h2>Where your data is stored</h2>
                <p>Your data is stored in a PostgreSQL database hosted by Supabase, and the
                MotoWrap API is served via Render. These hosting providers process your data
                on our behalf to run the service.</p>

                <h2>Map tiles</h2>
                <p>Maps in the app are loaded from OpenStreetMap tile servers. When map tiles
                load, the tile servers receive your IP address and the coordinates of the map
                area you are viewing, as is standard for any map service.</p>

                <h2>What we do NOT do</h2>
                <ul>
                  <li>No advertisements.</li>
                  <li>No analytics or tracking SDKs.</li>
                  <li>No selling of your data.</li>
                  <li>No sharing of your data with third parties beyond the hosting providers
                      named above (Supabase and Render).</li>
                </ul>

                <h2>Data retention</h2>
                <p>Your data is retained until you delete your account. When you delete your
                account, your profile, motorcycles, rides, and all GPS location data are
                permanently removed.</p>

                <h2>Deleting your account and data</h2>
                <p>You can delete your account and all associated data at any time:</p>
                <ul>
                  <li>In the app: <strong>Profile &rarr; Delete Account</strong></li>
                  <li>By email: contact <a href="mailto:sandip@roostoo.com">sandip@roostoo.com</a>
                      from your registered email address</li>
                </ul>

                <h2>Contact</h2>
                <p>For any privacy questions or requests, contact Sayan Mondal at
                <a href="mailto:sandip@roostoo.com">sandip@roostoo.com</a>.</p>
                """;
    }

    @GetMapping(value = "/account-deletion", produces = MediaType.TEXT_HTML_VALUE)
    public String accountDeletion() {
        return "<title>Delete Your MotoWrap Account</title>" + STYLE + """
                <h1>Delete Your MotoWrap Account</h1>
                <p>You can delete your MotoWrap account and all associated data in either of
                two ways:</p>
                <ul>
                  <li><strong>In the app:</strong> go to <strong>Profile &rarr; Delete Account</strong>.</li>
                  <li><strong>By email:</strong> send a deletion request to
                      <a href="mailto:sandip@roostoo.com">sandip@roostoo.com</a> from the email
                      address registered to your account.</li>
                </ul>
                <p>Deletion is immediate and permanently removes your profile, motorcycles,
                rides, and all GPS location data. This cannot be undone.</p>
                """;
    }
}
