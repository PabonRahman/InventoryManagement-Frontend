import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-moderator-board',
  templateUrl: './moderator-board.component.html',
  styleUrls: ['./moderator-board.component.css']
})
export class ModeratorBoardComponent implements OnInit {
  currentUser: any = null;
  stats = {
    pendingApprovals: 12,
    totalProducts: 567,
    activeSuppliers: 45,
    inventoryAlerts: 8,
    categories: 23,
    todaySales: 45
  };

  pendingTasks = [
    { id: 1, type: 'Product', title: 'New smartphone submission', user: 'John Doe', time: '2 hours ago', priority: 'high' },
    { id: 2, type: 'Supplier', title: 'Supplier verification request', user: 'Tech Corp', time: '5 hours ago', priority: 'medium' },
    { id: 3, type: 'Category', title: 'Category merge request', user: 'Sarah Wilson', time: '1 day ago', priority: 'low' },
    { id: 4, type: 'Product', title: 'Product image update', user: 'Mike Johnson', time: '1 day ago', priority: 'medium' }
  ];

  quickActions = [
    { title: 'Manage Products', icon: 'fa-boxes', description: 'Approve and manage products', link: '/products', color: 'primary' },
    { title: 'Supplier Management', icon: 'fa-truck', description: 'Verify and manage suppliers', link: '/suppliers', color: 'success' },
    { title: 'Category Management', icon: 'fa-tags', description: 'Organize product categories', link: '/categories', color: 'info' },
    { title: 'Inventory Alerts', icon: 'fa-bell', description: 'View low stock alerts', link: '/inventories', color: 'warning' }
  ];

  recentModerations = [
    { action: 'Approved product', item: 'Wireless Headphones', user: 'AudioTech', time: '30 mins ago' },
    { action: 'Rejected supplier', item: 'Quick Supplies Inc', user: 'Admin', time: '2 hours ago' },
    { action: 'Updated category', item: 'Electronics', user: 'Moderator', time: '4 hours ago' },
    { action: 'Verified supplier', item: 'Global Parts Ltd', user: 'Sarah', time: '6 hours ago' }
  ];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return 'fa-exclamation-triangle';
      case 'medium': return 'fa-info-circle';
      case 'low': return 'fa-flag';
      default: return 'fa-circle';
    }
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  approveTask(taskId: number): void {
    // Implement approval logic
    this.pendingTasks = this.pendingTasks.filter(task => task.id !== taskId);
  }

  rejectTask(taskId: number): void {
    // Implement rejection logic
    this.pendingTasks = this.pendingTasks.filter(task => task.id !== taskId);
  }
}