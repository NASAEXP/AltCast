import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// ==================== EMAIL TEMPLATES ====================

interface AuditReportEmailProps {
    email: string;
    domain: string;
    grade: string;
    score: number;
    auditUrl: string;
    threatLevel: string;
}

interface LeadCaptureEmailProps {
    email: string;
    url: string;
}

// ==================== EMAIL FUNCTIONS ====================

export async function sendAuditReportEmail({
    email,
    domain,
    grade,
    score,
    auditUrl,
    threatLevel,
}: AuditReportEmailProps) {
    const { data, error } = await resend.emails.send({
        from: "AltCast <noreply@altcast.com>", // TODO: Update with verified domain
        to: email,
        subject: `🔴 Security Audit Complete: ${domain} - Grade ${grade}`,
        html: `
            <div style="font-family: monospace; background: #000; color: #fff; padding: 32px;">
                <h1 style="color: #FF003C; margin-bottom: 8px;">ALTCAST SECURITY AUDIT</h1>
                <p style="color: #666; font-size: 12px; margin-bottom: 32px;">HOSTILE AUDIT DIVISION</p>
                
                <div style="border: 1px solid #333; padding: 24px; margin-bottom: 24px;">
                    <h2 style="color: #fff; margin: 0 0 8px 0;">${domain}</h2>
                    <p style="color: #666; margin: 0;">Threat Level: <span style="color: ${threatLevel === 'CRITICAL' ? '#FF003C' : threatLevel === 'HIGH' ? '#FF6B00' : '#CCFF00'};">${threatLevel}</span></p>
                </div>
                
                <div style="text-align: center; padding: 32px; border: 2px solid ${score >= 80 ? '#CCFF00' : score >= 50 ? '#FFB800' : '#FF003C'}; margin-bottom: 24px;">
                    <div style="font-size: 64px; font-weight: bold; color: ${score >= 80 ? '#CCFF00' : score >= 50 ? '#FFB800' : '#FF003C'};">${grade}</div>
                    <div style="color: #666; font-size: 12px;">SECURITY GRADE</div>
                    <div style="color: #fff; font-size: 24px; margin-top: 8px;">${score}/100</div>
                </div>
                
                <a href="${auditUrl}" style="display: block; background: #CCFF00; color: #000; text-align: center; padding: 16px; text-decoration: none; font-weight: bold; text-transform: uppercase;">
                    View Full Report →
                </a>
                
                <p style="color: #666; font-size: 12px; text-align: center; margin-top: 32px;">
                    This is an automated security assessment. For remediation services, reply to this email.
                </p>
            </div>
        `,
    });

    if (error) {
        console.error("Failed to send audit report email:", error);
        throw error;
    }

    return data;
}

export async function sendLeadCaptureEmail({ email, url }: LeadCaptureEmailProps) {
    const { data, error } = await resend.emails.send({
        from: "AltCast <noreply@altcast.com>", // TODO: Update with verified domain
        to: email,
        subject: "🎯 Your Security Scan is Queued",
        html: `
            <div style="font-family: monospace; background: #000; color: #fff; padding: 32px;">
                <h1 style="color: #CCFF00; margin-bottom: 8px;">TARGET ACQUIRED</h1>
                <p style="color: #666; font-size: 12px; margin-bottom: 32px;">ALTCAST SECURITY</p>
                
                <div style="border: 1px solid #333; padding: 24px; margin-bottom: 24px;">
                    <p style="color: #666; margin: 0 0 8px 0;">SCANNING TARGET:</p>
                    <p style="color: #fff; font-size: 18px; margin: 0;">${url}</p>
                </div>
                
                <p style="color: #999; line-height: 1.6;">
                    Your hostile audit is now in the queue. We'll notify you when the scan is complete with your full security report.
                </p>
                
                <p style="color: #666; font-size: 12px; margin-top: 32px;">
                    Expected completion: 24-48 hours
                </p>
                
                <hr style="border: none; border-top: 1px solid #333; margin: 32px 0;" />
                
                <p style="color: #666; font-size: 12px; text-align: center;">
                    Want faster results? <a href="https://altcast.com/#pricing" style="color: #CCFF00;">Upgrade to Priority Queue →</a>
                </p>
            </div>
        `,
    });

    if (error) {
        console.error("Failed to send lead capture email:", error);
        throw error;
    }

    return data;
}

// Internal notification for new leads (optional)
export async function notifyTeamNewLead(email: string, url: string) {
    const { error } = await resend.emails.send({
        from: "AltCast System <system@altcast.com>",
        to: "team@altcast.com", // TODO: Update with your team email
        subject: `🎯 New Lead: ${email}`,
        html: `
            <div style="font-family: monospace; padding: 16px;">
                <h2>New Lead Captured</h2>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Target URL:</strong> ${url}</p>
                <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            </div>
        `,
    });

    if (error) {
        console.error("Failed to notify team:", error);
        // Don't throw - this is optional
    }
}
