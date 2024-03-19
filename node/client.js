import axios from "axios";
import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

// Function to register a webhook
async function registerWebhook(eventType, url) {
    try {
        const response = await axios.post('http://localhost:8080/register', {eventType, url});
        console.log(response.data);
    } catch (error) {
        console.error('Error registering webhook:', error.response.data);
    }
}

// Function to unregister a webhook
async function unregisterWebhook(eventType, url) {
    try {
        const response = await axios.post('http://localhost:8080/unregister', {eventType, url});
        console.log(response.data);
    } catch (error) {
        console.error('Error registering webhook:', error.response.data);
    }
}

app.post('/new_payment', (req, res) => {
    console.log('Received payment deletion info', req.body);
    res.status(200).send({ message: 'Payment deletion info received' });
});

app.listen(PORT, () => {
    console.log(`Client running on port ${PORT}`);
});

registerWebhook('payment_received', 'http://localhost:3000/payment');
