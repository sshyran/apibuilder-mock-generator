export function isJson(value: any) {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }

  return true;
}

export function isDateIso8601(value: any) {
  const pattern = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;
  return typeof value === 'string' && pattern.test(value);
}

export function isDateTimeIso8601(value: any) {
  const pattern = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;
  return typeof value === 'string' && pattern.test(value);
}

export function isUuid(value: any) {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof value === 'string' && pattern.test(value);
}
