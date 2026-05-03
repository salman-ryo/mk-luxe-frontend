// lib/constants/site-config.ts

export type SocialIcon =
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "mail"
  | "phone"

export type SocialLink = {
  label: string
  href: string
  icon: SocialIcon
  action?: string
}

export type SiteConfig = {
  brand: {
    name: string
    email: string
    phone: string
    whatsappNumber: string
    description: string
  }

  support: {
    workingHours: string
    supportLabel: string
    stars: number
  }

  location: {
    title: string
    cta: string
    address: string
    mapUrl: string
  }

  socials: SocialLink[]
}

export const siteConfig: SiteConfig = {
  brand: {
    name: "MK Luxe Divine",

    email: "mkluxed@gmail.com",

    phone: "+91 80509 65516",

    whatsappNumber: "918050965516",

    description:
      "Timeless metallic jewelry pieces curated for modern everyday style. Thoughtfully sourced, quality checked, and directly priced.",
  },

  support: {
    workingHours: "Mon - Fri: 9:00 AM - 6:00 PM",

    supportLabel: "24/7 Support",

    stars: 5,
  },

  location: {
    title: "Opening Hours",

    cta: "Find Our Store",

    address: "Karnataka, India",

    mapUrl: "https://maps.google.com",
  },

  socials: [
    {
      label: "Email",

      href: "mailto:mkluxed@gmail.com",

      icon: "mail",

      action: "Email Us",
    },

    {
      label: "+91 80509 65516",

      href: "https://wa.me/918050965516",

      icon: "phone",

      action: "WhatsApp",
    },

    {
      label: "@mkluxedivine",

      href:
        "https://www.instagram.com/mkluxedivine?igsh=a2swNTI1MWwyNXlh&utm_source=qr",

      icon: "instagram",

      action: "Instagram",
    },

    {
      label: "facebook.com/mkluxedivine",

      href: "https://facebook.com/mkluxedivine",

      icon: "facebook",

      action: "Facebook",
    },

    {
      label: "WhatsApp",

      href: "https://wa.me/918050965516",

      icon: "whatsapp",
    },
  ],
}