import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NewServiceRequest } from "../backend.d";
import { useActor } from "./useActor";

export function useGetActiveDealers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["activeDealers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveDealers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCustomerRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["customerRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomerRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDealerRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["dealerRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDealerRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOpenRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["openRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOpenRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetServiceRequest(requestId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["serviceRequest", requestId],
    queryFn: async () => {
      if (!actor || !requestId) return null;
      return actor.getServiceRequest(requestId);
    },
    enabled: !!actor && !isFetching && !!requestId,
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["callerUserRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateServiceRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (request: NewServiceRequest) => {
      if (!actor) throw new Error("Not connected");
      return actor.createServiceRequest(request);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customerRequests"] });
      qc.invalidateQueries({ queryKey: ["openRequests"] });
    },
  });
}

export function useAcceptRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.acceptRequest(requestId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["openRequests"] });
      qc.invalidateQueries({ queryKey: ["dealerRequests"] });
    },
  });
}

export function useCompleteRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.completeRequest(requestId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dealerRequests"] });
    },
  });
}

export function useCancelRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelRequest(requestId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customerRequests"] });
    },
  });
}

export function useRateDealer() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      requestId,
      rating,
    }: { requestId: string; rating: number }) => {
      if (!actor) throw new Error("Not connected");
      return actor.rateDealer(requestId, BigInt(rating));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customerRequests"] });
    },
  });
}

export function useRegisterDealer() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      address,
      phone,
    }: { name: string; address: string; phone: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerDealer(name, address, phone);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerUserRole"] });
      qc.invalidateQueries({ queryKey: ["dealerRequests"] });
    },
  });
}
