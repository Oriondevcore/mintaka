import axios from 'axios'
import nodemailer from 'nodemailer'

const ADMIN_WHATSAPP = process.env.ADMIN_NUMBER || '27724971810'

console.log('📧 Email Module initialized\n')

/**
 * DRAFT EMAIL (show to Graham for approval)
 */
export async function draftEmail(to, subject, body, from = 'mintaka@mintaka.oriondevcore.com') {
  try {
    const email = {
      from: from,
      to: to,
      bcc: 'graham@oriondevcore.com',
      subject: subject,
      body: body,
      timestamp: new Date().toISOString(),
      status: 'draft'
    }

    console.log(`   📝 Draft email created for: ${to}`)
    console.log(`   Subject: ${subject}`)

    return {
      success: true,
      email: email,
      message: `Email drafted. Awaiting Graham's approval to send.`,
      action: 'Show to Graham in WhatsApp for approval'
    }

  } catch (error) {
    console.error(`   ❌ Draft error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

/**
 * SEND EMAIL
 */
export async function sendEmail(to, subject, body, from = 'mintaka@mintaka.oriondevcore.com') {
  try {
    // Verify SMTP config
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (!smtpHost || !smtpUser || !smtpPass) {
      throw new Error('SMTP not configured in .env')
    }

    console.log(`   📧 Creating SMTP connection...`)

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort) || 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        ciphers: 'SSLv3'
      }
    })

    // Test connection
    await transporter.verify()
    console.log(`   ✅ SMTP connected`)

    // Send email
    console.log(`   📤 Sending email to ${to}...`)

    const info = await transporter.sendMail({
      from: from,
      to: to,
      bcc: 'graham@oriondevcore.com',
      subject: subject,
      html: body.includes('<html') ? body : `<p>${body}</p>`,
      text: body
    })

    console.log(`   ✅ Email sent: ${info.messageId}`)

    return {
      success: true,
      to: to,
      subject: subject,
      messageId: info.messageId,
      timestamp: new Date().toISOString(),
      status: 'sent'
    }

  } catch (error) {
    console.error(`   ❌ Send error: ${error.message}`)
    return {
      success: false,
      error: error.message,
      note: 'Check .env for SMTP configuration'
    }
  }
}

/**
 * EMAIL TEMPLATE - Sales/Proposal
 */
export function getSalesEmailTemplate(hotelName, proposal) {
  return `
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #d62828; color: white; padding: 20px; text-align: center; border-radius: 4px; }
        .content { padding: 20px; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; }
        a { color: #d62828; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ORION Dev Core</h1>
            <p>Agentic AI for African Hospitality</p>
        </div>
        
        <div class="content">
            <p>Hi ${hotelName},</p>
            
            <p>Thank you for your interest in ORION Dev Core.</p>
            
            <p>We've prepared a custom proposal for your operation. This document outlines how ORION can help you:</p>
            <ul>
                <li>Increase revenue by 5-17%</li>
                <li>Improve guest communication 24/7</li>
                <li>Reduce operational errors</li>
                <li>Gain real-time insights</li>
            </ul>
            
            <p>Please review the attached proposal. If you have any questions, Graham Schubach will be in touch personally.</p>
            
            <p>Best regards,<br>
            <strong>Mintaka</strong><br>
            ORION Dev Core<br>
            <a href="mailto:mintaka@mintaka.oriondevcore.com">mintaka@mintaka.oriondevcore.com</a></p>
        </div>
        
        <div class="footer">
            <p>ORION Dev Core | Built in Africa. Engineered for Impact.</p>
            <p>Contact: graham@oriondevcore.com | +27 72 497 1810</p>
        </div>
    </div>
</body>
</html>
`
}

/**
 * EMAIL TEMPLATE - Onboarding
 */
export function getOnboardingEmailTemplate(hotelName) {
  return `
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #f77f00; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .step { background: #f5f5f5; padding: 15px; margin: 10px 0; border-left: 4px solid #d62828; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to ORION</h1>
        </div>
        
        <div class="content">
            <p>Hi ${hotelName},</p>
            
            <p>Congratulations! Your hotel is now part of the ORION family.</p>
            
            <p><strong>Here's what happens next:</strong></p>
            
            <div class="step">
                <strong>Week 1: Setup</strong><br>
                We'll configure ORION for your operation and train your team.
            </div>
            
            <div class="step">
                <strong>Week 2-3: Soft Launch</strong><br>
                ORION goes live with your team, supporting guest communication.
            </div>
            
            <div class="step">
                <strong>Month 1+: Optimization</strong><br>
                We monitor performance and optimize for your specific needs.
            </div>
            
            <p>Graham will contact you personally to schedule setup meetings.</p>
            
            <p>In the meantime, if you have questions, reach out:<br>
            <a href="mailto:mintaka@mintaka.oriondevcore.com">mintaka@mintaka.oriondevcore.com</a></p>
            
            <p>Best regards,<br>
            <strong>Mintaka & Graham</strong></p>
        </div>
    </div>
</body>
</html>
`
}

/**
 * EMAIL TEMPLATE - General Support
 */
export function getSupportEmailTemplate(contactName) {
  return `
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #d62828; color: white; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ORION Support</h1>
        </div>
        
        <div class="content" style="padding: 20px;">
            <p>Hi ${contactName},</p>
            
            <p>Thank you for reaching out to ORION Dev Core.</p>
            
            <p>Your message has been received. Graham will review it personally and follow up with you within 24 hours.</p>
            
            <p>In the meantime, if you need immediate assistance, feel free to reach out via WhatsApp to Mintaka.</p>
            
            <p>Best regards,<br>
            <strong>Mintaka</strong><br>
            ORION Dev Core</p>
        </div>
    </div>
</body>
</html>
`
}

/**
 * TEST EMAIL
 */
export async function testEmail() {
  console.log('🧪 Testing email configuration...')
  
  const configured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS

  if (!configured) {
    console.log('   ❌ SMTP not configured')
    console.log('   Add to .env:')
    console.log('      SMTP_HOST=smtp.cloudflare.com')
    console.log('      SMTP_PORT=587')
    console.log('      SMTP_USER=mintaka@mintaka.oriondevcore.com')
    console.log('      SMTP_PASS=your-password')
    return false
  }

  console.log('   ✅ SMTP configured')
  console.log(`   From: ${process.env.SMTP_USER}`)
  return true
}

export default {
  draftEmail,
  sendEmail,
  getSalesEmailTemplate,
  getOnboardingEmailTemplate,
  getSupportEmailTemplate,
  testEmail
}
