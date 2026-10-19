/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { Playground } from './components/Playground';
import { ReadmeViewer } from './components/ReadmeViewer';
import { ScreenshotsStudio } from './components/ScreenshotsStudio';
import { CodeViewer } from './components/CodeViewer';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('playground');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 3-Zone Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {activeTab === 'playground' && <Playground />}
        {activeTab === 'screenshots' && <ScreenshotsStudio />}
        {activeTab === 'readme' && (
          <ReadmeViewer onGoToScreenshots={() => setActiveTab('screenshots')} />
        )}
        {activeTab === 'codebase' && <CodeViewer />}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-300">Student Records REST API</span>
            <span>·</span>
            <span>Spring Boot 3.3.4</span>
            <span>·</span>
            <span>Java 21</span>
            <span>·</span>
            <span>JPA & Hibernate Validator</span>
          </div>
          <div>
            Distributed under the MIT License. Ready for GitHub import.
          </div>
        </div>
      </footer>
    </div>
  );
}
