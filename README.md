# Study Notes AI — Online App

This is a ready-to-deploy Next.js app. It keeps the OpenAI key on the server and sends uploaded study photos to the Responses API. The browser stores the resulting notes locally on the device.

## No coding deployment
1. Create a GitHub account if needed.
2. Create a new repository and upload ALL files/folders from this ZIP.
3. In Vercel, choose Add New Project → Import the GitHub repository → Deploy.
4. In Vercel Project Settings → Environment Variables, add:
   OPENAI_API_KEY = your OpenAI API key
5. Redeploy.
6. Open the Vercel URL on your phone. Use Camera/Gallery.

The OpenAI key must stay server-side. Do not put it in browser code or a NEXT_PUBLIC_ variable.

## Important
OpenAI API usage is billed separately from ChatGPT subscriptions. Set an appropriate spending limit in your API account.

Model used: gpt-5.6-luna (image input supported).
