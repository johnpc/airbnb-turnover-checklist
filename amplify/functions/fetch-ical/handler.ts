export const handler = async (event: { url: string }) => {
  const response = await fetch(event.url)
  const text = await response.text()
  return { body: text }
}
