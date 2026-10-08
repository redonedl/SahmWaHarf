import { useState, useEffect } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-7276264500805485/8936061947';

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export const useInterstitialAdManager = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let loadedListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setIsLoaded(true);
    });

    let closedListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setIsLoaded(false);
      interstitial.load(); // preload next
    });
    
    let errorListener = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Interstitial Error', error);
      setIsLoaded(false);
    });

    if (!isLoaded) {
      interstitial.load();
    }

    return () => {
      loadedListener();
      closedListener();
      errorListener();
    };
  }, []);

  const showAd = () => {
    if (isLoaded) {
      interstitial.show();
    }
  };

  const addClosedListener = (callback: () => void) => {
    return interstitial.addAdEventListener(AdEventType.CLOSED, callback);
  };

  return { isLoaded, showAd, addClosedListener };
};
