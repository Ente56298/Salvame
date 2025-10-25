import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, location } = req.body;

  try {
    // In production, integrate with Twilio or similar SMS service
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      console.log('SMS service not configured, logging emergency:', { message, location });
      return res.status(200).json({ 
        success: true, 
        message: 'Emergency logged (SMS service not configured)' 
      });
    }

    // Example Twilio integration (commented out for demo)
    /*
    const twilio = require('twilio')(twilioAccountSid, twilioAuthToken);
    
    await twilio.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: '+525512345678' // Emergency contact number
    });
    */

    // Log emergency for now
    console.log('🚨 EMERGENCY ALERT:', {
      timestamp: new Date().toISOString(),
      message,
      location,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({ 
      success: true, 
      message: 'Emergency alert sent successfully' 
    });

  } catch (error) {
    console.error('Emergency SMS error:', error);
    res.status(500).json({ 
      error: 'Failed to send emergency alert',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}