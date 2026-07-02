import nodemailer from "nodemailer";
import dns from "node:dns";
import { NextResponse } from "next/server";
import { getPrice } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";

function sanitize(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(value) {
  return !value || /^\S+@\S+\.\S+$/.test(value);
}

function materialLabel(value) {
  return `${value.toUpperCase()} Gold`;
}

function getMailConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM || user;
  const to = process.env.MAIL_TO || from;

  if (!host || !user || !pass || !from || !to) {
    return null;
  }

  return { host, port, user, pass, from, to };
}

function lookupIPv4(hostname, options, callback) {
  dns.lookup(hostname, { ...options, family: 4 }, callback);
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const name = sanitize(payload.name);
    const phone = sanitize(payload.phone);
    const email = sanitize(payload.email);
    const diamondType = sanitize(payload.diamondType);
    const quality = sanitize(payload.quality);
    const karat = sanitize(payload.karat);
    const goldColor = sanitize(payload.goldColor);
    const bandColor = sanitize(payload.bandColor) || "Jet Black";
    const price = getPrice({ diamondType, quality, karat });

    if (!name || !phone || !diamondType || !quality || !karat || !price) {
      return NextResponse.json(
        { message: "Missing required order details." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const mailConfig = getMailConfig();
    if (!mailConfig) {
      return NextResponse.json(
        { message: "Email service is not configured." },
        { status: 500 }
      );
    }

    const material = materialLabel(karat);
    const selectedColor = `${goldColor || "Yellow"} Gold`;
    const formattedPrice = formatINR(price);
    const diamondTypeLabel = diamondType.replace("-", " ");
    const safe = {
      name: escapeHtml(name),
      phone: escapeHtml(phone),
      email: escapeHtml(email || "Not provided"),
      material: escapeHtml(material),
      selectedColor: escapeHtml(selectedColor),
      bandColor: escapeHtml(bandColor),
      quality: escapeHtml(quality),
      diamondType: escapeHtml(diamondTypeLabel),
      formattedPrice: escapeHtml(formattedPrice),
    };

    const transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.port === 465,
      family: 4,
      lookup: lookupIPv4,
      connectionTimeout: 15000,
      auth: {
        user: mailConfig.user,
        pass: mailConfig.pass,
      },
    });

    const internalMail = transporter.sendMail({
      from: `Galassia Jewels <${mailConfig.from}>`,
      to: mailConfig.to,
      replyTo: email || undefined,
      subject: `New Place Order Request - ${name}`,
      text: [
        "New place order request",
        "",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email || "Not provided"}`,
        "",
        `Material: ${material}`,
        `Gold Color: ${selectedColor}`,
        `Band Color: ${bandColor}`,
        `Diamond Quality: ${quality}`,
        `Diamond Type: ${diamondTypeLabel}`,
        `Price: ${formattedPrice}`,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
          <h2>New place order request</h2>
          <p><strong>Name:</strong> ${safe.name}</p>
          <p><strong>Phone:</strong> ${safe.phone}</p>
          <p><strong>Email:</strong> ${safe.email}</p>
          <hr />
          <p><strong>Material:</strong> ${safe.material}</p>
          <p><strong>Gold Color:</strong> ${safe.selectedColor}</p>
          <p><strong>Band Color:</strong> ${safe.bandColor}</p>
          <p><strong>Diamond Quality:</strong> ${safe.quality}</p>
          <p><strong>Diamond Type:</strong> ${safe.diamondType}</p>
          <p><strong>Price:</strong> ${safe.formattedPrice}</p>
        </div>
      `,
    });

    const customerMail = email
      ? transporter.sendMail({
          from: `Galassia Jewels <${mailConfig.from}>`,
          to: email,
          replyTo: mailConfig.from,
          subject: "We received your Galassia Jewels order request",
          text: [
            `Dear ${name},`,
            "",
            "Thank you for placing your order request with Galassia Jewels.",
            "We have received your details and our team will contact you within 24 hours to confirm the next steps.",
            "",
            "Your requested selection:",
            `Material: ${material}`,
            `Gold Color: ${selectedColor}`,
            `Band Color: ${bandColor}`,
            `Diamond Quality: ${quality}`,
            `Diamond Type: ${diamondTypeLabel}`,
            `Price: ${formattedPrice}`,
            "",
            "For any urgent update, you can reply to this email or contact us at contact@galassiajewels.com.",
            "",
            "Warm regards,",
            "Galassia Jewels",
          ].join("\n"),
          html: `
            <div style="margin: 0; padding: 0; background: #f4f0e8; font-family: Arial, sans-serif; color: #181512;">
              <div style="max-width: 640px; margin: 0 auto; padding: 32px 16px;">
                <div style="background: #080808; border: 1px solid #c9a063; overflow: hidden;">
                  <div style="height: 4px; background: #c9a063;"></div>
                  <div style="padding: 34px 30px 18px; text-align: center;">
                    <div style="font-family: Georgia, 'Times New Roman', serif; color: #c9a063; font-size: 24px; letter-spacing: 5px; text-transform: uppercase;">
                      Galassia
                    </div>
                    <div style="margin-top: 4px; color: #a8a198; font-size: 11px; letter-spacing: 4px; text-transform: uppercase;">
                      Jewels
                    </div>
                  </div>

                  <div style="padding: 10px 34px 34px; text-align: center;">
                    <div style="display: inline-block; margin-bottom: 18px; padding: 8px 14px; border: 1px solid rgba(34, 197, 94, 0.35); background: rgba(34, 197, 94, 0.12); color: #4ade80; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                      Request Received
                    </div>
                    <h1 style="margin: 0; color: #ece6d8; font-family: Georgia, 'Times New Roman', serif; font-size: 34px; line-height: 1.15; font-weight: 500;">
                      Thank you, ${safe.name}
                    </h1>
                    <p style="max-width: 500px; margin: 18px auto 0; color: #b8b0a3; font-size: 15px; line-height: 1.7;">
                      We have received your Galassia Jewels order request. Our team will contact you within <strong style="color: #e0c089;">2-3 hours</strong> to confirm the details and next steps.
                    </p>
                  </div>

                  <div style="padding: 0 30px 34px;">
                    <div style="border: 1px solid #262626; background: #101010; padding: 22px;">
                      <div style="margin-bottom: 16px; color: #c9a063; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;">
                        Requested Selection
                      </div>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                        <tr>
                          <td style="padding: 10px 0; color: #8f887e; font-size: 13px;">Material</td>
                          <td align="right" style="padding: 10px 0; color: #ece6d8; font-size: 14px;">${safe.material}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; color: #8f887e; font-size: 13px; border-top: 1px solid #202020;">Gold Color</td>
                          <td align="right" style="padding: 10px 0; color: #ece6d8; font-size: 14px; border-top: 1px solid #202020;">${safe.selectedColor}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; color: #8f887e; font-size: 13px; border-top: 1px solid #202020;">Band Color</td>
                          <td align="right" style="padding: 10px 0; color: #ece6d8; font-size: 14px; border-top: 1px solid #202020;">${safe.bandColor}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; color: #8f887e; font-size: 13px; border-top: 1px solid #202020;">Diamond Quality</td>
                          <td align="right" style="padding: 10px 0; color: #ece6d8; font-size: 14px; border-top: 1px solid #202020;">${safe.quality}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 0; color: #8f887e; font-size: 13px; border-top: 1px solid #202020;">Diamond Type</td>
                          <td align="right" style="padding: 10px 0; color: #ece6d8; font-size: 14px; border-top: 1px solid #202020;">${safe.diamondType}</td>
                        </tr>
                        <tr>
                          <td style="padding: 16px 0 4px; color: #8f887e; font-size: 13px; border-top: 1px solid #2d2d2d;">Price</td>
                          <td align="right" style="padding: 16px 0 4px; color: #e0c089; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; border-top: 1px solid #2d2d2d;">${safe.formattedPrice}</td>
                        </tr>
                      </table>
                    </div>
                  </div>

                  <div style="padding: 0 34px 34px; text-align: center;">
                    <p style="margin: 0 0 18px; color: #b8b0a3; font-size: 14px; line-height: 1.7;">
                      For any urgent update, reply to this email or contact us directly.
                    </p>
                    <a href="mailto:contact@galassiajewels.com" style="display: inline-block; padding: 13px 22px; background: #c9a063; color: #080808; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                      Contact Galassia Jewels
                    </a>
                  </div>

                  <div style="padding: 20px 30px; border-top: 1px solid #1f1f1f; text-align: center;">
                    <p style="margin: 0; color: #7f776d; font-size: 12px; line-height: 1.6;">
                      Warm regards,<br />
                      <span style="color: #c9a063;">Galassia Jewels</span>
                    </p>
                  </div>
                </div>

                <p style="margin: 18px 0 0; color: #8a8278; font-size: 11px; line-height: 1.5; text-align: center;">
                  This confirmation was sent because an order request was submitted on galassiajewels.com.
                </p>
              </div>
            </div>
          `,
        })
      : Promise.resolve();

    await Promise.all([internalMail, customerMail]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Place order request email failed", error);
    return NextResponse.json(
      { message: "Could not send order request email." },
      { status: 500 }
    );
  }
}
