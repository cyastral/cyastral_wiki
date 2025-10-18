'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

export default function SimpleLayout() {
  const t = useTranslations('HomePage');
  return (
    <>
      <h1 className="text-3xl text-red-500">Hello World</h1>
    </>
  );
} 