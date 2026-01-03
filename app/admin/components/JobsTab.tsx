'use client';

import { useEffect, useState } from 'react';
import { getJobs, getJobChecklist, updateJobStatus, updateJob, updateChecklist } from '../actions/jobs';
import type { Job, JobStatus, JobChecklist } from '@/lib/types';

const JOB_STATUSES: JobStatus[] = [
  'INTAKE_PENDING',
  'IN_PROGRESS',
  'QA',
  'DELIVERED',
  'REVISIONS',
  'CLOSED',
];

export default function JobsTab() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [checklist, setChecklist] = useState<JobChecklist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    const data = await getJobs();
    setJobs(data);
    setLoading(false);
  }

  async function handleStatusChange(jobId: string, status: JobStatus) {
    await updateJobStatus(jobId, status);
    loadJobs();
  }

  async function handleSelectJob(job: Job) {
    setSelectedJob(job);
    const checklistData = await getJobChecklist(job.id);
    setChecklist(checklistData);
  }

  function copyClientUpdate() {
    if (!selectedJob) return;
    const template = `Hi ${selectedJob.buyer_name},

Quick update on your ${selectedJob.service} project:

Status: ${selectedJob.status}
${selectedJob.due_at ? `Due: ${new Date(selectedJob.due_at).toLocaleDateString()}` : ''}

[ADD YOUR UPDATE HERE]

Let me know if you have any questions!

Best,
ShortFormFactory Team`;

    navigator.clipboard.writeText(template);
    alert('Client update template copied!');
  }

  function copyDeliveryMessage() {
    if (!selectedJob) return;
    const template = `Hi ${selectedJob.buyer_name},

Your ${selectedJob.service} edits are complete!

Download: ${selectedJob.delivery_link || '[INSERT LINK]'}

Please review and let me know if you need any revisions (1 round included).

Timeline for revisions: 24-48 hours

Happy with the result? Would love a testimonial!

Best,
ShortFormFactory Team`;

    navigator.clipboard.writeText(template);
    alert('Delivery message copied!');
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Jobs Kanban</h2>
        <button
          onClick={loadJobs}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto">
        {JOB_STATUSES.map((status) => (
          <div key={status} className="bg-gray-100 rounded-lg p-4 min-w-[250px]">
            <h3 className="font-semibold mb-3 text-sm">{status.replace('_', ' ')}</h3>
            <div className="space-y-2">
              {jobs
                .filter((job) => job.status === status)
                .map((job) => (
                  <div
                    key={job.id}
                    className="bg-white p-3 rounded shadow-sm cursor-pointer hover:shadow-md transition"
                    onClick={() => handleSelectJob(job)}
                  >
                    <p className="font-medium text-sm">{job.buyer_name}</p>
                    <p className="text-xs text-gray-600">{job.service}</p>
                    {job.rush && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                        RUSH
                      </span>
                    )}
                    {job.due_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(job.due_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {selectedJob && checklist && (
        <JobDetailModal
          job={selectedJob}
          checklist={checklist}
          onClose={() => {
            setSelectedJob(null);
            setChecklist(null);
          }}
          onUpdate={async (updates) => {
            await updateJob(selectedJob.id, updates);
            loadJobs();
            handleSelectJob({ ...selectedJob, ...updates });
          }}
          onChecklistUpdate={async (updates) => {
            await updateChecklist(selectedJob.id, updates);
            const updated = await getJobChecklist(selectedJob.id);
            setChecklist(updated);
          }}
          onStatusChange={async (status) => {
            await updateJobStatus(selectedJob.id, status);
            loadJobs();
            setSelectedJob({ ...selectedJob, status });
          }}
          onCopyClientUpdate={copyClientUpdate}
          onCopyDeliveryMessage={copyDeliveryMessage}
        />
      )}
    </div>
  );
}

function JobDetailModal({
  job,
  checklist,
  onClose,
  onUpdate,
  onChecklistUpdate,
  onStatusChange,
  onCopyClientUpdate,
  onCopyDeliveryMessage,
}: {
  job: Job;
  checklist: JobChecklist;
  onClose: () => void;
  onUpdate: (updates: Partial<Job>) => void;
  onChecklistUpdate: (updates: Record<string, boolean>) => void;
  onStatusChange: (status: JobStatus) => void;
  onCopyClientUpdate: () => void;
  onCopyDeliveryMessage: () => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(job);

  function handleSave() {
    onUpdate(formData);
    setEditMode(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">Job Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {!editMode ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{job.buyer_name}</h3>
                <p className="text-gray-600">{job.buyer_email}</p>
              </div>
              <select
                value={job.status}
                onChange={(e) => onStatusChange(e.target.value as JobStatus)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                {JOB_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Service</label>
                <p className="font-medium">{job.service}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Package</label>
                <p className="font-medium">{job.package || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Rush</label>
                <p className="font-medium">{job.rush ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Due Date</label>
                <p className="font-medium">
                  {job.due_at ? new Date(job.due_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>

            {job.assets_link && (
              <div>
                <label className="text-sm text-gray-500">Assets Link</label>
                <a
                  href={job.assets_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  {job.assets_link}
                </a>
              </div>
            )}

            {job.footage_link && (
              <div>
                <label className="text-sm text-gray-500">Footage Link</label>
                <a
                  href={job.footage_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  {job.footage_link}
                </a>
              </div>
            )}

            {job.delivery_link && (
              <div>
                <label className="text-sm text-gray-500">Delivery Link</label>
                <a
                  href={job.delivery_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  {job.delivery_link}
                </a>
              </div>
            )}

            {job.qa_notes && (
              <div>
                <label className="text-sm text-gray-500">QA Notes</label>
                <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
                  {job.qa_notes}
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <label className="text-sm text-gray-500">Buyer Price</label>
                <p className="font-medium">
                  {job.buyer_price ? `$${job.buyer_price}` : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Editor Payout</label>
                <p className="font-medium">
                  {job.editor_payout ? `$${job.editor_payout}` : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Payout Status</label>
                <p className="font-medium">{job.payout_status || 'N/A'}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Checklist</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries({
                  payment_confirmed: 'Payment Confirmed',
                  files_received: 'Files Received',
                  scope_locked: 'Scope Locked',
                  edit_in_progress: 'Edit In Progress',
                  qa_pass: 'QA Pass',
                  delivered: 'Delivered',
                  revision_requested: 'Revision Requested',
                  closed: 'Closed',
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={checklist[key as keyof JobChecklist] as boolean}
                      onChange={(e) =>
                        onChecklistUpdate({ [key]: e.target.checked })
                      }
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded mr-2"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Edit Job
              </button>
              <button
                onClick={onCopyClientUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Copy Client Update
              </button>
              <button
                onClick={onCopyDeliveryMessage}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Copy Delivery Message
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Buyer Name</label>
                <input
                  type="text"
                  value={formData.buyer_name}
                  onChange={(e) =>
                    setFormData({ ...formData, buyer_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Buyer Email</label>
                <input
                  type="email"
                  value={formData.buyer_email}
                  onChange={(e) =>
                    setFormData({ ...formData, buyer_email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service</label>
                <input
                  type="text"
                  value={formData.service}
                  onChange={(e) =>
                    setFormData({ ...formData, service: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Package</label>
                <input
                  type="text"
                  value={formData.package || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, package: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.rush}
                    onChange={(e) =>
                      setFormData({ ...formData, rush: e.target.checked })
                    }
                    className="h-4 w-4 mr-2"
                  />
                  <span className="text-sm font-medium">Rush Order</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="datetime-local"
                  value={formData.due_at?.slice(0, 16) || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, due_at: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Assets Link</label>
              <input
                type="url"
                value={formData.assets_link || ''}
                onChange={(e) =>
                  setFormData({ ...formData, assets_link: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Footage Link</label>
              <input
                type="url"
                value={formData.footage_link || ''}
                onChange={(e) =>
                  setFormData({ ...formData, footage_link: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Delivery Link</label>
              <input
                type="url"
                value={formData.delivery_link || ''}
                onChange={(e) =>
                  setFormData({ ...formData, delivery_link: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">QA Notes</label>
              <textarea
                value={formData.qa_notes || ''}
                onChange={(e) =>
                  setFormData({ ...formData, qa_notes: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Buyer Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.buyer_price || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      buyer_price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Editor Payout
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.editor_payout || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      editor_payout: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Payout Status
                </label>
                <select
                  value={formData.payout_status || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, payout_status: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select status</option>
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData(job);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
