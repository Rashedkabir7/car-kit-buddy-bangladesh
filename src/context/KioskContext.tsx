
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Vehicle = {
  make: string;
  model: string;
  year: number;
};

export type Product = {
  id: string;
  name: string;
  category: 'battery' | 'tires' | 'lubricants' | 'lights' | 'electronics';
  description: string;
  price: number;
  image: string;
  specs: string[];
  inStock: boolean;
  location: string;
  compatibleVehicles: Vehicle[];
  rating?: number;
};

type KioskContextType = {
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  currentStep: 'welcome' | 'vehicle' | 'products' | 'details' | 'contact';
  setCurrentStep: (step: 'welcome' | 'vehicle' | 'products' | 'details' | 'contact') => void;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  filteredProducts: Product[];
  setFilteredProducts: (products: Product[]) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
};

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export const KioskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [currentStep, setCurrentStep] = useState<'welcome' | 'vehicle' | 'products' | 'details' | 'contact'>('welcome');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <KioskContext.Provider
      value={{
        language,
        setLanguage,
        currentStep,
        setCurrentStep,
        selectedVehicle,
        setSelectedVehicle,
        selectedProduct,
        setSelectedProduct,
        filteredProducts,
        setFilteredProducts,
        selectedCategory,
        setSelectedCategory
      }}
    >
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = () => {
  const context = useContext(KioskContext);
  if (context === undefined) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  return context;
};
