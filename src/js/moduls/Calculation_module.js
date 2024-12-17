class Event {
  constructor(id) {
    this.id = id;
    this.earliestTime = 0;
    this.latestTime = 0;
    this.delta = 0;
    this.outgoing = [];
  }
}

class Activity {
  constructor(name, duration, fromEvent, toEvent) {
    this.name = name;
    this.duration = parseFloat(duration);
    this.fromEvent = fromEvent;
    this.toEvent = toEvent;
  }
}

export const calculateResults = (rows) => {
  try {
    const events = new Map();
    const activities = [];
    var totalDuration = 0;

    // Pomocnicza funkcja do tworzenia lub pobierania zdarzenia
    const getEvent = (id) => {
      if (!events.has(id)) {
        events.set(id, new Event(id));
      }
      return events.get(id);
    };

    rows.forEach((row, index) => {
      if (!row.name || !row.duration || !row.range) {
        throw new Error(`Brakujące dane w wierszu ${index + 1}`);
      }

      const [from, to] = row.range.split('-').map(Number);
      if (isNaN(from) || isNaN(to) || from >= to) {
        throw new Error(`Nieprawidłowy zakres w wierszu ${index + 1}`);
      }

      const fromEvent = getEvent(from);
      const toEvent = getEvent(to);

      const activity = new Activity(row.name, row.duration, fromEvent.id, toEvent.id);
      activities.push(activity);
      fromEvent.outgoing.push(activity);

      totalDuration += activity.duration;
    });

    // Forward pass: Obliczamy najwcześniejsze czasy
    events.forEach((event) => {
      event.outgoing.forEach((activity) => {
        const targetEvent = getEvent(activity.toEvent);
        targetEvent.earliestTime = Math.max(
          targetEvent.earliestTime,
          event.earliestTime + activity.duration
        );
      });
    });

    // Backward pass: Obliczamy najpóźniejsze czasy
    const eventList = Array.from(events.values()).reverse();
    const lastEvent = eventList[0];
    lastEvent.latestTime = lastEvent.earliestTime;

    eventList.forEach((event) => {
      event.outgoing.forEach((activity) => {
        const targetEvent = getEvent(activity.toEvent);
        event.latestTime = Math.min(
          event.latestTime || targetEvent.latestTime - activity.duration,
          targetEvent.latestTime - activity.duration
        );
      });
      event.delta = event.latestTime - event.earliestTime;
    });

    const totalRange = rows.reduce((acc, row) => {
      const [start, end] = row.range.split('-').map(Number);
      return {
        start: acc.start === null ? start : Math.min(acc.start, start),
        end: acc.end === null ? end : Math.max(acc.end, end),
      };
    }, { start: null, end: null });

    // Ścieżka krytyczna
    const criticalPathDuration = Array.from(events.values()).reduce((maxDuration, event) => {
      return Math.max(maxDuration, event.latestTime);
    }, 0);

    return {
      events: Array.from(events.values()), //Tablica zdarzeń
      activities, //Czynności
      totalDuration: criticalPathDuration, // Czas trwabia ścieżki krytycznej (TR)
      totalRange, //zakres
    };
  } catch (error) {
    return { error: error.message };
  }
};

//Przekazanie danych do konstruktora grafu
export const generateGraphData = (events, activities) => {
  const nodes = events.map((event) => ({
    id: event.id,
    label: `Nr Zdarzenia ${event.id}\nCzas najwcześniejszy: ${event.earliestTime}\nCzas najpóźniejszy: ${event.latestTime}\nZapas: ${event.delta}`,
  }));

  const edges = activities.map((activity) => ({
    from: activity.fromEvent,
    to: activity.toEvent,
    label: `${activity.name} (${activity.duration}h)`,
  }));

  return { nodes, edges };
};
