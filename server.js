const express = require('express');
const { Resend } = require('resend');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Initialize Resend with API Key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Higher limit for PDF base64
app.use(express.static(path.join(__dirname, './')));

// API Endpoint to send the quote email with PDF
app.post('/api/send-quote', async (req, res) => {
    const { formData, pdfBase64, customerEmail } = req.body;

    try {
        const { data, error } = await resend.emails.send({
            from: 'ADITHYA Security <onboarding@resend.dev>', // Replace with your verified domain
            to: ['adithyashs@gmail.com'], // The user's email
            subject: `New Quote Request from ${formData.firstName} ${formData.lastName}`,
            html: `
                <h2>New Quote Request Details</h2>
                <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Phone:</strong> ${formData.phone}</p>
                <p><strong>Company:</strong> ${formData.company || 'N/A'}</p>
                <p><strong>Service:</strong> ${formData.service}</p>
                <p><strong>Location:</strong> ${formData.location || 'N/A'}</p>
                <p><strong>Message:</strong> ${formData.message || 'No message provided'}</p>
                <br>
                <p>The detailed quote is attached as a PDF.</p>
            `,
            attachments: [
                {
                    filename: `Quote_${formData.firstName}_${formData.lastName}.pdf`,
                    content: pdfBase64.split(',')[1], // Remove the data:application/pdf;base64, prefix
                },
            ],
        });

        if (error) {
            console.error('Resend Error:', error);
            return res.status(400).json({ error });
        }

        res.status(200).json({ message: 'Email sent successfully', data });
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Static files served from: ' + __dirname);
});
