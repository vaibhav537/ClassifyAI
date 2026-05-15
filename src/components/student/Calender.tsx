"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Sparkles } from "lucide-react";
import { EventItem } from "@/lib/types";
import { eventTypeColors } from "@/lib/helper";

const AppCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [dayEvents, setDayEvents] = useState<EventItem[]>([]);
  const [showAllEvents, setShowAllEvents] = useState(false);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    const campusId = localStorage.getItem("CampusID");

    const fetchEvents = async () => {
      try {
        const res = await fetch(`/api/assistant/event?campusId=${campusId}`);
        const data = await res.json();

        if (data.success) {
          setEvents(data.events);
        }
      } catch (error) {
        console.log("Failed to fetch events", error);
      }
    };

    fetchEvents();
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = new Date(currentYear, currentMonth - 1, 0);
  const daysInPrevMonth = prevMonth.getDate();

  const prevMonthDays = [];
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    prevMonthDays.push(daysInPrevMonth - i);
  }

  const currentMonthDays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    currentMonthDays.push(day);
  }

  const totalCells = 42;
  const remainingCells =
    totalCells - prevMonthDays.length - currentMonthDays.length;

  const nextMonthDays = [];
  for (let day = 1; day <= remainingCells; day++) {
    nextMonthDays.push(day);
  }

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentMonth + direction);
    setCurrentDate(newDate);
  };

  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === currentMonth &&
    today.getFullYear() === currentYear;

  const isSelected = (day: number) =>
    selectedDate &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === currentMonth &&
    selectedDate.getFullYear() === currentYear;

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const eventTypePriority: { [key: string]: number } = {
    public: 1,
    holiday: 2,
    festival: 3,
    national: 4,
    religious: 5,
    cultural: 6,
    sports: 7,
    business: 8,
    personal: 9,
    private: 10,
  };

  const getEventsForDay = (day: number) => {
    const dateStr = formatDate(new Date(currentYear, currentMonth, day));
    return events.filter((e) => formatDate(e.date) === dateStr);
  };

  const getPriorityEventForDay = (day: number) => {
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length === 0) return null;

    const sortedEvents = dayEvents.sort((a, b) => {
      const priorityA = eventTypePriority[a.type.toLowerCase()] || 999;
      const priorityB = eventTypePriority[b.type.toLowerCase()] || 999;
      return priorityA - priorityB;
    });

    return sortedEvents[0];
  };

  const getEventTypeForDay = (day: number) => {
    const priorityEvent = getPriorityEventForDay(day);
    return priorityEvent?.type || null;
  };

  const handleDateClick = (day: number | undefined, type: string) => {
    if (type === "current" && day !== undefined) {
      const clickedDate = new Date(currentYear, currentMonth, day);
      setSelectedDate(clickedDate);

      const priorityEvent = getPriorityEventForDay(day);
      setDayEvents(priorityEvent ? [priorityEvent] : []);
      setShowAllEvents(false);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const renderEventDisplay = () => {
    if (!selectedDate || dayEvents.length === 0) return null;

    const event = dayEvents[0];

    return (
      <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-amber-100">
              {event.title}
            </p>
            <p className="mt-1 truncate text-xs leading-5 text-amber-100/70">
              {event.description}
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-amber-100">
            {event.type}
          </span>
        </div>
      </div>
    );
  };

  const renderDayContent = (day: number) => {
    return <span>{day}</span>;
  };

  return (
    <div className="relative h-full min-h-[360px] w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#14141B]/90 shadow-2xl shadow-black/35 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/12 via-transparent to-cyan-400/6" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="border-b border-white/10 px-5 py-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-300 transition hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Campus Calendar
              </p>
              <h2 className="mt-1 text-lg font-extrabold tracking-tight text-white">
                {months[currentMonth]} {currentYear}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-slate-300 transition hover:border-violet-300/35 hover:bg-violet-500/15 hover:text-white"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {selectedDate ? (
            dayEvents.length > 0 ? (
              renderEventDisplay()
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Selected Date
                </p>
                <p className="mt-1 text-sm font-bold text-slate-200">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )
          ) : (
            <button
              type="button"
              onClick={goToToday}
              className="mx-auto flex items-center justify-center gap-2 rounded-full border border-violet-300/20 bg-violet-500/10 px-4 py-2 text-sm font-bold text-violet-100 transition hover:border-violet-300/40 hover:bg-violet-500/20"
            >
              <Calendar size={15} />
              Today
            </button>
          )}
        </div>

        <div className="flex-1 px-5 py-4">
          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {prevMonthDays.map((day, index) => (
              <button
                key={`prev-${index}`}
                type="button"
                className="flex aspect-square items-center justify-center rounded-2xl text-sm font-semibold text-slate-700"
                disabled
              >
                {day}
              </button>
            ))}

            {currentMonthDays.map((day) => {
              const isEventDayType = getEventTypeForDay(day);
              let eventClass = "";

              if (isEventDayType && eventTypeColors[isEventDayType]) {
                eventClass = eventTypeColors[isEventDayType];
              }

              const selected = isSelected(day);
              const todayDate = isToday(day);
              const hasEvent = Boolean(isEventDayType);

              return (
                <button
                  key={`current-${day}`}
                  type="button"
                  onClick={() => handleDateClick(day, "current")}
                  className={`relative flex aspect-square items-center justify-center rounded-2xl text-sm font-bold transition duration-200 hover:-translate-y-0.5 ${
                    todayDate
                      ? "bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-950/40"
                      : selected
                        ? "border border-violet-300/40 bg-violet-500/20 text-violet-100"
                        : hasEvent
                          ? eventClass
                          : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  {renderDayContent(day)}

                  {hasEvent && !todayDate && (
                    <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-current opacity-80" />
                  )}
                </button>
              );
            })}

            {nextMonthDays.map((day, index) => (
              <button
                key={`next-${index}`}
                type="button"
                className="flex aspect-square items-center justify-center rounded-2xl text-sm font-semibold text-slate-700"
                disabled
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" />
            Click a date to view events
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-slate-400">
            {events.length} Events
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppCalendar;