import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import AuthModal from "./AuthModal";

type View = "landing" | "customer" | "dealer" | "tracker";

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export default function Header({ currentView, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { identity, clear } = useInternetIdentity();
  const isLoggedIn = !!identity;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 justify-between">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2 font-display font-bold text-xl text-brand-blue"
          onClick={() => onNavigate("landing")}
          data-ocid="nav.link"
        >
          <img
            src="/assets/generated/tyrefix-logo-transparent.dim_80x80.png"
            alt="TyreFix logo"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span>TyreFix</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <button
            type="button"
            className={`hover:text-brand-blue transition-colors ${
              currentView === "landing" ? "text-brand-blue" : ""
            }`}
            onClick={() => onNavigate("landing")}
            data-ocid="nav.link"
          >
            Home
          </button>
          <button
            type="button"
            className="hover:text-brand-blue transition-colors"
            onClick={() => {
              const el = document.getElementById("services-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              onNavigate("landing");
            }}
            data-ocid="nav.link"
          >
            Services
          </button>
          <button
            type="button"
            className={`hover:text-brand-blue transition-colors ${
              currentView === "tracker" ? "text-brand-blue" : ""
            }`}
            onClick={() => onNavigate("tracker")}
            data-ocid="nav.link"
          >
            Track Request
          </button>
          <button
            type="button"
            className={`hover:text-brand-blue transition-colors ${
              currentView === "dealer" ? "text-brand-blue" : ""
            }`}
            onClick={() => onNavigate("dealer")}
            data-ocid="nav.link"
          >
            Partner Portal
          </button>
          <button
            type="button"
            className="hover:text-brand-blue transition-colors"
            onClick={() => {
              const el = document.getElementById("support-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              onNavigate("landing");
            }}
            data-ocid="nav.link"
          >
            Support
          </button>
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                onClick={() => onNavigate("customer")}
                data-ocid="nav.link"
              >
                My Dashboard
              </Button>
              <Button
                size="sm"
                className="bg-destructive text-destructive-foreground hover:opacity-90"
                onClick={() => clear()}
                data-ocid="nav.link"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                className="bg-brand-yellow text-brand-yellow-dark font-semibold hover:opacity-90"
                onClick={() => setAuthOpen(true)}
                data-ocid="nav.primary_button"
              >
                Book Now
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                onClick={() => setAuthOpen(true)}
                data-ocid="nav.secondary_button"
              >
                Login / Signup
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          data-ocid="nav.toggle"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 flex flex-col gap-4">
          <button
            type="button"
            className="text-sm text-left font-medium"
            onClick={() => {
              onNavigate("landing");
              setMenuOpen(false);
            }}
            data-ocid="nav.link"
          >
            Home
          </button>
          <button
            type="button"
            className="text-sm text-left font-medium"
            onClick={() => {
              onNavigate("tracker");
              setMenuOpen(false);
            }}
            data-ocid="nav.link"
          >
            Track Request
          </button>
          <button
            type="button"
            className="text-sm text-left font-medium"
            onClick={() => {
              onNavigate("dealer");
              setMenuOpen(false);
            }}
            data-ocid="nav.link"
          >
            Partner Portal
          </button>
          {isLoggedIn ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onNavigate("customer");
                  setMenuOpen(false);
                }}
                data-ocid="nav.link"
              >
                My Dashboard
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  clear();
                  setMenuOpen(false);
                }}
                data-ocid="nav.link"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="bg-brand-yellow text-brand-yellow-dark font-semibold"
              onClick={() => {
                setAuthOpen(true);
                setMenuOpen(false);
              }}
              data-ocid="nav.primary_button"
            >
              Login / Book Now
            </Button>
          )}
        </div>
      )}

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(view) => {
          setAuthOpen(false);
          onNavigate(view);
        }}
      />
    </header>
  );
}
