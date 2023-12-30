import { ToastrService } from 'ngx-toastr';

import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentsService } from '../../services/students.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, RouterLink],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent {
  form!: FormGroup;
  studentformSubscription!: Subscription
  paramSubscription!: Subscription
  studentService = inject(StudentsService)

  isEdit = false
  id: any;
  constructor(private fb: FormBuilder, private activatedRouter: ActivatedRoute, private router: Router, private toasterService: ToastrService) {

  }

  ngOnDestroy(): void {
    if (this.studentformSubscription) {
      this.studentformSubscription.unsubscribe()
    }

    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe()
    }
  }

  onSubmit() {
    if (!this.isEdit){

      this.studentformSubscription = this.studentService.addStudent(this.form.value).subscribe({
        next:(response)=> {
          console.log(response)
          this.toasterService.success('Student added successfully')
          this.router.navigateByUrl('/students')
        },
        error:(err)=> {
          console.log(err)
        }
      })
      //
    } else {
      this.studentService.editStudent(this.id, this.form.value).subscribe({
        next:(value)=>{
          this.toasterService.success('Student edited successfully')
          this.router.navigateByUrl('/students')
        },
        error:(err)=>{
          this.toasterService.error('Student edited failed')
        }
      })
    }
  }
  ngOnInit(): void {
    this.paramSubscription = this.activatedRouter.params.subscribe({
      next:(response)=>{
        let id = response['id']
        this.id = id;
        if (!id) return;

        console.log(response['id'])
        this.studentService.getStudentMethod(id).subscribe({
          next:(response)=>{
            this.form.patchValue(response)
            this.isEdit = true
          },
          error:(err)=>{
            console.log(err)
          }
        })
      },
      error:(err)=>{
        console.log(err)
      }
    })

    this.form = this.fb.group({
      name: ['', Validators.required],
      address: [],
      phoneNumber: [],
      email: ['', Validators.email],
    })
  }
}
