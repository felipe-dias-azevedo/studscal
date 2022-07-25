import {Injectable} from '@angular/core';
import {Materia, NewMateria} from "./materia";
import {ContextStorageService} from "../context-storage/context-storage.service";

@Injectable({
  providedIn: 'root'
})
export class MateriaService {

  private key = 'materias';

  constructor(private contextStorageService: ContextStorageService<NewMateria, Materia>) { }

  get(): Materia[] {
    return this.contextStorageService.get(this.key)
      .filter(m => m.id !== undefined);
  }

  getById(id: string): Materia | null {
    return this.contextStorageService.getById(this.key, id);
  }

  add(materia: NewMateria): void {
    this.contextStorageService.add(this.key, materia);
  }

  deleteById(id: string): void {
    this.contextStorageService.deleteById(this.key, id);
  }

  deleteAll(): void {
    this.contextStorageService.deleteAll(this.key);
  }
}