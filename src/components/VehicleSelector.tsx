import React, { useState, useEffect } from 'react';
import { useKiosk } from '../context/KioskContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { carMakes, carModels, carYears, popularVehicles } from '../data/vehicles';
import { getCompatibleProducts } from '../data/products';
import { ArrowRight, Car, CarFront } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const VehicleSelector: React.FC = () => {
  const { language, setCurrentStep, setSelectedVehicle, setFilteredProducts } = useKiosk();
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [year, setYear] = useState<number | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [filteredPopularVehicles, setFilteredPopularVehicles] = useState(popularVehicles);

  const translations = {
    title: {
      en: 'Select Your Vehicle',
      bn: 'আপনার গাড়ি নির্বাচন করুন'
    },
    make: {
      en: 'Make',
      bn: 'ব্র্যান্ড'
    },
    model: {
      en: 'Model',
      bn: 'মডেল'
    },
    year: {
      en: 'Year',
      bn: 'বছর'
    },
    popular: {
      en: 'Popular Vehicles',
      bn: 'জনপ্রিয় গাড়ি'
    },
    allPopular: {
      en: 'All Popular Vehicles',
      bn: 'সকল জনপ্রিয় গাড়ি'
    },
    filterPopular: {
      en: 'Popular ${make} Vehicles',
      bn: 'জনপ্রিয় ${make} গাড়ি'
    },
    selectMake: {
      en: 'Select make',
      bn: 'ব্র্যান্ড নির্বাচন করুন'
    },
    selectModel: {
      en: 'Select model',
      bn: 'মডেল নির্বাচন করুন'
    },
    selectYear: {
      en: 'Select year',
      bn: 'বছর নির্বাচন করুন'
    },
    findAccessories: {
      en: 'Find Accessories',
      bn: 'এক্সেসরিজ খুঁজুন'
    }
  };

  const vehicleImages: {[key: string]: string} = {
    'Toyota': 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=400&auto=format&fit=crop',
    'Honda': 'https://images.unsplash.com/photo-1600661653561-629509413bfd?w=400&auto=format&fit=crop',
    'Mitsubishi': 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=400&auto=format&fit=crop',
    'Nissan': 'https://images.unsplash.com/photo-1550841503-60feb104da1c?w=400&auto=format&fit=crop',
    'Hyundai': 'https://images.unsplash.com/photo-1607853827120-f9759a6f529f?w=400&auto=format&fit=crop',
    'Kia': 'https://images.unsplash.com/photo-1652762890470-a66bbab748b2?w=400&auto=format&fit=crop',
    'Suzuki': 'https://images.unsplash.com/photo-1545974452-caa213f76132?w=400&auto=format&fit=crop',
    'Mercedes-Benz': 'https://images.unsplash.com/photo-1629897048514-3dd7414efc45?w=400&auto=format&fit=crop',
    'BMW': 'https://images.unsplash.com/photo-1556800572-1b8aeef2c54f?w=400&auto=format&fit=crop',
    'Audi': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400&auto=format&fit=crop'
  };

  const getVehicleImage = (make: string) => {
    return vehicleImages[make] || 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop'; // Default image
  };

  useEffect(() => {
    if (make && carModels[make]) {
      setAvailableModels(carModels[make]);
      setModel('');
      setYear(null);
      
      if (make) {
        const filtered = popularVehicles.filter(vehicle => vehicle.make === make);
        setFilteredPopularVehicles(filtered);
      } else {
        setFilteredPopularVehicles(popularVehicles);
      }
    } else {
      setAvailableModels([]);
      setFilteredPopularVehicles(popularVehicles);
    }
  }, [make]);

  useEffect(() => {
    setIsFormValid(!!make && !!model && !!year);
  }, [make, model, year]);

  const handlePopularVehicleSelect = (vehicle: typeof popularVehicles[0]) => {
    setMake(vehicle.make);
    setTimeout(() => {
      setModel(vehicle.model);
      setYear(vehicle.year);
    }, 10);
  };

  const handleFindAccessories = () => {
    if (isFormValid) {
      const vehicle = { make, model, year: year as number };
      setSelectedVehicle(vehicle);
      const compatibleProducts = getCompatibleProducts(vehicle);
      setFilteredProducts(compatibleProducts);
      setCurrentStep('products');
    }
  };

  const getPopularHeading = () => {
    if (make) {
      return translations.filterPopular[language].replace('${make}', make);
    }
    return translations.allPopular[language];
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-8 text-rahimafrooz-blue">
        {translations.title[language]}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="kiosk-panel">
          <div className="space-y-6">
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                {translations.make[language]}
              </label>
              <Select value={make} onValueChange={setMake}>
                <SelectTrigger id="make" className="w-full text-lg py-6">
                  <SelectValue placeholder={translations.selectMake[language]} />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {carMakes.map((carMake) => (
                    <SelectItem key={carMake} value={carMake} className="text-lg py-2">
                      {carMake}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                {translations.model[language]}
              </label>
              <Select 
                value={model} 
                onValueChange={setModel} 
                disabled={!make}
              >
                <SelectTrigger id="model" className="w-full text-lg py-6">
                  <SelectValue placeholder={translations.selectModel[language]} />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {availableModels.map((carModel) => (
                    <SelectItem key={carModel} value={carModel} className="text-lg py-2">
                      {carModel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                {translations.year[language]}
              </label>
              <Select 
                value={year?.toString() || ''} 
                onValueChange={(value) => setYear(parseInt(value))}
                disabled={!make || !model}
              >
                <SelectTrigger id="year" className="w-full text-lg py-6">
                  <SelectValue placeholder={translations.selectYear[language]} />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {carYears.map((year) => (
                    <SelectItem key={year} value={year.toString()} className="text-lg py-2">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="kiosk-btn-primary w-full mt-4 text-lg py-6"
              disabled={!isFormValid}
              onClick={handleFindAccessories}
            >
              {translations.findAccessories[language]}
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            {getPopularHeading()}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredPopularVehicles.map((vehicle, index) => (
              <Card 
                key={`${vehicle.make}-${vehicle.model}-${vehicle.year}-${index}`}
                className="cursor-pointer hover:border-rahimafrooz-blue transition-colors overflow-hidden"
                onClick={() => handlePopularVehicleSelect(vehicle)}
              >
                <div className="h-32 bg-gray-100 overflow-hidden">
                  <img 
                    src={getVehicleImage(vehicle.make)} 
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                  <p className="text-sm text-gray-500">{vehicle.year}</p>
                </CardContent>
              </Card>
            ))}
            
            {filteredPopularVehicles.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500">
                {language === 'en' 
                  ? `No popular ${make} vehicles found` 
                  : `কোন জনপ্রিয় ${make} গাড়ি পাওয়া যায়নি`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSelector;
