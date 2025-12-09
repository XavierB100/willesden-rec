import { Button } from "@/components/ui/Button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-vintage-cream">
            {/* Header */}
            <div className="bg-vintage-moss text-vintage-cream py-16 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Visit Our Yard</h1>
                <p className="text-vintage-cream/80 max-w-2xl mx-auto font-sans">
                    Come visualize our stock in person. We are open 6 days a week.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Info Column */}
                <div className="space-y-10">

                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold text-vintage-charcoal">Contact Details</h2>
                        <div className="space-y-4 font-sans text-vintage-charcoal/80">
                            <div className="flex items-start">
                                <MapPin className="w-6 h-6 mr-4 text-vintage-gold flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-vintage-charcoal">Willesden Reclamation</p>
                                    <p>71 High Road</p>
                                    <p>London</p>
                                    <p>NW10 2SU</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Phone className="w-6 h-6 mr-4 text-vintage-gold flex-shrink-0" />
                                <p>07907 020 909</p>
                            </div>
                            <div className="flex items-center">
                                <Mail className="w-6 h-6 mr-4 text-vintage-gold flex-shrink-0" />
                                <p>info@willesdenreclamation.co.uk</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-serif font-bold text-vintage-charcoal">Opening Hours</h2>
                        <div className="space-y-2 font-sans text-vintage-charcoal/80">
                            <div className="flex justify-between max-w-xs border-b border-vintage-charcoal/10 pb-2">
                                <span>Monday - Friday</span>
                                <span className="font-semibold">8:00 AM - 5:00 PM</span>
                            </div>
                            <div className="flex justify-between max-w-xs border-b border-vintage-charcoal/10 pb-2">
                                <span>Saturday</span>
                                <span className="font-semibold">10:00 AM - 4:00 PM</span>
                            </div>
                            <div className="flex justify-between max-w-xs pb-2 text-vintage-charcoal/50">
                                <span>Sunday</span>
                                <span>Closed</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Map Column */}
                <div className="h-[400px] bg-vintage-charcoal/5 rounded-md overflow-hidden relative">
                    {/* Placeholder for Google Map Embed */}
                    <div className="absolute inset-0 flex items-center justify-center text-vintage-charcoal/40 font-sans">
                        <span className="text-sm border border-current px-4 py-2 rounded">Map Component Loading...</span>
                    </div>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2481.595931215467!2d-0.24523998407421875!3d51.53901897964036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876104dd2b1b1b1%3A0x1b1b1b1b1b1b1b1b!2s71%20High%20Rd%2C%20London%20NW10%202SU!5e0!3m2!1sen!2suk!4v1620000000000!5m2!1sen!2suk"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0 opacity-80 hover:opacity-100 transition-opacity"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
