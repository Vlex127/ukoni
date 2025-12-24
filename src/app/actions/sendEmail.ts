'use server';

import { revalidatePath } from 'next/cache';
import nodemailer from 'nodemailer';

// Email service configuration
const EMAIL_SERVICE = {
  provider: process.env.EMAIL_PROVIDER || 'gmail',
  gmailEmail: process.env.GMAIL_EMAIL,
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
  fromEmail: process.env.FROM_EMAIL,
  fromName: process.env.FROM_NAME || 'Your App'
};

interface EmailData {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

interface CampaignData {
  subject: string;
  content: string;
  audience: 'all' | 'subscribers' | 'paid' | 'custom';
  customRecipients?: string[];
}

export async function sendEmail(data: EmailData) {
  try {
    // Validate required fields
    if (!data.to || !data.subject || (!data.html && !data.text)) {
      throw new Error('Missing required fields: to, subject, and either html or text content');
    }

    if (!EMAIL_SERVICE.gmailEmail || !EMAIL_SERVICE.gmailAppPassword) {
      throw new Error('Gmail email and app password not configured');
    }

    // Normalize recipients to array
    const recipients = Array.isArray(data.to) ? data.to : [data.to];

    // Log email sending attempt (without sensitive data)
    console.log(`Sending email to ${recipients.length} recipient(s) with subject: ${data.subject}`);

    // Gmail SMTP implementation
    if (EMAIL_SERVICE.provider === 'gmail') {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_SERVICE.gmailEmail,
          pass: EMAIL_SERVICE.gmailAppPassword,
        },
      });

      const mailOptions = {
        from: `${EMAIL_SERVICE.fromName} <${EMAIL_SERVICE.fromEmail}>`,
        to: recipients.join(', '),
        subject: data.subject,
        html: data.html,
        text: data.text,
        replyTo: data.replyTo,
        attachments: data.attachments,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);

      return {
        success: true,
        messageId: result.messageId,
        provider: EMAIL_SERVICE.provider,
      };
    }

    // Add other email providers here (SendGrid, Mailgun, etc.)
    throw new Error(`Email provider ${EMAIL_SERVICE.provider} not implemented`);

  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

export async function sendCampaign(campaignData: CampaignData) {
  try {
    // Get recipients based on audience selection
    let recipients: string[] = [];

    switch (campaignData.audience) {
      case 'all':
        recipients = await getAllSubscribers();
        break;
      case 'subscribers':
        recipients = await getNewsletterSubscribers();
        break;
      case 'paid':
        recipients = await getPaidSubscribers();
        break;
      case 'custom':
        recipients = campaignData.customRecipients || [];
        break;
      default:
        throw new Error('Invalid audience selection');
    }

    if (recipients.length === 0) {
      throw new Error('No recipients found for this audience');
    }

    // Send campaign to all recipients
    const results = await Promise.allSettled(
      recipients.map(email => 
        sendEmail({
          to: email,
          subject: campaignData.subject,
          html: campaignData.content,
        })
      )
    );

    // Count successful and failed sends
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Campaign sent: ${successful} successful, ${failed} failed`);

    // Revalidate admin pages to show updated campaign stats
    revalidatePath('/admin/mail');

    return {
      success: true,
      totalRecipients: recipients.length,
      successful,
      failed,
      campaignId: `campaign_${Date.now()}`,
    };

  } catch (error) {
    console.error('Campaign sending error:', error);
    throw error;
  }
}

// Helper functions to get subscribers (implement these based on your database)
async function getAllSubscribers(): Promise<string[]> {
  // TODO: Implement database query to get all subscribers
  // Example: return await db.select().from(subscribers).where(eq(subscribers.status, 'active'));
  return [];
}

async function getNewsletterSubscribers(): Promise<string[]> {
  // TODO: Implement database query to get newsletter subscribers
  return [];
}

async function getPaidSubscribers(): Promise<string[]> {
  // TODO: Implement database query to get paid subscribers
  return [];
}


// Save campaign as draft
export async function saveDraft(campaignData: Partial<CampaignData>) {
  try {
    // TODO: Implement database storage for drafts
    
    console.log('Campaign draft saved');
    
    return {
      success: true,
      draftId: `draft_${Date.now()}`,
    };
  } catch (error) {
    console.error('Draft saving error:', error);
    throw error;
  }
}

// Get campaign statistics
export async function getCampaignStats(campaignId: string) {
  try {
    // TODO: Implement database query to get campaign statistics
    // This would typically include open rates, click rates, etc.
    
    return {
      campaignId,
      totalSent: 0,
      totalOpened: 0,
      totalClicked: 0,
      openRate: '0%',
      clickRate: '0%',
      unsubscribes: 0,
    };
  } catch (error) {
    console.error('Stats retrieval error:', error);
    throw error;
  }
}
