// data/external-links.ts

export type SocialLink = {
  label: string
  href: string
  icon: "instagram" | "facebook" | "whatsapp"
}

export type ExternalLinks = {
  email: string
  whatsapp: string

  socials: SocialLink[]
}

export const externalLinks: ExternalLinks = {
  email: "hello@mkluxedivine.com",

  whatsapp: "https://wa.me/918050965516",

  socials: [
    {
      label: "Instagram",
      href: "https://instagram.com/mkluxedivine",
      icon: "instagram",
    },

    {
      label: "Facebook",
      href: "https://facebook.com/mkluxedivine",
      icon: "facebook",
    },

    {
      label: "WhatsApp",
      href: "https://wa.me/918050965516",
      icon: "whatsapp",
    },
  ],
}