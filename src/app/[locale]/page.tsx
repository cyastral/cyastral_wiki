'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';


export default function SimpleLayout() {
  const t = useTranslations('HomePage');
  const router = useRouter();
  const handleClick = () =>{
    router.push("/admin/CreateVcsinger");
  }
  return (
    <>
      <h1 className="text-3xl text-red-500">Hello World</h1>
      <Button onClick={handleClick}>Create Vcsinger</Button>
    </>
  );
} 