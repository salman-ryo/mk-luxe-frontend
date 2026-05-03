// app/contact/page.tsx

import Link from "next/link"

import {
  Mail,
  Phone,
  Instagram,
  Facebook,
  MapPin,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { contactPageData } from "@/lib/constants/contact-page-data"

import { siteConfig } from "@/lib/constants/site-config"

const iconMap = {
  mail: Mail,
  phone: Phone,
  instagram: Instagram,
  facebook: Facebook,
}

export default function ContactPage() {
  const { hero, form } = contactPageData

  return (
    <main className="min-h-screen bg-background text-foreground py-24 px-16">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-serif mb-4">
            {hero.title}
          </h1>

          <p className="text-xl text-muted-foreground tracking-widest uppercase">
            {hero.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="space-y-8">
            <h2 className="text-lg uppercase tracking-widest font-bold border-b border-primary/30 pb-4">
              {form.title}
            </h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">
                    Name
                  </label>

                  <Input
                    placeholder="Your full name"
                    className="bg-muted/20 border-border focus:border-primary rounded-none h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">
                    Email
                  </label>

                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="bg-muted/20 border-border focus:border-primary rounded-none h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">
                    Subject
                  </label>

                  <Input
                    placeholder="Inquiry subject"
                    className="bg-muted/20 border-border focus:border-primary rounded-none h-12"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">
                    Project Type
                  </label>

                  <Select>
                    <SelectTrigger className="bg-muted/20 border-border focus:border-primary rounded-none h-12 uppercase tracking-widest text-xs">
                      <SelectValue placeholder="Select Inquiry Type" />
                    </SelectTrigger>

                    <SelectContent className="bg-[#0a0a0c] border-primary/30">
                      {form.projectTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm uppercase tracking-widest text-muted-foreground">
                  Message
                </label>

                <Textarea
                  placeholder="How can we help you?"
                  className="bg-muted/20 border-border focus:border-primary rounded-none min-h-37 resize-none"
                />
              </div>

              <Button
                size="lg"
                className="w-full md:w-auto px-12 py-6 rounded-none uppercase tracking-widest font-bold text-base"
              >
                {form.submitButtonText}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-12">
            {/* Contact Cards */}
            <div className="space-y-8">
              <h2 className="text-lg uppercase tracking-widest font-bold border-b border-primary/30 pb-4">
                Contact Info
              </h2>

              <div className="bg-muted/20 border border-border/50 p-8 space-y-6">
                {siteConfig.socials
                  .filter((item) =>
                    ["mail", "phone", "instagram", "facebook"].includes(
                      item.icon
                    )
                  )
                  .map((item) => {
                    const Icon =
                      iconMap[item.icon as keyof typeof iconMap]

                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>

                          <span className="text-muted-foreground font-medium">
                            {item.label}
                          </span>
                        </div>

                        <Link href={item.href} target="_blank">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-none border-primary/30 text-xs uppercase tracking-widest hover:bg-primary hover:text-background h-8 px-4 bg-transparent"
                          >
                            {item.action}
                          </Button>
                        </Link>
                      </div>
                    )
                  })}

                {/* Support Info */}
                <div className="pt-6 border-t border-border/30 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-widest">
                    <Clock className="w-4 h-4" />

                    <span>{siteConfig.support.workingHours}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({
                      length: siteConfig.support.stars,
                    }).map((_, i) => (
                      <span
                        key={i}
                        className="text-primary text-[10px]"
                      >
                        ★
                      </span>
                    ))}

                    <span className="text-[10px] text-muted-foreground ml-2 uppercase tracking-widest">
                      {siteConfig.support.supportLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Location */}
            <div className="space-y-8">
              <h2 className="text-lg uppercase tracking-widest font-bold border-b border-primary/30 pb-4">
                {siteConfig.location.title}
              </h2>

              <Link
                href={siteConfig.location.mapUrl}
                target="_blank"
                className="block"
              >
                <div className="relative aspect-video bg-muted/40 border border-border/50 overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-[#0a0a0c]">
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "radial-gradient(#c4a484 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-full animate-pulse">
                      <MapPin className="text-background w-6 h-6" />
                    </div>

                    <span className="uppercase tracking-[0.4em] text-sm font-bold text-primary group-hover:scale-110 transition-transform">
                      {siteConfig.location.cta}
                    </span>

                    <p className="text-xs text-muted-foreground uppercase tracking-widest">
                      {siteConfig.location.address}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}