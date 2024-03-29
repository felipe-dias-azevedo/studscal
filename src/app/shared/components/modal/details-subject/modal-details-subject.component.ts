import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {IdentifiableContext, ParentIdentifiableContext} from "../../../services/context-storage/identifiable-context";
import {Subject} from "../../../services/subject/subject";
import {SubjectService} from "../../../services/subject/subject.service";
import {NotifyService} from "../../../services/notify/notify.service";
import {Subtopic} from "../../../services/subtopic/subtopic";
import {Materia} from "../../../services/materia/materia";
import {SubtopicService} from "../../../services/subtopic/subtopic.service";
import {MateriaService} from "../../../services/materia/materia.service";
import {ModalAlertComponent} from "../alert/modal-alert.component";
import {ModalAlertResponse} from "../alert/modal-alert-response";
import {ModalUpdateSubjectComponent} from "../update-subject/modal-update-subject.component";
import {ModalRepeatComponent} from "../repeat/modal-repeat.component";
import {ModalAlertTypeContent} from "../alert/modal-alert-type-content";
import {ModalNoteSubjectComponent} from "../note-subject/modal-note-subject.component";
import {NoteSubject} from "../note-subject/note-subject";
import {ModalRepeatResponse} from "../repeat/modal-repeat-response";

@Component({
  selector: 'app-modal-details-subject',
  templateUrl: './modal-details-subject.component.html',
  styleUrls: ['./modal-details-subject.component.css']
})
export class ModalDetailsSubjectComponent implements OnInit {

  subject!: Subject;
  subtopic!: Subtopic | null;
  materia!: Materia | null;

  subjectComments?: string[];
  subjectNotes?: string[];

  constructor(
    private dialogRef: MatDialogRef<ModalDetailsSubjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IdentifiableContext,
    private subjectService: SubjectService,
    private subtopicService: SubtopicService,
    private materiaService: MateriaService,
    private notifyService: NotifyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    const subject = this.subjectService.getById(this.data.id);

     subject.subscribe(s => {
       if (s === null) {
         this.notifyService.show('Não foi possível obter os dados desta disciplina');
         this.dialogRef.close();
         return;
       }

       this.subject = s!
       this.materiaService.getById(s!.materiaId).subscribe(m => this.materia = m);
       this.subtopicService.getById(s!.subtopicId).subscribe(s => this.subtopic = s);
       this.subjectComments = s!.comments?.split('\n');
       this.subjectNotes = s.notes?.split('\n');
    });
  }

  deleteSubject() {
    const confirmationDialog = this.dialog.open<ModalAlertComponent, ModalAlertTypeContent, ModalAlertResponse>(ModalAlertComponent, {
      data: {
        typeContent: 'a ocorrência da seguinte Disciplina',
        nameContent: this.subject.name,
        dateContent: this.subject.date
      }
    });
    confirmationDialog.afterClosed().subscribe(result => {
      if (result === undefined || !result.confirm) {
        return;
      }

      this.subjectService.deleteById(this.subject.id);

      this.notifyService.show('Disciplina deletada com sucesso!');

      this.dialogRef.close();
    });
  }

  deleteAllSubjects() {
    const confirmationDialog = this.dialog.open<ModalAlertComponent, ModalAlertTypeContent, ModalAlertResponse>(ModalAlertComponent, {
      data: {
        typeContent: 'todas as ocorrências da seguinte Disciplina',
        nameContent: this.subject.name
      }
    });
    confirmationDialog.afterClosed().subscribe(result => {
      if (result === undefined || !result.confirm) {
        return;
      }

      this.subjectService.deleteByParentId(this.subject.parentId);

      this.notifyService.show('Disciplinas deletadas com sucesso!');

      this.dialogRef.close();
    });
  }

  updateSubject() {
    this.dialog.open(ModalUpdateSubjectComponent, {
      panelClass: 'modal-container',
      data: {
        subject: this.subject,
        subtopic: this.subtopic,
        materia: this.materia
      }
    });
  }

  repeatSubject() {
    const repeatDialog = this.dialog.open<ModalRepeatComponent, ParentIdentifiableContext, ModalRepeatResponse>(ModalRepeatComponent, {
      panelClass: 'modal-container',
      data: {
        id: this.subject.id,
        parentId: this.subject.parentId
      }
    });
    repeatDialog.afterClosed().subscribe(result => {
      if (result === undefined) {
        return;
      }

      this.dialogRef.close();
    });
  }

  addNoteSubject() {
    const noteDialog = this.dialog.open<ModalNoteSubjectComponent, NoteSubject, NoteSubject>(ModalNoteSubjectComponent, {
      panelClass: 'mini-modal-container',
      data: {
        note: this.subject.notes
      }
    });
    noteDialog.afterClosed().subscribe(result => {
      if (result === undefined || result.note === undefined) {
        return;
      }

      const subject: Subject = {
        ...this.subject,
        notes: result?.note
      }

      this.subjectService.update(this.subject.id, subject);
    });
  }
}
