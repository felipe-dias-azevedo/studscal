import {IdentifiableContext} from "../context-storage/identifiable-context";

export interface NewSubject {
  name: string;
  subtopicId: string;
  materiaId: string;
  date: Date;
  comments?: string;
  notes?: string;
}

export interface PreSubject extends NewSubject {
  parentId: string;
}

export interface Subject extends IdentifiableContext, PreSubject {}
