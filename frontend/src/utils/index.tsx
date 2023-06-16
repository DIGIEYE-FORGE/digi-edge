export function toggleFullScreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else if (document.exitFullscreen) document.exitFullscreen();
}

export function stringify(value: any) {
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}
