import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      emailaddress: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { emailaddress, password } = this.registerForm.value;

      this.authService.register(emailaddress, password).subscribe({
        next: () => {
          this.snackBar.open('Registered successfully.', 'Close', { duration: 5000 });
          this.router.navigate(['/login'], {
            state: { email: emailaddress }
          });
        },
        error: (err) => {
          this.snackBar.open(err.error || 'Registration failed', 'Close', { duration: 5000 });
        }
      });
    }
    this.router.navigate(['/login'])
  }
}
