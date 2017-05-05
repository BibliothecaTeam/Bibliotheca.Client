import { IndexStatusEnum } from "./index-status-enum";

export class IndexStatus {
    indexStatus: IndexStatusEnum;
    projectId: string;
    branchName: string;
    startTime: Date;
    numberOfIndexedDocuments: Number;
    numberOfAllDocuments: Number;
}