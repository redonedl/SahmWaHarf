import { getAnalytics, logEvent } from '@react-native-firebase/analytics';
const analytics = getAnalytics();

class AnalyticsManager {
  /**
   * Log when a user starts a level.
   */
  static async logLevelStarted(categoryId: string, levelId: number) {
    try {
      await logEvent(analytics, 'level_started', {
        category_id: categoryId,
        level_id: levelId,
      });
    } catch (error) {
      console.warn('Analytics Error (logLevelStarted):', error);
    }
  }

  /**
   * Log when a user completely finishes a level.
   */
  static async logLevelCompleted(categoryId: string, levelId: number) {
    try {
      await logEvent(analytics, 'level_completed', {
        category_id: categoryId,
        level_id: levelId,
      });
    } catch (error) {
      console.warn('Analytics Error (logLevelCompleted):', error);
    }
  }

  /**
   * Log when a user unlocks a new category using coins.
   */
  static async logCategoryUnlocked(categoryId: string, cost: number) {
    try {
      await logEvent(analytics, 'category_unlocked', {
        category_id: categoryId,
        cost: cost,
      });
    } catch (error) {
      console.warn('Analytics Error (logCategoryUnlocked):', error);
    }
  }

  /**
   * Log when a user buys and uses a hint.
   */
  static async logHintUsed(categoryId: string, levelId: number) {
    try {
      await logEvent(analytics, 'hint_used', {
        category_id: categoryId,
        level_id: levelId,
      });
    } catch (error) {
      console.warn('Analytics Error (logHintUsed):', error);
    }
  }

  /**
   * Log when a user watches an ad.
   */
  static async logAdWatched(adType: string) {
    try {
      await logEvent(analytics, 'ad_watched', {
        ad_type: adType,
      });
    } catch (error) {
      console.warn('Analytics Error (logAdWatched):', error);
    }
  }
}

export default AnalyticsManager;
