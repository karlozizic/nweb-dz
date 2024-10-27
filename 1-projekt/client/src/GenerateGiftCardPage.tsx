import {useState} from "react";
import getAccessToken from "./GetAccessToken";

interface Error {
    error: string;
}

function GenerateGiftCardPage(){
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4080';
    const [oib, setOib] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(event: any) {
        event.preventDefault();
        setIsLoading(true);
        const accessToken = await getAccessToken();

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/giftCards/generate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({oib, firstName, lastName})
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error);
            setIsLoading(false);
        }

        setQrCode(data.qrCode);
        setIsLoading(false);
    }

    return (
        <div>
            <h1>Generate Gift Card Page</h1>

            {error && (
                <div>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Oib:
                    </label>
                    <input type="text" value={oib} onChange={(e) => setOib(e.target.value)} disabled={isLoading} pattern="[0-9]{11}"/>
                    <label>
                        First name:
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={isLoading}/>
                    </label>
                    <label>
                        Last name:
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isLoading}/>
                    </label>
                    <input type="submit" value="Submit"/>
                </div>
            </form>
            {qrCode && (
                <div>
                    <h2>Generated QR Code:</h2>
                    <img src={qrCode} alt="Gift Card QR Code" />
                </div>
            )}
        </div>
    );
}

export default GenerateGiftCardPage;