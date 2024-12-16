class Event {
  constructor(id, earliestTime, latestTime, previousActivity, nextActivity) {
    this.id = id;
    this.earliestTime = earliestTime;
    this.latestTime = latestTime;
    this.delta = latestTime - earliestTime;
    this.previousActivity = previousActivity;
    this.nextActivity = nextActivity;
  }
}

class Activity {
  constructor(name, duration, range) {
    this.name = name;
    this.duration = duration;
    this.range = range;
    this.events = [];
  }

  addEvent(event) {
    this.events.push(event);
  }
}

export const calculateResults = (rows) => {
  try {
    let sum = 0;
    let id = 1;
    let prevActiv = "";
    let nextActive = "";

    const events = [];
    const activities = rows.map((row, index) => {
      if (!row.name || !row.duration || !row.range) {
        throw new Error(`Brakujące dane w wierszu ${index + 1}`);
      }

      const [start, end] = row.range.split('-').map(Number);

      if (isNaN(start) || isNaN(end) || start >= end) {
        throw new Error(`Nieprawidłowy zakres w wierszu ${index + 1}`);
      }

      if (index === 0) {
        nextActive = row.name;
      } else {
        prevActiv = rows[index - 1].name;
        nextActive = row.name;
      }

      const event = new Event(id, sum, sum, prevActiv, nextActive);
      events.push(event);

      const activity = new Activity(row.name, parseFloat(row.duration), [start, end]);
      activity.addEvent(event);

      sum += parseInt(row.duration);
      id++;
      return activity;
    });

    const finalEvent = new Event(id, sum, sum, nextActive, "");
    events.push(finalEvent);

    activities.forEach((activity) => {
      const matchingEvent = events.find((event) => event.id === activity.range[1]);
      if (matchingEvent) {
        activity.addEvent(matchingEvent);
      }
    });

    const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0);

    const totalRange = activities.reduce(
      (acc, activity) => ({
        start: Math.min(acc.start, activity.range[0]),
        end: Math.max(acc.end, activity.range[1]),
      }),
      { start: Infinity, end: -Infinity }
    );

    return {
      events,
      activities,
      totalDuration,
      totalRange,
    };
  } catch (error) {
    return { error: error.message };
  }
};

export const generateGraphData = (events, activities) => {
  const nodes = events.map((event) => ({
    id: event.id,
    label: `Zdarzenie ${event.id}\nCzas najwcześniejszy: ${event.earliestTime}\nCzas najpóźniejszy: ${event.latestTime}\nDelta: ${event.delta}`,
  }));

  const edges = activities.map((activity) => ({
    from: activity.events[0].id,
    to: activity.events[activity.events.length - 1].id,
    label: `${activity.name} (${activity.duration}h)`,
  }));

  return { nodes, edges };
};
