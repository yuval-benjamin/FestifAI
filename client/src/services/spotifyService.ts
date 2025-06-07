
export const SPOTIFY_KEYS = {
  ACCESS_TOKEN: "spotify_access_token",
  REFRESH_TOKEN: "spotify_refresh_token",
  EXPIRES_AT: "spotify_expires_at"
};

export const parseSpotifyTokens = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get("access_token");
  const expiresIn = params.get("expires_in");
  console.log(accessToken)

  if (accessToken && expiresIn) {
    const expiresAt = Date.now() + parseInt(expiresIn) * 1000;

    localStorage.setItem(SPOTIFY_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(SPOTIFY_KEYS.EXPIRES_AT, expiresAt.toString());

    // Clean up URL after processing
    window.history.replaceState({}, document.title, "/");
    return true;
  }

  console.error("Failed to parse tokens from URL hash");
  return false;
};

export const getAccessToken = (): string | null => {
  const token = localStorage.getItem(SPOTIFY_KEYS.ACCESS_TOKEN);
  const expiresAt = localStorage.getItem(SPOTIFY_KEYS.EXPIRES_AT);

  if (token && expiresAt && Date.now() < parseInt(expiresAt)) {
    return token;
  }

  return null;
};

export const setSpotifyTokens = (accessToken: string, refreshToken: string, expiresIn: number) => {
  const expiresAt = Date.now() + expiresIn * 1000;

  localStorage.setItem("spotify_access_token", accessToken);
  localStorage.setItem("spotify_refresh_token", refreshToken);
  localStorage.setItem("spotify_expires_at", expiresAt.toString());
};


export const getRefreshToken = (): string | null => {
  return localStorage.getItem(SPOTIFY_KEYS.REFRESH_TOKEN);
};

export const isLoggedIn = (): boolean => {
  return !!getAccessToken();
};

export const logoutSpotify = () => {
  Object.values(SPOTIFY_KEYS).forEach((key) => localStorage.removeItem(key));
};

export const loginWithSpotify = () => {
  const clientId = "e4f2aaa400d04d40824fe55863470098";
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-top-read"
  ];

  const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: "token",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
  }).toString()}`;
  window.location.href = authUrl;
};


