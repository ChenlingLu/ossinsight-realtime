export function createNumbers(document: Document, fontSize: number) {
  const container = document.createElement('div');
  const numbers = document.createElement('div');
  container.style.height = '73px';
  numbers.style.color = 'rgba(255,255,255,1)';
  numbers.style.webkitTextStroke = '1px rgba(0, 0, 0, 1)';
  numbers.style.fontFamily = 'sans-serif';
  numbers.style.fontSize = `${fontSize}px`;
  numbers.style.fontWeight = 'bold';
  numbers.style.textAlign = 'center';
  container.appendChild(numbers);
  let current: number = 0;

  let from: number;
  let to: number;
  let step: number;
  let animating = false;

  const setValue = (value: number) => {
    from = current;
    to = value;
    animating = true;
  };

  const update = (delta: number) => {
    if (!animating) {
      return;
    }
    step = Math.floor((to - from) * delta) || (to > from ? 1 : -1); // prevent 0
    if (Math.abs(to - current) <= Math.abs(step)) {
      current = to;
      animating = false;
    } else {
      current += step;
    }

    numbers.innerText = current.toLocaleString('en');
  };

  return { numbers: container, update, setValue };
}
