import { useState, useEffect, useCallback } from 'react';
import { RewardedAd, RewardedAdEventType, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-7276264500805485/5820698034';

let rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export const useRewardedHintAd = (onRewardEarned: () => void) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setIsLoaded(true);
    });

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        onRewardEarned();
      }
    );

    const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      setIsLoaded(false);
      // Preload next ad immediately after the current one is closed
      rewarded.load();
    });

    // Load initial ad if not loaded yet
    if (!rewarded.loaded) {
      rewarded.load();
    } else {
      setIsLoaded(true);
    }

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, [onRewardEarned]);

  const showAd = useCallback(() => {
    if (isLoaded) {
      rewarded.show();
    }
  }, [isLoaded]);

  return {
    isLoaded,
    showAd,
  };
};
