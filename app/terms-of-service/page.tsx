import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tomadachi Bond Tracker - Terms of Service",
};

export default function TermsOfServicePage() {
  return (
    <div
      className="min-h-screen py-16 px-4"
      style={{
        background:
          "linear-gradient(135deg, #ffec01 0%, #ffc848 50%, #ffec01 100%)",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-600 font-semibold mb-8 transition-colors"
        >
          ← Back to Bond Tracker
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1
            className="text-2xl font-bold text-gray-800 mb-1"
            style={{ fontFamily: "Fredoka, sans-serif" }}
          >
            Terms of Service
          </h1>
          <p className="text-xs text-gray-400 mb-8">Last updated:  May 8th, 2026</p>

          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <section>
              <h2
                className="text-base font-semibold text-gray-800 mb-2"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                1. Acceptance of Terms
              </h2>
              <p>
                By using Tomadachi Bond Tracker, you confirm that you understand and agree to the Terms of
                Service below. If you do not agree to these terms, please do not use this application.
              </p>
              <p>
                If you have any questions or concerns, please contact me at:&nbsp;
                <a className="text-blue-700" href="mailto:roboagain@protonmail.com">
                   roboagain@protonmail.com&nbsp;.
                </a>
              </p>
            </section>

            <section>
              <h2
                className="text-base font-semibold text-gray-800 mb-2"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                2. Description of Service
              </h2>
              <p>
                Tomadachi Bond Tracker is a free, web-based tool for
                tracking bonds between Miis. All data is
                stored locally in your browser via local storage and is never transmitted to any
                server.
              </p>
            </section>

            <section>
              <h2
                className="text-base font-semibold text-gray-800 mb-2"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                3. Nintendo Disclaimer
              </h2>
              <p>
                This site is an independent fan-made tool and is
                not affiliated with, endorsed by, associated with, or connected to Nintendo Co.,
                Ltd. in any way. "Mii" and all related character designs are trademarks of Nintendo Co., Ltd. All Nintendo trademarks, characters, and
                intellectual property belong to their respective owners.
              </p>
            </section>

            <section>
              <h2
                className="text-base font-semibold text-gray-800 mb-2"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                4. User Responsibilities
              </h2>
              <p>
                You are responsible for any data you enter into the application.
                Because all data is stored only in your browser&apos;s
                localStorage, clearing your browser data will permanently delete
                your bond records. We recommend exporting your data regularly
                using the built-in JSON export feature or saving this website as an exception if you regularly clear your cookies / localStorage from your browser's settings.
              </p>
            </section>

            <section>
              <h2
                className="text-base font-semibold text-gray-800 mb-2"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                5. Limitation of Liability
              </h2>
              <p>
                This service is provided &quot;as is&quot; without warranty of
                any kind. We are not liable for any data loss resulting from
                browser storage being cleared, device failure, or any other
                cause.
              </p>
            </section>

            <section>
              <h2
                className="text-base font-semibold text-gray-800 mb-2"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                6. Changes to Terms
              </h2>
              <p>
                We reserve the right to update these terms at any time. We encourage you to review the terms periodically to stay informed about the use of the site. We may notify users via a site banner or other means if changes are made to the Terms of Service. Continued
                use of the application after changes constitutes acceptance of the
                revised terms.
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
