import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SubjectData} from "../../../models/subject-data";
import {Subject} from "../../../services/subject/subject";
import {Subtopic} from "../../../services/subtopic/subtopic";
import {Materia} from "../../../services/materia/materia";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SubtopicService} from "../../../services/subtopic/subtopic.service";
import {MateriaService} from "../../../services/materia/materia.service";
import {NotifyService} from "../../../services/notify/notify.service";
import {FormUpdateSubjectModel} from "./form-update-subject-model";
import {SubjectService} from "../../../services/subject/subject.service";

@Component({
  selector: 'app-update-subject',
  templateUrl: './modal-update-subject.component.html',
  styleUrls: ['./modal-update-subject.component.css']
})
export class ModalUpdateSubjectComponent implements OnInit {

  subject!: Subject;
  subtopic!: Subtopic;
  materia!: Materia;

  subtopics!: Subtopic[];
  materias!: Materia[];

  formUpdateSubject!: FormGroup;

  constructor(
      private dialogRef: MatDialogRef<ModalUpdateSubjectComponent>,
      @Inject(MAT_DIALOG_DATA) public data: SubjectData,
      private formBuilder: FormBuilder,
      private subjectService: SubjectService,
      private subtopicService: SubtopicService,
      private materiaService: MateriaService,
      private notifyService: NotifyService
  ) { }

  ngOnInit(): void {
    this.subject = this.data.subject;
    this.subtopic = this.data.subtopic;
    this.materia = this.data.materia;

    this.getData();

    this.formUpdateSubject = this.formBuilder.group({
      subjectName: [this.subject.name, [Validators.required, Validators.minLength(2)]],
      subtopicId: [this.subtopic.id, [Validators.required, Validators.minLength(2)]],
      materiaId: [this.materia.id, [Validators.required, Validators.minLength(2)]]
    });
  }

  private getData() {
    this.subtopics = this.subtopicService.get();
    this.materias = this.materiaService.get();
  }

  updateSubjects() {
    const { subjectName, materiaId, subtopicId } = this.formUpdateSubject.getRawValue() as FormUpdateSubjectModel;

    if (
      this.subject.name === subjectName &&
      this.subject.materiaId === materiaId &&
      this.materia.id === materiaId &&
      this.subject.subtopicId === subtopicId &&
      this.subtopic.id === subtopicId
    ) {
      this.notifyService.show("Os dados não foram alterados");
      return;
    }

    this.subjectService.updateByParentId(this.subject.parentId, {
      ...this.subject, name: subjectName, materiaId, subtopicId
    });

    this.notifyService.show('Disciplina atualizada com sucesso!');

    this.dialogRef.close();
  }
}