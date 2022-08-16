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

  let handle: number;
  const setValue = (value: number) => {
    cancelAnimationFrame(handle);
    handle = requestAnimationFrame(() => {
      numbers.innerText = value.toLocaleString('en');
    });
  };

  return { numbers: container, setValue };
}
