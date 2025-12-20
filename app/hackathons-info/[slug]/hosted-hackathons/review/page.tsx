"use client"
import React from 'react';
import JudgeDashboard from '@/components/hackathons-info/JudgeDashboard';
import { useParams } from 'next/navigation';


export default function Page() {

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Review Submissions</h1>   
        </div>

        <JudgeDashboard hackathonId={useParams()?.slug as string} />
      </div>
    </div>
  );
}
