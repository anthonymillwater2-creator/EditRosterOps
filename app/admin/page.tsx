'use client';

import { useState } from 'react';
import RequestsTab from './components/RequestsTab';
import JobsTab from './components/JobsTab';
import TemplatesTab from './components/TemplatesTab';

type Tab = 'requests' | 'jobs' | 'templates';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('requests');

  return (
    <div>
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'jobs'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Jobs
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Templates
          </button>
        </nav>
      </div>

      {activeTab === 'requests' && <RequestsTab />}
      {activeTab === 'jobs' && <JobsTab />}
      {activeTab === 'templates' && <TemplatesTab />}
    </div>
  );
}
