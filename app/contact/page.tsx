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
    <main className="min-h-screen bg-background text-foreground py-16 px-4 md:py-24 md:px-16">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-3 md:mb-4">
            {hero.title}
          </h1>

          <p className="text-sm sm:text-base md:text-xl text-muted-foreground tracking-widest uppercase">
            {hero.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Contact Form */}
          <div className="space-y-6 md:space-y-8">
            <h2 className="text-base md:text-lg uppercase tracking-widest font-bold border-b border-primary/30 pb-3 md:pb-4">
              {form.title}
            </h2>

            <form className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground">
                    Name
                  </label>

                  <Input
                    placeholder="Your full name"
                    className="bg-muted/20 border-border focus:border-primary rounded-none h-10 md:h-12 text-sm"
                  />
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground">
                    Email
                  </label>

                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="bg-muted/20 border-border focus:border-primary rounded-none h-10 md:h-12 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground">
                    Subject
                  </label>

                  <Input
                    placeholder="Inquiry subject"
                    className="bg-muted/20 border-border focus:border-primary rounded-none h-10 md:h-12 text-sm"
                  />
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground">
                    Project Type
                  </label>

                  <Select>
                    <SelectTrigger className="bg-muted/20 border-border focus:border-primary rounded-none h-10 md:h-12 uppercase tracking-widest text-[10px] md:text-xs">
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

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground">
                  Message
                </label>

                <Textarea
                  placeholder="How can we help you?"
                  className="bg-muted/20 border-border focus:border-primary rounded-none min-h-24 md:min-h-37 resize-none text-sm"
                />
              </div>

              <Button
                size="lg"
                className="w-full md:w-auto px-8 md:px-12 py-5 md:py-6 rounded-none uppercase tracking-widest font-bold text-sm md:text-base mt-2"
              >
                {form.submitButtonText}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-10 md:space-y-12 mt-4 md:mt-0">
            {/* Contact Cards */}
            <div className="space-y-6 md:space-y-8">
              <h2 className="text-base md:text-lg uppercase tracking-widest font-bold border-b border-primary/30 pb-3 md:pb-4">
                Contact Info
              </h2>

              <div className="bg-muted/20 border border-border/50 p-5 sm:p-6 md:p-8 space-y-4 md:space-y-6">
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
                        className="flex items-center justify-between group gap-2"
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-8 h-8 md:w-10 md:h-10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
                            <Icon className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                          </div>

                          <span className="text-muted-foreground font-medium text-sm md:text-base truncate">
                            {item.label}
                          </span>
                        </div>

                        <Link href={item.href} target="_blank" className="shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-none border-primary/30 text-[10px] md:text-xs uppercase tracking-widest hover:bg-primary hover:text-background h-7 md:h-8 px-3 md:px-4 bg-transparent"
                          >
                            {item.action}
                          </Button>
                        </Link>
                      </div>
                    )
                  })}

                {/* Support Info */}
                <div className="pt-4 md:pt-6 border-t border-border/30 space-y-2 md:space-y-3">
                  <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground uppercase tracking-widest">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />

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
            <div className="space-y-6 md:space-y-8">
              <h2 className="text-base md:text-lg uppercase tracking-widest font-bold border-b border-primary/30 pb-3 md:pb-4">
                {siteConfig.location.title}
              </h2>

              <Link
                href={siteConfig.location.mapUrl}
                target="_blank"
                className="block"
              >
                <div className="relative aspect-square sm:aspect-video md:aspect-video bg-muted/40 border border-border/50 overflow-hidden group cursor-pointer">
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

                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 md:space-y-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary flex items-center justify-center rounded-full animate-pulse">
                      <MapPin className="text-background w-5 h-5 md:w-6 md:h-6" />
                    </div>

                    <span className="uppercase tracking-[0.3em] md:tracking-[0.4em] text-xs md:text-sm font-bold text-primary group-hover:scale-110 transition-transform">
                      {siteConfig.location.cta}
                    </span>

                    <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest text-center px-4">
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