export default function generateId(): string {
  return Array.from({ length: 4 }).reduce((id: string) => {
    return id + `${Math.ceil(Math.random() * (9999 - 999) + 999)}`;
  }, '') as string;
}
