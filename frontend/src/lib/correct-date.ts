const correctDate = (updatedAt: string | Date) => {
  const date = new Date(updatedAt)
  const now = new Date()

  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    // Display time if it's today
    return date.toLocaleTimeString("en-PK", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(now.getDate() - 7)

  if (date > oneWeekAgo) {
    // Display weekday name if it's within a week
    return date.toLocaleDateString("en-PK", { weekday: "long" })
  }

  // Display date in DD/MM/YYYY format if itF's older than a week
  return date.toLocaleDateString("en-PK")
}

export default correctDate
