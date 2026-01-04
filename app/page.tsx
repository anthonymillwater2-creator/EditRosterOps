import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Short-form editing.<br />No roulette.
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Managed short-form editing with strict QA. Invite-only bench expanding for overflow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/request"
              className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition"
            >
              Request Editing
            </Link>

            <a
              href="https://shortformfactory.com/order"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-black text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition"
            >
              Order Now
            </a>
          </div>

          <div className="pt-16 space-y-6">
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Strict QA</h3>
                <p className="text-gray-600">Every edit reviewed before delivery. No guessing on quality.</p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Fast Turnaround</h3>
                <p className="text-gray-600">24-48h standard. Rush 12h available for urgent needs.</p>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Vetted Editors</h3>
                <p className="text-gray-600">Invite-only bench. Proven track record required.</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-24 pt-12 border-t border-gray-200 text-center text-gray-600">
          <p>Questions? Email us at <a href="mailto:shortformfactory.help@gmail.com" className="text-black underline">shortformfactory.help@gmail.com</a></p>
        </footer>
      </main>
    </div>
  );
}
