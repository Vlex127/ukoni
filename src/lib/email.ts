import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"${process.env.FROM_NAME || 'Ukoni'}" <${process.env.FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string): Promise<boolean> {
    const subject = 'Welcome to Ukoni - Thank You for Subscribing!';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Ukoni</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 20px;
          }
          .logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #2563eb, #0891b2);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }
          h1 {
            color: #1f2937;
            font-size: 28px;
            margin-bottom: 20px;
          }
          .content {
            margin-bottom: 30px;
          }
          .feature-list {
            background-color: #f8fafc;
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
          }
          .feature-list h3 {
            color: #1f2937;
            margin-bottom: 15px;
          }
          .feature-list ul {
            margin: 0;
            padding-left: 20px;
          }
          .feature-list li {
            margin-bottom: 8px;
            color: #4b5563;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb, #0891b2);
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          .social-links {
            margin-top: 15px;
          }
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #6b7280;
            text-decoration: none;
          }
          .social-links a:hover {
            color: #2563eb;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <div class="logo-icon">✨</div>
              Ukoni
            </div>
            <h1>Welcome to the Community! 🎉</h1>
          </div>
          
          <div class="content">
            <p>Hi there,</p>
            <p>Thank you so much for subscribing to Ukoni! We're thrilled to have you join our community of writers, developers, and creators.</p>
            
            <div class="feature-list">
              <h3>What to expect from our newsletter:</h3>
              <ul>
                <li>📝 Weekly insights on technology, design, and digital well-being</li>
                <li>🚀 Exclusive content and early access to new articles</li>
                <li>💡 Tips and tricks from industry experts</li>
                <li>🌟 Behind-the-scenes stories and creative processes</li>
                <li>🎯 Curated resources to fuel your creativity</li>
              </ul>
            </div>
            
            <p>Our mission is to create a space where ideas flourish and connections are made. Whether you're here to learn, share, or simply get inspired, you're in the right place.</p>
            
            <div style="text-align: center;">
              <a href="https://ukoni.com" class="cta-button">Explore Latest Articles</a>
            </div>
            
            <p>If you have any questions or topics you'd love to see us cover, just reply to this email. We'd love to hear from you!</p>
            
            <p>Welcome aboard!</p>
            <p>
              <strong>Adaeze Sophia Ukoni</strong><br>
              Founder, Ukoni
            </p>
          </div>
          
          <div class="footer">
            <p>You're receiving this email because you subscribed to our newsletter.</p>
            <div class="social-links">
              <a href="https://linkedin.com/in/adaeze-sophia-ukoni-1b6704a5">LinkedIn</a>
              <a href="https://instagram.com/ukoni_sophia">Instagram</a>
              <a href="https://ukoni.com">Website</a>
            </div>
            <p style="margin-top: 20px; font-size: 12px;">
              © 2026 Ukoni Inc. All rights reserved.<br>
              If you no longer wish to receive these emails, you can unsubscribe at any time.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Welcome to Ukoni!

Thank you for subscribing to our newsletter! We're excited to have you join our community.

What to expect:
- Weekly insights on technology, design, and digital well-being
- Exclusive content and early access to new articles
- Tips and tricks from industry experts
- Behind-the-scenes stories and creative processes
- Curated resources to fuel your creativity

Visit our website: https://ukoni.com

Best regards,
Adaeze Sophia Ukoni
Founder, Ukoni
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
      text,
    });
  }
}

export const emailService = new EmailService();
