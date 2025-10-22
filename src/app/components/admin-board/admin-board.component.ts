import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-board',
  templateUrl: './admin-board.component.html',
  styleUrls: ['./admin-board.component.css']
})
export class AdminBoardComponent implements OnInit {
  currentUser: any = null;
  stats = {
    totalUsers: 0,
    activeUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    revenue: 0,
    pendingTasks: 0
  };

  recentActivities = [
    { user: 'John Doe', action: 'Created new product', time: '2 mins ago', type: 'success' },
    { user: 'Sarah Smith', action: 'Updated inventory', time: '5 mins ago', type: 'info' },
    { user: 'Mike Johnson', action: 'Deleted user account', time: '10 mins ago', type: 'danger' },
    { user: 'Admin', action: 'System backup completed', time: '1 hour ago', type: 'warning' }
  ];

  systemHealth = {
    cpu: 45,
    memory: 68,
    storage: 82,
    network: 95
  };

  quickActions = [
    { title: 'User Management', icon: 'fa-users', description: 'Manage system users and roles', link: '/admin/users', color: 'primary' },
    { title: 'System Settings', icon: 'fa-cogs', description: 'Configure system parameters', link: '/admin/settings', color: 'warning' },
    { title: 'Backup & Restore', icon: 'fa-database', description: 'Manage system backups', link: '/admin/backup', color: 'info' },
    { title: 'Audit Logs', icon: 'fa-clipboard-list', description: 'View system activity logs', link: '/admin/logs', color: 'success' }
  ];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadStats();
  }

  loadStats(): void {
    // Mock data - replace with actual API calls
    this.stats = {
      totalUsers: 1247,
      activeUsers: 893,
      totalProducts: 5678,
      totalSales: 2341,
      revenue: 125430,
      pendingTasks: 23
    };
  }

  getSystemHealthClass(value: number): string {
    if (value >= 80) return 'danger';
    if (value >= 60) return 'warning';
    return 'success';
  }

  getSystemHealthIcon(value: number): string {
    if (value >= 80) return 'fa-exclamation-triangle';
    if (value >= 60) return 'fa-info-circle';
    return 'fa-check-circle';
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString();
  }
}