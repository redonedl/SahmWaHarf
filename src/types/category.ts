export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconFamily: 'Ionicons' | 'FontAwesome';
  isPremium: boolean;
  cost: number;
  gradient: [string, string];
}
