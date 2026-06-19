"use client";

import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Január",
  "Február",
  "Marec",
  "Apríl",
  "Máj",
  "Jún",
  "Júl",
  "August",
  "September",
  "Október",
  "November",
  "December",
];

const WEEKDAYS = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];

function formatLocalDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  return `${day}. ${month}. ${year}`;
}

export interface DatePickerProps {
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ value = "", onChange, className, placeholder, disabled, name }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const parsedDate = useMemo(() => {
      if (!value) return null;
      const parts = value.split("-");
      if (parts.length !== 3) return null;
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return { year, month, day };
    }, [value]);

    const [viewMonth, setViewMonth] = useState(() => parsedDate?.month ?? new Date().getMonth());
    const [viewYear, setViewYear] = useState(() => parsedDate?.year ?? new Date().getFullYear());

    useEffect(() => {
      if (parsedDate) {
        setViewMonth(parsedDate.month);
        setViewYear(parsedDate.year);
      }
    }, [parsedDate]);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    const daysGrid = useMemo(() => {
      const year = viewYear;
      const month = viewMonth;

      const firstDayIdx = (new Date(year, month, 1).getDay() + 6) % 7;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const daysInPrevMonth = new Date(year, month, 0).getDate();

      const grid = [];

      for (let i = firstDayIdx - 1; i >= 0; i--) {
        grid.push({
          day: daysInPrevMonth - i,
          month: month === 0 ? 11 : month - 1,
          year: month === 0 ? year - 1 : year,
          isCurrentMonth: false,
        });
      }

      for (let i = 1; i <= daysInMonth; i++) {
        grid.push({
          day: i,
          month,
          year,
          isCurrentMonth: true,
        });
      }

      const remaining = 42 - grid.length;
      for (let i = 1; i <= remaining; i++) {
        grid.push({
          day: i,
          month: month === 11 ? 0 : month + 1,
          year: month === 11 ? year + 1 : year,
          isCurrentMonth: false,
        });
      }

      return grid;
    }, [viewYear, viewMonth]);

    const selectDate = (year: number, month: number, day: number) => {
      const pad = (n: number) => String(n).padStart(2, "0");
      const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
      if (onChange) {
        onChange({ target: { value: dateStr, name } });
      }
      setIsOpen(false);
    };

    const handlePrevMonth = () => {
      if (viewMonth === 0) {
        setViewMonth(11);
        setViewYear((y) => y - 1);
      } else {
        setViewMonth((m) => m - 1);
      }
    };

    const handleNextMonth = () => {
      if (viewMonth === 11) {
        setViewMonth(0);
        setViewYear((y) => y + 1);
      } else {
        setViewMonth((m) => m + 1);
      }
    };

    const years = useMemo(() => {
      const current = new Date().getFullYear();
      const start = current - 100;
      const end = current + 10;
      const arr = [];
      for (let y = end; y >= start; y--) {
        arr.push(y);
      }
      return arr;
    }, []);

    const formattedValue = useMemo(() => formatLocalDate(value), [value]);

    return (
      <div className="relative w-full" ref={containerRef}>
        <div className="relative w-full">
          <input
            type="text"
            ref={ref}
            readOnly
            disabled={disabled}
            value={formattedValue}
            placeholder={placeholder}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              "flex h-9 w-full cursor-pointer rounded-md border border-input bg-card pl-3 pr-8 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50 select-none",
              className,
              "pr-8"
            )}
          />
          <CalendarDays
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 cursor-pointer text-muted-foreground/75 hover:text-foreground"
          />
        </div>

        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-1.5 w-72 rounded-xl border border-border bg-card p-3 shadow-pop select-none animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between gap-1 pb-3">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="flex size-7 items-center justify-center rounded-md border border-border bg-card hover:bg-secondary text-muted-foreground transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>

              <div className="flex items-center gap-1.5">
                <select
                  value={viewMonth}
                  onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                  className="h-7 rounded-md border border-border bg-card px-1.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i}>
                      {m}
                    </option>
                  ))}
                </select>

                <select
                  value={viewYear}
                  onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                  className="h-7 rounded-md border border-border bg-card px-1.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="flex size-7 items-center justify-center rounded-md border border-border bg-card hover:bg-secondary text-muted-foreground transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-muted-foreground/80 py-1">
              {WEEKDAYS.map((d) => (
                <div key={d} className="h-5 flex items-center justify-center">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 pt-1">
              {daysGrid.map((item, idx) => {
                const isSelected =
                  parsedDate &&
                  parsedDate.day === item.day &&
                  parsedDate.month === item.month &&
                  parsedDate.year === item.year;

                const isToday =
                  new Date().getDate() === item.day &&
                  new Date().getMonth() === item.month &&
                  new Date().getFullYear() === item.year;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectDate(item.year, item.month, item.day)}
                    className={cn(
                      "h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all",
                      item.isCurrentMonth
                        ? "text-foreground hover:bg-secondary"
                        : "text-muted-foreground/45 hover:bg-secondary/40",
                      isSelected
                        ? "bg-primary text-primary-foreground font-semibold shadow-sm scale-95 hover:bg-primary/90 hover:text-primary-foreground"
                        : isToday
                          ? "border border-primary/50 font-semibold text-primary"
                          : ""
                    )}
                  >
                    {item.day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
