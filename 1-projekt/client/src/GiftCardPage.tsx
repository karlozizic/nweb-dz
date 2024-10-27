import {useAuth0} from "@auth0/auth0-react";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

interface GiftCard {
    id: string;
    oib: string;
    first_name: string;
    last_name: string;
    created: string;
}

function GiftCardPage() {
    const {id} = useParams();
    const { user, isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();
    const [giftCard, setGiftCard] = useState<any>(null);
    const [error, setError] = useState('');
    const [isLoaded, setIsLoaded] = useState(true);

    useEffect(() => {
        console.log('GiftCardPage useEffect');
        if (isLoading)
            return;

        if (!isAuthenticated) {
            loginWithRedirect({
                appState: { returnTo: window.location.pathname }
            });
            return;
        }

        const fetchGiftCard = async () => {
            const token = await getAccessTokenSilently();
            console.log('Sending request to:', `${process.env.REACT_APP_API_URL}/api/giftCard/${id}`);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/giftCard/${id}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Response:', response);
            if (!response.ok) {
                setError('Error fetching gift card');
                return;
            }

            const data = await response.json();
            setGiftCard(data);
        }

        fetchGiftCard();
    }, [isAuthenticated, loginWithRedirect, getAccessTokenSilently, id]);

    if (!isLoaded) {
        return (
            <div>
                <h1>Gift Card Page</h1>
                <div>
                    Loading...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>Gift Card Page</h1>
                <div>
                    {error}
                </div>
            </div>
        );
    }

    if (!giftCard) {
        return (
            <div>
                <h1>Gift Card Page</h1>
                <div>
                    Loading...
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div>
            <div>
                <p>First Name: {user.name}</p>
                <p>Last Name: {user.email}</p>
            </div>
            <div>
                <p>Gift Card ID: {giftCard.id}</p>
                <p>OIB: {giftCard.oib}</p>
                <p>First Name: {giftCard.first_name}</p>
                <p>Last Name: {giftCard.last_name}</p>
                <p>Created At: {giftCard.created}</p>
            </div>
        </div>
  );
}

export default GiftCardPage;