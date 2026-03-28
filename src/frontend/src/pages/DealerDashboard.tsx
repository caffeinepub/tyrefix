import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Car,
  CheckCircle2,
  ChevronRight,
  Loader2,
  MapPin,
  Store,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import StarRating from "../components/StarRating";
import StatusBadge from "../components/StatusBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAcceptRequest,
  useCompleteRequest,
  useGetDealerRequests,
  useGetOpenRequests,
  useRegisterDealer,
} from "../hooks/useQueries";

export default function DealerDashboard() {
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: openRequests, isLoading: loadingOpen } = useGetOpenRequests();
  const { data: myRequests, isLoading: loadingMine } = useGetDealerRequests();
  const acceptRequest = useAcceptRequest();
  const completeRequest = useCompleteRequest();
  const registerDealer = useRegisterDealer();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [showRegForm, setShowRegForm] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !address.trim() || !phone.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await registerDealer.mutateAsync({ name, address, phone });
      toast.success("Registered as service partner!");
      setShowRegForm(false);
    } catch {
      toast.error("Registration failed. You may already be registered.");
      setShowRegForm(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await acceptRequest.mutateAsync(id);
      toast.success("Request accepted!");
    } catch {
      toast.error("Could not accept request");
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeRequest.mutateAsync(id);
      toast.success("Request marked as complete!");
    } catch {
      toast.error("Could not complete request");
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Store size={56} className="mx-auto text-brand-blue mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Partner Portal
        </h2>
        <p className="text-muted-foreground mb-6">
          Login to manage service requests and grow your business.
        </p>
        <p className="text-sm text-muted-foreground">
          Please login using the button in the top navigation.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Partner Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage incoming tyre service requests
          </p>
        </div>
        <Button
          variant="outline"
          className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white shrink-0"
          onClick={() => setShowRegForm(!showRegForm)}
          data-ocid="dealer.open_modal_button"
        >
          <Store size={15} className="mr-2" />{" "}
          {showRegForm ? "Hide Form" : "Register / Update Profile"}
        </Button>
      </div>

      {/* No requests banner */}
      {!myRequests?.length && !showRegForm && (
        <Card className="border-brand-blue bg-blue-50 mb-6">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-brand-blue">
                Complete your partner registration
              </p>
              <p className="text-sm text-muted-foreground">
                Set up your profile to start accepting jobs.
              </p>
            </div>
            <Button
              className="bg-brand-blue text-white hover:opacity-90 shrink-0"
              onClick={() => setShowRegForm(true)}
              data-ocid="dealer.primary_button"
            >
              Register <ChevronRight size={16} className="ml-1" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Registration Form */}
      {showRegForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg text-brand-blue">
                Partner Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Business Name
                  </p>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. QuickFix Tyres"
                    data-ocid="dealer.input"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Address
                  </p>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Shop address"
                    data-ocid="dealer.input"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Phone Number
                  </p>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    data-ocid="dealer.input"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  className="bg-brand-blue text-white hover:opacity-90"
                  onClick={handleRegister}
                  disabled={registerDealer.isPending}
                  data-ocid="dealer.submit_button"
                >
                  {registerDealer.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Registering...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRegForm(false)}
                  data-ocid="dealer.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {["open", "accepted", "completed", "cancelled"].map((stat) => {
          const list =
            stat === "open" ? (openRequests ?? []) : (myRequests ?? []);
          const count =
            stat === "open"
              ? list.length
              : list.filter((r) => r.status.toLowerCase() === stat).length;
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

      {/* Tabs */}
      <Tabs defaultValue="open">
        <TabsList className="mb-4">
          <TabsTrigger value="open" data-ocid="dealer.tab">
            Open Requests ({openRequests?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="mine" data-ocid="dealer.tab">
            My Requests ({myRequests?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open">
          {loadingOpen ? (
            <div className="space-y-4" data-ocid="dealer.loading_state">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : !openRequests?.length ? (
            <Card className="border-border" data-ocid="dealer.empty_state">
              <CardContent className="p-12 text-center">
                <CheckCircle2
                  size={40}
                  className="mx-auto text-muted-foreground mb-3"
                />
                <p className="font-semibold text-foreground">
                  No open requests right now
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  New customer requests will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {openRequests.map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  data-ocid={`open.item.${i + 1}`}
                >
                  <Card className="border-border hover:shadow-card transition-shadow">
                    <CardContent className="p-5 flex items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {req.vehicleType} — {req.issue}
                          </span>
                          <StatusBadge status={req.status} />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin size={12} />
                          <span className="truncate">{req.location}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Tyre: {req.tyreType}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-brand-blue text-white hover:opacity-90 shrink-0"
                        onClick={() => handleAccept(req.id)}
                        disabled={acceptRequest.isPending}
                        data-ocid={`open.primary_button.${i + 1}`}
                      >
                        Accept Job
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mine">
          {loadingMine ? (
            <div className="space-y-4" data-ocid="dealer.loading_state">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : !myRequests?.length ? (
            <Card className="border-border" data-ocid="dealer.empty_state">
              <CardContent className="p-12 text-center">
                <Car size={40} className="mx-auto text-muted-foreground mb-3" />
                <p className="font-semibold text-foreground">
                  No accepted requests yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  data-ocid={`mine.item.${i + 1}`}
                >
                  <Card className="border-border hover:shadow-card transition-shadow">
                    <CardContent className="p-5 flex items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {req.vehicleType} — {req.issue}
                          </span>
                          <StatusBadge status={req.status} />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin size={12} />
                          <span className="truncate">{req.location}</span>
                        </div>
                        {req.customerRating && (
                          <div className="flex items-center gap-1">
                            <StarRating
                              value={Number(req.customerRating)}
                              readonly
                              size={13}
                            />
                          </div>
                        )}
                      </div>
                      {req.status.toLowerCase() === "accepted" && (
                        <Button
                          size="sm"
                          className="bg-green-600 text-white hover:bg-green-700 shrink-0"
                          onClick={() => handleComplete(req.id)}
                          disabled={completeRequest.isPending}
                          data-ocid={`mine.primary_button.${i + 1}`}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
