import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, Loader2, MapPin, Plus, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { ServiceRequest } from "../backend.d";
import StarRating from "../components/StarRating";
import StatusBadge from "../components/StatusBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCancelRequest,
  useCreateServiceRequest,
  useGetCustomerRequests,
  useRateDealer,
} from "../hooks/useQueries";

type View = "landing" | "customer" | "dealer" | "tracker";

interface CustomerDashboardProps {
  onNavigate: (view: View) => void;
}

export default function CustomerDashboard({
  onNavigate,
}: CustomerDashboardProps) {
  const { identity } = useInternetIdentity();
  const { data: requests, isLoading } = useGetCustomerRequests();
  const createRequest = useCreateServiceRequest();
  const cancelRequest = useCancelRequest();
  const rateDealer = useRateDealer();

  const [newOpen, setNewOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("Car");
  const [tyreType, setTyreType] = useState("Tubeless");
  const [issue, setIssue] = useState("Puncture");
  const [ratingFor, setRatingFor] = useState<ServiceRequest | null>(null);
  const [ratingValue, setRatingValue] = useState(5);

  const principal = identity?.getPrincipal().toString();

  const handleCreate = async () => {
    if (!location.trim()) {
      toast.error("Enter your location");
      return;
    }
    try {
      await createRequest.mutateAsync({
        vehicleType,
        tyreType,
        issue,
        location,
      });
      toast.success("Request created successfully!");
      setNewOpen(false);
      setLocation("");
    } catch {
      toast.error("Failed to create request");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelRequest.mutateAsync(id);
      toast.success("Request cancelled");
    } catch {
      toast.error("Could not cancel request");
    }
  };

  const handleRate = async () => {
    if (!ratingFor) return;
    try {
      await rateDealer.mutateAsync({
        requestId: ratingFor.id,
        rating: ratingValue,
      });
      toast.success("Rating submitted!");
      setRatingFor(null);
    } catch {
      toast.error("Could not submit rating");
    }
  };

  const toggleBtn = (
    options: string[],
    current: string,
    setter: (v: string) => void,
  ) => (
    <div className="flex rounded-md overflow-hidden border border-border">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => setter(opt)}
          className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
            current === opt
              ? "bg-brand-blue text-white"
              : "bg-secondary text-muted-foreground hover:bg-muted"
          }`}
          data-ocid="form.toggle"
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            My Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {principal
              ? `Principal: ${principal.substring(0, 18)}...`
              : "Customer Account"}
          </p>
        </div>
        <Button
          className="bg-brand-blue text-white hover:opacity-90"
          onClick={() => setNewOpen(true)}
          data-ocid="customer.open_modal_button"
        >
          <Plus size={16} className="mr-2" /> New Request
        </Button>
      </div>

      {/* Go to dealer dashboard link */}
      <div className="mb-6 text-sm text-muted-foreground">
        Are you a service partner?{" "}
        <button
          type="button"
          className="text-brand-blue underline hover:opacity-80"
          onClick={() => onNavigate("dealer")}
          data-ocid="customer.link"
        >
          Switch to Partner Dashboard
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {["total", "pending", "accepted", "completed"].map((stat) => {
          const count =
            requests?.filter(
              (r) => stat === "total" || r.status.toLowerCase() === stat,
            ).length ?? 0;
          return (
            <Card key={stat} className="border-border">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold font-display text-brand-blue">
                  {count}
                </p>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">
                  {stat}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Requests list */}
      {isLoading ? (
        <div className="space-y-4" data-ocid="customer.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : !requests?.length ? (
        <Card className="border-border" data-ocid="customer.empty_state">
          <CardContent className="p-12 text-center">
            <Car size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-foreground mb-2">
              No service requests yet
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Got a tyre issue? Book a service in seconds.
            </p>
            <Button
              className="bg-brand-blue text-white hover:opacity-90"
              onClick={() => setNewOpen(true)}
              data-ocid="customer.primary_button"
            >
              Book Now
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              data-ocid={`customer.item.${i + 1}`}
            >
              <Card className="border-border hover:shadow-card transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground">
                          {req.vehicleType} — {req.issue}
                        </span>
                        <StatusBadge status={req.status} />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={12} />
                        <span className="truncate">{req.location}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Tyre: {req.tyreType} · ID: {req.id.substring(0, 12)}...
                      </p>
                      {req.customerRating && (
                        <div className="flex items-center gap-1">
                          <StarRating
                            value={Number(req.customerRating)}
                            readonly
                            size={14}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {req.status.toLowerCase() === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-white text-xs"
                          onClick={() => handleCancel(req.id)}
                          disabled={cancelRequest.isPending}
                          data-ocid={`customer.delete_button.${i + 1}`}
                        >
                          Cancel
                        </Button>
                      )}
                      {req.status.toLowerCase() === "completed" &&
                        !req.customerRating && (
                          <Button
                            size="sm"
                            className="bg-brand-yellow text-brand-yellow-dark hover:opacity-90 text-xs"
                            onClick={() => setRatingFor(req)}
                            data-ocid={`customer.edit_button.${i + 1}`}
                          >
                            <Star size={13} className="mr-1" /> Rate
                          </Button>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* New Request Modal */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md" data-ocid="customer.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-brand-blue">
              New Service Request
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                Location
              </p>
              <div className="relative">
                <MapPin
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Enter your address..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-8"
                  data-ocid="request.input"
                />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                Vehicle Type
              </p>
              {toggleBtn(["Car", "Bike", "SUV"], vehicleType, setVehicleType)}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                Tyre Type
              </p>
              {toggleBtn(["Tubeless", "Tube"], tyreType, setTyreType)}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                Issue
              </p>
              {toggleBtn(["Puncture", "Flat", "Damage"], issue, setIssue)}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewOpen(false)}
              data-ocid="request.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="bg-brand-blue text-white hover:opacity-90"
              onClick={handleCreate}
              disabled={createRequest.isPending}
              data-ocid="request.submit_button"
            >
              {createRequest.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Booking...
                </>
              ) : (
                "Book Service"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rating Modal */}
      <Dialog open={!!ratingFor} onOpenChange={(v) => !v && setRatingFor(null)}>
        <DialogContent className="sm:max-w-sm" data-ocid="rating.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-brand-blue">
              Rate Your Service
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4 text-center">
            <p className="text-muted-foreground text-sm">
              How was your experience?
            </p>
            <div className="flex justify-center">
              <StarRating
                value={ratingValue}
                onChange={setRatingValue}
                size={32}
              />
            </div>
            <p className="text-sm font-semibold text-foreground">
              {
                ["Terrible", "Bad", "Okay", "Good", "Excellent"][
                  ratingValue - 1
                ]
              }
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRatingFor(null)}
              data-ocid="rating.cancel_button"
            >
              Skip
            </Button>
            <Button
              className="bg-brand-blue text-white hover:opacity-90"
              onClick={handleRate}
              disabled={rateDealer.isPending}
              data-ocid="rating.confirm_button"
            >
              {rateDealer.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Submit Rating"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
