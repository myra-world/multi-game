import React from 'react';

export interface Game {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: string;
  color: string;
}