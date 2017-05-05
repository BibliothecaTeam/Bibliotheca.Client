import { HealthStatus } from "./health-status";

export class Instance {
    id: string;
    address: string;
    port: number;
    healthStatus: HealthStatus;
    healthOuptput: string;
    tags: string[];
    notes: string;
}