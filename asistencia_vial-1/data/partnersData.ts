import React from 'react';
import { Partner } from '../types';
import OxxoIcon from '../components/icons/OxxoIcon';
import PemexIcon from '../components/icons/PemexIcon';
import AutozoneIcon from '../components/icons/AutozoneIcon';

export const initialPartners: Partner[] = [
    { id: '1', name: 'OXXO', iconComponent: 'OxxoIcon' },
    { id: '2', name: 'PEMEX', iconComponent: 'PemexIcon' },
    { id: '3', name: 'AutoZone', iconComponent: 'AutozoneIcon' },
];

export const partnerIcons: { [key: string]: React.FC } = {
    OxxoIcon,
    PemexIcon,
    AutozoneIcon,
};
