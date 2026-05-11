import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tomadachi Bond Tracker - Terms of Service",
};

export default function TermsOfServicePage() {
  return (
    <div
      className="min-h-screen px-4 py-16"
      style={{
        background: "linear-gradient(135deg, #ffec01 0%, #ffc848 50%, #ffec01 100%)",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <div className="mx-auto max-w-2xl">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-500 transition-colors hover:text-rose-600"
        >
          ← Back to Bond Tracker
        </Link>

        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <h1 className="font-fredoka mb-1 text-2xl font-bold text-gray-800">
            Terms of Service
          </h1>
          <p className="mb-8 text-xs text-gray-400">Last updated: May 8th, 2026</p>

          <div className="space-y-6 text-sm leading-relaxed text-gray-600">
            <section>
              <h2 className="font-fredoka mb-2 text-base font-semibold text-gray-800">
                1. Acceptance of Terms
              </h2>
              <p>
                By using Tomadachi Bond Tracker, you confirm that you understand and agree
                to the Terms of Service below. If you do not agree to these terms, please
                do not use this application.
              </p>
              <p>
                If you have any questions or concerns, please contact me at:&nbsp;
                <a className="text-blue-700" href="mailto:roboagain@protonmail.com">
                  roboagain@protonmail.com&nbsp;.
                </a>
              </p>
            </section>

            <section>
              <h2 className="font-fredoka mb-2 text-base font-semibold text-gray-800">
                2. Description of Service
              </h2>
              <p>
                Tomadachi Bond Tracker is a free, web-based tool for tracking bonds
                between Miis. All data is stored locally in your browser via local storage
                and is never transmitted to any server.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka mb-2 text-base font-semibold text-gray-800">
                3. Nintendo Disclaimer
              </h2>
              <p>
                This site is an independent fan-made tool and is not affiliated with,
                endorsed by, associated with, or connected to Nintendo Co., Ltd. in any
                way. &quot;Mii&quot; and all related character designs are trademarks of
                Nintendo Co., Ltd. All Nintendo trademarks, characters, and intellectual
                property belong to their respective owners.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka mb-2 text-base font-semibold text-gray-800">
                4. User Responsibilities
              </h2>
              <p>
                You are responsible for any data you enter into the application. Because
                all data is stored only in your browser&apos;s localStorage, clearing your
                browser data will permanently delete your bond records. We recommend
                exporting your data regularly using the built-in JSON export feature or
                saving this website as an exception if you regularly clear your cookies /
                localStorage from your browser&apos;s settings.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka mb-2 text-base font-semibold text-gray-800">
                5. Limitation of Liability
              </h2>
              <p>
                This service is provided &quot;as is&quot; without warranty of any kind.
                We are not liable for any data loss resulting from browser storage being
                cleared, device failure, or any other cause.
              </p>
            </section>

            <section>
              <h2 className="font-fredoka mb-2 text-base font-semibold text-gray-800">
                6. Changes to Terms
              </h2>
              <p>
                We reserve the right to update these terms at any time. We encourage you
                to review the terms periodically to stay informed about the use of the
                site. We may notify users via a site banner or other means if changes are
                made to the Terms of Service. Continued use of the application after
                changes constitutes acceptance of the revised terms.
              </p>
            </section>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © 2026 Tomadachi Bond Tracker. All rights reserved.
        </p>
      </div>
    </div>
  );
}
