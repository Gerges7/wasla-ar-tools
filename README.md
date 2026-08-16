# وصلة — Wasla Tools

موقع أدوات عربية مجانية لأصحاب الأعمال، منشور على Cloudflare Workers Static Assets.

## النشر التلقائي
اربط هذا المستودع بالـ Worker الحالي `wasla-ar-tools` من:
Cloudflare Dashboard → Workers & Pages → wasla-ar-tools → Settings → Builds → Connect.

- Production branch: `main`
- Build command: اتركه فارغًا
- Deploy command: `npx wrangler deploy`
- Root directory: `/`

بعد الربط، كل Push إلى `main` يؤدي إلى نشر تلقائي.

## هيكل المشروع
- `public/`: ملفات الموقع التي تُنشر للزوار.
- `wrangler.jsonc`: إعداد Cloudflare Worker.

## ملاحظة AdSense
الإعلانات غير مفعلة بعد. يتم تفعيلها لاحقًا بعد تجهيز الموقع والموافقة، مع الحفاظ على المشروع مجاني التكلفة قدر الإمكان في البداية.
Deployment test
