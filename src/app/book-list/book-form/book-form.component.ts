import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/Book.model';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {

  bookform!: FormGroup
  fileIsUploading: boolean = false;
  fileUrl!: string;
  fileUploaded = false

  constructor(private frombuilder: FormBuilder, private bookservice: BooksService, private router: Router) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.bookform = this.frombuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required]
    })
  }

  onSave() {
    const title = this.bookform.get('title')?.value
    const author = this.bookform.get('author')?.value
    const newBook = new Book(title, author)
    if (this.fileUrl && this.fileUrl !== '') {
      newBook.photo = this.fileUrl
    }
    this.bookservice.createNewBook(newBook)
    this.router.navigate(['/books'])
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.bookservice.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    )
  }

  detectFiles(event: Event) {
    this.onUploadFile((<HTMLInputElement>event.target).files![0]);
  }
}
