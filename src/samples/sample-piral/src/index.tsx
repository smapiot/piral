import { renderInstance } from 'piral';
import { setupFooter, setupMenu } from './parts';

renderInstance({
  subscriptionUrl: false,
  attach(api) {
    setupFooter(api);
    setupMenu(api);
  },
  Loader: undefined,
  FeedErrorInfo: undefined,
  FormErrorInfo: undefined,
  LoadingErrorInfo: undefined,
  NotFoundErrorInfo: undefined,
  PageErrorInfo: undefined,
  UnknownErrorInfo: undefined,
  DashboardContainer: undefined,
  Tile: undefined,
  MenuContainer: undefined,
  MenuItem: undefined,
  SearchContainer: undefined,
  SearchInput: undefined,
  SearchResult: undefined,
  NotificationsContainer: undefined,
  NotificationItem: undefined,
});

export * from 'piral';
