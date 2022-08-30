export function validateSemester(semester: string): boolean {
  const rExp = /^(WS|SS)-\d\d$/;
  return rExp.test(semester);
}
