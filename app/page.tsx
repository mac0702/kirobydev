'use client';

import { useState } from 'react';
import Script from 'next/script';
import { SwiftParser, ParsedMessage } from '@/lib/swift-parser';

export default function Home() {
  const [swiftMessage, setSwiftMessage] = useState(SwiftParser.getSampleMessage());
  const [parsedResult, setParsedResult] = useState<ParsedMessage | null>(null);
  const [showJSON, setShowJSON] = useState(false);

  const handleParse = () => {
    const result = SwiftParser.parseMessage(swiftMessage);
    setParsedResult(result);
  };

  const handleLoadSample = () => {
    setSwiftMessage(SwiftParser.getSampleMessage());
    setParsedResult(null);
  };

  const handleClear = () => {
    setSwiftMessage('');
    setParsedResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black text-gray-100">
      {/* Haunted Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-red-900/50 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
            🏦 SWIFT.HAUNT 💀
          </h1>
          <p className="text-center text-gray-400 mt-2">
            Resurrecting 1973 Banking Protocol from the Dead
          </p>
          <p className="text-center text-sm text-red-400 mt-1">
            ⚠️ Educational Demo Only - Not for Production Use ⚠️
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="bg-black/70 border border-red-900/50 rounded-lg p-6 shadow-2xl shadow-red-900/20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-red-400">📨 SWIFT MT103 Message</h2>
                <div className="space-x-2">
                  <button
                    onClick={handleLoadSample}
                    className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded transition"
                  >
                    Load Sample
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded transition"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <textarea
                value={swiftMessage}
                onChange={(e) => setSwiftMessage(e.target.value)}
                className="w-full h-96 bg-gray-950 text-green-400 font-mono text-sm p-4 rounded border border-red-900/30 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
                placeholder="Paste SWIFT MT103 message here..."
                spellCheck={false}
              />

              <button
                onClick={handleParse}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg shadow-red-900/50 transition transform hover:scale-105"
              >
                🔮 Parse Message
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-black/70 border border-orange-900/50 rounded-lg p-4 text-sm">
              <h3 className="font-semibold text-orange-400 mb-2">💀 About SWIFT</h3>
              <p className="text-gray-400 mb-2">
                SWIFT (Society for Worldwide Interbank Financial Telecommunication) was founded in <span className="text-red-400 font-bold">1973</span> - over 50 years ago!
              </p>
              <p className="text-gray-400">
                This "dead" technology still powers trillions of dollars in international payments every day. MT103 is used for customer credit transfers.
              </p>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            {parsedResult ? (
              <>
                {/* Status */}
                <div className={`bg-black/70 border ${parsedResult.valid ? 'border-green-900/50' : 'border-red-900/50'} rounded-lg p-4`}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      {parsedResult.valid ? '✅ Valid Message' : '❌ Invalid Message'}
                    </h2>
                    <button
                      onClick={() => setShowJSON(!showJSON)}
                      className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded transition"
                    >
                      {showJSON ? 'Show Parsed' : 'Show JSON'}
                    </button>
                  </div>

                  {parsedResult.errors.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h3 className="text-red-400 font-semibold">Errors:</h3>
                      {parsedResult.errors.map((error, i) => (
                        <div key={i} className="text-sm text-red-300 bg-red-950/30 p-2 rounded">
                          • {error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Parsed Data */}
                {showJSON ? (
                  <div className="bg-black/70 border border-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">📄 JSON Output</h3>
                    <pre className="bg-gray-950 text-green-400 font-mono text-xs p-4 rounded overflow-x-auto max-h-96 overflow-y-auto">
                      {SwiftParser.formatJSON(parsedResult)}
                    </pre>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(SwiftParser.formatJSON(parsedResult));
                        alert('JSON copied to clipboard!');
                      }}
                      className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded transition text-sm"
                    >
                      📋 Copy JSON
                    </button>
                  </div>
                ) : (
                  <div className="bg-black/70 border border-gray-800 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-300">💰 Transaction Details</h3>

                    {parsedResult.transaction.reference && (
                      <div>
                        <span className="text-gray-500 text-sm">Reference:</span>
                        <div className="text-white font-mono">{parsedResult.transaction.reference}</div>
                      </div>
                    )}

                    {parsedResult.transaction.amount && (
                      <div>
                        <span className="text-gray-500 text-sm">Amount:</span>
                        <div className="text-2xl font-bold text-green-400">
                          {parsedResult.transaction.currency} {parsedResult.transaction.amount}
                        </div>
                      </div>
                    )}

                    {parsedResult.transaction.valueDate && (
                      <div>
                        <span className="text-gray-500 text-sm">Value Date:</span>
                        <div className="text-white">{parsedResult.transaction.valueDate}</div>
                      </div>
                    )}

                    {parsedResult.transaction.orderingCustomer && (
                      <div className="border-t border-gray-800 pt-4">
                        <span className="text-gray-500 text-sm">From:</span>
                        <div className="text-white font-semibold">{parsedResult.transaction.orderingCustomer.name}</div>
                        {parsedResult.transaction.orderingCustomer.account && (
                          <div className="text-gray-400 text-sm font-mono">Acct: {parsedResult.transaction.orderingCustomer.account}</div>
                        )}
                        {parsedResult.transaction.orderingCustomer.address && (
                          <div className="text-gray-400 text-sm">{parsedResult.transaction.orderingCustomer.address.join(', ')}</div>
                        )}
                      </div>
                    )}

                    {parsedResult.transaction.beneficiary && (
                      <div className="border-t border-gray-800 pt-4">
                        <span className="text-gray-500 text-sm">To:</span>
                        <div className="text-white font-semibold">{parsedResult.transaction.beneficiary.name}</div>
                        {parsedResult.transaction.beneficiary.account && (
                          <div className="text-gray-400 text-sm font-mono">Acct: {parsedResult.transaction.beneficiary.account}</div>
                        )}
                        {parsedResult.transaction.beneficiary.address && (
                          <div className="text-gray-400 text-sm">{parsedResult.transaction.beneficiary.address.join(', ')}</div>
                        )}
                      </div>
                    )}

                    {parsedResult.transaction.remittanceInfo && (
                      <div className="border-t border-gray-800 pt-4">
                        <span className="text-gray-500 text-sm">Payment Details:</span>
                        <div className="text-white">{parsedResult.transaction.remittanceInfo.join(' / ')}</div>
                      </div>
                    )}

                    {parsedResult.transaction.chargeBearer && (
                      <div>
                        <span className="text-gray-500 text-sm">Charges:</span>
                        <div className="text-white">{parsedResult.transaction.chargeBearer}</div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-black/70 border border-gray-800 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">👻</div>
                <p className="text-gray-500">Parse a SWIFT message to see results</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-red-900/50 bg-black/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>Built for <span className="text-red-400">Kiroween 2024</span> 🎃</p>
          <p className="mt-1">Resurrection Category: Bringing 1973 SWIFT Protocol Back to Life</p>
        </div>
      </footer>

      {/* Load Haunted Sound */}
      <Script src="/haunted-sound.js" strategy="lazyOnload" />
    </div>
  );
}
