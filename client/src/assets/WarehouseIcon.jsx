// Se decidió poner los svg en componentes para poder cambiarles las propiedades a través de un atributo html pasado por props

export function WarehouseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-building"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 9l9 -5l9 5v11a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
      <path d="M9 22v-6h6v6" />
      <path d="M9 12h6" />
      <path d="M12 12v3" />
    </svg>
  );
}
