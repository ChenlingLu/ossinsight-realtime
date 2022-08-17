export type RawData = { event_day: string, events: number }


export function getTotal(): Promise<RawData[]> {
  return fetch('https://api.ossinsight.io/q/events-daily').then(data => data.json()).then(data => data.data);
}
