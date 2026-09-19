import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  Download,
  Copy,
  Check,
  Smartphone,
  Terminal,
  ExternalLink,
  ChevronRight,
  Code2,
  PackageCheck
} from 'lucide-react';
import JSZip from 'jszip';
import { androidProjectFiles, AndroidProjectFile } from '../data/androidProjectSource';

export const AndroidProjectExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidProjectFile>(androidProjectFiles[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Add all project files into the root or android folder
      androidProjectFiles.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add gradlew wrapper stub
      zip.file(
        'gradlew',
        `#!/usr/bin/env sh
exec ./gradle/wrapper/gradle-wrapper.jar "$@"
`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'StudyOS_AI_Android_Studio_Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate zip', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div id="android-project-explorer" className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">
                Android Studio Project Explorer
              </h2>
              <p className="text-xs text-slate-400">
                Kotlin 1.9 + Jetpack Compose + Material 3 + Room DB
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
          >
            {zipSuccess ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Downloaded ZIP!</span>
              </>
            ) : isZipping ? (
              <span>Packaging ZIP...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Android Project (.ZIP)</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Build Instructions */}
        <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs font-mono text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>./gradlew assembleDebug</span>
          </div>
          <span className="text-[11px] text-slate-400">Generates APK in app/build/outputs/apk</span>
        </div>
      </div>

      {/* Explorer Body: File List + Code Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* File Navigator Sidebar */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2">
            Project Files ({androidProjectFiles.length})
          </div>
          <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
            {androidProjectFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/70'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate font-mono text-[11px]">{file.name}</span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      file.category === 'config'
                        ? 'bg-slate-100 text-slate-600'
                        : file.category === 'database'
                        ? 'bg-emerald-100 text-emerald-700'
                        : file.category === 'engine'
                        ? 'bg-purple-100 text-purple-700'
                        : file.category === 'manifest'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Previewer */}
        <div className="md:col-span-2 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-md flex flex-col overflow-hidden">
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono text-slate-300 truncate">
              <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{selectedFile.path}</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-[11px] text-slate-200 font-semibold flex items-center gap-1.5 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-200 max-h-[480px]">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
