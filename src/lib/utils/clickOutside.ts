export function clickOutside(elementId: string, callback: () => void) {
  function handleClick(event: MouseEvent) {
    const element = document.getElementById(elementId);
    if (element && !element.contains(event.target as Node)) {
      callback();
    }
  }

  document.addEventListener('click', handleClick);

  return {
    destroy() {
      document.removeEventListener('click', handleClick);
    }
  };
}
