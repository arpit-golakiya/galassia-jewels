import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getPrice } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";

export const runtime = "nodejs";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

function sanitize(value) {
  return String(value || "").trim();
}

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function getPrivateKey() {
  return process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

function getWebhookConfig() {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

  if (!url) {
    return null;
  }

  return { url, secret };
}

function getSheetsConfig() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = getPrivateKey();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "Leads";

  if (!clientEmail || !privateKey || !spreadsheetId || !sheetName) {
    return null;
  }

  return { clientEmail, privateKey, spreadsheetId, sheetName };
}

async function getAccessToken({ clientEmail, privateKey }) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: clientEmail,
    scope: GOOGLE_SHEETS_SCOPE,
    aud: GOOGLE_TOKEN_URL,
    exp: now + 3600,
    iat: now,
  };
  const unsignedToken = `${base64url(JSON.stringify(header))}.${base64url(
    JSON.stringify(claim)
  )}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(unsignedToken)
    .sign(privateKey);
  const assertion = `${unsignedToken}.${base64url(signature)}`;

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload.error_description ||
        payload.error ||
        "Could not authenticate with Google Sheets."
    );
  }

  return payload.access_token;
}

async function appendLeadToSheet(config, values) {
  const accessToken = await getAccessToken(config);
  const escapedSheetName = config.sheetName.replace(/'/g, "''");
  const range = encodeURIComponent(`'${escapedSheetName}'!A:N`);
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [values] }),
    }
  );
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload.error?.message || "Could not append lead to Google Sheet."
    );
  }

  return payload;
}

async function appendLeadToAppsScript({ url, secret }, values) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, values }),
  });
  const responseText = await response.text();
  let payload = {};

  try {
    payload = JSON.parse(responseText);
  } catch {
    payload = {};
  }

  if (!response.ok || payload.ok === false) {
    const detail =
      payload.message ||
      responseText.slice(0, 180).replace(/\s+/g, " ").trim() ||
      `HTTP ${response.status}`;
    throw new Error(`Google Apps Script failed: ${detail}`);
  }

  return payload;
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
    const bandColor = sanitize(payload.bandColor);
    const pageUrl = sanitize(payload.pageUrl);
    const price = getPrice({ diamondType, quality, karat });

    if (!name || !phone || !diamondType || !quality || !karat || !price) {
      return NextResponse.json(
        { message: "Missing required reveal price details." },
        { status: 400 }
      );
    }

    const leadValues = [
      new Date().toISOString(),
      name,
      phone,
      email || "Not provided",
      diamondType.replace("-", " "),
      quality,
      `${karat.toUpperCase()} Gold`,
      `${goldColor || "Yellow"} Gold`,
      bandColor || "Dune",
      price,
      formatINR(price),
      pageUrl,
      payload.userAgent || "",
      "Reveal Price",
    ];

    const webhookConfig = getWebhookConfig();
    if (webhookConfig) {
      await appendLeadToAppsScript(webhookConfig, leadValues);
      return NextResponse.json({ ok: true });
    }

    const sheetsConfig = getSheetsConfig();
    if (!sheetsConfig) {
      return NextResponse.json(
        { message: "Google Sheets is not configured." },
        { status: 500 }
      );
    }

    await appendLeadToSheet(sheetsConfig, leadValues);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Reveal price Google Sheet logging failed", {
      message: error?.message,
      name: error?.name,
    });
    return NextResponse.json(
      { message: error?.message || "Could not save lead to Google Sheet." },
      { status: 500 }
    );
  }
}
