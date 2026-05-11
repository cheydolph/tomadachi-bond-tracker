import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Tomadachi Bond Tracker",
};

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen py-16 px-4"
      style={{
        background:
          "linear-gradient(135deg, #fef9f0 0%, #fdf2f8 50%, #f0fdf4 100%)",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-600 font-semibold mb-8 transition-colors"
        >
          ← Back to Bond Tracker
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1
            className="text-2xl font-bold text-gray-800 mb-1 font-fredoka"
          >
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400 mb-8">Last updated: May 8th, 2026</p>
          <p className="text-xs">
            By using Tomadachi Bond Tracker, you confirm that you understand and agree to the Terms of
            Service below. If you do not agree to these terms, please do not use this application.
          </p>
          <p className="text-xs">
            If you have any questions or concerns, please contact me at:&nbsp;
            <a className="text-blue-700" href="mailto:roboagain@protonmail.com">
                roboagain@protonmail.com&nbsp;.
            </a>
          </p>
          <div className="space-y-6 text-sm mt-6 leading-relaxed">
            <section>
              <h2
                className="text-base font-semibold text-gray-800 mb-2 font-fredoka"
              >
                1. Data Sharing
              </h2>
              <p>
                Tomadachi Bond Tracker does not collect, store, transmit, or sell any personal data to any third parties. The application runs entirely in your
                browser. Your data may be sent anonymously to self-hosted third-party services or trusted third-party tools used solely to keep the site functional.
              </p>
            </section>

            <section>
              <h2
                className="text-base font-semibold text-gray-800 mb-2 font-fredoka"
              >
                2. Local Storage
              </h2>
              <p>
                All bond data you create is saved exclusively to your
                browser&apos;s <code className="bg-gray-100 px-1 rounded">localStorage</code>.
                This data never leaves your device. It can be deleted at any
                time by clearing your browser storage or using your
                browser&apos;s developer tools.
              </p>
            </section>

            <section>
              <h2
                className="text-base font-semibold text-gray-800 mb-2 font-fredoka"
              >
                3. No Cookies
              </h2>
              <p>
                We do not use cookies, tracking pixels, analytics scripts, or
                any third-party tracking technologies.
              </p>
            </section>

            <section>
              <h2
                className="text-base font-semibold text-gray-800 mb-2 font-fredoka"
              >
                4. Third-Party Services
              </h2>
              <p>
                The application loads fonts from Google Fonts. This request is
                made by your browser directly to Google&apos;s servers and is
                subject to{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-500 hover:text-rose-600 underline underline-offset-2"
                >
                  Google&apos;s Privacy Policy
                </a>
                . No other third-party services are used.
              </p>
            </section>

            <section>
              <h2
                className="text-base font-semibold text-gray-800 mb-2 font-fredoka"
              >
                5. Children&apos;s Privacy
              </h2>
              <p>
                Because we collect no data whatsoever, this application is safe
                for users of all ages. No personally identifiable information is
                ever requested or stored.
              </p>
            </section>

            <section>
              <h2
                className="text-base font-semibold text-gray-800 mb-2 font-fredoka"
              >
                6. Changes to This Policy
              </h2>
              <p>
                If this policy changes, the updated version will be posted at
                this URL. Because we collect no data, changes will not affect
                any stored information.
              </p>
            </section>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Tomadachi Bond Tracker. All rights reserved.
        </p>
      </div>
    </div>
  );
}
