"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  Mail,
  Loader2,
  RefreshCw,
  Trash2,
  MailOpen,
  Mail as MailUnread,
  Phone,
  AtSign,
} from "lucide-react";

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/api/contact");
      setContacts(response.data.contacts || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load messages."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const toggleRead = async (contact) => {
    try {
      setBusyId(contact._id);

      await axios.put(`/api/contact/${contact._id}`, {
        isRead: !contact.isRead,
      });

      setContacts((prev) =>
        prev.map((c) =>
          c._id === contact._id ? { ...c, isRead: !c.isRead } : c
        )
      );
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to update message."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;

    try {
      setBusyId(id);

      await axios.delete(`/api/contact/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      setSuccess("Message deleted.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to delete message."
      );
    } finally {
      setBusyId(null);
    }
  };

  const visible =
    filter === "unread"
      ? contacts.filter((c) => !c.isRead)
      : contacts;

  const unreadCount = contacts.filter((c) => !c.isRead).length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 size={22} className="animate-spin" />
          Loading messages...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-900">
            <Mail size={24} />
            {unreadCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Contact Messages
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Submissions from the website contact form
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 outline-none focus:border-blue-500"
          >
            <option value="all">All ({contacts.length})</option>
            <option value="unread">Unread ({unreadCount})</option>
          </select>

          <button
            onClick={fetchContacts}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-gray-100 p-4">
              <Mail size={32} className="text-gray-400" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            No messages yet
          </h2>
          <p className="mt-2 text-gray-500">
            Contact form submissions from your website will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {visible.map((contact) => (
            <div
              key={contact._id}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                contact.isRead
                  ? "border-gray-200"
                  : "border-blue-300 ring-1 ring-blue-100"
              }`}
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gray-100 px-6 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white">
                  {contact.name?.charAt(0).toUpperCase() || "?"}
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`truncate ${contact.isRead ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>
                    {contact.name}
                    {!contact.isRead && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 align-middle">
                        <MailUnread size={11} />
                        New
                      </span>
                    )}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <AtSign size={12} />
                      {contact.email}
                    </span>
                    {contact.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone size={12} />
                        {contact.phone}
                      </span>
                    )}
                    <span>
                      {new Date(contact.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`mailto:${contact.email}`}
                    className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                  >
                    Reply
                  </a>

                  <button
                    onClick={() => toggleRead(contact)}
                    disabled={busyId === contact._id}
                    title={contact.isRead ? "Mark as unread" : "Mark as read"}
                    className="rounded-lg bg-gray-50 p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                  >
                    {busyId === contact._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <MailOpen size={16} />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(contact._id)}
                    disabled={busyId === contact._id}
                    title="Delete"
                    className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    {busyId === contact._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className="px-6 py-4">
                <p className={`whitespace-pre-wrap leading-7 ${contact.isRead ? "text-gray-600" : "text-gray-800"}`}>
                  {contact.message}
                </p>
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}
