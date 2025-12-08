export default function DateRangePicker({ value, onChange }) {
  const handleChange = (e) => {
    onChange({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          name="start"
          value={value.start}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>End Date:</label>
        <input
          type="date"
          name="end"
          value={value.end}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}