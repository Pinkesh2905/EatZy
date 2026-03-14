import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterPayload } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  userData: RegisterPayload = {
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer',
    address: ''
  };
  error = '';
  loading = false;

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.authService.register(this.userData).subscribe({
      next: () => this.authService.completeLogin(this.route.snapshot.queryParamMap.get('returnUrl')),
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
