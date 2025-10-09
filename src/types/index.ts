export type Login = {
  user: string;
  pass: string;
};

export interface MapViewProps {
  cities: any[];
  moreItem: any;
  selectedItems: any[];
  onNavigate?: (page: string) => void;
  onProcessUpdate: any;
  historyData: any;
  historyOpen: boolean;
  mapContainerRef: any;
}
