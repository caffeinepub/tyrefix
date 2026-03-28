import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Store, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type View = "landing" | "customer" | "dealer" | "tracker";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (view: View) => void;
  defaultRole?: "customer" | "dealer";
}

export default function AuthModal({
  open,
  onClose,
  onSuccess,
  defaultRole,
}: AuthModalProps) {
  const [selectedRole, setSelectedRole] = useState<"customer" | "dealer">(
    defaultRole ?? "customer",
  );
  const { login, isLoggingIn } = useInternetIdentity();

  const handleLogin = async () => {
    try {
      await login();
      toast.success("Logged in successfully!");
      onSuccess(selectedRole === "dealer" ? "dealer" : "customer");
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md" data-ocid="auth.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-brand-blue">
            Welcome to TyreFix
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Login or create an account to book tyre services.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <p className="text-sm font-medium text-foreground">I am a...</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                selectedRole === "customer"
                  ? "border-brand-blue bg-blue-50"
                  : "border-border hover:border-brand-blue/50"
              }`}
              onClick={() => setSelectedRole("customer")}
              data-ocid="auth.radio"
            >
              <User
                size={28}
                className={
                  selectedRole === "customer"
                    ? "text-brand-blue"
                    : "text-muted-foreground"
                }
              />
              <span
                className={`text-sm font-semibold ${selectedRole === "customer" ? "text-brand-blue" : "text-foreground"}`}
              >
                Customer
              </span>
              <span className="text-xs text-muted-foreground text-center">
                Book tyre repair services
              </span>
            </button>
            <button
              type="button"
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                selectedRole === "dealer"
                  ? "border-brand-blue bg-blue-50"
                  : "border-border hover:border-brand-blue/50"
              }`}
              onClick={() => setSelectedRole("dealer")}
              data-ocid="auth.radio"
            >
              <Store
                size={28}
                className={
                  selectedRole === "dealer"
                    ? "text-brand-blue"
                    : "text-muted-foreground"
                }
              />
              <span
                className={`text-sm font-semibold ${selectedRole === "dealer" ? "text-brand-blue" : "text-foreground"}`}
              >
                Service Partner
              </span>
              <span className="text-xs text-muted-foreground text-center">
                Manage repair requests
              </span>
            </button>
          </div>

          <Button
            className="w-full bg-brand-blue text-white hover:opacity-90 font-semibold"
            onClick={handleLogin}
            disabled={isLoggingIn}
            data-ocid="auth.submit_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
              </>
            ) : (
              "Continue with Internet Identity"
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Secure, decentralized authentication — no password needed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
