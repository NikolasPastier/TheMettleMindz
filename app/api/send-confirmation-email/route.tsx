import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, customerName, sessionId, items, totalAmount, currency } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      console.log("[v0] RESEND_API_KEY not configured, skipping email")
      return NextResponse.json({ message: "Email service not configured" }, { status: 200 })
    }

    const productNames = items?.map((item: any) => item.title).join(", ") || "Digital Products"
    const formattedAmount = ((totalAmount || 0) / 100).toFixed(2)

    const downloadLinks =
      items?.map((item: any) => {
        const links: Record<string, string> = {
          "champions-mindset": "https://drive.google.com/uc?export=download&id=1-hXEHZ26npEmE9TioMBZNAQdlPeGBNIE",
          "theme-page-masterclass": `${request.nextUrl.origin}/course/theme-page-masterclass`,
          "theme-page-masterclass-ebook":
            "https://drive.google.com/uc?export=download&id=1UEEeyznbNAlU2ryw-nPVxL6FNrEeiUjO",
          "viral-clip-pack-bundle": "https://drive.google.com/uc?export=download&id=1yqyU1kv5-jZv5XNDWZ5e1yEok0KTjMP0",
        }
        return {
          title: item.title,
          link: links[item.id] || "#",
          isDownload: item.id !== "theme-page-masterclass",
        }
      }) || []

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #dc2626; text-align: center;">Thank You for Your Purchase!</h1>
        
        ${customerName ? `<p>Dear ${customerName},</p>` : "<p>Dear Valued Customer,</p>"}
        
        <p>Your payment has been successfully processed. Here are your purchase details:</p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Summary</h3>
          <p><strong>Order ID:</strong> ${sessionId.slice(-8).toUpperCase()}</p>
          <p><strong>Products:</strong> ${productNames}</p>
          <p><strong>Total:</strong> $${formattedAmount} ${currency?.toUpperCase() || "USD"}</p>
        </div>
        
        <h3>Your Downloads & Access Links:</h3>
        <div style="margin: 20px 0;">
          ${downloadLinks
            .map(
              (link) => `
            <div style="background: #fff; border: 1px solid #e5e7eb; padding: 15px; margin: 10px 0; border-radius: 6px;">
              <h4 style="margin: 0 0 10px 0; color: #374151;">${link.title}</h4>
              <a href="${link.link}" style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
                ${link.isDownload ? "Download Now" : "Access Course"}
              </a>
            </div>
          `,
            )
            .join("")}
        </div>
        
        <p>If you have any questions or need support, please don't hesitate to contact us.</p>
        
        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>The Champion's Mindset Team</strong>
        </p>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p>This email was sent regarding your purchase. Please keep this email for your records.</p>
        </div>
      </div>
    `

    const { data, error } = await resend.emails.send({
      from: "Champion's Mindset <noreply@championsmindset.com>",
      to: [email],
      subject: `Your Purchase Confirmation - Order ${sessionId.slice(-8).toUpperCase()}`,
      html: emailHtml,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    console.log("[v0] Email sent successfully:", data?.id)
    return NextResponse.json({ message: "Email sent successfully", id: data?.id })
  } catch (error) {
    console.error("[v0] Email API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
