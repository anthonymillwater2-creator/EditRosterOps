'use client';

import { useState } from 'react';
import { submitRequest } from './actions';
import Link from 'next/link';

export default function RequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await submitRequest(formData);

    setLoading(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Failed to submit request');
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
          <div className="text-green-600 text-5xl">✓</div>
          <h1 className="text-2xl font-bold text-gray-900">Request Received!</h1>
          <p className="text-gray-600">
            We respond within 24 hours. Check your email for our quote.
          </p>
          <a
            href="https://shortformfactory.com/order"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Order Now
          </a>
          <Link href="/" className="block text-gray-600 hover:text-gray-900">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Back
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Editing</h1>
          <p className="text-gray-600 mb-8">
            Tell us about your project and we'll send you a custom quote within 24 hours.
          </p>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="need_type" className="block text-sm font-semibold text-gray-700 mb-2">
                What do you need? *
              </label>
              <select
                id="need_type"
                name="need_type"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Select service</option>
                <option value="Repurpose">Repurpose</option>
                <option value="Social Edit">Social Edit</option>
                <option value="Smart Cut">Smart Cut</option>
                <option value="Captions">Captions</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Platforms * (select all that apply)
              </label>
              <div className="space-y-2">
                {['TikTok', 'IG', 'Shorts'].map((platform) => (
                  <label key={platform} className="flex items-center">
                    <input
                      type="checkbox"
                      name="platforms"
                      value={platform}
                      required={false}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="volume_per_week" className="block text-sm font-semibold text-gray-700 mb-2">
                  Videos per week *
                </label>
                <input
                  type="number"
                  id="volume_per_week"
                  name="volume_per_week"
                  min="1"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="turnaround" className="block text-sm font-semibold text-gray-700 mb-2">
                  Turnaround needed *
                </label>
                <select
                  id="turnaround"
                  name="turnaround"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select turnaround</option>
                  <option value="24-48h">24-48h</option>
                  <option value="Rush 12h">Rush 12h</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="budget_range" className="block text-sm font-semibold text-gray-700 mb-2">
                Budget range *
              </label>
              <select
                id="budget_range"
                name="budget_range"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Select budget</option>
                <option value="<200">&lt;$200</option>
                <option value="200-500">$200-$500</option>
                <option value="500-1k">$500-$1k</option>
                <option value="1k+">$1k+</option>
              </select>
            </div>

            <div>
              <label htmlFor="footage_link" className="block text-sm font-semibold text-gray-700 mb-2">
                Footage link (optional)
              </label>
              <input
                type="url"
                id="footage_link"
                name="footage_link"
                placeholder="https://"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="examples_link" className="block text-sm font-semibold text-gray-700 mb-2">
                Example videos link (optional)
              </label>
              <input
                type="url"
                id="examples_link"
                name="examples_link"
                placeholder="https://"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                Additional notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Any specific requirements, style preferences, deadlines, etc."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white px-6 py-4 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
