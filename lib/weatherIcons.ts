export function getWeatherIcon(code: number): string {
  // Sunny
  if (code === 0) {
    return `
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="8"
          stroke="black"
          stroke-width="2"
          fill="none" />
      </svg>
    `;
  }

  // Partly cloudy
  if ([1, 2, 3].includes(code)) {
    return `
      <svg width="36" height="36" viewBox="0 0 36 36">
        <ellipse cx="18" cy="20" rx="10" ry="6"
          stroke="black"
          stroke-width="2"
          fill="none" />
      </svg>
    `;
  }

  // Rain
  if (
    [
      51, 53, 55,
      61, 63, 65,
      80, 81, 82
    ].includes(code)
  ) {
    return `
      <svg width="36" height="36" viewBox="0 0 36 36">
        <ellipse cx="18" cy="14" rx="10" ry="6"
          stroke="black"
          stroke-width="2"
          fill="none" />
        <line x1="12" y1="24" x2="10" y2="30"
          stroke="black"
          stroke-width="2" />
        <line x1="18" y1="24" x2="16" y2="30"
          stroke="black"
          stroke-width="2" />
        <line x1="24" y1="24" x2="22" y2="30"
          stroke="black"
          stroke-width="2" />
      </svg>
    `;
  }

  // Snow
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return `
      <svg width="36" height="36" viewBox="0 0 36 36">
        <line x1="18" y1="8" x2="18" y2="28"
          stroke="black"
          stroke-width="2" />
        <line x1="8" y1="18" x2="28" y2="18"
          stroke="black"
          stroke-width="2" />
      </svg>
    `;
  }

  // Thunderstorm
  if ([95, 96, 99].includes(code)) {
    return `
      <svg width="36" height="36" viewBox="0 0 36 36">
        <polyline
          points="18,6 10,20 18,20 14,30 26,14 18,14"
          stroke="black"
          stroke-width="2"
          fill="none"
        />
      </svg>
    `;
  }

  // Default cloud
  return `
    <svg width="36" height="36" viewBox="0 0 36 36">
      <ellipse cx="18" cy="18" rx="10" ry="6"
        stroke="black"
        stroke-width="2"
        fill="none" />
    </svg>
  `;
}
