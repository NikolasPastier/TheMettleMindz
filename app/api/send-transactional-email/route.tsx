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
      console.error("[v0] RESEND_API_KEY not configured")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    const productNames = items?.map((item: any) => item.title).join(", ") || "Digital Products"
    const formattedAmount = ((totalAmount || 0) / 100).toFixed(2)
    const orderNumber = sessionId?.slice(-8).toUpperCase() || "N/A"

    const productLinks: Record<string, string> = {
      "champions-mindset": "https://drive.google.com/uc?export=download&id=1-hXEHZ26npEmE9TioMBZNAQdlPeGBNIE",
      "theme-page-masterclass": `${request.nextUrl.origin}/course/theme-page-masterclass`,
      "theme-page-masterclass-ebook":
        "https://drive.google.com/uc?export=download&id=1UEEeyznbNAlU2ryw-nPVxL6FNrEeiUjO",
      "viral-clip-pack-bundle": "https://drive.google.com/uc?export=download&id=1yqyU1kv5-jZv5XNDWZ5e1yEok0KTjMP0",
    }

    const downloadLinks =
      items?.map((item: any) => ({
        title: item.title,
        link: productLinks[item.id] || "#",
        isDownload: item.id !== "theme-page-masterclass",
      })) || []

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; font-size: 28px; margin: 0; font-weight: bold;">Thank You for Your Purchase!</h1>
        </div>
        
        <div style="margin-bottom: 25px;">
          ${customerName ? `<p style="font-size: 16px; margin: 0 0 15px 0;">Dear ${customerName},</p>` : '<p style="font-size: 16px; margin: 0 0 15px 0;">Dear Valued Customer,</p>'}
          <p style="font-size: 16px; line-height: 1.5; margin: 0;">Your payment has been successfully processed. Here are your purchase details:</p>
        </div>
        
        <div style="background: #f9fafb; padding: 25px; border-radius: 8px; margin: 25px 0; border: 1px solid #e5e7eb;">
          <h3 style="color: #dc2626; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Order Summary</h3>
          <p style="margin: 8px 0; font-size: 15px;"><strong>Order ID:</strong> ${orderNumber}</p>
          <p style="margin: 8px 0; font-size: 15px;"><strong>Products:</strong> ${productNames}</p>
          <p style="margin: 8px 0; font-size: 15px;"><strong>Total:</strong> $${formattedAmount} ${currency?.toUpperCase() || "USD"}</p>
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #dc2626; margin-bottom: 20px; font-size: 18px;">Your Downloads & Access Links:</h3>
          ${downloadLinks
            .map(
              (link) => `
            <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
              <h4 style="margin: 0 0 15px 0; color: #374151; font-size: 16px;">${link.title}</h4>
              <a href="${link.link}" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 14px;">
                ${link.isDownload ? "Download Now" : "Access Course"}
              </a>
            </div>
          `,
            )
            .join("")}
        </div>
        
        <div style="margin: 30px 0; padding: 20px 0; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 16px; line-height: 1.5; margin: 0 0 15px 0;">If you have any questions or need support, please don't hesitate to contact us.</p>
          
          <p style="margin: 20px 0 0 0; font-size: 16px;">
            Best regards,<br>
            <strong style="color: #dc2626;">The TheMettleMindz Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
          <p style="margin: 0;">This email was sent regarding your purchase. Please keep this email for your records.</p>
        </div>
      </div>
    `

    const { data, error } = await resend.emails.send({
      from: "TheMettleMindz <noreply@themettlemindz.com>",
      to: [email],
      subject: `Your Purchase Confirmation - Order ${orderNumber}`,
      html: emailHtml,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    console.log("[v0] Transactional email sent successfully:", data?.id)
    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("[v0] Transactional email API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
