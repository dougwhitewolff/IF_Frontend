// src/components/activity/IntroductionOverlay.tsx

'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface IntroductionOverlayProps {
  activityName: string;
  description: string;
  onClose: () => void;
}

const IntroductionOverlay: React.FC<IntroductionOverlayProps> = ({
  activityName,
  description,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close introduction"
        >
          <X size={20} />
        </button>
        
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {activityName}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-lg text-gray-600">
            {description}
          </p>
        </CardContent>

        <CardFooter className="justify-center pb-6">
          <Button 
            onClick={onClose}
            className="px-8 py-2 text-lg"
          >
            Begin Activity
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IntroductionOverlay;
