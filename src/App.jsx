import React, { useState, useEffect, useMemo } from "react";

// 1. Metadata for all 27 Classrooms (AF, AS including AS03/08/22/25, and AG)
const ROOMS_META = [
  // 1st Floor (AF Block)
  { id: "AF13", floor: "AF", floorName: "1st Floor • AF Block", tag: "3rd/7th Sem CSE" },
  { id: "AF14", floor: "AF", floorName: "1st Floor • AF Block", tag: "3rd Sem CSE" },
  { id: "AF15", floor: "AF", floorName: "1st Floor • AF Block", tag: "3rd/5th Sem CSE" },
  { id: "AF16", floor: "AF", floorName: "1st Floor • AF Block", tag: "CSE Lecture" },
  { id: "AF17", floor: "AF", floorName: "1st Floor • AF Block", tag: "CSE / AIML" },
  { id: "AF18", floor: "AF", floorName: "1st Floor • AF Block", tag: "CSE / DFCS" },
  { id: "AF19", floor: "AF", floorName: "1st Floor • AF Block", tag: "CSE / GT" },
  { id: "AF20", floor: "AF", floorName: "1st Floor • AF Block", tag: "3rd Sem AIML/DS" },
  { id: "AF21", floor: "AF", floorName: "1st Floor • AF Block", tag: "AIML / M.Tech" },
  { id: "AF23", floor: "AF", floorName: "1st Floor • AF Block", tag: "3rd/7th Sem CSE" },
  { id: "AF24", floor: "AF", floorName: "1st Floor • AF Block", tag: "3rd/5th Sem CSE" },
  { id: "AF26A", floor: "AF", floorName: "1st Floor • AF Block", tag: "M.Tech / CC / GT" },
  { id: "AF26B", floor: "AF", floorName: "1st Floor • AF Block", tag: "1 M.Tech / CC" },

  // 2nd Floor (AS Block - including AS03, AS08, AS22, AS25)
  { id: "AS03", floor: "AS", floorName: "2nd Floor • AS Block", tag: "3ECE / Shared" },
  { id: "AS08", floor: "AS", floorName: "2nd Floor • AS Block", tag: "3ECE Lab / Shared" },
  { id: "AS17", floor: "AS", floorName: "2nd Floor • AS Block", tag: "5th Sem CSE-A" },
  { id: "AS18", floor: "AS", floorName: "2nd Floor • AS Block", tag: "5th Sem CSE-B" },
  { id: "AS19", floor: "AS", floorName: "2nd Floor • AS Block", tag: "5th Sem CSE-C" },
  { id: "AS20", floor: "AS", floorName: "2nd Floor • AS Block", tag: "CSE Lecture" },
  { id: "AS22", floor: "AS", floorName: "2nd Floor • AS Block", tag: "3ECE / Shared" },
  { id: "AS24", floor: "AS", floorName: "2nd Floor • AS Block", tag: "5th Sem CSE-D" },
  { id: "AS25", floor: "AS", floorName: "2nd Floor • AS Block", tag: "5ECE / Shared" },
  { id: "AS27", floor: "AS", floorName: "2nd Floor • AS Block", tag: "5th Sem CSE-E" },

  // Ground Floor (AG Block)
  { id: "AG-22", floor: "AG", floorName: "Ground Floor • AG Block", tag: "5th AIML-B / 7th" },
  { id: "AG-23", floor: "AG", floorName: "Ground Floor • AG Block", tag: "5th BAIML-C" },
  { id: "AG-24-B", floor: "AG", floorName: "Ground Floor • AG Block", tag: "3 M.Tech / 7th CC" },
  { id: "AG-25", floor: "AG", floorName: "Ground Floor • AG Block", tag: "5th AIML-A" }
];

const DAYS = [
  { id: "Mo", name: "Monday", short: "Mon" },
  { id: "Tu", name: "Tuesday", short: "Tue" },
  { id: "We", name: "Wednesday", short: "Wed" },
  { id: "Th", name: "Thursday", short: "Thu" },
  { id: "Fr", name: "Friday", short: "Fri" }
];

const PERIODS = [
  { id: 1, label: "P1", time: "8:10 - 9:00", start: 490, end: 540, endStr: "9:00" },
  { id: 2, label: "P2", time: "9:00 - 9:50", start: 540, end: 590, endStr: "9:50" },
  { id: 3, label: "P3", time: "9:50 - 10:40", start: 590, end: 640, endStr: "10:40" },
  { id: 4, label: "P4", time: "10:40 - 11:30", start: 640, end: 690, endStr: "11:30" },
  { id: 5, label: "P5", time: "11:30 - 12:20", start: 690, end: 740, endStr: "12:20" },
  { id: 6, label: "P6", time: "12:20 - 13:10", start: 740, end: 790, endStr: "13:10" },
  { id: 7, label: "P7", time: "13:10 - 14:00", start: 790, end: 840, endStr: "14:00" },
  { id: 8, label: "P8", time: "14:00 - 14:50", start: 840, end: 890, endStr: "14:50" },
  { id: 9, label: "P9", time: "14:50 - 15:40", start: 890, end: 940, endStr: "15:40" },
  { id: 10, label: "P10", time: "15:40 - 16:30", start: 940, end: 990, endStr: "16:30" }
];

const ALL_ROOM_IDS = ROOMS_META.map((r) => r.id);

// 2. Empty Classrooms Dataset across all 50 timetable sheets
const EMPTY_DATA = {
  Mo: {
    1: ["AF16","AF18","AF19","AF20","AF21","AF24","AF26A","AF26B","AS03","AS20","AS22","AS25","AG-24-B"],
    2: ["AF15","AF18","AF20","AS03","AS20","AS22","AS25","AG-24-B"],
    3: ["AF15","AF26A","AF26B","AS03","AS08","AS19","AS22","AS25","AS27","AG-24-B"],
    4: ["AF13","AF14","AF18","AF23","AF26A","AF26B","AS08","AS20","AS22","AS25","AG-24-B","AG-25"],
    5: ["AF17","AF20","AF23","AF26A","AF26B","AS03","AS08","AS17","AS18","AS19","AS20","AS22","AS24","AS25","AS27","AG-22","AG-24-B","AG-25"],
    6: ["AF14","AF15","AF18","AF19","AF20","AF23","AF24","AF26A","AF26B","AS03","AS08","AS19","AS20","AS22","AS25","AG-22","AG-25"],
    7: ["AF16","AF17","AF18","AF19","AF20","AF24","AF26A","AF26B","AS08","AS19","AS20","AS22","AS24","AS25","AG-25"],
    8: ["AF15","AF17","AF18","AF21","AF26B","AS03","AS08","AS17","AS18","AS22","AS24","AS25","AS27","AG-24-B"],
    9: ["AF13","AF15","AF16","AF17","AF18","AF20","AF21","AF24","AF26A","AF26B","AS03","AS08","AS17","AS18","AS20","AS22","AS24","AS25","AS27","AG-22","AG-24-B","AG-25"],
    10: ALL_ROOM_IDS.filter((id) => id !== "AF14")
  },
  Tu: {
    1: ["AF14","AF15","AF16","AF17","AF18","AF19","AF21","AF26A","AF26B","AS03","AS08","AS20","AS22","AS24","AS25","AS27","AG-24-B","AG-25"],
    2: ["AF14","AF15","AF16","AF17","AF19","AF21","AS03","AS08","AS20","AS22","AS24","AS25","AS27"],
    3: ["AF14","AF21","AS03","AS08","AS17","AS18","AS19","AS25"],
    4: ["AF13","AF16","AF17","AF18","AF20","AF26B","AS08","AS22","AS25","AG-22"],
    5: ["AF13","AF16","AF17","AF18","AF19","AF20","AF21","AF23","AF24","AF26A","AF26B","AS03","AS08","AS17","AS18","AS19","AS20","AS22","AS25","AS27","AG-22","AG-24-B"],
    6: ["AF13","AF15","AF16","AF18","AF20","AS03","AS08","AS18","AS19","AS22","AS25","AG-22"],
    7: ["AF15","AF16","AF17","AF18","AF19","AF23","AS03","AS08","AS20","AS22","AS25","AG-23"],
    8: ["AF18","AF23","AF24","AF26A","AS03","AS08","AS18","AS22","AS25","AS27","AG-23","AG-24-B"],
    9: ["AF17","AF18","AF21","AF23","AF24","AF26A","AF26B","AS03","AS08","AS17","AS18","AS19","AS20","AS22","AS24","AS25","AS27","AG-22","AG-23","AG-24-B","AG-25"],
    10: ALL_ROOM_IDS
  },
  We: {
    1: ["AF19","AF26A","AF26B","AS03","AS08","AS20","AS22","AS25","AG-24-B"],
    2: ["AF26A","AS03","AS08","AS22","AS25"],
    3: ["AF18","AF19","AF21","AS03","AS08","AS20","AS22","AS25","AG-22"],
    4: ["AF26B","AS03","AS08","AS18","AS20","AS22","AS24","AS25","AG-24-B"],
    5: ["AF16","AF17","AF18","AF19","AF23","AF24","AF26A","AS08","AS17","AS18","AS19","AS20","AS22","AS25","AG-22","AG-23","AG-24-B"],
    6: ["AF15","AF23","AF24","AF26A","AS03","AS08","AS17","AS20","AS22","AG-23"],
    7: ["AF15","AF16","AF17","AF18","AF19","AF26A","AS08","AS20","AS22","AS25","AG-25"],
    8: ["AF17","AF18","AF21","AS08","AS19","AS20","AS22","AS24","AS25","AG-22","AG-23"],
    9: ["AF13","AF16","AF17","AF18","AF20","AF21","AF23","AF24","AF26B","AS03","AS08","AS17","AS18","AS19","AS20","AS22","AS24","AS25","AS27","AG-22","AG-23","AG-24-B","AG-25"],
    10: ALL_ROOM_IDS
  },
  Th: {
    1: ["AF19","AF20","AS03","AS08","AS17","AS22","AS25","AG-23","AG-24-B","AG-25"],
    2: ["AF16","AS03","AS08","AS20","AS22","AS25","AG-25"],
    3: ["AF13","AF14","AF17","AF21","AS03","AS20","AS22","AS24","AS25","AS27"],
    4: ["AF18","AF26A","AF26B","AS03","AS19","AS22","AS25","AG-22","AG-24-B","AG-25"],
    5: ["AF19","AF21","AF23","AF24","AS03","AS08","AS18","AS19","AS20","AS22","AS24","AS25","AS27","AG-22","AG-23","AG-24-B","AG-25"],
    6: ["AF13","AF14","AF15","AF23","AS03","AS08","AS17","AS22","AS27","AG-22","AG-24-B","AG-25"],
    7: ["AF15","AF16","AF18","AF26A","AS03","AS08","AS17","AS18","AS20","AS22","AS24","AS25","AG-22","AG-24-B","AG-25"],
    8: ["AF13","AF14","AF15","AF16","AF17","AF18","AF23","AF24","AS03","AS08","AS17","AS20","AS22","AS24","AS25","AG-24-B"],
    9: ["AF13","AF14","AF15","AF16","AF17","AF18","AF19","AF20","AF21","AF24","AS03","AS08","AS17","AS18","AS19","AS20","AS22","AS24","AS25","AS27","AG-22","AG-23","AG-24-B","AG-25"],
    10: ALL_ROOM_IDS.filter((id) => id !== "AF26B")
  },
  Fr: {
    1: ["AF13","AF14","AF16","AF17","AF18","AF19","AF26A","AF26B","AS03","AS08","AS20","AS22","AS24","AS25","AG-23","AG-24-B"],
    2: ["AF14","AF20","AF26A","AF26B","AS03","AS08","AS20","AS22","AS24","AS25","AG-23","AG-24-B"],
    3: ["AF14","AF16","AF19","AF20","AF26A","AF26B","AS03","AS08","AS17","AS18","AS25","AG-24-B"],
    4: ["AF15","AF17","AF19","AF21","AF26A","AF26B","AS03","AS08","AS17","AS18","AS20","AS22","AS27","AG-24-B"],
    5: ["AF13","AF14","AF15","AF16","AF17","AF20","AF21","AF23","AF24","AF26A","AF26B","AS03","AS08","AS17","AS18","AS19","AS20","AS22","AS24","AS25","AS27","AG-22","AG-23","AG-24-B","AG-25"],
    6: ["AF13","AF14","AF16","AF17","AF18","AF19","AF21","AF26A","AF26B","AS03","AS08","AS20","AS22","AS24","AS25","AS27","AG-22","AG-24-B"],
    7: ["AF14","AF21","AF24","AF26A","AF26B","AS03","AS08","AS20","AS22","AS24","AS25","AG-22","AG-23","AG-25"],
    8: ["AF13","AF15","AF17","AF21","AF23","AF26A","AF26B","AS03","AS08","AS17","AS18","AS19","AS20","AS22","AS24","AS25","AS27","AG-22","AG-23"],
    9: ["AF13","AF14","AF15","AF18","AF19","AF20","AF21","AF23","AF24","AF26A","AF26B","AS03","AS08","AS17","AS18","AS19","AS20","AS22","AS24","AS25","AS27","AG-22","AG-23","AG-24-B","AG-25"],
    10: ALL_ROOM_IDS
  }
};

function isRoomFree(roomId, day, period) {
  return EMPTY_DATA[day]?.[period]?.includes(roomId) ?? false;
}

function getFreeStreak(roomId, day, startPeriod) {
  if (!isRoomFree(roomId, day, startPeriod)) {
    return { count: 0, until: null, allDay: false };
  }
  let count = 0;
  let lastPeriod = PERIODS[startPeriod - 1];
  for (let p = startPeriod; p <= 10; p++) {
    if (isRoomFree(roomId, day, p)) {
      count++;
      lastPeriod = PERIODS[p - 1];
    } else {
      break;
    }
  }
  return {
    count,
    until: lastPeriod.endStr,
    allDay: startPeriod + count - 1 === 10
  };
}

export default function App() {
  const [selectedDay, setSelectedDay] = useState("Mo");
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [selectedFloor, setSelectedFloor] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOccupied, setShowOccupied] = useState(false);
  const [sortByStreak, setSortByStreak] = useState(false);
  const [modalRoom, setModalRoom] = useState(null);
  const [now, setNow] = useState(new Date());

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-sync on initial mount
  useEffect(() => {
    syncToLiveTime();
  }, []);

  const syncToLiveTime = () => {
    const current = new Date();
    const dayMap = { 1: "Mo", 2: "Tu", 3: "We", 4: "Th", 5: "Fr" };
    setSelectedDay(dayMap[current.getDay()] || "Mo");

    const mins = current.getHours() * 60 + current.getMinutes();
    const active = PERIODS.find((p) => mins >= p.start && mins < p.end);
    if (active) {
      setSelectedPeriod(active.id);
    } else if (mins < 490) {
      setSelectedPeriod(1);
    } else {
      setSelectedPeriod(10);
    }
  };

  // Live status banner text
  const liveInfo = useMemo(() => {
    const dayIdx = now.getDay();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const clockStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    const mins = now.getHours() * 60 + now.getMinutes();

    if (dayIdx === 0 || dayIdx === 6) {
      return { clock: `${dayNames[dayIdx]} • ${clockStr}`, status: "Weekend — Campus Free", isLive: false };
    }
    const active = PERIODS.find((p) => mins >= p.start && mins < p.end);
    if (active) {
      return {
        clock: `${dayNames[dayIdx]} • ${clockStr}`,
        status: `Live: ${active.label} (${active.end - mins}m left)`,
        isLive: true
      };
    }
    if (mins < 490) {
      return { clock: `${dayNames[dayIdx]} • ${clockStr}`, status: "Before P1 (Starts 8:10 AM)", isLive: false };
    }
    return { clock: `${dayNames[dayIdx]} • ${clockStr}`, status: "After Hours — Rooms Free", isLive: false };
  }, [now]);

  // Summary statistics for the selected Day + Period
  const stats = useMemo(() => {
    const freeIds = EMPTY_DATA[selectedDay][selectedPeriod] || [];
    let bestRoom = "—";
    let bestCount = 0;

    freeIds.forEach((id) => {
      const s = getFreeStreak(id, selectedDay, selectedPeriod);
      if (s.count > bestCount) {
        bestCount = s.count;
        bestRoom = id;
      }
    });

    return {
      freeCount: freeIds.length,
      busyCount: ROOMS_META.length - freeIds.length,
      bestRoom,
      bestCount
    };
  }, [selectedDay, selectedPeriod]);

  // Filtered and grouped rooms
  const groupedFloors = useMemo(() => {
    const floors = ["AF", "AS", "AG"];
    const q = searchQuery.trim().toUpperCase();

    return floors
      .filter((f) => selectedFloor === "ALL" || selectedFloor === f)
      .map((floorCode) => {
        let rooms = ROOMS_META.filter((r) => {
          if (r.floor !== floorCode) return false;
          if (q && !r.id.includes(q) && !r.tag.toUpperCase().includes(q)) return false;
          const free = isRoomFree(r.id, selectedDay, selectedPeriod);
          if (!showOccupied && !free) return false;
          return true;
        }).map((r) => ({
          ...r,
          free: isRoomFree(r.id, selectedDay, selectedPeriod),
          streak: getFreeStreak(r.id, selectedDay, selectedPeriod)
        }));

        if (sortByStreak) {
          rooms.sort((a, b) => b.streak.count - a.streak.count || a.id.localeCompare(b.id));
        }

        const totalFloorFree = ROOMS_META.filter(
          (r) => r.floor === floorCode && isRoomFree(r.id, selectedDay, selectedPeriod)
        ).length;

        return {
          floorCode,
          floorName: ROOMS_META.find((r) => r.floor === floorCode)?.floorName || floorCode,
          rooms,
          totalFloorFree
        };
      })
      .filter((group) => group.rooms.length > 0);
  }, [selectedDay, selectedPeriod, selectedFloor, searchQuery, showOccupied, sortByStreak]);

  const currentDayObj = DAYS.find((d) => d.id === selectedDay);
  const currentPeriodObj = PERIODS.find((p) => p.id === selectedPeriod);

  return (
    <div className="app-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700;800&display=swap');

        :root {
          --bg-dark: #070a12;
          --bg-card: rgba(15, 23, 42, 0.72);
          --bg-card-hover: rgba(22, 33, 58, 0.9);
          --border-subtle: rgba(148, 163, 184, 0.14);
          --emerald: #10b981;
          --emerald-glow: rgba(16, 185, 129, 0.22);
          --rose: #f43f5e;
          --sky: #38bdf8;
          --amber: #f59e0b;
          --text-main: #f8fafc;
          --text-muted: #94a3b8;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body, .app-shell {
          min-height: 100vh;
          background-color: var(--bg-dark);
          background-image:
            radial-gradient(circle at 12% 8%, rgba(16, 185, 129, 0.12), transparent 40%),
            radial-gradient(circle at 88% 12%, rgba(56, 189, 248, 0.12), transparent 42%),
            radial-gradient(circle at 50% 90%, rgba(99, 102, 241, 0.08), transparent 50%);
          color: var(--text-main);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* Top Header */
        .top-nav {
          position: sticky;
          top: 0;
          z-index: 30;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          background: rgba(7, 10, 18, 0.82);
          border-bottom: 1px solid var(--border-subtle);
        }
        .nav-inner {
          max-width: 1260px;
          margin: 0 auto;
          padding: 14px 20px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-logo {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(56, 189, 248, 0.2));
          border: 1px solid rgba(16, 185, 129, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 15px;
          color: #34d399;
          letter-spacing: 0.5px;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
        }
        .brand-title {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.3px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .badge-wef {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.3);
          color: #7dd3fc;
        }
        .brand-sub {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        /* Live Pill */
        .live-box {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid var(--border-subtle);
          padding: 8px 14px;
          border-radius: 14px;
        }
        .pulse-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--emerald);
          box-shadow: 0 0 12px var(--emerald);
          animation: pulseGlow 2s infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.25); opacity: 0.65; }
        }
        .live-clock {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
        }
        .live-status {
          font-size: 11px;
          color: #34d399;
          font-weight: 500;
        }
        .btn-now {
          background: linear-gradient(135deg, #10b981, #059669);
          color: #042f2e;
          border: none;
          padding: 7px 13px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
        }
        .btn-now:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.45);
        }

        /* Container */
        .main-container {
          max-width: 1260px;
          margin: 0 auto;
          padding: 22px 20px 60px;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        /* Control Panel */
        .control-panel {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
        }
        .controls-top {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
        }
        .control-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--text-muted);
          margin-bottom: 8px;
          display: block;
        }
        .segmented {
          display: inline-flex;
          flex-wrap: wrap;
          background: rgba(7, 10, 18, 0.9);
          padding: 4px;
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
          gap: 4px;
        }
        .seg-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 7px 14px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .seg-btn:hover {
          color: #fff;
        }
        .seg-btn.active-emerald {
          background: var(--emerald);
          color: #032219;
          font-weight: 700;
          box-shadow: 0 2px 12px rgba(16, 185, 129, 0.35);
        }
        .seg-btn.active-sky {
          background: var(--sky);
          color: #082f49;
          font-weight: 700;
          box-shadow: 0 2px 12px rgba(56, 189, 248, 0.35);
        }

        /* Search & Toggles */
        .filter-right {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }
        .search-input {
          background: rgba(7, 10, 18, 0.9);
          border: 1px solid var(--border-subtle);
          color: #fff;
          padding: 9px 14px;
          border-radius: 12px;
          font-size: 12px;
          width: 220px;
          outline: none;
          font-family: 'JetBrains Mono', monospace;
          transition: border-color 0.15s;
        }
        .search-input:focus {
          border-color: var(--emerald);
        }

        .toggle-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .toggles-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .chip-toggle {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: var(--text-muted);
          cursor: pointer;
          user-select: none;
          padding: 5px 10px;
          border-radius: 8px;
          background: rgba(7, 10, 18, 0.6);
          border: 1px solid var(--border-subtle);
          transition: all 0.15s;
        }
        .chip-toggle.active {
          color: #fff;
          border-color: rgba(56, 189, 248, 0.45);
          background: rgba(56, 189, 248, 0.12);
        }

        /* Period Grid */
        .period-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
          gap: 8px;
        }
        .period-btn {
          background: rgba(7, 10, 18, 0.85);
          border: 1px solid var(--border-subtle);
          border-radius: 13px;
          padding: 10px 11px;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s;
          color: var(--text-main);
        }
        .period-btn:hover {
          border-color: rgba(148, 163, 184, 0.35);
          transform: translateY(-1px);
        }
        .period-btn.active {
          background: rgba(16, 185, 129, 0.14);
          border-color: var(--emerald);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
        }
        .p-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .p-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 800;
          color: #fff;
        }
        .period-btn.active .p-label {
          color: #34d399;
        }
        .p-count {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 6px;
          background: rgba(15, 23, 42, 0.9);
          color: #34d399;
          font-weight: 600;
        }
        .p-time {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 6px;
        }

        /* KPI Stats Row */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }
        .kpi-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .kpi-card.emerald-tint {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(15, 23, 42, 0.75));
          border-color: rgba(16, 185, 129, 0.3);
        }
        .kpi-title {
          font-size: 12px;
          color: var(--text-muted);
        }
        .kpi-val {
          font-size: 24px;
          font-weight: 800;
          font-family: 'JetBrains Mono', monospace;
          margin-top: 3px;
        }
        .kpi-sub {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .kpi-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        /* Floor Group */
        .floor-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .floor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 8px;
        }
        .floor-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .floor-title {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #e2e8f0;
        }
        .floor-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          padding: 2px 9px;
          border-radius: 999px;
          background: rgba(16, 185, 129, 0.12);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        /* Room Cards Grid */
        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
        }
        .room-card {
          background: var(--bg-card);
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.18s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 14px;
        }
        .room-card.free {
          border: 1px solid rgba(16, 185, 129, 0.32);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }
        .room-card.free:hover {
          background: var(--bg-card-hover);
          border-color: #34d399;
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(16, 185, 129, 0.15);
        }
        .room-card.busy {
          border: 1px solid rgba(244, 63, 94, 0.22);
          opacity: 0.72;
        }
        .room-card.busy:hover {
          opacity: 1;
          border-color: rgba(244, 63, 94, 0.45);
        }
        .room-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .room-id {
          font-family: 'JetBrains Mono', monospace;
          font-size: 21px;
          font-weight: 800;
          color: #fff;
        }
        .room-tag {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .status-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 800;
          padding: 4px 9px;
          border-radius: 999px;
          letter-spacing: 0.4px;
        }
        .status-pill.free {
          background: rgba(16, 185, 129, 0.16);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.35);
        }
        .status-pill.busy {
          background: rgba(244, 63, 94, 0.15);
          color: #fb7185;
          border: 1px solid rgba(244, 63, 94, 0.3);
        }

        .streak-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid var(--border-subtle);
          font-size: 12px;
        }
        .streak-val {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          color: #38bdf8;
        }
        .streak-val.high {
          color: #34d399;
        }

        /* 10-Period Mini Timeline Bar */
        .mini-bar {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .mini-seg {
          height: 6px;
          flex: 1;
          border-radius: 999px;
          transition: all 0.15s;
        }
        .mini-seg.free {
          background: rgba(16, 185, 129, 0.75);
        }
        .mini-seg.busy {
          background: rgba(244, 63, 94, 0.45);
        }
        .mini-seg.current {
          outline: 2px solid #fff;
          transform: scaleY(1.35);
        }
        .mini-labels {
          display: flex;
          justify-content: space-between;
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          color: #64748b;
          margin-top: 4px;
        }

        /* Modal Overlay */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(3, 6, 12, 0.82);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .modal-card {
          background: #0f172a;
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 20px;
          max-width: 650px;
          width: 100%;
          max-height: 88vh;
          overflow-y: auto;
          padding: 22px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .modal-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .btn-close {
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: #fff;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
        }
        .heatmap-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
        }
        .heatmap-table th {
          color: var(--text-muted);
          font-weight: 600;
          padding: 4px;
          text-align: center;
        }
        .heat-cell {
          padding: 8px 4px;
          border-radius: 7px;
          text-align: center;
          font-weight: 700;
          font-size: 10px;
        }
        .heat-cell.free {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.35);
        }
        .heat-cell.busy {
          background: rgba(244, 63, 94, 0.15);
          color: #fb7185;
          border: 1px solid rgba(244, 63, 94, 0.25);
        }

        /* Responsive */
        @media (max-width: 600px) {
          .nav-inner { padding: 10px 14px; }
          .brand-title { font-size: 15px; }
          .live-box { padding: 6px 10px; gap: 8px; }
          .main-container { padding: 14px 14px 40px; gap: 14px; }
          .rooms-grid { grid-template-columns: 1fr; }
          .period-grid { grid-template-columns: repeat(5, 1fr); }
        }
      `}</style>

      {/* Top Navigation */}
      <header className="top-nav">
        <div className="nav-inner">
          <div className="brand">
            <div className="brand-logo">MR</div>
            <div>
              <div className="brand-title">
                MRIIRS Empty Classroom Finder
                <span className="badge-wef">w.e.f. 21 Oct 2026</span>
              </div>
              <div className="brand-sub">
                27 Classrooms Tracked • 1st Floor (AF), 2nd Floor (AS + AS03/08/22/25) & Ground (AG)
              </div>
            </div>
          </div>

          <div className="live-box">
            <div className="pulse-dot" />
            <div>
              <div className="live-clock">{liveInfo.clock}</div>
              <div className="live-status">{liveInfo.status}</div>
            </div>
            <button className="btn-now" onClick={syncToLiveTime}>
              ⚡ Sync Now
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-container">
        {/* Control Panel */}
        <section className="control-panel">
          <div className="controls-top">
            <div>
              <span className="control-label">1. Select Day</span>
              <div className="segmented">
                {DAYS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDay(d.id)}
                    className={`seg-btn ${selectedDay === d.id ? "active-emerald" : ""}`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-right">
              <div>
                <span className="control-label">Floor Filter</span>
                <div className="segmented">
                  {[
                    { id: "ALL", label: "All (27)" },
                    { id: "AF", label: "1st • AF (13)" },
                    { id: "AS", label: "2nd • AS (10)" },
                    { id: "AG", label: "Ground • AG (4)" }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFloor(f.id)}
                      className={`seg-btn ${selectedFloor === f.id ? "active-sky" : ""}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="control-label">Quick Search</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Room (e.g. AS25, AF13)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Period Scroller */}
          <div>
            <div className="toggle-row" style={{ marginBottom: "10px" }}>
              <span className="control-label" style={{ marginBottom: 0 }}>
                2. Select Period / Time Slot
              </span>
              <div className="toggles-group">
                <div
                  onClick={() => setSortByStreak(!sortByStreak)}
                  className={`chip-toggle ${sortByStreak ? "active" : ""}`}
                >
                  <span>{sortByStreak ? "★" : "☆"}</span>
                  <span>Sort by Longest Free Streak</span>
                </div>
                <div
                  onClick={() => setShowOccupied(!showOccupied)}
                  className={`chip-toggle ${showOccupied ? "active" : ""}`}
                >
                  <span>{showOccupied ? "☑" : "☐"}</span>
                  <span>Show Occupied Rooms</span>
                </div>
              </div>
            </div>

            <div className="period-grid">
              {PERIODS.map((p) => {
                const freeCount = EMPTY_DATA[selectedDay][p.id].length;
                const active = selectedPeriod === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPeriod(p.id)}
                    className={`period-btn ${active ? "active" : ""}`}
                  >
                    <div className="p-top">
                      <span className="p-label">{p.label}</span>
                      <span className="p-count">{freeCount} free</span>
                    </div>
                    <div className="p-time">{p.time}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* KPI Summary Bar */}
        <section className="kpi-grid">
          <div className="kpi-card">
            <div>
              <div className="kpi-title">Active Slot</div>
              <div className="kpi-val" style={{ fontSize: "19px" }}>
                {currentDayObj.name} • {currentPeriodObj.label}
              </div>
              <div className="kpi-sub" style={{ color: "#34d399" }}>
                {currentPeriodObj.time}
              </div>
            </div>
            <div className="kpi-icon">🕒</div>
          </div>

          <div className="kpi-card emerald-tint">
            <div>
              <div className="kpi-title" style={{ color: "#a7f3d0" }}>
                Empty Classrooms
              </div>
              <div className="kpi-val" style={{ color: "#34d399" }}>
                {stats.freeCount} <span style={{ fontSize: "14px", fontWeight: 500 }}>/ 27</span>
              </div>
              <div className="kpi-sub">Unlocked & available now</div>
            </div>
            <div className="kpi-icon" style={{ color: "#34d399" }}>
              ✓
            </div>
          </div>

          <div className="kpi-card">
            <div>
              <div className="kpi-title">Occupied Classrooms</div>
              <div className="kpi-val" style={{ color: "#fb7185" }}>
                {stats.busyCount}
              </div>
              <div className="kpi-sub">Lecture in progress</div>
            </div>
            <div className="kpi-icon" style={{ color: "#fb7185" }}>
              ✕
            </div>
          </div>

          <div className="kpi-card">
            <div>
              <div className="kpi-title">Best Long-Stay Pick</div>
              <div className="kpi-val" style={{ color: "#38bdf8" }}>
                {stats.bestRoom}
              </div>
              <div className="kpi-sub">
                Free for {stats.bestCount} consecutive period{stats.bestCount === 1 ? "" : "s"}
              </div>
            </div>
            <div className="kpi-icon">⭐</div>
          </div>
        </section>

        {/* Floor Sections & Room Cards */}
        {groupedFloors.map((group) => (
          <section key={group.floorCode} className="floor-section">
            <div className="floor-header">
              <div className="floor-title-wrap">
                <h2 className="floor-title">{group.floorName}</h2>
                <span className="floor-pill">{group.totalFloorFree} Free Now</span>
              </div>
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Click any card for weekly 5×10 room matrix
              </span>
            </div>

            <div className="rooms-grid">
              {group.rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setModalRoom(room)}
                  className={`room-card ${room.free ? "free" : "busy"}`}
                >
                  <div>
                    <div className="room-top">
                      <div>
                        <div className="room-id">{room.id}</div>
                        <div className="room-tag">{room.tag}</div>
                      </div>
                      <span className={`status-pill ${room.free ? "free" : "busy"}`}>
                        {room.free ? "FREE" : "BUSY"}
                      </span>
                    </div>

                    <div className="streak-row">
                      <span style={{ color: "#94a3b8" }}>
                        {room.free ? "Available Streak:" : "Current Status:"}
                      </span>
                      {room.free ? (
                        <span className={`streak-val ${room.streak.count >= 3 ? "high" : ""}`}>
                          {room.streak.allDay
                            ? "Free rest of day"
                            : `${room.streak.count}P (until ${room.streak.until})`}
                        </span>
                      ) : (
                        <span style={{ color: "#fb7185", fontWeight: 600 }}>
                          Occupied in P{selectedPeriod}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 10-Period Mini Bar */}
                  <div>
                    <div className="mini-bar">
                      {PERIODS.map((p) => {
                        const pFree = isRoomFree(room.id, selectedDay, p.id);
                        return (
                          <div
                            key={p.id}
                            title={`${p.label} (${p.time}): ${pFree ? "Free" : "Occupied"}`}
                            className={`mini-seg ${pFree ? "free" : "busy"} ${
                              p.id === selectedPeriod ? "current" : ""
                            }`}
                          />
                        );
                      })}
                    </div>
                    <div className="mini-labels">
                      <span>P1 (8:10)</span>
                      <span>P5</span>
                      <span>P10 (16:30)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Weekly 5x10 Heatmap Modal for Selected Room */}
      {modalRoom && (
        <div className="modal-backdrop" onClick={() => setModalRoom(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "24px",
                      fontWeight: 800
                    }}
                  >
                    {modalRoom.id}
                  </span>
                  <span className="badge-wef">{modalRoom.floorName}</span>
                </div>
                <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                  {modalRoom.tag} • Full Weekly Availability Heatmap (Mon–Fri)
                </p>
              </div>
              <button className="btn-close" onClick={() => setModalRoom(null)}>
                ✕
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="heatmap-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    {PERIODS.map((p) => (
                      <th key={p.id}>
                        <div>{p.label}</div>
                        <div style={{ fontSize: "9px", opacity: 0.7 }}>{p.time.split(" - ")[0]}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((d) => (
                    <tr key={d.id}>
                      <td
                        style={{
                          fontWeight: 700,
                          color: d.id === selectedDay ? "#34d399" : "#cbd5e1",
                          paddingRight: "8px"
                        }}
                      >
                        {d.short}
                      </td>
                      {PERIODS.map((p) => {
                        const free = isRoomFree(modalRoom.id, d.id, p.id);
                        const isCurrentSelection =
                          d.id === selectedDay && p.id === selectedPeriod;
                        return (
                          <td
                            key={p.id}
                            className={`heat-cell ${free ? "free" : "busy"}`}
                            style={
                              isCurrentSelection
                                ? { outline: "2px solid #fff", fontWeight: 800 }
                                : undefined
                            }
                          >
                            {free ? "FREE" : "BUSY"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
