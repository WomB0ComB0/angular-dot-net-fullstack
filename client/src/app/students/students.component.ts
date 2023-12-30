import { Component, OnInit, inject } from '@angular/core';
import { StudentsService } from '../services/students.service';
import { Observable } from 'rxjs';
import { Student } from '../types/student';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {
  students$!: Observable<Student[]>;
  toasterService!: ToastrService;
  studentService = inject(StudentsService);


  ngOnInit(): void {
    this.students$ = this.studentService.getStudents()
  }

  delete(id: number){
    this.studentService.deleteStudent(id).subscribe({
      next: (response)=>{
        this.toasterService.success('Student deleted successfully')
        this.getStudents()
      },
    })
  }

  private getStudents(): void {
    this.students$ = this.studentService.getStudents();
  }
}
