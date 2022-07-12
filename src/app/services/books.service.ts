import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Book } from '../models/Book.model';
import { getApp } from "firebase/app";
import { DataSnapshot, getDatabase, onValue, ref, set, get, child } from "firebase/database";
import { getStorage, ref as refStorage, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { initializeApp } from "firebase/app";



@Injectable({
  providedIn: 'root'
})


export class BooksService {
  books: Book[] = [];
  booksSubject = new Subject<Book[]>();
  constructor() { }

  emitBooks() {
    this.booksSubject.next(this.books)
  }

  saveBooks() {
    const db = getDatabase();
    set(ref(db, '/books'), this.books);
  }

  getBooks() {
    const db = getDatabase();
    const reference = ref(db, '/books');
    onValue(reference, (data: DataSnapshot) => {
      this.books = data.val() ? data.val() : []
      this.emitBooks();
    })
  }

  getSingleBooks(id: number) {
    const dbRef = ref(getDatabase());
    return new Promise<Book>(
      (resolve, reject) => {
        get(child(dbRef, `/books/${id}`)).then((snapshot) => {
          if (snapshot.exists()) {
            resolve(<Book>snapshot.val());
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          reject(error);
        })
      }
    )
  }

  createNewBook(newBook: Book) {
    this.books.push(newBook)
    this.saveBooks()
    this.emitBooks()
  }

  removeBook(book: Book) {
    if (book.photo) {
      const storage = getStorage();
      const storageRef = refStorage(storage, book.photo);

      // Delete the file
      deleteObject(storageRef).then(() => {
        // File deleted successfully
      }).catch((error: any) => {
        console.log(error);

      });
    }
    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if (bookEl === book) {
          return book
        } else { return -1 }
      })
    this.books.splice(bookIndexToRemove, 1)
    this.saveBooks()
    this.emitBooks()
  }

  uploadFile(file: File) {
    const firebaseConfig = {
      apiKey: "AIzaSyDTJNUAFKIHhwOzPz0D2pBiVK2a23Glvxw",
      authDomain: "angular20-32ea6.firebaseapp.com",
      databaseURL: "https://angular20-32ea6-default-rtdb.firebaseio.com",
      projectId: "angular20-32ea6",
      storageBucket: "gs://angular20-32ea6.appspot.com",
      messagingSenderId: "273572570575",
      appId: "1:273572570575:web:a1ba09106220abbcfb5eba",
      measurementId: "G-0LRBM67W8C",
    };

    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const metadata = {
      contentType: 'image/jpeg'
    };

    const almostUniqueName = new Date().toString()
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = refStorage(storage, 'images/' + almostUniqueName + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    return new Promise<string>(
      (resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            reject(error)
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      }
    )

  }
}


