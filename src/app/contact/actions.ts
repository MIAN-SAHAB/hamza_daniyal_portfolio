"use server";

import { site } from "@/lib/site";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  /** Echo back what the visitor typed so a failed send doesn't wipe the form. */
  values?: Record<string, string>;
};

const TYPES = ["Creative Web & 3D", "Full-Stack Platform", "Headless Commerce", "WordPress / Plugin", "Something else"];
const BUDGETS = ["< $5k", "$5k – $15k", "$15k – $40k", "$40k +"];

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Sends the contact brief to site.email through the Resend REST API.
 * Env: RESEND_API_KEY (required), RESEND_FROM (optional, must be a verified Resend sender).
 */
export async function sendBrief(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const values = { name: get("name"), email: get("email"), message: get("message"), type: get("type"), budget: get("budget") };

  // Honeypot: real visitors never see or fill this field.
  if (get("company_website")) return { status: "success", message: "Thanks — your brief is on its way." };

  const errors: ContactState["errors"] = {};
  if (!values.name || values.name.length > 120) errors.name = "Tell me who you are.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 200) errors.email = "That email doesn't look right.";
  if (values.message.length < 10) errors.message = "A sentence or two about the project, please.";
  if (values.message.length > 5000) errors.message = "Let's keep the first message under 5,000 characters.";
  if (Object.keys(errors).length) return { status: "error", errors, values };

  const type = TYPES.includes(values.type) ? values.type : "Unspecified";
  const budget = BUDGETS.includes(values.budget) ? values.budget : "Unspecified";

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY is not set");
    return { status: "error", message: `Sending is temporarily unavailable — please email ${site.email} directly.`, values };
  }

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;color:#1b1446;line-height:1.5">
      <h2 style="margin:0 0 16px">New project brief</h2>
      <p><strong>Name:</strong> ${escape(values.name)}<br/>
      <strong>Email:</strong> ${escape(values.email)}<br/>
      <strong>Project type:</strong> ${escape(type)}<br/>
      <strong>Budget:</strong> ${escape(budget)}</p>
      <p style="white-space:pre-wrap;padding:16px;background:#f7f4ff;border-radius:12px">${escape(values.message)}</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>",
        to: [site.email],
        reply_to: values.email,
        subject: `New brief — ${type} (${budget}) from ${values.name}`,
        html,
        text: `${values.message}\n\n— ${values.name} <${values.email}>\nType: ${type}\nBudget: ${budget}`,
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend error", res.status, await res.text());
      throw new Error("send failed");
    }
  } catch {
    return { status: "error", message: `Couldn't send right now — please email ${site.email} directly.`, values };
  }

  return { status: "success", message: "Thanks — your brief landed in my inbox. I'll reply within one working day." };
}
