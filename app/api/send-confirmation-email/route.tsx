import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { customerEmail, customerName, purchasedItems, sessionId, totalAmount } = await request.json()

    if (!customerEmail || !purchasedItems || !Array.isArray(purchasedItems)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const getDownloadLink = (itemId: string) => {
      const downloadLinks: Record<string, string> = {
        "champions-mindset": "https://drive.google.com/uc?export=download&id=1-hXEHZ26npEmE9TioMBZNAQdlPeGBNIE",
        "theme-page-masterclass": `${process.env.NEXT_PUBLIC_APP_URL || "https://v0-champion-s-mindset-landing-page.vercel.app"}/course/theme-page-masterclass`,
        "theme-page-masterclass-ebook":
          "https://drive.google.com/uc?export=download&id=1UEEeyznbNAlU2ryw-nPVxL6FNrEeiUjO",
        "viral-clip-pack-bundle": "https://drive.google.com/uc?export=download&id=VIRAL_CLIP_PACK_FILE_ID",
      }
      return downloadLinks[itemId] || `${process.env.NEXT_PUBLIC_APP_URL}/downloads/${itemId}.pdf`
    }

    const getItemDescription = (itemId: string) => {
      const descriptions: Record<string, string> = {
        "champions-mindset": "Complete e-book with bonus materials and 60-day roadmap",
        "theme-page-masterclass": "Video course with templates and resources",
        "theme-page-masterclass-ebook": "E-book version with comprehensive guide and templates",
        "viral-clip-pack-bundle": "Complete collection of viral video clips and templates",
      }
      return descriptions[itemId] || "Digital product with instant access"
    }

    // Generate email HTML content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Purchase Confirmation - Champion's Mindset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626, #991b1b); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .product-item { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #dc2626; }
            .download-btn { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Purchase Confirmed!</h1>
              <p>Thank you for your purchase, ${customerName || "Champion"}!</p>
            </div>
            <div class="content">
              <h2>Your Digital Products</h2>
              <p>Your order has been successfully processed. Here are your purchased items with instant access:</p>
              
              ${purchasedItems
                .map(
                  (item: any) => `
                <div class="product-item">
                  <h3>${item.title}</h3>
                  <p>${getItemDescription(item.id)}</p>
                  ${item.quantity > 1 ? `<p><strong>Quantity:</strong> ${item.quantity}</p>` : ""}
                  ${item.price ? `<p><strong>Price:</strong> $${(item.price * (item.quantity || 1)).toFixed(2)}</p>` : ""}
                  <a href="${getDownloadLink(item.id)}" class="download-btn">
                    ${item.id === "theme-page-masterclass" ? "🎓 Access Course" : "⬇️ Download Now"}
                  </a>
                </div>
              `,
                )
                .join("")}
              
              <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <h3>📧 Order Details</h3>
                <p><strong>Order ID:</strong> ${sessionId?.slice(-8).toUpperCase()}</p>
                <p><strong>Email:</strong> ${customerEmail}</p>
                <p><strong>Total:</strong> $${totalAmount ? (totalAmount / 100).toFixed(2) : "0.00"}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <h3>💡 What's Next?</h3>
                <ul>
                  <li>Download your products using the links above</li>
                  <li>Start your transformation journey today</li>
                  <li>Join our community of champions</li>
                  <li>Create an account to access your products anytime</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>Need help? Contact us at support@championsmindset.com</p>
              <p>© ${new Date().getFullYear()} Champion's Mindset. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // For now, we'll log the email content (in production, integrate with email service)
    console.log("[v0] Email would be sent to:", customerEmail)
    console.log("[v0] Email content generated successfully")

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'noreply@championsmindset.com',
    //   to: customerEmail,
    //   subject: 'Your Purchase Confirmation - Champion\'s Mindset',
    //   html: emailHtml
    // })

    return NextResponse.json({
      message: "Email prepared successfully",
      emailSent: false, // Set to true when email service is integrated
      recipient: customerEmail,
    })
  } catch (error) {
    console.error("Error sending confirmation email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
