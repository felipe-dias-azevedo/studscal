import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  private mensagemFechar = 'Fechar';

  constructor(
    private notifyService: MatSnackBar
  ) { }

  show(message: string, closeMessage?: string) {
    this.notifyService.open(message, closeMessage ?? this.mensagemFechar, {
      duration: 4000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }
}
