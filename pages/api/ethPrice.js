// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD', {
      headers: {
        'Apikey': process.env.NEXT_PUBLIC_CRYPTO_API_KEY, // Replace with your actual API key
      },
    });
    // If the request is successful, send the JSON response
    res.status(200).json(response.data);
  } catch (error) {
    // Log and return the error if the request fails
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching cryptocurrency listings.' });
  }
}
