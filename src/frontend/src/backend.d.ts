import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ServiceRequest {
    id: string;
    status: string;
    vehicleType: string;
    createdAt: bigint;
    customerRating?: bigint;
    updatedAt: bigint;
    tyreType: string;
    customerId: Principal;
    issue: string;
    location: string;
    dealerId?: Principal;
}
export interface NewServiceRequest {
    vehicleType: string;
    tyreType: string;
    issue: string;
    location: string;
}
export interface DealerProfile {
    id: Principal;
    totalRatings: bigint;
    name: string;
    createdAt: bigint;
    isActive: boolean;
    address: string;
    rating: number;
    phone: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptRequest(requestId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelRequest(requestId: string): Promise<void>;
    completeRequest(requestId: string): Promise<void>;
    createServiceRequest(request: NewServiceRequest): Promise<string>;
    getActiveDealers(): Promise<Array<DealerProfile>>;
    getAllDealers(): Promise<Array<DealerProfile>>;
    getAllRequests(): Promise<Array<ServiceRequest>>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomerRequests(): Promise<Array<ServiceRequest>>;
    getDealerProfile(dealerId: Principal): Promise<DealerProfile>;
    getDealerRequests(): Promise<Array<ServiceRequest>>;
    getOpenRequests(): Promise<Array<ServiceRequest>>;
    getPendingRequestsByDealer(dealerId: Principal): Promise<Array<ServiceRequest>>;
    getRequestsByDealer(dealerId: Principal): Promise<Array<ServiceRequest>>;
    getServiceRequest(requestId: string): Promise<ServiceRequest>;
    isCallerAdmin(): Promise<boolean>;
    rateDealer(requestId: string, rating: bigint): Promise<void>;
    registerDealer(name: string, address: string, phone: string): Promise<void>;
}
