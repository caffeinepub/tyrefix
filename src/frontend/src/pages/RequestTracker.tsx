import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Car,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Search,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import StarRating from "../components/StarRating";
import StatusBadge from "../components/StatusBadge";
import { useGetServiceRequest } from "../hooks/useQueries";

const STATUS_STEPS = ["pending", "accepted", "completed"];

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock size={20} className="text-yellow-600" />,
  accepted: <Car size={20} className="text-brand-blue" />,
  completed: <CheckCircle2 size={20} className="text-green-600" />,
  cancelled: <XCircle size={20} className="text-gray-500" />,
};

export default function RequestTracker() {
  const [inputId, setInputId] = useState("");
  const [searchId, setSearchId] = useState("");
  const { data: request, isLoading, isError } = useGetServiceRequest(searchId);

  const handleSearch = () => {
    if (inputId.trim()) setSearchId(inputId.trim());
  };

  const currentStep = request
    ? STATUS_STEPS.indexOf(request.status.toLowerCase())
    : -1;

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <Search size={24} className="text-brand-blue" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Track Your Request
        </h1>
        <p className="text-muted-foreground mt-2">
          Enter your service request ID to check real-time status.
        </p>
      </motion.div>

      {/* Search */}
      <Card className="border-border mb-6" data-ocid="tracker.card">
        <CardContent className="p-5">
          <div className="flex gap-3">
            <Input
              placeholder="Enter Request ID..."
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
              data-ocid="tracker.search_input"
            />
            <Button
              className="bg-brand-blue text-white hover:opacity-90"
              onClick={handleSearch}
              disabled={isLoading}
              data-ocid="tracker.primary_button"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search size={16} />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading && (
        <Card className="border-border" data-ocid="tracker.loading_state">
          <CardContent className="p-8 text-center">
            <Loader2
              size={32}
              className="animate-spin text-brand-blue mx-auto mb-3"
            />
            <p className="text-muted-foreground">Looking up your request...</p>
          </CardContent>
        </Card>
      )}

      {isError && searchId && (
        <Card
          className="border-destructive bg-red-50"
          data-ocid="tracker.error_state"
        >
          <CardContent className="p-6 text-center">
            <XCircle size={32} className="text-destructive mx-auto mb-3" />
            <p className="font-semibold text-destructive">Request not found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please check the ID and try again.
            </p>
          </CardContent>
        </Card>
      )}

      {request && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-border shadow-card">
            <CardContent className="p-6 space-y-6">
              {/* Status header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Request ID</p>
                  <p className="font-mono text-sm font-medium text-foreground">
                    {request.id}
                  </p>
                </div>
                <StatusBadge status={request.status} />
              </div>

              {/* Progress steps */}
              {request.status.toLowerCase() !== "cancelled" && (
                <div className="flex items-center gap-2">
                  {STATUS_STEPS.map((step, i) => (
                    <div
                      key={step}
                      className="flex items-center flex-1 last:flex-none"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                          i <= currentStep
                            ? "border-brand-blue bg-brand-blue text-white"
                            : "border-border bg-secondary text-muted-foreground"
                        }`}
                      >
                        {i < currentStep ? "✓" : i + 1}
                      </div>
                      <div className="flex-1 last:hidden">
                        <div
                          className={`h-1 mx-1 rounded transition-colors ${
                            i < currentStep ? "bg-brand-blue" : "bg-border"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Vehicle
                  </p>
                  <p className="font-medium text-foreground">
                    {request.vehicleType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Issue</p>
                  <p className="font-medium text-foreground">{request.issue}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Tyre Type
                  </p>
                  <p className="font-medium text-foreground">
                    {request.tyreType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Location
                  </p>
                  <p className="font-medium text-foreground flex items-center gap-1">
                    <MapPin size={12} className="text-brand-blue" />
                    {request.location}
                  </p>
                </div>
              </div>

              {request.customerRating && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">
                    Your Rating
                  </p>
                  <StarRating value={Number(request.customerRating)} readonly />
                </div>
              )}

              {/* Status message */}
              <div
                className={`rounded-lg p-4 text-sm ${
                  request.status === "pending"
                    ? "bg-yellow-50 text-yellow-800"
                    : request.status === "accepted"
                      ? "bg-blue-50 text-blue-800"
                      : request.status === "completed"
                        ? "bg-green-50 text-green-800"
                        : "bg-gray-50 text-gray-600"
                }`}
              >
                {STATUS_ICONS[request.status.toLowerCase()]}
                <span className="ml-2 font-medium">
                  {request.status === "pending" &&
                    "Your request is waiting for a nearby partner to accept."}
                  {request.status === "accepted" &&
                    "A service partner is on their way to you!"}
                  {request.status === "completed" &&
                    "Service completed! We hope you had a great experience."}
                  {request.status === "cancelled" &&
                    "This request was cancelled."}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </main>
  );
}
