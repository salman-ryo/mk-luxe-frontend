import { Mail, Phone, Instagram, Facebook, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-12 pb-24">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-serif mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground tracking-widest uppercase">We're here for help.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="space-y-8">
            <h2 className="text-lg uppercase tracking-widest font-bold border-b border-primary/30 pb-4">
              Send a Message
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">Name</label>
                  <Input
                    placeholder="Your full name"
                    className="bg-muted/20 border-border focus:border-primary rounded-none h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="bg-muted/20 border-border focus:border-primary rounded-none h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">Subject</label>
                  <Input
                    placeholder="Inquiry subject"
                    className="bg-muted/20 border-border focus:border-primary rounded-none h-12"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm uppercase tracking-widest text-muted-foreground">Project Type</label>
                  <Select>
                    <SelectTrigger className="bg-muted/20 border-border focus:border-primary rounded-none h-12 uppercase tracking-widest text-xs">
                      <SelectValue placeholder="Select Inquiry Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0c] border-primary/30">
                      <SelectItem value="order">Order Support</SelectItem>
                      <SelectItem value="custom">Custom Jewelry</SelectItem>
                      <SelectItem value="bulk">Bulk Inquiry</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm uppercase tracking-widest text-muted-foreground">Message</label>
                <Textarea
                  placeholder="How can we help you?"
                  className="bg-muted/20 border-border focus:border-primary rounded-none min-h-[150px] resize-none"
                />
              </div>

              <Button
                size="lg"
                className="w-full md:w-auto px-12 py-6 rounded-none uppercase tracking-widest font-bold text-base"
              >
                Submit
              </Button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-12">
            {/* Info Cards */}
            <div className="space-y-8">
              <h2 className="text-lg uppercase tracking-widest font-bold border-b border-primary/30 pb-4">
                Contact Info
              </h2>
              <div className="bg-muted/20 border border-border/50 p-8 space-y-6">
                {[
                  { icon: Mail, label: "info@noxus.com", action: "Email us" },
                  { icon: Phone, label: "+1 (555) 123-667", action: "WhatsApp" },
                  { icon: Instagram, label: "@noxusjewelry", action: "Instagram" },
                  { icon: Facebook, label: "facebook.com/noxus", action: "Facebook" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground font-medium">{item.label}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-none border-primary/30 text-xs uppercase tracking-widest hover:bg-primary hover:text-background h-8 px-4 bg-transparent"
                    >
                      {item.action}
                    </Button>
                  </div>
                ))}

                <div className="pt-6 border-t border-border/30">
                  <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">
                    Mon - Fri: 9:00 AM - 6:00 PM
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-primary text-[10px]">
                        ★
                      </span>
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-2 uppercase tracking-widest">
                      24/7 Support
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Location */}
            <div className="space-y-8">
              <h2 className="text-lg uppercase tracking-widest font-bold border-b border-primary/30 pb-4">
                Opening Hours
              </h2>
              <div className="relative aspect-video bg-muted/40 border border-border/50 overflow-hidden group cursor-pointer">
                {/* Mock Map Background */}
                <div className="absolute inset-0 bg-[#0a0a0c]">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: "radial-gradient(#c4a484 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-full animate-pulse">
                    <MapPin className="text-background w-6 h-6" />
                  </div>
                  <span className="uppercase tracking-[0.4em] text-sm font-bold text-primary group-hover:scale-110 transition-transform">
                    Find Our Store
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
