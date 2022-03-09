export default class ShipStatusComponent {
  constructor(data) {
    this.component = document.createElement("div");
    const table = document.createElement("table");
    table.classList.add("ship");
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    const tr = document.createElement("tr");
    tbody.appendChild(tr);
    for (let i = 0; i < data.len.length; i += 1) {
      const td = document.createElement("td");
      if (data.sunk) {
        td.classList.add("sunk");
      }
      tr.appendChild(td);
    }
    this.component.appendChild(table);
  }
}
