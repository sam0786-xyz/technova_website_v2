"use client";

import { useState, useEffect } from "react";

export default function LiveTimer({ timerEnd }: { timerEnd: string | null }) {
    const [timeLeft, setTimeLeft] = useState("--:--:--");

    useEffect(() => {
        if (!timerEnd) {
            setTimeLeft("--:--:--");
            return;
        }

        const endTime = new Date(timerEnd).getTime();

        const update = () => {
            const remaining = endTime - Date.now();
            if (remaining <= 0) {
                setTimeLeft("00:00:00");
                return;
            }
            const h = Math.floor(remaining / 3600000);
            const m = Math.floor((remaining % 3600000) / 60000);
            const s = Math.floor((remaining % 60000) / 1000);
            setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [timerEnd]);

    return <span>{timeLeft}</span>;
}
