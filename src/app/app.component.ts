import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyDTJNUAFKIHhwOzPz0D2pBiVK2a23Glvxw",
      authDomain: "angular20-32ea6.firebaseapp.com",
      databaseURL: "https://angular20-32ea6-default-rtdb.firebaseio.com",
      projectId: "angular20-32ea6",
      storageBucket: "gs://angular20-32ea6.appspot.com",
      messagingSenderId: "273572570575",
      appId: "1:273572570575:web:a1ba09106220abbcfb5eba",
      measurementId: "G-0LRBM67W8C"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
  }
}
