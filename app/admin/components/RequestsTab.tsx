'use client';

import { useEffect, useState } from 'react';
import { getRequests, updateRequestStatus, convertRequestToJob, updateRequestTiers } from '../actions/requests';
import type { BuyerRequest, RequestStatus, ComplexityTier, SpeedTier } from '@/lib/types';

export default function RequestsTab() {
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<BuyerRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    const data = await getRequests();
    setRequests(data);
    setLoading(false);
  }

  async function handleStatusChange(id: string, status: RequestStatus) {
    await updateRequestStatus(id, status);
    loadRequests();
  }

  async function handleConvertToJob(requestId: string) {
    const result = await convertRequestToJob(requestId);
    if (result.success) {
      alert('Job created successfully!');
      loadRequests();
      setSelectedRequest(null);
    } else {
      alert(`Error: ${result.error}`);
    }
  }

  function copyQuoteEmail(request: BuyerRequest) {
    const template = `Hi ${request.name},

Thanks for reaching out about ${request.need_type} editing!

Based on your needs:
- Service: ${request.need_type}
- Turnaround: ${request.turnaround}
- Volume: ${request.volume_per_week} per week
- Platforms: ${request.platforms.join(', ')}

Price: [INSERT PRICE]

[INSERT NEXT STEP]

Ready to move forward? Order here: https://shortformfactory.com/order

Questions? Reply to this email.

Best,
ShortFormFactory Team`;

    navigator.clipboard.writeText(template);
    alert('Quote email template copied to clipboard!');
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Buyer Requests</h2>
        <button
          onClick={loadRequests}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:border-gray-300 cursor-pointer"
            onClick={() => setSelectedRequest(request)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{request.name}</h3>
                <p className="text-sm text-gray-600">{request.email}</p>
                {request.company && (
                  <p className="text-sm text-gray-600">{request.company}</p>
                )}
              </div>
              <select
                value={request.status}
                onChange={(e) => {
                  e.stopPropagation();
                  handleStatusChange(request.id, e.target.value as RequestStatus);
                }}
                onClick={(e) => e.stopPropagation()}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  request.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                  request.status === 'IN_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'QUOTED' ? 'bg-purple-100 text-purple-800' :
                  request.status === 'WON' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                <option value="NEW">NEW</option>
                <option value="IN_REVIEW">IN_REVIEW</option>
                <option value="QUOTED">QUOTED</option>
                <option value="WON">WON</option>
                <option value="LOST">LOST</option>
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Service:</span>
                <p className="font-medium">{request.need_type}</p>
              </div>
              <div>
                <span className="text-gray-500">Turnaround:</span>
                <p className="font-medium">{request.turnaround}</p>
              </div>
              <div>
                <span className="text-gray-500">Volume/week:</span>
                <p className="font-medium">{request.volume_per_week}</p>
              </div>
              <div>
                <span className="text-gray-500">Budget:</span>
                <p className="font-medium">{request.budget_range}</p>
              </div>
            </div>

            {(request.complexity_suggested || request.speed_tier) && (
              <div className="mt-4 flex gap-2">
                {request.complexity_suggested && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                    Tier: {request.complexity_suggested}
                  </span>
                )}
                {request.speed_tier && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                    Speed: {request.speed_tier}
                  </span>
                )}
              </div>
            )}

            <p className="text-xs text-gray-400 mt-2">
              {new Date(request.created_at).toLocaleString()}
            </p>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No requests yet
          </div>
        )}
      </div>

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onCopyQuote={() => copyQuoteEmail(selectedRequest)}
          onConvertToJob={() => handleConvertToJob(selectedRequest.id)}
          onUpdateTiers={async (complexity, speed) => {
            await updateRequestTiers(selectedRequest.id, complexity, speed);
            loadRequests();
            setSelectedRequest(null);
          }}
        />
      )}
    </div>
  );
}

function RequestDetailModal({
  request,
  onClose,
  onCopyQuote,
  onConvertToJob,
  onUpdateTiers,
}: {
  request: BuyerRequest;
  onClose: () => void;
  onCopyQuote: () => void;
  onConvertToJob: () => void;
  onUpdateTiers: (complexity: ComplexityTier, speed: SpeedTier) => void;
}) {
  const [complexity, setComplexity] = useState<ComplexityTier>(
    request.complexity_suggested || 'PRO'
  );
  const [speed, setSpeed] = useState<SpeedTier>(request.speed_tier || 'STANDARD');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">Request Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Name</label>
              <p className="font-medium">{request.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium">{request.email}</p>
            </div>
          </div>

          {request.company && (
            <div>
              <label className="text-sm text-gray-500">Company</label>
              <p className="font-medium">{request.company}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Service</label>
              <p className="font-medium">{request.need_type}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Platforms</label>
              <p className="font-medium">{request.platforms.join(', ')}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-500">Volume/week</label>
              <p className="font-medium">{request.volume_per_week}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Turnaround</label>
              <p className="font-medium">{request.turnaround}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Budget</label>
              <p className="font-medium">{request.budget_range}</p>
            </div>
          </div>

          {request.footage_link && (
            <div>
              <label className="text-sm text-gray-500">Footage Link</label>
              <a
                href={request.footage_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline block"
              >
                {request.footage_link}
              </a>
            </div>
          )}

          {request.examples_link && (
            <div>
              <label className="text-sm text-gray-500">Examples Link</label>
              <a
                href={request.examples_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline block"
              >
                {request.examples_link}
              </a>
            </div>
          )}

          {request.notes && (
            <div>
              <label className="text-sm text-gray-500">Notes</label>
              <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
                {request.notes}
              </p>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Internal Tier Override</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Complexity Tier
                </label>
                <select
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value as ComplexityTier)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="BASIC">BASIC</option>
                  <option value="PRO">PRO</option>
                  <option value="ELITE">ELITE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Speed Tier
                </label>
                <select
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value as SpeedTier)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="STANDARD">STANDARD</option>
                  <option value="RUSH">RUSH</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => onUpdateTiers(complexity, speed)}
              className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            >
              Update Tiers
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onCopyQuote}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Copy Quote Email
            </button>
            <button
              onClick={onConvertToJob}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Convert to Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
