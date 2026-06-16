function base64URLEncode(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

export function generateCodeVerifier() {
    const array = new Uint8Array(64);
    crypto.getRandomValues(array);
    return base64URLEncode(array);
}

export async function generateCodeChallenge(verifier) {
    const encoded = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", encoded);
    return base64URLEncode(digest);
}

export function buildAuthUrl(challenge) {
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
    const redirectUri = `${window.location.origin}/callback`;

    const params = new URLSearchParams({
        client_id: clientId,
        response_type: "code",
        scope: "openid",
        redirect_uri: redirectUri,
        code_challenge: challenge,
        code_challenge_method: "S256",
    });

    return `${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth?${params}`;
}

export async function exchangeCodeForToken(code) {
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
    const redirectUri = `${window.location.origin}/callback`;
    const verifier = sessionStorage.getItem("pkce_verifier");

    const res = await fetch(
        `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`,
        {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                client_id: clientId,
                code,
                redirect_uri: redirectUri,
                code_verifier: verifier,
            }),
        }
    );

    if (!res.ok) throw new Error("Token exchange failed");
    return res.json();
}

export function buildLogoutUrl() {
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
    const redirectUri = window.location.origin;

    const params = new URLSearchParams({
        client_id: clientId,
        post_logout_redirect_uri: redirectUri,
    });

    return `${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout?${params}`;
}
