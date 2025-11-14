export default function MentionLegalePage() {
  return (
    <main className="min-h-screen bg-white pb-12 sm:pb-16 lg:pb-20">
      {/* Hero Section */}
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Mentions legales
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Olla Fidelite
          </p>
        </div>

        {/* PDF Viewer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}>
            <iframe
              src="/Mentions légales.pdf#toolbar=0&navpanes=0&scrollbar=1&view=FitH"
              className="w-full h-full"
              title="Mentions legales"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
