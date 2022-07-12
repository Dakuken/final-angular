import { Injectable } from '@angular/core';
import { CanActivate, Router, } from '@angular/router';
import { Observable } from 'rxjs';
import { getAuth } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {


  constructor(private router: Router) { }


  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const auth = getAuth()
    return new Promise(
      (resolve, reject) => {
        getAuth().onAuthStateChanged(
          (user) => {
            if (user) {
              resolve(true)
            } else {
              this.router.navigate(['/auth', 'signin'])
              resolve(false)
            }
          }
        )
      }
    )

  }
}
