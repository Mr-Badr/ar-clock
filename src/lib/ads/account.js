export const ADSENSE_ACCOUNT_CLIENT_ID = 'ca-pub-5421885011942418';

export function getAdsensePublisherId() {
  return ADSENSE_ACCOUNT_CLIENT_ID.replace(/^ca-/, '');
}
