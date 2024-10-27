const getAccessToken = async () => {
    if (!process.env.REACT_APP_AUTH0_DOMAIN) {
        throw new Error('Auth0 domain not configured');
    }
    const tokenEndpoint = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`;

    const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
            client_secret: process.env.REACT_APP_AUTH0_CLIENT_SECRET,
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            grant_type: 'client_credentials'
        })
    });

    console.log(response);

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
            errorData?.error_description ||
            `Failed to get access token: ${response.status}`
        );
    }

    const data = await response.json();
    return data.access_token;
}
export default getAccessToken;