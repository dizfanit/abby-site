import { createContext, useContext, useState, ReactNode } from "react";

export type ListingStatus = "active" | "paused" | "moderation" | "rejected";

export interface UserListing {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  price: string;
  priceUnit: string;
  address: string;
  description: string;
  photos: string[];
  status: ListingStatus;
  createdAt: string;
  views: number;
  responses: number;
  dealType?: string;
  rooms?: string;
  area?: string;
  floor?: string;
  totalFloors?: string;
  condition?: string;
  houseType?: string;
  experience?: string;
  employmentType?: string;
  goodsCondition?: string;
}

interface ListingsContextValue {
  listings: UserListing[];
  addListing: (listing: Omit<UserListing, "id" | "createdAt" | "views" | "responses">) => void;
  updateListingStatus: (id: string, status: ListingStatus) => void;
  deleteListing: (id: string) => void;
  updateListing: (id: string, data: Partial<UserListing>) => void;
}

const ListingsContext = createContext<ListingsContextValue>({
  listings: [],
  addListing: () => {},
  updateListingStatus: () => {},
  deleteListing: () => {},
  updateListing: () => {},
});

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<UserListing[]>([]);

  const addListing = (listing: Omit<UserListing, "id" | "createdAt" | "views" | "responses">) => {
    const newListing: UserListing = {
      ...listing,
      id: `listing_${Date.now()}`,
      createdAt: new Date().toLocaleDateString("ru-RU"),
      views: 0,
      responses: 0,
    };
    setListings(prev => [newListing, ...prev]);
  };

  const updateListingStatus = (id: string, status: ListingStatus) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const updateListing = (id: string, data: Partial<UserListing>) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  return (
    <ListingsContext.Provider value={{ listings, addListing, updateListingStatus, deleteListing, updateListing }}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  return useContext(ListingsContext);
}
