export type TimeInterval = {
  start: number;
  end: number;
};

export type AppointmentInterval = {
  start: Date;
  end: Date;
};

export type BlockedInterval = {
  time: string;     
  duration: number;  
};

export class ScheduleDomain {
  private timeToMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }

  private minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60).toString().padStart(2, "0");
    const m = (minutes % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  }

  generateSlots(
    workStart: string,
    workEnd: string,
    serviceDuration: number,
    stepMinutes = serviceDuration
  ): string[] {
    const slots: string[] = [];
    let current = this.timeToMinutes(workStart);
    const endMinutes = this.timeToMinutes(workEnd);

    while (current + serviceDuration <= endMinutes) {
      slots.push(this.minutesToTime(current));
      current += stepMinutes;
    }

    return slots;
  }

  filterAvailableSlots(
    slots: string[],
    appointments: AppointmentInterval[],
    blocked: BlockedInterval[],
    serviceDuration: number,
    bufferMinutes = 0
  ): string[] {
    const busyIntervals: TimeInterval[] = [];

    for (const app of appointments) {
      const start =
        app.start.getHours() * 60 + app.start.getMinutes();
      const end =
        app.end.getHours() * 60 + app.end.getMinutes();

      busyIntervals.push({
        start: start - bufferMinutes,
        end: end + bufferMinutes,
      });
    }

    for (const block of blocked) {
      const start = this.timeToMinutes(block.time);
      const end = start + block.duration;

      busyIntervals.push({ start, end });
    }

    return slots.filter((time) => {
      const slotStart = this.timeToMinutes(time);
      const slotEnd = slotStart + serviceDuration;

      return !busyIntervals.some(
        busy => slotStart < busy.end && slotEnd > busy.start
      );
    });
  }
}
