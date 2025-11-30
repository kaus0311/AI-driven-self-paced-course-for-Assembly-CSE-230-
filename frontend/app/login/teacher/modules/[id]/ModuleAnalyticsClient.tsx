// frontend/app/login/teacher/modules/[id]/ModuleAnalyticsClient.tsx
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { getModuleDetail } from "../../data/professorModules";

export default function ModuleAnalyticsClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  const module = id ? getModuleDetail(id) : undefined;

  if (!module) {
    return (
      <div className="prof-page-root">
        <main className="prof-main">
          <div className="prof-panel">
            <button
              type="button"
              className="prof-back-button"
              onClick={() => router.push("/login/teacher")}
            >
              ← Back to Modules
            </button>
            <h1 className="prof-detail-title">Module Not Found</h1>
            <p className="prof-panel-description">
              We couldn&apos;t find analytics for this module.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="prof-page-root">
      <main className="prof-main">
        <section className="prof-panel">
          <button
            type="button"
            className="prof-back-button"
            onClick={() => router.push("/login/teacher")}
          >
            ← Back to Modules
          </button>

          <div className="prof-detail-header">
            <h1 className="prof-detail-title">{module.name}</h1>
            <div className="prof-detail-subtitle">
              Question-level performance analytics
            </div>
          </div>

          {/* Summary row */}
          <div className="prof-detail-summary-grid">
            <div className="prof-summary-card">
              <div className="prof-summary-value">
                {module.totalQuestions}
              </div>
              <div className="prof-summary-label">Total Questions</div>
            </div>
            <div className="prof-summary-card">
              <div className="prof-summary-value">
                {module.avgAccuracy}%
              </div>
              <div className="prof-summary-label">Avg Accuracy</div>
            </div>
            <div className="prof-summary-card">
              <div className="prof-summary-value">
                {module.strongCount}
              </div>
              <div className="prof-summary-label">Strong (≥70%)</div>
            </div>
            <div className="prof-summary-card">
              <div className="prof-summary-value">
                {module.weakCount}
              </div>
              <div className="prof-summary-label">Weak (&lt;60%)</div>
            </div>
          </div>
        </section>

        {/* Performance by topic */}
        <section className="prof-panel">
          <div className="prof-panel-header">Performance by Topic</div>

          <div className="prof-topic-list">
            {module.topics.map((t) => (
              <div key={t.name} className="prof-topic-row">
                <div className="prof-topic-name">{t.name}</div>
                <div className="prof-topic-bar-wrapper">
                  <div className="prof-progress-track prof-topic-track">
                    <div
                      className="prof-progress-fill prof-topic-fill"
                      style={{ width: `${t.accuracy}%` }}
                    />
                  </div>
                  <div className="prof-topic-accuracy">
                    {t.accuracy}%
                  </div>
                </div>
                <div className="prof-topic-detail">{t.detail}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Areas needing attention */}
        <section className="prof-panel">
          <div className="prof-panel-header">Areas Needing Attention</div>
          <p className="prof-panel-description">
            Questions below 60% accuracy may indicate topics that require
            additional review or practice materials.
          </p>

          <div className="prof-tag-row">
            {module.attentionTags.map((tag) => (
              <span key={tag} className="prof-tag-pill">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

