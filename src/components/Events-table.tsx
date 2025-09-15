import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const EventsTable = () => {
  const eventsData = [
    { id: "1", time: "12:40:21", object: "fzhdndh", event: "36wywhrh" },
    { id: "2", time: "12:41:10", object: "abc123", event: "event-test" },
    { id: "3", time: "12:42:55", object: "xyz789", event: "event-456" },
  ];

  return (
    <div className="w-full max-w-md mx-auto border rounded-md shadow-sm bg-white">
      <div className="max-h-64 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Times</TableHead>
              <TableHead>Objects</TableHead>
              <TableHead>Events</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventsData?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.time}</TableCell>
                <TableCell>{item.object}</TableCell>
                <TableCell>{item.event}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default EventsTable;