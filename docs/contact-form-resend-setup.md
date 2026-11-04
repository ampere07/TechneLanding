# Contact form: Resend setup

The Contact us form posts to `api/contact.ts`. That function sends the message through Resend to the
address you choose. Nothing is sent until you finish the steps below.

Resend may rename menu items from time to time. If a label here differs slightly, look for the closest match.

## What you need

- A Resend account at https://resend.com
- Access to the DNS settings for `techne.ph`, so you can verify the domain
- Access to the Vercel project settings

## 1. Verify your domain

Resend only sends from a domain it has verified. Without this step it will refuse to deliver to your inbox.

1. In the Resend dashboard open **Domains** and select **Add Domain**.
2. Enter `techne.ph`. A subdomain such as `send.techne.ph` also works and keeps this mail apart from your normal mail.
3. Resend shows a few DNS records. Add each one at the company that manages DNS for `techne.ph`.
   They are SPF and DKIM records, and sometimes an MX record for bounces.
4. Select **Verify**. It can take a few minutes, and sometimes longer, for DNS to update.

Verified domains also give good delivery. The SPF and DKIM records are what keep the mail out of Spam.

## 2. Create an API key

1. Open **API Keys** and select **Create API Key**.
2. Name it `Techne website`.
3. Set the permission to **Sending access** and, if offered, limit it to the `techne.ph` domain.
4. Create it and copy the key now. Resend shows it only once. It starts with `re_`.

Treat the key like a password. Anyone who has it can send mail from your domain.

## 3. Add the settings

The three settings are server-only. Never give them a `VITE_` prefix, because Vite would put them in the
public JavaScript bundle.

| Name | Value |
| --- | --- |
| `RESEND_API_KEY` | The key from step 2 |
| `RESEND_FROM` | A plain address on the verified domain, for example `noreply@techne.ph` |
| `CONTACT_TO` | Where messages arrive. One address, or several separated by commas |

Write `RESEND_FROM` as a plain address, not as `Name <address>`. The function sets the sender name to the visitor's name and email address, so each message shows who wrote it.

### On Vercel

1. Open the project, then **Settings > Environment Variables**.
2. Add the three names above for the Production environment. Add Preview too if you test on preview deploys.
3. Redeploy. Environment variables only apply to new deployments.

### On your computer

1. Copy `.env.example` to `.env.local`.
2. Fill in the three values.
3. Run `npm run dev`. The form works on the local address Vite prints, through the same function.

`.env.local` is ignored by git. Do not commit it.

## 4. Test it

1. Open the Contact us page and send a message with every field filled in.
2. The message should arrive at `CONTACT_TO` within a few seconds. Its subject starts with `[Techne website]`.
3. Replying to it replies to the visitor, because their address is set as Reply-To.
4. In the Resend dashboard, **Emails** lists each message and whether it was delivered.

To try it before the domain is verified, set `RESEND_FROM` to `onboarding@resend.dev` and `CONTACT_TO` to the
email address you signed up to Resend with. Resend delivers test mail only to that address.

Also run `npm test`. The tests check the function against a fake Resend, so they pass without a key.
They do not prove your key works. Only sending a real message does.

## Troubleshooting

The server log shows `[contact] resend send failed with <status> <reason>`. The visitor only ever sees a
general "could not send" message.

| What you see | Likely cause and fix |
| --- | --- |
| Log says `401` and `API key is invalid` | The key is wrong, has stray spaces, or was deleted. Create a new key and update `RESEND_API_KEY`. |
| Log says `403` and the domain is not verified | `RESEND_FROM` is on a domain that is not verified yet. Finish step 1, or use an address on the verified domain. |
| Log says `403` and you can only send to your own address | You are using `onboarding@resend.dev`. Verify your domain and change `RESEND_FROM`. |
| Log says `422` | `RESEND_FROM` or `CONTACT_TO` is not accepted. Check both are plain, valid addresses. |
| Log says `429` | Resend's own sending rate was exceeded. Wait a moment. If it repeats, check the dashboard for a burst of messages. |
| The form shows a server error and the log says mail is not configured | One of the three settings is missing in this environment. On Vercel, redeploy after adding it. |
| Mail arrives in Spam | Check that SPF and DKIM show as verified in **Domains**. Add a DMARC record for techne.ph. Mark the first message "Not spam". |
| The form says "You have sent several messages in a short time" | The per-visitor limit of 8 messages in 10 minutes was reached. It resets by itself. |

## Limits and good to know

- Resend's free plan has a daily and a monthly sending limit. Check your plan on the Resend pricing page.
  A contact form stays far below it unless it is being spammed.
- The visitor rate limit is kept in memory on each serverless instance. It slows abuse but is not a guarantee.
  The hidden trap field, the origin check and the fixed recipient do the rest.
- To rotate the key, create a new one, update `RESEND_API_KEY`, redeploy, then delete the old key.
- Failures are logged on the server. Visitor text and the API key are never logged.
