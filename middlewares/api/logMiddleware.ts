export function logMiddleware(req: Request): { response: string } {
  return { response: req.method + " " + req.url + "YES" };
}
