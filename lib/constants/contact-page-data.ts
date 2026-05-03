// lib/constants/contact-page-data.ts

export type ContactPageData = {
  hero: {
    title: string
    subtitle: string
  }

  form: {
    title: string
    submitButtonText: string

    projectTypes: {
      label: string
      value: string
    }[]
  }
}

export const contactPageData: ContactPageData = {
  hero: {
    title: "Contact Us",

    subtitle: "We're here for help.",
  },

  form: {
    title: "Send a Message",

    submitButtonText: "Submit",

    projectTypes: [
      {
        label: "Order Support",
        value: "order",
      },

      {
        label: "Custom Jewelry",
        value: "custom",
      },

      {
        label: "Bulk Inquiry",
        value: "bulk",
      },

      {
        label: "Other",
        value: "other",
      },
    ],
  },
}