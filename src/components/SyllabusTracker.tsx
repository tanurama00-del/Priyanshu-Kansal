import React, { useState } from 'react';
import {
  Search,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Edit2,
  BookOpen,
  Filter,
  Flame,
  Check,
  X
} from 'lucide-react';
import { Subject, Chapter, Priority, RevisionStage } from '../types';

interface SyllabusTrackerProps {
  subjects: Subject[];
  chapters: Chapter[];
  onToggleChapter: (chapterId: number) => void;
  onAddChapter: (chapter: Omit<Chapter, 'id'>) => void;
  onDeleteChapter: (chapterId: number) => void;
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  onUpdateChapterNotes: (chapterId: number, notes: string) => void;
}

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({
  subjects,
  chapters,
  onToggleChapter,
  onAddChapter,
  onDeleteChapter,
  onAddSubject,
  onUpdateChapterNotes,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

  // Modals
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  // New chapter form state
  const [newSubjectId, setNewSubjectId] = useState<number>(subjects[0]?.id || 1);
  const [newChapterName, setNewChapterName] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('HIGH');
  const [newEstHours, setNewEstHours] = useState('3.5');
  const [newNotes, setNewNotes] = useState('');

  // New subject form state
  const [newSubName, setNewSubName] = useState('');
  const [newSubColor, setNewSubColor] = useState('#2563EB');

  // Filtered Chapters
  const filteredChapters = chapters.filter((c) => {
    if (selectedSubjectId !== 'all' && c.subjectId !== selectedSubjectId) return false;
    if (filterStatus === 'pending' && c.isCompleted) return false;
    if (filterStatus === 'completed' && !c.isCompleted) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.notes.toLowerCase().includes(q);
    }
    return true;
  });

  const totalFiltered = filteredChapters.length;
  const completedFiltered = filteredChapters.filter((c) => c.isCompleted).length;
  const progressPct = totalFiltered > 0 ? Math.round((completedFiltered / totalFiltered) * 100) : 0;

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterName.trim()) return;
    const nextNumber =
      chapters.filter((c) => c.subjectId === newSubjectId).length + 1;
    onAddChapter({
      subjectId: newSubjectId,
      name: newChapterName.trim(),
      chapterNumber: nextNumber,
      isCompleted: false,
      priority: newPriority,
      estimatedHours: parseFloat(newEstHours) || 3.0,
      revisionStage: 'NONE',
      notes: newNotes.trim(),
    });
    setNewChapterName('');
    setNewNotes('');
    setShowAddChapter(false);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    onAddSubject({
      name: newSubName.trim(),
      colorHex: newSubColor,
      iconName: 'book',
    });
    setNewSubName('');
    setShowAddSubject(false);
  };

  return (
    <div id="syllabus-tracker-view" className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Syllabus Tracker</h1>
          <p className="text-xs text-slate-500">CBSE Class 10 Board Curriculum</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="add-subject-modal-btn"
            onClick={() => setShowAddSubject(true)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
          >
            + Subject
          </button>
          <button
            id="add-chapter-modal-btn"
            onClick={() => setShowAddChapter(true)}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-xs flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Chapter
          </button>
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedSubjectId('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            selectedSubjectId === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Subjects ({chapters.length})
        </button>
        {subjects.map((sub) => {
          const subCount = chapters.filter((c) => c.subjectId === sub.id).length;
          const isSelected = selectedSubjectId === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: sub.colorHex }}
              />
              {sub.name} ({subCount})
            </button>
          );
        })}
      </div>

      {/* Progress & Search Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            Completion Progress ({completedFiltered}/{totalFiltered})
          </span>
          <span className="font-bold text-blue-600">{progressPct}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search chapters or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold text-slate-600">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2 py-1 rounded ${filterStatus === 'all' ? 'bg-white shadow-2xs text-slate-900' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-2 py-1 rounded ${filterStatus === 'pending' ? 'bg-white shadow-2xs text-slate-900' : ''}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-2 py-1 rounded ${filterStatus === 'completed' ? 'bg-white shadow-2xs text-slate-900' : ''}`}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      <div className="space-y-2.5">
        {filteredChapters.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
            No chapters match the selected filter.
          </div>
        ) : (
          filteredChapters.map((chap) => {
            const subject = subjects.find((s) => s.id === chap.subjectId);
            return (
              <div
                key={chap.id}
                id={`chapter-card-${chap.id}`}
                className={`p-3.5 bg-white rounded-xl border transition ${
                  chap.isCompleted
                    ? 'border-slate-200 bg-slate-50/70'
                    : 'border-slate-200/90 shadow-2xs hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleChapter(chap.id)}
                    className="mt-0.5 text-slate-300 hover:text-emerald-600 transition"
                  >
                    {chap.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-xs font-semibold ${
                          chap.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {chap.chapterNumber}. {chap.name}
                      </h3>
                      <button
                        onClick={() => onDeleteChapter(chap.id)}
                        className="text-slate-300 hover:text-rose-500 p-1 rounded transition"
                        title="Delete Chapter"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px]">
                      {subject && (
                        <span
                          className="px-2 py-0.5 rounded font-semibold text-white"
                          style={{ backgroundColor: subject.colorHex }}
                        >
                          {subject.name}
                        </span>
                      )}

                      {/* Priority Tag */}
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          chap.priority === 'HIGH'
                            ? 'bg-rose-100 text-rose-700'
                            : chap.priority === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {chap.priority} PRIORITY
                      </span>

                      {/* Estimated Hours */}
                      <span className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        <Clock className="w-2.5 h-2.5" />
                        {chap.estimatedHours} hrs
                      </span>

                      {/* Revision Stage */}
                      {chap.revisionStage !== 'NONE' && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-semibold">
                          {chap.revisionStage.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    {/* Notes Section */}
                    {editingNotesId === chap.id ? (
                      <div className="mt-2.5 flex gap-2">
                        <input
                          type="text"
                          value={notesDraft}
                          onChange={(e) => setNotesDraft(e.target.value)}
                          placeholder="Add revision note, board formulas, tricky concepts..."
                          className="flex-1 text-xs px-2.5 py-1 border border-blue-400 rounded-md bg-blue-50/40 text-slate-800 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            onUpdateChapterNotes(chap.id, notesDraft);
                            setEditingNotesId(null);
                          }}
                          className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingNotesId(chap.id);
                          setNotesDraft(chap.notes || '');
                        }}
                        className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-1.5 rounded cursor-pointer hover:bg-slate-100/80 transition flex items-center justify-between"
                      >
                        <span className="italic truncate">
                          {chap.notes ? `Note: ${chap.notes}` : '+ Click to add key revision note/formulas'}
                        </span>
                        <Edit2 className="w-2.5 h-2.5 text-slate-400 ml-1 shrink-0" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Chapter Modal */}
      {showAddChapter && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Add Syllabus Chapter</h2>
              <button onClick={() => setShowAddChapter(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateChapter} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(Number(e.target.value))}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Chapter Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Magnetic Effects of Electric Current"
                  value={newChapterName}
                  onChange={(e) => setNewChapterName(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="HIGH">High Priority (Board Essential)</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Study Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="30"
                    value={newEstHours}
                    onChange={(e) => setNewEstHours(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Key Concepts</label>
                <input
                  type="text"
                  placeholder="e.g. Fleming's Left Hand Rule, Solenoid formula"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChapter(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Add New Subject</h2>
              <button onClick={() => setShowAddSubject(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSubject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hindi, Information Technology"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Color Theme</label>
                <div className="flex gap-2">
                  {['#2563EB', '#059669', '#D97706', '#7C3AED', '#E11D48', '#0891B2'].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNewSubColor(col)}
                      className={`w-7 h-7 rounded-full transition ${
                        newSubColor === col ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : ''
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubject(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
