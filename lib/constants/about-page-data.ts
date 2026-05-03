// data/about-page-data.ts

export type FeatureItem = {
  icon: "hammer" | "heart" | "shield" | "award"
  title: string
  description: string
}

export type AboutPageData = {
  hero: {
    title: string
    subtitle: string
    description: string

    image: string
    imageAlt: string

    primaryButton: {
      label: string
      href: string
    }

    secondaryButton?: {
      label: string
      href: string
    }
  }

  features: {
    sectionTitle: string
    items: FeatureItem[]
  }

  milestones: {
    sectionTitle: string

    items: {
      date: string
      title: string
    }[]
  }

  founder: {
    sectionTitle: string
    name: string
    role: string
    quote: string
    image: string
  }
}

export const aboutPageData: AboutPageData = {
  hero: {
    title: "Our Story",
    subtitle: "Bulk Sourced. Directly Priced. Made for Everyday Style.",
    description:
      "Founded in 2025, MkLuxeDivine was built with a simple idea: source metallic jewellery in bulk and bring it directly to people with style, value, and confidence. Every piece reflects our focus on accessible elegance and dependable quality.",
    image: "/craftsman-working-on-jewellery.jpg",
    imageAlt: "Our Story",
    primaryButton: {
      label: "Shop Now",
      href: "/shop",
    },
  },

  features: {
    sectionTitle: "Why Choose Us",
    items: [
      {
        icon: "hammer",
        title: "Bulk Sourcing",
        description:
          "We source metallic jewellery in volume to keep our selection fresh and competitively priced.",
      },
      {
        icon: "heart",
        title: "Direct Value",
        description:
          "By selling directly to customers, we make stylish jewellery more accessible every day.",
      },
      {
        icon: "shield",
        title: "Quality Checked",
        description:
          "Every piece is carefully inspected for finish, consistency, and everyday wearability.",
      },
      {
        icon: "award",
        title: "Trusted Choice",
        description:
          "A growing name for customers who want practical style, fair pricing, and reliable service.",
      },
    ],
  },

  milestones: {
    sectionTitle: "Milestones",
    items: [
      {
        date: "2025",
        title: "Foundation",
      },
      {
        date: "2025",
        title: "First Direct-to-Customer Collection",
      },
      {
        date: "Today",
        title: "Growing Reach Across Local Markets",
      },
    ],
  },

  founder: {
    sectionTitle: "Meet The Founder",
    name: "Monica",
    role: "Founder & Director",
    quote:
      "MkLuxeDivine was created to make metallic jewellery easier to access, better priced, and thoughtfully selected for customers who value both style and practicality.",
    image: "/images/mkluxe.jpg",
  },
}