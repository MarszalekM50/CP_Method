class Event {
  constructor(id) {
    this.id = id;
    this.earliestTime = 0;
    this.latestTime = 0;
    this.delta = 0;
    this.outgoing = [];
    this.incoming = [];
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
      toEvent.incoming.push(activity);

      totalDuration += activity.duration;
    });

     //Ustawienie tablicy w kolejności
     const topologicalSort = (events) => {
      const inDegree = new Map();
      const queue = [];
      const sortedEvents = [];

      events.forEach((event) => {
        inDegree.set(event.id, 0);
      });

      events.forEach((event) => {
        event.outgoing.forEach((activity) => {
          const targetEvent = getEvent(activity.toEvent);
          inDegree.set(targetEvent.id, inDegree.get(targetEvent.id) + 1);
        });
      });

      events.forEach((event) => {
        if (inDegree.get(event.id) === 0) {
          queue.push(event);
        }
      });
      while (queue.length > 0) {
        const event = queue.shift();
        sortedEvents.push(event);

        event.outgoing.forEach((activity) => {
          const targetEvent = getEvent(activity.toEvent);
          inDegree.set(targetEvent.id, inDegree.get(targetEvent.id) - 1);
          if (inDegree.get(targetEvent.id) === 0) {
            queue.push(targetEvent);
          }
        });
      }
      return sortedEvents;
    };

    // Forward pass: Obliczamy najwcześniejsze czasy
    var changed = true; // Zmienna śledząca, czy wystąpiła jakakolwiek zmiana
    while (changed) {
      changed = false;
      events.forEach((event) => {
        event.outgoing.forEach((activity) => {
          const targetEvent = getEvent(activity.toEvent);
          const newEarliestTime = event.earliestTime + activity.duration;

          if (newEarliestTime > targetEvent.earliestTime) {
            targetEvent.earliestTime = newEarliestTime;
            changed = true;
          }
        });
      });
    }

    // Backward pass: Obliczamy najpóźniejsze czasy
    const eventList = topologicalSort(Array.from(events.values()));
    const reverseEventList = eventList.reverse();
    const lastEvent = reverseEventList[0];
    lastEvent.latestTime = lastEvent.earliestTime;
    eventList.forEach((event) => {
      var candidateTimes = [];

      event.outgoing.forEach((activity) => {
        const targetEvent = getEvent(activity.toEvent);
        candidateTimes.push(targetEvent.latestTime - activity.duration);
      });

      if (candidateTimes.length > 0) {
        event.latestTime = Math.min(...candidateTimes);
      }

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

    // Znajdowanie ścieżki krytycznej
    const findCriticalPath = (events, activities) => {
      const criticalPath = []; 
      const criticalEvents = events.filter((event) => event.delta === 0);

      var currentEvents = criticalEvents.filter((event) => event.incoming.length === 0);

      while (currentEvents.length > 0) {
        const nextEvents = [];

        currentEvents.forEach((currentEvent) => {
          if (!criticalPath.includes(currentEvent.id)) {
            criticalPath.push(currentEvent.id);
          }

          currentEvent.outgoing.forEach((activity) => {
            const targetEvent = events.find(
              (e) => e.id === activity.toEvent
            );
            if (targetEvent && targetEvent.delta === 0) {
              nextEvents.push(targetEvent);
            }
          });
        });

        currentEvents = nextEvents;
      }
      return { criticalPath: criticalPath.sort((a, b) => a - b) }; //sortowanie wyniku - potrzebne?
    };

    const {criticalPath} = findCriticalPath(Array.from(events.values()),activities);

    return {
      events: Array.from(events.values()), //Tablica zdarzeń
      activities, //Czynności
      totalDuration: criticalPathDuration, // Czas trwabia ścieżki krytycznej (TR)
      totalRange, //zakres
      criticalPath, //ścieżka krytyczna
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
