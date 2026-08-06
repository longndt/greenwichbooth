export function loadState(defaults) {
  return {
    ...defaults,
    eventName: localStorage.getItem('greenwichbooth.eventName') || defaults.eventName || '',
    studentName: localStorage.getItem('greenwichbooth.studentName') || defaults.studentName || '',
    interval: Number(localStorage.getItem('greenwichbooth.interval') || defaults.interval || 3) || 3,
    themeIndex: Number(localStorage.getItem('greenwichbooth.themeIndex') || defaults.themeIndex || 0) || 0,
    photoCount: Number(localStorage.getItem('greenwichbooth.photoCount') || defaults.photoCount || 3) || 3,
    layoutIndex: Number(localStorage.getItem('greenwichbooth.layoutIndex') || defaults.layoutIndex || 0) || 0,
  };
}

export function saveState(key, value) {
  localStorage.setItem(`greenwichbooth.${key}`, String(value));
}
