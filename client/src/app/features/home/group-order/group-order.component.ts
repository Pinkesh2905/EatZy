import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupOrderService } from '../../../core/services/group-order.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-order',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="group-container" *ngIf="groupOrderService.activeGroup() as group">
      <div class="glass-card group-header">
        <div class="info">
          <h1>Group Order: <span class="text-primary">{{ group.code }}</span></h1>
          <p>Ordering from <strong>{{ group.restaurant?.name }}</strong></p>
        </div>
        <div class="share-box">
          <label>Invite Friends</label>
          <div class="copy-field">
            <code>{{ group.code }}</code>
            <button class="btn-sm" (click)="copyInviteLink(group.code)">
              {{ copied ? 'Copied' : 'Copy Link' }}
            </button>
          </div>
        </div>
      </div>

      <div class="participants-grid">
        @for (member of group.members; track member.user?._id) {
          <div class="member-card glass-card">
            <div class="member-header">
              <span class="user-name">{{ member.user?.name }}</span>
              <span class="item-count">{{ member.items.length }} items</span>
            </div>
            <div class="member-items">
              @for (item of member.items; track item.dishName) {
                <div class="group-item">
                  <span>{{ item.dishName }} x{{ item.quantity }}</span>
                  <span>₹{{ item.price * item.quantity }}</span>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <div class="group-summary glass-card">
        <div class="total-row">
           <span>Group Total ({{ getTotalItems() }} Items)</span>
           <span class="price">₹{{ getTotalPrice() }}</span>
        </div>
        <button class="btn-primary w-100 mt-20">Unified Checkout</button>
      </div>
    </div>
  `,
  styles: [`
    .group-container { max-width: 1000px; margin: 40px auto; padding: 0 20px; }
    .group-header { display: flex; justify-content: space-between; align-items: center; padding: 32px; margin-bottom: 32px; }
    .share-box label { display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
    .copy-field { background: rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 8px; display: flex; gap: 12px; align-items: center; }
    .participants-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-bottom: 40px; }
    .member-card { padding: 20px; }
    .member-header { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; }
    .group-item { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; }
    .group-summary { padding: 32px; }
    .total-row { display: flex; justify-content: space-between; font-size: 24px; font-weight: bold; }
    .price { color: var(--primary); }
    .w-100 { width: 100%; }
    .mt-20 { margin-top: 20px; }
  `]
})
export class GroupOrderComponent implements OnInit {
  groupOrderService = inject(GroupOrderService);
  private route = inject(ActivatedRoute);
  copied = false;

  ngOnInit() {
    const code = this.route.snapshot.params['code'];
    if (code) {
      this.groupOrderService.joinGroup(code).subscribe();
    }
  }

  getTotalItems() {
    return this.groupOrderService.activeGroup()?.members.reduce((acc: number, m: any) => acc + m.items.length, 0) || 0;
  }

  getTotalPrice() {
    return this.groupOrderService.activeGroup()?.members.reduce((acc: number, m: any) => {
      return acc + m.items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);
    }, 0) || 0;
  }

  async copyInviteLink(code: string) {
    const inviteLink = `${window.location.origin}/group/${code}`;

    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(inviteLink);
    }

    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 2000);
  }
}
