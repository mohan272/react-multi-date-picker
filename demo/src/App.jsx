import { useState } from "react";
import DatePicker from "react-multi-date-picker";

export default function App() {
  const [value, setValue] = useState(new Date());

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Playground</h1>
      <DatePicker value={value} onChange={setValue} />
      <pre style={{ marginTop: 16 }}>{String(value)}</pre>
    </div>
  );
}
