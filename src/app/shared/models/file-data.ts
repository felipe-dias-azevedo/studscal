import {Subject} from "../services/subject/subject";
import {Materia} from "../services/materia/materia";
import {Subtopic} from "../services/subtopic/subtopic";

export interface FileData {
    subjects: FileSubjectData[];
    materias: FileMateriaData[];
    subtopics: FileSubtopicData[];
}

export interface FileSubjectData {
    id: string;
    subject: string;
    subtopic: string;
    materia: string;
    date: string;
}

export interface FileMateriaData {
    materia: string;
    color: string;
}

export interface FileSubtopicData {
    subtopic: string;
}

export interface FileDataFormated {
    subjects: Subject[];
    materias: Materia[];
    subtopics: Subtopic[];
}