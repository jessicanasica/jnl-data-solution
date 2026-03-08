import { Component } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonButton, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent, 
  IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  cloudOfflineOutline,
  clipboardOutline,
  peopleOutline,
  settingsOutline,
  checkmarkCircle,
  businessOutline,
  flaskOutline,
  earthOutline,
  mailOutline,
  calendarOutline,
  logoLinkedin,
  logoGithub
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home-service-focused.page.html',
  styleUrls: ['home-service-focused.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonIcon
  ],
})
export class HomePage {
  constructor() {
    addIcons({
      'cloud-offline-outline': cloudOfflineOutline,
      'clipboard-outline': clipboardOutline,
      'people-outline': peopleOutline,
      'settings-outline': settingsOutline,
      'checkmark-circle': checkmarkCircle,
      'business-outline': businessOutline,
      'flask-outline': flaskOutline,
      'earth-outline': earthOutline,
      'mail-outline': mailOutline,
      'calendar-outline': calendarOutline,
      'logo-linkedin': logoLinkedin,
      'logo-github': logoGithub
    });
  }
}
