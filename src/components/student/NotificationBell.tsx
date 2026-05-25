"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { Bell, CheckCheck, Inbox, Loader2 } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import toast from "react-hot-toast";
import { showNotification } from "@/lib/helper";
import { getPusherClient, Channels, Events } from "@/lib/pusher";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);

  // *(A. Vanshika) Storing exact milisecond time when the component is mounted.....
  const mountTime = useRef<number>(Date.now());
  const prevUnreadCount = useRef<number>(0);
  const shownNotifications = useRef<Set<string>>(new Set());
  const bellControls = useAnimation();

  useEffect(() => {
    setStudentId(localStorage.getItem("studentId"));
  }, []);

  const { data, error, mutate, isLoading } = useSWR(
    studentId ? `/api/student/notifications?studentId=${studentId}` : null,
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
    },
  );

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  useEffect(() => {
    if (unreadCount > prevUnreadCount.current) {
      bellControls.start({
        rotate: [0, -15, 15, -10, 10, -5, 5, 0],
        transition: { duration: 0.7, ease: "easeInOut" },
      });

      const audio = new Audio("/ClassifyAI-notification.mp3");
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }

    prevUnreadCount.current = unreadCount;
  }, [unreadCount, bellControls]);

  useEffect(() => {
    if (!studentId) return;

    const pusher = getPusherClient(studentId);
    const channel = pusher.subscribe(Channels.notifications(studentId));

    channel.bind(Events.NEW_NOTIFICATION, () => {
      // *(A. Vanshika) trigger SWR revalidation — picks up new notification from DB.....
      mutate(`/api/student/notifications?studentId=${studentId}`);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(Channels.notifications(studentId));
    };
  }, [studentId, mutate]);

  useEffect(() => {
    if (!notifications.length) return;

    notifications.forEach((n: any) => {
      // *(A. Vanshika) Taking the time where notification was generated.....
      const notifTime = new Date(n.createdAt).getTime();

      // *(A. Vanshika) Showing only those notification that were generated after the page loads.....
      if (
        notifTime > mountTime.current &&
        !shownNotifications.current.has(n.id)
      ) {
        shownNotifications.current.add(n.id);

        showNotification({
          id: n.id,
          title: n.title,
          message: n.body,
          link: n.meta?.link,
        });
      }
    });
  }, [notifications]);

  const handleToggle = async () => {
    const currentlyOpening = !isOpen;
    setIsOpen(currentlyOpening);

    if (currentlyOpening && unreadCount > 0 && studentId) {
      const unreadIds = notifications
        .filter((n: any) => !n.read)
        .map((n: any) => n.id);

      if (unreadIds.length === 0) return;

      mutate({ ...data, unreadCount: 0 }, false);

      try {
        await fetch("/api/student/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId, notificationIds: unreadIds }),
        });

        mutate();
      } catch {
        toast.error("Couldn't mark notifications as read.");
      }
    }
  };

  const sortedNotifications = [...notifications]
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <div className="relative z-[9999]">
      <motion.button
        type="button"
        onClick={handleToggle}
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-200 shadow-lg shadow-black/20 backdrop-blur-xl transition duration-300 hover:border-violet-300/40 hover:bg-violet-500/15"
        animate={bellControls}
        aria-label="Open notifications"
      >
        <Bell className="h-5 w-5 text-violet-200" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-[#08080C] bg-gradient-to-r from-violet-500 to-fuchsia-500 px-1 text-[10px] font-extrabold text-white shadow-lg shadow-violet-950/50">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 z-[9999] mt-3 w-[min(calc(100vw-2rem),24rem)] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#14141B]/95 shadow-2xl shadow-black/45 backdrop-blur-2xl 2xl:-right-8"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-sm font-extrabold text-white">
                  Notifications
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {unreadCount > 0
                    ? `${unreadCount} unread update${
                        unreadCount > 1 ? "s" : ""
                      }`
                    : "You are all caught up"}
                </p>
              </div>

              {unreadCount === 0 ? (
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10">
                  <CheckCheck size={17} className="text-emerald-300">
                    <title>All caught up!</title>
                  </CheckCheck>
                </div>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
                  <Bell size={17} className="text-violet-300" />
                </div>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading && (
                <div className="flex items-center justify-center gap-2 px-5 py-8 text-sm font-medium text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin text-violet-300" />
                  Loading notifications...
                </div>
              )}

              {error && (
                <div className="px-5 py-6 text-sm font-medium text-red-300">
                  Failed to load notifications.
                </div>
              )}

              {!isLoading && !error && sortedNotifications.length > 0 && (
                <ul>
                  {sortedNotifications.map((n: any) => (
                    <li
                      key={n.id}
                      className={`border-b border-white/10 px-5 py-4 transition last:border-b-0 hover:bg-white/[0.06] ${
                        !n.read ? "bg-violet-500/10" : "bg-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                            !n.read ? "bg-violet-300" : "bg-slate-700"
                          }`}
                        />

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-bold text-white">
                            {n.title}
                          </p>

                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-400">
                            {n.body}
                          </p>

                          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {!isLoading && !error && sortedNotifications.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                    <Inbox className="h-5 w-5 text-slate-500" />
                  </div>

                  <p className="mt-4 text-sm font-bold text-slate-300">
                    No notifications yet
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Important campus updates will appear here.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}