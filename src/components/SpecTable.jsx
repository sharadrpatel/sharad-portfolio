// Target specifications for a design project. The table scrolls sideways on
// narrow screens, so its wrapper is focusable and named for keyboard users.
export default function SpecTable({ specs, caption }) {
  return (
    <div className="spec-table-wrap" tabIndex={0} role="region" aria-label={caption}>
      <table className="spec-table">
        <caption className="label label--muted">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">User need</th>
            <th scope="col">Target</th>
            <th scope="col">Basis</th>
          </tr>
        </thead>
        <tbody>
          {specs.map((s) => (
            <tr key={s.need}>
              <th scope="row">{s.need}</th>
              <td className="spec-table__target">{s.target}</td>
              <td>{s.basis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
