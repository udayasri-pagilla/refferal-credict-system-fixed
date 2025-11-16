// pages/dashboard.tsx
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';
import useAuth from '../store/useAuth';
import { authHeaders as authHeadersHelper } from '../lib/api'; // keep your existing import

type DashboardData = {
  totalReferred?: number;
  converted?: number;
  credits?: number;
  referralCode?: string;
  activity?: Array<{ title?: string; type?: string; status?: string; createdAt?: string }>;
};

const DashboardPage: NextPage = () => {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [copyMsg, setCopyMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // safe wrapper to produce typed headers (avoids spreading undefined / any)
  function buildAuthHeaders(tok?: string | null): Record<string, string> {
    if (!tok) return {};
    try {
      // authHeadersHelper may return something like { Authorization: 'Bearer ...' }
      const h = (authHeadersHelper as any)(tok);
      if (!h || typeof h !== 'object') return {};
      // ensure it's a plain record<string,string>
      const out: Record<string, string> = {};
      Object.entries(h).forEach(([k, v]) => {
        if (typeof v === 'string') out[k] = v;
        else out[k] = String(v);
      });
      return out;
    } catch {
      // fallback: use a basic Authorization header if helper fails
      return { Authorization: `Bearer ${tok}` };
    }
  }

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';
        const headers = buildAuthHeaders(token);
        const res = await fetch(`${base}/api/dashboard`, { headers });
        if (!res.ok) {
          const body = await res.json().catch(() => ({ message: 'Failed' }));
          throw new Error(body?.message || body?.error || 'Failed to load');
        }
        setData(await res.json());
      } catch (e: any) {
        setErr(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const copyLink = async () => {
    if (!data?.referralCode) return;
    const link = `${typeof window !== 'undefined' ? location.origin : ''}/register?ref=${data.referralCode}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopyMsg('Copied!');
      setTimeout(() => setCopyMsg(null), 1400);
    } catch {
      setCopyMsg('Copy failed');
      setTimeout(() => setCopyMsg(null), 1400);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Nav />

      <main className="w-full max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
          <p className="mt-2 text-sm text-slate-500">Overview of your referrals, conversions and credits.</p>
        </div>

        {!token && (
          <div className="max-w-3xl mt-6">
            <div className="mt-4 text-sm text-slate-600">Please sign in to view your dashboard.</div>
          </div>
        )}

        {err && (
          <div className="max-w-3xl mt-6">
            <div className="text-sm text-rose-700 bg-rose-50 p-3 rounded-md border border-rose-100">{err}</div>
          </div>
        )}

        {token && (
          <section className="mt-8 grid grid-cols-1 gap-6">
            {/* Loading / empty state */}
            {loading && (
              <div className="max-w-3xl">
                <div className="bg-white rounded-2xl shadow-xl p-6 text-sm text-slate-600">Loading dashboard…</div>
              </div>
            )}

            {/* Stats row */}
            {!loading && data && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col hover:shadow-2xl transition-shadow">
                    <div className="text-sm text-slate-500">Referred Users</div>
                    <div className="mt-4 text-3xl font-bold text-slate-900">{data.totalReferred ?? 0}</div>
                    <div className="mt-2 text-xs text-slate-400">People you invited</div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col hover:shadow-2xl transition-shadow">
                    <div className="text-sm text-slate-500">Converted</div>
                    <div className="mt-4 text-3xl font-bold text-slate-900">{data.converted ?? 0}</div>
                    <div className="mt-2 text-xs text-slate-400">Referrals who bought</div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col hover:shadow-2xl transition-shadow">
                    <div className="text-sm text-slate-500">Credits</div>
                    <div className="mt-4 text-3xl font-bold text-slate-900">{data.credits ?? 0}</div>
                    <div className="mt-2 text-xs text-slate-400">Available to spend</div>
                  </div>
                </div>

                {/* Referral card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-slate-500">Your referral code</div>
                    <div className="mt-3 flex items-center gap-3">
                      <code className="font-mono bg-slate-50 border border-slate-100 px-3 py-2 rounded text-slate-800">{data.referralCode ?? '—'}</code>
                      <button
                        onClick={copyLink}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow hover:brightness-105 transition"
                      >
                        Copy link
                      </button>
                      {copyMsg && <span className="text-sm text-slate-600 ml-2">{copyMsg}</span>}
                    </div>
                    <div className="mt-3 text-sm text-slate-500 max-w-prose">Share this link with friends. When they make their first purchase you both earn credits.</div>
                  </div>

                  <div className="hidden md:flex items-center">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-slate-100 rounded-xl p-4">
                      <div className="text-xs text-slate-500">Referral Reward</div>
                      <div className="mt-2 text-xl font-bold text-slate-900">+2 credits</div>
                      <div className="mt-1 text-xs text-slate-400">on first purchase</div>
                    </div>
                  </div>
                </div>

                {/* Recent activity */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Recent activity</h3>
                    <div className="text-sm text-slate-500">Latest 10</div>
                  </div>

                  <div className="mt-4">
                    {data.activity && data.activity.length > 0 ? (
                      <ul className="divide-y divide-slate-100">
                        {data.activity.map((it, idx) => (
                          <li key={idx} className="py-3 flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-slate-800">{it.title ?? it.type ?? 'Activity'}</div>
                              <div className="text-xs text-slate-400 mt-1">{it.createdAt ? new Date(it.createdAt).toLocaleString() : ''}</div>
                            </div>

                            <div className="text-sm text-slate-500">{it.status ?? ''}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-slate-500">No recent activity to show.</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
