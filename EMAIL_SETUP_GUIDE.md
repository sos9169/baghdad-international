# 🌐 دليل الأرشفة على جوجل وتفعيل إيميلات Google Workspace لـ baghdad-international.com

تهانينا لشراء الدومين الرسمي **`https://baghdad-international.com/`**! 🎉
هذا الدليل الشامل يشرح لك بالتفصيل خطوتين أساسيتين:
1. **أرشفة الموقع وظهوره على محرك بحث جوجل (Google Search & Bing)**.
2. **إنشاء وتفعيل إيميلات `info@baghdad-international.com` و `contact@baghdad-international.com` عبر Google Workspace**.

---

## 🔍 أولاً: أرشفة الموقع وظهوره على نتائج بحث جوجل (Google Indexing)

لقد قمنا بتجهيز وملء ملفات الأرشفة والـ SEO بالكامل داخل الموقع:
- **`sitemap.xml`**: خريطة الموقع التي تعرّف محركات البحث بجميع أقسام وصفحات الموقع.
- **`robots.txt`**: سماح لجميع عناكب جوجل وأدوات الفحص بأرشفة الدومين الرئيسي.
- **`Structured Data (JSON-LD)`**: كود تعريف المؤسسة، الشعار، الأرقام، والعناوين لإظهار نتائج غنية على جوجل.

### 📌 خطوات الأرشفة في Google Search Console (تستغرق دقيقتين):
1. ادخل على **[Google Search Console](https://search.google.com/search-console)** وسجّل بايميل جودل.
2. اضغط **Add Property** واختر **URL prefix** ثم أدخل:
   `https://baghdad-international.com/`
3. اختر طريقة التوثيق الأسهل (مثلاً **HTML Tag** وضعه في الموقع أو **DNS TXT Record** في لوحة الدومين).
4. بعد الإثبات، اذهب إلى قائمة **Sitemaps** في الجانب الأيسر.
5. أدخل رابط الخريطة: `sitemap.xml` واضغط **Submit**.
6. في غضون 24-48 ساعة، سينتهي عناكب جوجل من فحص الموقع وتظهر صفحتك في نتائج البحث عند كتابة "مجموعة بغداد الدولية" أو "Baghdad International Group"!

---

## ✉️ ثانياً: تفعيل إيميلات Google Workspace (`info@` & `contact@`)

لإنشاء إيميل **`info@baghdad-international.com`** وإيميل **`contact@baghdad-international.com`** يعملان مباشرة من تطبيق Gmail وبصندوق وارد رسمي احترافي:

### 📌 الخطوات الشاملة فور الاشتراك في Google Workspace:
1. ادخل على **[Google Workspace](https://workspace.google.com/)** واضغط **Get Started**.
2. أدخل اسم مؤسستك ودومينك: `baghdad-international.com`.
3. قم بإنشاء الحساب الأول: `info@baghdad-international.com`.
4. بعد الدخول للمستكشف (Google Admin Console)، أضف المستخدم الثاني: `contact@baghdad-international.com` (أو أنشئ له Alias مجاني يوجه لـ info).

### 📌 سجلات الـ DNS المطلوبة في لوحة الدومين (Namecheap / GoDaddy / Cloudflare / Vercel):
لتفعيل استقبال وإرسال الإيميلات فوراً دون الوصول لرسائل الـ Spam، أضف السجلات التالية:

#### 1. سجلات الـ MX (المسؤولة عن استقبال الرسائل عبر جوجل):
| Type | Name / Host | Value / Target | Priority |
| :--- | :--- | :--- | :--- |
| **MX** | `@` | `SMTP.GOOGLECOM.` | `1` |
| **MX** | `@` | `ALT1.ASPMX.L.GOOGLE.COM.` | `5` |
| **MX** | `@` | `ALT2.ASPMX.L.GOOGLE.COM.` | `5` |
| **MX** | `@` | `ALT3.ASPMX.L.GOOGLE.COM.` | `10` |
| **MX** | `@` | `ALT4.ASPMX.L.GOOGLE.COM.` | `10` |

#### 2. سجل الـ SPF (لحماية الإيميل وضمان وصول الرسائل لـ Inbox مباشرة):
| Type | Name / Host | Value |
| :--- | :--- | :--- |
| **TXT** | `@` | `v=spf1 include:_spf.google.com ~all` |

#### 3. سجل الـ DKIM & DMARC (لتوثيق أمان البريد من Google Admin Console):
- من لوحة Google Admin 👈 **Apps** 👈 **Google Workspace** 👈 **Gmail** 👈 **Authenticate email**، انسخ سجل الـ TXT الخاص بـ DKIM وأضفه في لوحة الدومين.

---

✅ **الموقع الآن جاهز 100% ومربوط على الدومين الجديد `https://baghdad-international.com/` ومزود بجميع السجلات المطلوبة.**
