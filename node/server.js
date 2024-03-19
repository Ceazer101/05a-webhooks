import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

let registeredWebhooks = [];

// Register webhook
app.post('/register', (req, res) => {
    const { eventType, url } = req.body;
    registeredWebhooks.push({ eventType, url });
    console.log(`Webhook registered for event type: ${eventType} and URL: ${url}`);
    res.send('Webhook registered successfully');
    console.log(registeredWebhooks);
});

// Unregister webhook
app.post('/unregister', (req, res) => {
    const { eventType, url } = req.body;
    registeredWebhooks = registeredWebhooks.filter(webhook => !(webhook.eventType === eventType && webhook.url === url));
    console.log(`Webhook unregistered for event type: ${eventType} and URL: ${url}`);
    res.send('Webhook unregistered successfully');
});

// Endpoint to simulate payment
app.post('/payment', (req, res) => {
    console.log('Payment received');
    // Trigger registered webhooks for payment event
    registeredWebhooks
        .filter(webhook => webhook.eventType === 'payment_received')
        .forEach(webhook => {
            // Simulate sending data to webhook URL
            console.log(`Sending payment data to webhook at ${webhook.url}`);
        });
    res.send('Payment processed');
});

// Ping endpoint
app.get('/ping', (req, res) => {
    // Trigger registered webhooks
    registeredWebhooks.forEach(webhook => {
        axios.post(webhook.url, { event: 'ping' })
            .then(() => {
                console.log(`Ping event sent to ${webhook.url}`);
            })
            .catch(error => {
                console.error(`Error sending ping event to ${webhook.url}:`, error);
            });
    });
    res.send('Ping event triggered successfully');
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Endpoint to handle GitHub webhook payloads
app.post('/webhook', (req, res) => {
    const payload = req.body;
    console.log('Received webhook payload:', payload);
    // Here you can handle the payload received from GitHub
    res.status(200).send('Webhook received successfully');
    console.log("maybe not")
});