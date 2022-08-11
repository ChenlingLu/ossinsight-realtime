export type RawData = { event_day: string, events: number }


export function getData(): Promise<RawData[]> {
  return fetch('https://api.ossinsight.io/q/events-daily').then(data => data.json()).then(data => data.data);
}

const DAY = 24 * 60 * 60 * 1000;

export function transform(data: RawData[]) {
  const first = data[0];
  const map: number[][] = Array(7).fill(0).map(() => []);
  const rawMap: (RawData | undefined)[][] = Array(7).fill(0).map(() => []);

  for (let day = 0; day < 7; day++) {
    for (let week = 0; week < 53; week++) {
      map[day][week] = 0;
      rawMap[day][week] = undefined;
    }
  }

  if (!first) {
    return [map, rawMap, [0, 0] as const] as const;
  }

  const firstDate = (new Date(first.event_day)).getTime();

  data.forEach((item) => {
    const diff = new Date(item.event_day);
    const offset = Math.round((diff.getTime() - firstDate) / DAY);

    const day = offset % 7;
    const week = Math.floor(offset / 7);

    map[day][week] = item.events / 1000000;
    rawMap[day][week] = item;
  });

  const rnow = new Date();
  const now = new Date(rnow.getUTCFullYear(), rnow.getUTCMonth(), rnow.getUTCDate());
  const nowOffset = Math.round((now.getTime() - firstDate) / DAY);
  const i = nowOffset % 7;
  const j = Math.floor(nowOffset / 7);
  return [map, rawMap, [i, j] as const] as const;
}