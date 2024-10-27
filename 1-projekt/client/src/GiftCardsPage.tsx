import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";


function GiftCardsPage() {
    const [giftCardsNumber, setGiftCardsNumber] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGiftCards = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/giftCards`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error fetching gift cards');
                }

                const data = await response.json();
                console.log('Fetched data:', data);
                setGiftCardsNumber(data.num || 0);
            } catch (error) {
                console.error('Error fetching gift cards:', error);
            }
        };

        fetchGiftCards();
    }, []);


    return (
        <div>
            <h1>Gift Cards Page</h1>
            <p>Number of gift cards available: {giftCardsNumber}</p>
            <button
                className="generate-button"
                onClick={() => navigate('/generateGiftCard')
                }>
                Generate New Gift Card
            </button>
        </div>
    );
}

export default GiftCardsPage;