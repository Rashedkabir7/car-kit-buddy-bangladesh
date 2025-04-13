
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

  // Update available models when make changes
  useEffect(() => {
    if (make && carModels[make]) {
      setAvailableModels(carModels[make]);
      setModel(''); // Reset model when make changes
      setYear(null); // Reset year when make changes
    } else {
      setAvailableModels([]);
    }
  }, [make]);

  // Check if form is valid
  useEffect(() => {
    setIsFormValid(!!make && !!model && !!year);
  }, [make, model, year]);

  const handlePopularVehicleSelect = (vehicle: typeof popularVehicles[0]) => {
    setMake(vehicle.make);
    
    // Need to wait for availableModels to update after setting make
    setTimeout(() => {
      setModel(vehicle.model);
      setYear(vehicle.year);
    }, 10);
  };

  const handleFindAccessories = () => {
    if (isFormValid) {
      const vehicle = { make, model, year: year as number };
      setSelectedVehicle(vehicle);
      
      // Get compatible products and set them in context
      const compatibleProducts = getCompatibleProducts(vehicle);
      setFilteredProducts(compatibleProducts);
      
      setCurrentStep('products');
    }
  };

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
            {translations.popular[language]}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {popularVehicles.slice(0, 8).map((vehicle, index) => (
              <Card 
                key={`${vehicle.make}-${vehicle.model}-${vehicle.year}-${index}`}
                className="cursor-pointer hover:border-rahimafrooz-blue transition-colors"
                onClick={() => handlePopularVehicleSelect(vehicle)}
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  {index % 2 === 0 ? (
                    <Car className="text-rahimafrooz-blue" />
                  ) : (
                    <CarFront className="text-rahimafrooz-blue" />
                  )}
                  <div>
                    <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                    <p className="text-sm text-gray-500">{vehicle.year}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSelector;
