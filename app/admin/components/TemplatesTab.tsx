'use client';

import { useEffect, useState } from 'react';
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from '../actions/templates';
import type { Template } from '@/lib/types';

export default function TemplatesTab() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    setLoading(true);
    const data = await getTemplates();
    setTemplates(data);
    setLoading(false);
  }

  async function handleCreate(template: {
    name: string;
    subject?: string;
    body: string;
  }) {
    const result = await createTemplate(template);
    if (result.success) {
      loadTemplates();
      setIsCreating(false);
    } else {
      alert(`Error: ${result.error}`);
    }
  }

  async function handleUpdate(
    id: string,
    template: { name: string; subject?: string; body: string }
  ) {
    const result = await updateTemplate(id, template);
    if (result.success) {
      loadTemplates();
      setSelectedTemplate(null);
    } else {
      alert(`Error: ${result.error}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this template?')) return;

    const result = await deleteTemplate(id);
    if (result.success) {
      loadTemplates();
      setSelectedTemplate(null);
    } else {
      alert(`Error: ${result.error}`);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Message Templates</h2>
        <div className="flex gap-2">
          <button
            onClick={loadTemplates}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
          >
            Refresh
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800"
          >
            + New Template
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
        <p className="font-semibold mb-2">Available placeholders:</p>
        <p>
          {'{name}'} {'{service}'} {'{turnaround}'} {'{price}'} {'{next_step}'}
          {' {order_url}'} {'{volume_per_week}'} {'{question}'} {'{delivery_link}'}
        </p>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:border-gray-300 cursor-pointer"
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{template.name}</h3>
                {template.subject && (
                  <p className="text-sm text-gray-600 mt-1">
                    Subject: {template.subject}
                  </p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(template.body);
                  alert('Template copied to clipboard!');
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {template.body}
            </p>
          </div>
        ))}

        {templates.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No templates yet. Create your first template to get started.
          </div>
        )}
      </div>

      {isCreating && (
        <TemplateFormModal
          onClose={() => setIsCreating(false)}
          onSave={handleCreate}
        />
      )}

      {selectedTemplate && (
        <TemplateFormModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onSave={(data) => handleUpdate(selectedTemplate.id, data)}
          onDelete={() => handleDelete(selectedTemplate.id)}
        />
      )}
    </div>
  );
}

function TemplateFormModal({
  template,
  onClose,
  onSave,
  onDelete,
}: {
  template?: Template;
  onClose: () => void;
  onSave: (data: { name: string; subject?: string; body: string }) => void;
  onDelete?: () => void;
}) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    subject: template?.subject || '',
    body: template?.body || '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formData);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">
            {template ? 'Edit Template' : 'New Template'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Template Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., QUOTE_EMAIL, DM_1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Subject (optional)
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder="Email subject line"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Body *</label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              required
              rows={12}
              placeholder="Template body with placeholders like {name}, {service}, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              {template ? 'Save Changes' : 'Create Template'}
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
