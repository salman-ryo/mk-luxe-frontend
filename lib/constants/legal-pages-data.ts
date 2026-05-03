// lib/constants/legal-pages-data.ts

export type LegalSection = {
  title: string
  content: string[]
}

export type LegalContactInfo = {
  title: string
  email: string
  phone: string
  address: string
}

export type LegalHero = {
  eyebrow: string
  title: string
  subtitle: string
  updatedAt: string
}

export type LegalPageData = {
  hero: LegalHero
  sections: LegalSection[]
  contact: LegalContactInfo
}

export const termsPageData: LegalPageData = {
  hero: {
    eyebrow: "Legal",

    title: "Terms & Conditions",

    subtitle:
      "Please read these terms before using our website, placing an order, or contacting us.",

    updatedAt: "Effective as of May 3, 2026",
  },

  sections: [
    {
      title: "1. Introduction",

      content: [
        "These Terms & Conditions govern your use of this website and any purchases or enquiries made through it.",

        "By browsing the site, contacting us, or placing an order, you agree to these terms.",
      ],
    },

    {
      title: "2. Business Model",

      content: [
        "Mk Luxe Divine is a roadside jewellery business that sources metallic jewellery in bulk and sells directly to customers.",

        "Product availability, pricing, and designs may change without prior notice based on stock and sourcing.",
      ],
    },

    {
      title: "3. Orders and Availability",

      content: [
        "An order or enquiry does not guarantee final availability until we confirm it.",

        "We may refuse, cancel, or adjust an order if an item is out of stock, incorrectly priced, or cannot be fulfilled for any reason.",

        "If we need to clarify product details, pricing, or delivery information, we may contact you before proceeding.",
      ],
    },

    {
      title: "4. Pricing and Payments",

      content: [
        "Prices shown on the website, WhatsApp, Instagram, or shared through messages are subject to change at any time.",

        "Any applicable delivery charges or additional costs will be communicated before confirmation where relevant.",

        "Payment methods may vary depending on the order type or collection method.",
      ],
    },

    {
      title: "5. Delivery and Pickup",

      content: [
        "Estimated delivery or pickup timelines are approximate and may vary depending on stock, location, and availability.",

        "Delays may occasionally happen because of supplier changes, weather conditions, or transport issues.",

        "Customers are responsible for providing accurate delivery or contact information.",
      ],
    },

    {
      title: "6. Returns and Exchanges",

      content: [
        "Because jewellery pieces are handled directly and may be part of limited stock, returns or exchanges may be limited.",

        "Requests for exchanges or corrections will be reviewed based on item condition and the nature of the issue.",

        "Please contact us as soon as possible if there is a problem with your order.",
      ],
    },

    {
      title: "7. Product Representation",

      content: [
        "We make every effort to display products accurately, but slight variations in color, polish, texture, or size may occur due to photography and lighting.",

        "All product descriptions and pricing are provided in good faith and may be updated when needed.",
      ],
    },

    {
      title: "8. Website Usage",

      content: [
        "You agree not to misuse the website, interfere with its functionality, or attempt unauthorized access.",

        "You are responsible for any information you provide through forms, messages, or enquiries.",
      ],
    },

    {
      title: "9. Intellectual Property",

      content: [
        "All content on this website including images, branding, logos, layouts, and written content belongs to Mk Luxe Divine unless otherwise stated.",

        "You may not copy or reuse website content without permission.",
      ],
    },

    {
      title: "10. Limitation of Liability",

      content: [
        "To the fullest extent permitted by law, Mk Luxe Divine is not responsible for indirect or incidental losses resulting from use of the website or purchase of products.",

        "Our responsibility is limited to the extent required under applicable laws.",
      ],
    },

    {
      title: "11. Updates to These Terms",

      content: [
        "We may update these Terms & Conditions from time to time as the business or website evolves.",

        "The latest version will always be available on this page.",
      ],
    },
  ],

  contact: {
    title: "Contact",

    email: "mkluxed@gmail.com",

    phone: "+91 80509 65516",

    address: "Karnataka, India",
  },
}

export const privacyPageData: LegalPageData = {
  hero: {
    eyebrow: "Privacy",

    title: "Privacy Policy",

    subtitle:
      "A simple explanation of how we handle the information you share with us.",

    updatedAt: "Effective as of May 3, 2026",
  },

  sections: [
    {
      title: "1. Overview",

      content: [
        "We value your privacy and keep this policy intentionally simple.",

        "We do not operate customer accounts or maintain a large customer database through this website.",

        "This policy explains what information we may receive and how it may be used.",
      ],
    },

    {
      title: "2. Information You Share With Us",

      content: [
        "If you contact us through WhatsApp, Instagram, email, phone, or forms, we may receive information such as your name, phone number, email address, and message details.",

        "If you place an order or enquiry, we may also receive product preferences, delivery details, or quantity information you choose to share.",
      ],
    },

    {
      title: "3. How We Use Information",

      content: [
        "We use shared information to respond to enquiries, confirm orders, provide support, arrange deliveries, and communicate about products.",

        "We may also keep limited records for operational, tax, or legal purposes where required.",
      ],
    },

    {
      title: "4. Information We Do Not Intentionally Keep",

      content: [
        "We do not create customer profiles or run a marketing database from this website.",

        "We do not sell customer information to third parties.",

        "If information is no longer needed for communication or records, we may remove or stop actively using it.",
      ],
    },

    {
      title: "5. Cookies and Technical Data",

      content: [
        "Like most websites, basic technical information such as browser type or device information may be automatically collected through hosting or browser technologies.",

        "If analytics, advertising, or additional tracking tools are added in the future, this policy may be updated accordingly.",
      ],
    },

    {
      title: "6. Sharing Information",

      content: [
        "We only share information when necessary to complete an order, coordinate delivery, comply with legal obligations, or work with trusted service providers.",

        "We do not share personal information with advertisers.",
      ],
    },

    {
      title: "7. Data Retention",

      content: [
        "We keep information only for as long as reasonably necessary for communication, business records, or legal obligations.",

        "Because we are a small roadside business, retention practices may remain simple and operational in nature.",
      ],
    },

    {
      title: "8. Your Choices",

      content: [
        "You may choose not to share personal information with us, though this may limit our ability to respond or complete an order.",

        "You may also request correction or deletion of information we still control, subject to legal or operational limitations.",
      ],
    },

    {
      title: "9. Security",

      content: [
        "We take reasonable precautions to protect the information shared with us.",

        "However, no online communication or storage method can be guaranteed completely secure.",
      ],
    },

    {
      title: "10. Policy Updates",

      content: [
        "This Privacy Policy may be updated occasionally if our website, tools, or business operations change.",

        "The latest version will always be available on this page.",
      ],
    },
  ],

  contact: {
    title: "Contact Us",

    email: "mkluxed@gmail.com",

    phone: "+91 80509 65516",

    address: "Karnataka, India",
  },
}