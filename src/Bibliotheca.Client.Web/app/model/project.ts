import { ContactPerson } from './contactPerson';
import { EditLink } from './editLink';

export class Project {
    id: string;
    name: string;
    description: string;
    defaultBranch: string;
    group: string;
    visibleBranches: string[];
    tags: string[];
    projectSite: string;
    contactPeople: ContactPerson[];
    editLinks: EditLink[];
}