import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  tasks: any[] = [];
  constructor(private platfotms:Platform, private alertCtrl: AlertController, private toastCtrl: ToastController,private actionSheetCtrl: ActionSheetController) {
    let taskJson = localStorage.getItem('taskDb');

    if(taskJson != null){
      this.tasks = JSON.parse(taskJson);
    }
  }
  ngOnInit(){
    this.platfotms.backButton.subscribeWithPriority(5, () =>{
      console.log('Another handler was called!');
    });
  }
  async showAdd(){
    const alert = await this.alertCtrl.create({
      header: 'O que deseja fazer ?',
      inputs: [
        { 
          name: 'newTask',
          type: 'text',
          placeholder: 'Diga o que deseja fazer ?'
        },
      ], 
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Clicou em cancelar!');
          }
        },
        {
            text: 'Adicionar',
            handler: (form) => {
              console.log(form.newTask);
              this.add(form.newTask);
            }
        }
      ]
    });
    await alert.present();
  }

  async add(newTask: string){
    // Valida campo tarefa
    if(newTask.trim().length < 1){
      const toast = await this.toastCtrl.create({
        message: 'Informe o que deseja fazer',
        duration: 2000,
        position: 'top'
      });
      toast.present();
      return;
    }
    let task = { name: newTask, done: false};
    this.tasks.push(task);

    this.updateLocalStorage();
  }

  updateLocalStorage(){
     localStorage.setItem('taskDb', JSON.stringify(this.tasks));

  }

  async openActions(task:any){
     
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'O que você deseja fazer ?',
        buttons: [{
          text: task.done ? 'Desmarcar' : 'Marcar',
          icon: task.done ? 'radio-button-off' : 'checkmark-circle',
          handler: () => {
            task.done = !task.done;
            this.updateLocalStorage();
          }
        }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
      });
      await actionSheet.present();
    }
  
    async confirma(task:any) {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        message: 'Caso confirme, irá apagar a tarefa, certeza que deseja apagar?',
        buttons: [
          {
            text: 'Não',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Sim',
            handler: () => {
              console.log('Confirm Okay');
              this.tasks = this.tasks.filter(taskArray => task != taskArray);
              this.updateLocalStorage();
            }
          }
        ]
      });
      await alert.present();
    }

    // excluir do localstorage
    // this.tasks = this.tasks.filter(taskArray => task != taskArray);
    //           this.updateLocalStorage();
  }