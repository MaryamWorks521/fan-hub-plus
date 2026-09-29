import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Compass,
  FileText,
  User,
  ShoppingBag,
  Calendar,
  MessageSquare,
  Bot,
  BarChart3,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export const AdminPage: React.FC = () => {
  const { user, token } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'analytics' | 'users' | 'categories' | 'characters' | 'articles' | 'submissions' | 'merchandise' | 'events' | 'feedback' | 'faqs'
  >('analytics');

  // Analytics data
  const [analytics, setAnalytics] = useState<any>(null);
  const [userList, setUserList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [characters, setCharacters] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [merchandise, setMerchandise] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Modals / Inputs
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  const [statusMessage, setStatusMessage] = useState('');

  const loadAllAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [resAn, resUs, resCat, resChar, resArt, resSub, resEv, resMerch, resFb, resFaq] =
        await Promise.all([
          fetch('/api/admin/analytics', { headers }),
          fetch('/api/users', { headers }),
          fetch('/api/categories'),
          fetch('/api/characters'),
          fetch('/api/articles'),
          fetch('/api/submissions/admin', { headers }),
          fetch('/api/events'),
          fetch('/api/merchandise'),
          fetch('/api/feedback/admin', { headers }),
          fetch('/api/chatbot/faqs')
        ]);

      if (resAn.ok) setAnalytics(await resAn.json());
      if (resUs.ok) setUserList((await resUs.json()).users || []);
      if (resCat.ok) setCategories((await resCat.json()).categories || []);
      if (resChar.ok) setCharacters((await resChar.json()).characters || []);
      if (resArt.ok) setArticles((await resArt.json()).articles || []);
      if (resSub.ok) setSubmissions((await resSub.json()).submissions || []);
      if (resEv.ok) setEvents((await resEv.json()).events || []);
      if (resMerch.ok) setMerchandise((await resMerch.json()).merchandise || []);
      if (resFb.ok) setFeedbackList((await resFb.json()).feedback || []);
      if (resFaq.ok) setFaqs((await resFaq.json()).faqs || []);
    } catch (err) {
      console.error('Failed to load admin dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, [token]);

  // User Actions
  const handleToggleUserStatus = async (userId: string) => {
    const res = await fetch(`/api/users/${userId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({})
    });
    if (res.ok) {
      loadAllAdminData();
      flashMessage('User active status updated.');
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    const res = await fetch(`/api/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });
    if (res.ok) {
      loadAllAdminData();
      flashMessage(`User role set to ${role}.`);
    }
  };

  // Submission Workflow
  const handleReviewSubmission = async (subId: string, status: 'approved' | 'rejected') => {
    const feedback = prompt(
      `Enter admin feedback for author (${status}):`,
      status === 'approved' ? 'Meets editorial standards!' : 'Needs additional references or revision.'
    );
    const res = await fetch(`/api/submissions/admin/${subId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, adminFeedback: feedback || '' })
    });
    if (res.ok) {
      loadAllAdminData();
      flashMessage(`Submission marked as ${status}.`);
    }
  };

  // Feedback Resolution
  const handleResolveFeedback = async (id: string, newStatus: string) => {
    const reply = prompt('Enter reply to send to user:', 'Thank you for bringing this to our attention!');
    const res = await fetch(`/api/feedback/admin/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus, adminReply: reply || '' })
    });
    if (res.ok) {
      loadAllAdminData();
      flashMessage('Feedback ticket status updated.');
    }
  };

  // Add FAQ
  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/chatbot/faqs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ question: faqQ, answer: faqA, category: 'general' })
    });
    if (res.ok) {
      setFaqQ('');
      setFaqA('');
      setShowAddFaq(false);
      loadAllAdminData();
      flashMessage('Knowledge Base FAQ created.');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Delete this knowledge base entry?')) return;
    const res = await fetch(`/api/chatbot/faqs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      loadAllAdminData();
      flashMessage('FAQ removed.');
    }
  };

  // Category Add
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: catName, description: catDesc })
    });
    if (res.ok) {
      setCatName('');
      setCatDesc('');
      setShowAddCategory(false);
      loadAllAdminData();
      flashMessage('Category added.');
    }
  };

  const flashMessage = (m: string) => {
    setStatusMessage(m);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white">Administrator Access Required</h1>
        <p className="mt-2 text-xs text-slate-400">
          You must log in with an administrator account (e.g. admin@fanhubplus.com) to access the Fan Hub Plus management console.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-600 text-white">
              <ShieldAlert className="h-3.5 w-3.5" />
            </span>
            <h1 className="font-display text-2xl font-bold text-white">
              Platform Administration Console
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Control users, fandom taxonomies, fan content approval queues, knowledge base, and platform telemetry.
          </p>
        </div>

        {statusMessage && (
          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300">
            <CheckCircle className="h-4 w-4" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-800 pb-2 text-xs">
        {[
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'users', label: `Users (${userList.length})`, icon: Users },
          { id: 'submissions', label: `Submissions (${submissions.length})`, icon: FileText },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Compass },
          { id: 'characters', label: `Characters (${characters.length})`, icon: User },
          { id: 'feedback', label: `Feedback (${feedbackList.length})`, icon: MessageSquare },
          { id: 'faqs', label: `Chatbot FAQs (${faqs.length})`, icon: Bot }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 font-medium transition-colors ${
                active
                  ? 'bg-rose-500 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: 'Total Accounts', val: analytics.metrics?.totalUsers },
              { label: 'Active Users', val: analytics.metrics?.activeUsers },
              { label: 'Total Articles', val: analytics.metrics?.totalArticles },
              { label: 'Bookmarks Stored', val: analytics.metrics?.totalBookmarks },
              { label: 'Pending Submissions', val: analytics.metrics?.pendingSubmissions, highlight: true },
              { label: 'Pending Feedback', val: analytics.metrics?.pendingFeedback, highlight: true }
            ].map((stat, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-4 ${
                  stat.highlight
                    ? 'border-rose-500/30 bg-rose-500/10'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {stat.label}
                </span>
                <span className="font-display text-2xl font-black text-white tabular-nums mt-1 block">
                  {stat.val}
                </span>
              </div>
            ))}
          </div>

          {/* Category Distribution Bar Chart */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="font-display text-base font-bold text-white mb-4">
              Category Content Distribution
            </h3>
            <div className="space-y-3">
              {analytics.categoryDistribution?.map((cat: any) => (
                <div key={cat.slug}>
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                    <span className="font-semibold">{cat.name}</span>
                    <span className="tabular-nums text-slate-400">{cat.count} items</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(10, cat.count * 15))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity Audit Trail */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="font-display text-base font-bold text-white mb-4">
              Recent Platform Operations Audit Trail
            </h3>
            <div className="space-y-2">
              {analytics.recentLogs?.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-rose-400 font-bold">
                      {log.action}
                    </span>
                    <span className="text-slate-300">· {log.details}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. User Management Tab */}
      {activeTab === 'users' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-white">Registered Users Roster</h3>
            <span className="text-xs text-slate-400">Total: {userList.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Fandoms</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {userList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          referrerPolicy="no-referrer"
                          className="h-7 w-7 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-bold text-white">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        className="rounded border border-slate-800 bg-slate-950 px-2 py-1 text-slate-200"
                      >
                        <option value="visitor">Visitor</option>
                        <option value="user">Registered User</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {u.favoriteFandoms?.slice(0, 2).join(', ')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          u.isActive
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`rounded px-2.5 py-1 text-[11px] font-semibold ${
                          u.isActive
                            ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                            : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                        }`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Submissions Approval Queue */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white">
              Fan Submissions Review Workflow
            </h3>
            <span className="text-xs text-slate-400">
              Pending: {submissions.filter(s => s.status === 'pending').length}
            </span>
          </div>

          <div className="space-y-3">
            {submissions.map(sub => (
              <div
                key={sub.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col md:flex-row items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-rose-400 uppercase">
                      {sub.category} · {sub.type}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      By {sub.authorName} ({sub.authorEmail})
                    </span>
                    <span
                      className={`rounded px-2 py-0.2 text-[10px] font-bold uppercase ${
                        sub.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : sub.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{sub.title}</h4>
                  <p className="mt-1 text-xs text-slate-400">{sub.summary}</p>
                  <p className="mt-2 text-xs text-slate-300 italic border-l-2 border-slate-700 pl-3">
                    "{sub.content}"
                  </p>

                  {sub.adminFeedback && (
                    <div className="mt-2 text-[11px] text-rose-300">
                      <strong>Admin note:</strong> {sub.adminFeedback}
                    </div>
                  )}
                </div>

                {sub.status === 'pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleReviewSubmission(sub.id, 'approved')}
                      className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                    >
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => handleReviewSubmission(sub.id, 'rejected')}
                      className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Categories Management */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white">Categories Management</h3>
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </button>
          </div>

          {showAddCategory && (
            <form onSubmit={handleAddCategory} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
              <input
                type="text"
                required
                placeholder="Category Name (e.g. Tabletop Gaming)"
                value={catName}
                onChange={e => setCatName(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-xs text-white"
              />
              <textarea
                required
                placeholder="Category Description..."
                value={catDesc}
                onChange={e => setCatDesc(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-xs text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="rounded px-3 py-1 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-rose-600 px-4 py-1 text-xs font-bold text-white"
                >
                  Save Category
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map(c => (
              <div key={c.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <h4 className="text-sm font-bold text-white">{c.name}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.description}</p>
                <span className="text-[10px] text-slate-500 block mt-2">Slug: {c.slug}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Feedback Management */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white">Feedback Desk & Tickets</h3>
          </div>

          <div className="space-y-3">
            {feedbackList.map(fb => (
              <div
                key={fb.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col md:flex-row items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-rose-400 uppercase">
                      {fb.type}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      From {fb.userName} ({fb.userEmail})
                    </span>
                    <span
                      className={`rounded px-2 py-0.2 text-[10px] font-bold uppercase ${
                        fb.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {fb.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 mt-1">{fb.message}</p>
                  {fb.adminReply && (
                    <p className="mt-2 text-xs text-rose-300 bg-slate-950 p-2 rounded border border-slate-800">
                      <strong>Admin Response:</strong> {fb.adminReply}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleResolveFeedback(fb.id, 'resolved')}
                    className="rounded-lg bg-emerald-600/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                  >
                    Reply & Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Chatbot Knowledge Base */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white">
              AI Chatbot Knowledge Base FAQs
            </h3>
            <button
              onClick={() => setShowAddFaq(!showAddFaq)}
              className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              <span>Add FAQ Grounding Rule</span>
            </button>
          </div>

          {showAddFaq && (
            <form onSubmit={handleAddFaq} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
              <input
                type="text"
                required
                placeholder="Question (e.g. When will tickets go live?)"
                value={faqQ}
                onChange={e => setFaqQ(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-xs text-white"
              />
              <textarea
                required
                placeholder="Grounded Answer for FanBot..."
                value={faqA}
                onChange={e => setFaqA(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-xs text-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFaq(false)}
                  className="rounded px-3 py-1 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-rose-600 px-4 py-1 text-xs font-bold text-white"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {faqs.map(faq => (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex items-start justify-between gap-4"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">Q: {faq.question}</h4>
                  <p className="mt-1 text-xs text-slate-300">A: {faq.answer}</p>
                </div>
                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
