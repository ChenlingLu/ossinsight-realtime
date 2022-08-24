import all from './lang.txt?raw';


const once = <T>() => {
  const set = new Set<T>();

  return (value: T) => {
    if (set.has(value)) {
      return false;
    } else {
      set.add(value);
      return true;
    }
  }
}

export const languages: string[] = [
  'Any Language',
  ...all.split('\n')
    .filter(Boolean)
    .filter(once()),
];
