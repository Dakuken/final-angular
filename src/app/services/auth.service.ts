import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  createNewUser(email: string, password: string) {
    const auth = getAuth();
    return new Promise<void>(
      (resolve, reject) => {
        createUserWithEmailAndPassword(auth, email, password)
          .then(
            () => {
              resolve()
            },
            (error) => {
              reject(error)
            }
          )
      }
    )
  }

  signInUser(email: string, password: string) {
    const auth = getAuth()
    return new Promise<void>(
      (resolve, reject) => {
        signInWithEmailAndPassword(auth, email, password)
          .then(
            () => {
              resolve();
            },
            (error) => {
              reject
            }
          )
      }
    )
  }

  signOutUser() {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log('Sign-out successful.');
    }).catch((error) => {
      console.log('An error happened');
    });
  }
}
