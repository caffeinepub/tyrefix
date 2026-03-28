import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);
  return (
    <footer className="bg-foreground text-white" id="support-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/tyrefix-logo-transparent.dim_80x80.png"
              alt="TyreFix"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-display font-bold text-xl text-brand-yellow">
              TyreFix
            </span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            India's fastest tyre puncture and repair service marketplace.
            On-demand, reliable, affordable.
          </p>
        </div>

        {/* Services */}
        <div className="space-y-3">
          <h4 className="font-semibold text-brand-yellow text-sm uppercase tracking-wider">
            Services
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Puncture Repair</li>
            <li>Flat Tyre Fix</li>
            <li>Tyre Replacement</li>
            <li>Wheel Balancing</li>
            <li>Roadside Assistance</li>
          </ul>
        </div>

        {/* Company */}
        <div className="space-y-3">
          <h4 className="font-semibold text-brand-yellow text-sm uppercase tracking-wider">
            Company
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>About Us</li>
            <li>Partner With Us</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-3">
          <h4 className="font-semibold text-brand-yellow text-sm uppercase tracking-wider">
            Contact
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <MapPin size={14} /> Mumbai, Maharashtra
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} /> support@tyrefix.in
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <span>© {year} TyreFix. All rights reserved.</span>
          <span>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-brand-yellow transition-colors"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
