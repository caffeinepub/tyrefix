import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import AuthModal from "../components/AuthModal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateServiceRequest,
  useGetActiveDealers,
} from "../hooks/useQueries";

type View = "landing" | "customer" | "dealer" | "tracker";

const STATIC_PARTNERS = [
  {
    id: "s1",
    name: "QuickFix Tyre Centre",
    address: "Andheri West, Mumbai",
    rating: 4.8,
    totalRatings: 312n,
    image: "/assets/generated/partner-shop-1.dim_400x250.jpg",
    distance: "1.2 km",
  },
  {
    id: "s2",
    name: "Speedy Wheel Works",
    address: "Bandra East, Mumbai",
    rating: 4.6,
    totalRatings: 198n,
    image: "/assets/generated/partner-shop-2.dim_400x250.jpg",
    distance: "2.4 km",
  },
  {
    id: "s3",
    name: "RoadSafe Mobile Service",
    address: "Powai, Mumbai",
    rating: 4.9,
    totalRatings: 451n,
    image: "/assets/generated/partner-shop-3.dim_400x250.jpg",
    distance: "3.1 km",
  },
  {
    id: "s4",
    name: "Premier Tyre Studio",
    address: "Juhu, Mumbai",
    rating: 4.7,
    totalRatings: 264n,
    image: "/assets/generated/partner-shop-4.dim_400x250.jpg",
    distance: "4.0 km",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Submit Your Request",
    desc: "Enter your location, vehicle type, and issue. Takes less than 60 seconds.",
    icon: <MapPin size={32} className="text-brand-blue" />,
  },
  {
    step: "02",
    title: "Partner Accepts",
    desc: "Nearest verified service partner accepts your request and heads your way.",
    icon: <CheckCircle2 size={32} className="text-brand-blue" />,
  },
  {
    step: "03",
    title: "Job Done, Rate & Pay",
    desc: "Tyre fixed in minutes. Rate your experience and pay seamlessly.",
    icon: <Star size={32} className="text-brand-blue" />,
  },
];

const FEATURES = [
  {
    icon: <Zap size={28} className="text-brand-blue" />,
    title: "Fast Response",
    desc: "Average arrival time under 20 minutes",
  },
  {
    icon: <Shield size={28} className="text-brand-blue" />,
    title: "Expert Techs",
    desc: "Verified, trained tyre professionals",
  },
  {
    icon: <DollarSign size={28} className="text-brand-blue" />,
    title: "Fair Pricing",
    desc: "Transparent rates, no hidden charges",
  },
  {
    icon: <Clock size={28} className="text-brand-blue" />,
    title: "24/7 Support",
    desc: "Round-the-clock customer assistance",
  },
];

interface LandingPageProps {
  onNavigate: (view: View) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const { data: dealers } = useGetActiveDealers();
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const [authOpen, setAuthOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("Car");
  const [tyreType, setTyreType] = useState("Tubeless");
  const [issue, setIssue] = useState("Puncture");
  const createRequest = useCreateServiceRequest();

  const displayPartners =
    dealers && dealers.length > 0
      ? dealers.slice(0, 4).map((d, i) => ({
          id: d.id.toString(),
          name: d.name,
          address: d.address,
          rating: d.rating,
          totalRatings: d.totalRatings,
          image: STATIC_PARTNERS[i % STATIC_PARTNERS.length].image,
          distance: STATIC_PARTNERS[i % STATIC_PARTNERS.length].distance,
        }))
      : STATIC_PARTNERS;

  const handleBookNow = async () => {
    if (!isLoggedIn) {
      setAuthOpen(true);
      return;
    }
    if (!location.trim()) {
      toast.error("Please enter your location");
      return;
    }
    try {
      await createRequest.mutateAsync({
        vehicleType,
        tyreType,
        issue,
        location,
      });
      toast.success("Service request created! Redirecting to dashboard...");
      setTimeout(() => onNavigate("customer"), 1200);
    } catch {
      toast.error("Failed to create request. Please try again.");
    }
  };

  const toggle = (
    options: string[],
    current: string,
    setter: (v: string) => void,
    ocidPrefix: string,
  ) => (
    <div className="flex rounded-md overflow-hidden border border-white/30">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => setter(opt)}
          className={`flex-1 px-3 py-1.5 text-sm font-medium transition-colors ${
            current === opt
              ? "bg-brand-yellow text-brand-yellow-dark"
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
          data-ocid={`${ocidPrefix}.toggle`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <main>
      {/* Hero */}
      <section
        className="relative min-h-[600px] flex items-center"
        id="services-section"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-tyre-service.dim_1400x700.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mb-10"
          >
            <p className="text-brand-yellow font-semibold text-sm uppercase tracking-widest mb-3">
              India's #1 Tyre Service Marketplace
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Tyre Trouble?
              <br />
              Help Is On The Way.
            </h1>
            <p className="text-white/80 text-lg">
              Instant puncture repair, flat tyre fix &amp; roadside assistance
              &mdash; on demand, anywhere.
            </p>
          </motion.div>

          {/* Service Request Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card
              className="max-w-2xl bg-brand-blue border-0 text-white shadow-hero"
              data-ocid="booking.card"
            >
              <CardContent className="p-6 space-y-4">
                <h3 className="font-display font-bold text-lg">
                  Book Tyre Service Now
                </h3>
                <div>
                  <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
                    Your Location
                  </p>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                    />
                    <Input
                      placeholder="Enter address or landmark..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-brand-yellow"
                      data-ocid="booking.input"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
                      Vehicle
                    </p>
                    {toggle(
                      ["Car", "Bike", "SUV"],
                      vehicleType,
                      setVehicleType,
                      "vehicle",
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
                      Tyre Type
                    </p>
                    {toggle(
                      ["Tubeless", "Tube"],
                      tyreType,
                      setTyreType,
                      "tyre",
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-1.5">
                      Issue
                    </p>
                    {toggle(
                      ["Puncture", "Flat", "Damage"],
                      issue,
                      setIssue,
                      "issue",
                    )}
                  </div>
                </div>
                <Button
                  className="w-full bg-brand-yellow text-brand-yellow-dark font-bold text-base hover:opacity-90 h-11"
                  onClick={handleBookNow}
                  disabled={createRequest.isPending}
                  data-ocid="booking.submit_button"
                >
                  {createRequest.isPending ? "Booking..." : "Book Service Now"}
                  {!createRequest.isPending && (
                    <ChevronRight size={18} className="ml-1" />
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-muted-foreground mt-2">
              Get help in 3 easy steps
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
                  {item.icon}
                </div>
                <div className="inline-block bg-brand-yellow text-brand-yellow-dark text-xs font-bold px-2 py-0.5 rounded-full">
                  Step {item.step}
                </div>
                <h3 className="font-display font-bold text-lg text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Service Partners */}
      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Nearby Service Partners
            </h2>
            <p className="text-muted-foreground mt-2">
              Verified professionals ready to help you
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayPartners.map((partner, i) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                data-ocid={`partners.item.${i + 1}`}
              >
                <Card className="overflow-hidden hover:shadow-card transition-shadow border-border">
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="w-full h-40 object-cover"
                  />
                  <CardContent className="p-4 space-y-2">
                    <h4 className="font-semibold text-sm text-foreground line-clamp-1">
                      {partner.name}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={12} />
                      <span className="line-clamp-1">{partner.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star
                          size={13}
                          className="fill-brand-yellow text-brand-yellow"
                        />
                        <span className="text-sm font-semibold text-foreground">
                          {partner.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({Number(partner.totalRatings)})
                        </span>
                      </div>
                      <span className="text-xs text-brand-blue font-medium">
                        {partner.distance}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white text-xs mt-1"
                      onClick={() =>
                        isLoggedIn ? onNavigate("customer") : setAuthOpen(true)
                      }
                      data-ocid="partners.button"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Why Choose TyreFix?
            </h2>
            <p className="text-muted-foreground mt-2">
              Built for speed, trust, and convenience
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center space-y-3 p-6 rounded-xl bg-secondary border border-border hover:shadow-card transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-sm text-foreground">
                  {feat.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-brand-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Got a flat tyre? We're on our way.
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Join 50,000+ satisfied customers who trust TyreFix every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-brand-yellow text-brand-yellow-dark font-bold hover:opacity-90"
              onClick={() =>
                isLoggedIn ? onNavigate("customer") : setAuthOpen(true)
              }
              data-ocid="cta.primary_button"
            >
              Book a Service Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-brand-blue"
              onClick={() => onNavigate("dealer")}
              data-ocid="cta.secondary_button"
            >
              <Phone size={16} className="mr-2" />
              Become a Partner
            </Button>
          </div>
        </div>
      </section>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(view) => {
          setAuthOpen(false);
          onNavigate(view);
        }}
      />
    </main>
  );
}
