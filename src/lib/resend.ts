import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
    console.warn("⚠️ Resend API key not configured. Emails will be mocked.");
}

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface SendAuditReportEmailParams {
    to: string;
    domain: string;
    score: number;
    threatLevel: string;
    auditSlug: string;
}

export async function sendAuditReportEmail({
    to,
    domain,
    score,
    threatLevel,
    auditSlug,
}: SendAuditReportEmailParams): Promise<boolean> {
    if (!resend) {
        console.log("📧 [MOCK] Would send audit report email to:", to);
        return true;
    }

    const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://getaltcast.com"}/audit/${auditSlug}`;

    try {
        await resend.emails.send({
            from: "AltCast <noreply@getaltcast.com>",
            to,
            subject: `🔴 Security Audit Complete: ${domain}`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Courier New', monospace; background: #050505; color: #fff; padding: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { border-bottom: 2px solid #CCFF00; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #CCFF00; }
        .score { font-size: 48px; font-weight: bold; margin: 20px 0; }
        .threat { padding: 10px 20px; display: inline-block; margin: 10px 0; }
        .threat.critical { background: rgba(255,0,60,0.2); border: 1px solid #FF003C; color: #FF003C; }
        .threat.high { background: rgba(255,100,0,0.2); border: 1px solid #FF6400; color: #FF6400; }
        .threat.medium { background: rgba(255,200,0,0.2); border: 1px solid #FFC800; color: #FFC800; }
        .threat.low { background: rgba(0,255,100,0.2); border: 1px solid #00FF64; color: #00FF64; }
        .cta { display: inline-block; background: #CCFF00; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; margin-top: 30px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">ALTCAST</div>
            <div style="color: #666; font-size: 12px;">SECURITY INDEX // PUBLIC RECORD</div>
        </div>
        
        <h1 style="margin: 0; font-size: 20px;">Hostile Audit Complete</h1>
        <p style="color: #888;">Target: <strong style="color: #fff;">${domain}</strong></p>
        
        <div class="score" style="color: ${score >= 80 ? "#00FF64" : score >= 50 ? "#FFC800" : "#FF003C"}">
            ${score}/100
        </div>
        
        <div class="threat ${threatLevel.toLowerCase()}">${threatLevel} THREAT LEVEL</div>
        
        <p style="color: #888; line-height: 1.6;">
            This is what we found in 30 seconds. Imagine what we'd find in 30 minutes.
        </p>
        
        <a href="${reportUrl}" class="cta">VIEW FULL REPORT →</a>
        
        <div class="footer">
            <p>AltCast Security Index</p>
            <p>We try to break your app before someone else does.</p>
        </div>
    </div>
</body>
</html>
            `,
        });
        return true;
    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
}

interface SendWelcomeEmailParams {
    to: string;
}

export async function sendWelcomeEmail({ to }: SendWelcomeEmailParams): Promise<boolean> {
    if (!resend) {
        console.log("📧 [MOCK] Would send welcome email to:", to);
        return true;
    }

    try {
        await resend.emails.send({
            from: "AltCast <noreply@getaltcast.com>",
            to,
            subject: "Welcome to AltCast",
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Courier New', monospace; background: #050505; color: #fff; padding: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { border-bottom: 2px solid #CCFF00; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #CCFF00; }
        .cta { display: inline-block; background: #CCFF00; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">ALTCAST</div>
        </div>
        
        <h1>Your audit is being processed.</h1>
        <p style="color: #888; line-height: 1.6;">
            We're running hostile tests against your target. You'll receive your full report shortly.
        </p>
        
        <p style="color: #CCFF00;">
            Ready for the full assault? Deploy a complete hostile audit for $299.
        </p>
        
        <a href="https://getaltcast.com/#pricing" class="cta">VIEW PRICING →</a>
    </div>
</body>
</html>
            `,
        });
        return true;
    } catch (error) {
        console.error("Failed to send welcome email:", error);
        return false;
    }
}
