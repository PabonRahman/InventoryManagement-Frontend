import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-user-board',
  templateUrl: './user-board.component.html',
  styleUrls: ['./user-board.component.css']
})
export class UserBoardComponent implements OnInit {
  currentUser: any = null;
  stats = {
    myProducts: 23,
    myPurchases: 15,
    mySales: 8,
    favoriteItems: 5,
    pendingOrders: 3,
    totalSpent: 1250
  };

  recentActivity = [
    { action: 'Purchased', item: 'Wireless Mouse', time: '2 hours ago', type: 'purchase' },
    { action: 'Viewed', item: 'Mechanical Keyboard', time: '5 hours ago', type: 'view' },
    { action: 'Added to favorites', item: 'Gaming Headset', time: '1 day ago', type: 'favorite' },
    { action: 'Sold', item: 'Old Laptop', time: '2 days ago', type: 'sale' }
  ];

  quickLinks = [
    { title: 'Browse Products', icon: 'fa-search', description: 'Explore available products', link: '/products', color: 'primary' },
    { title: 'My Purchases', icon: 'fa-shopping-cart', description: 'View purchase history', link: '/purchases', color: 'success' },
    { title: 'My Sales', icon: 'fa-chart-line', description: 'Manage your sales', link: '/sales', color: 'info' },
    { title: 'Favorites', icon: 'fa-heart', description: 'View favorite items', link: '/favorites', color: 'danger' }
  ];

  recommendations = [
    { name: 'Smartphone X', price: 599, rating: 4.5, image: '📱' },
    { name: 'Wireless Earbuds', price: 129, rating: 4.2, image: '🎧' },
    { name: 'Laptop Stand', price: 45, rating: 4.7, image: '💻' },
    { name: 'Desk Lamp', price: 35, rating: 4.0, image: '💡' }
  ];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    console.log('👤 User Board - Current user:', this.currentUser);
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString();
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'purchase': return 'fa-shopping-cart text-success';
      case 'view': return 'fa-eye text-info';
      case 'favorite': return 'fa-heart text-danger';
      case 'sale': return 'fa-dollar-sign text-warning';
      default: return 'fa-circle text-secondary';
    }
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i + 1);
  }
}