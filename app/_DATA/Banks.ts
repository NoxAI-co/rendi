interface Bank {
  name: string;
  tasaEA: number;
  image: string;
  id: number;
  type?: string;
  act?: boolean;
}

export const Banks: Bank[] = [
  {
    name: "Nubank",
    tasaEA: 8.25,
    image: "/nubank.webp",
    id: 1,
    type: "Cajita de ahorros",
  },
  {
    name: "Bold",
    type: "Bolsillos de Ahorro",
    tasaEA: 10,
    image: "/bold.webp",
    id: 10,
    act: true,
  },
  {
    name: "Bancolombia",
    type: "Cuenta de ahorros",
    tasaEA: 0.05,
    image: "/bancolombia.webp",
    id: 2,
  },
  {
    name: "Lulo Bank",
    tasaEA: 9.25,
    type: "Bolsillos Flex Lulo Pro",
    image: "/lulo.webp",
    id: 3,
    act: true,
  },
  {
    name: "Banco Finandina",
    tasaEA: 10,
    image: "/finandina.webp",
    id: 9,
    type: "Cuenta Flexidigital+",
  },
  {
    name: "RappiPay",
    type: "Bolsillos RappiCuenta",
    tasaEA: 9,
    image: "/rappi.jpg",
    id: 4,
  },
  {
    name: "Bancamia",
    tasaEA: 10,
    image: "/bancamia.webp",
    id: 5,
    type: "Cuenta RentaPlus",
  },
  {
    name: "Pibank",
    type: "Cuenta de ahorros",
    tasaEA: 11,
    image: "/pibank.webp",
    id: 8,
  },
  {
    name: "Global66",
    type: "Cuenta de ahorros",
    tasaEA: 11,
    image: "/global66.webp",
    id: 9,
    act: true,
  },
];

export const DepositosBajoMonto: Bank[] = [
  {
    name: "Ualá",
    tasaEA: 5,
    image: "/uala.webp",
    type: "Deposito bajo monto",
    id: 6,
  },
  {
    name: "Nequi",
    tasaEA: 0.1,
    image: "/nequi.webp",
    type: "Deposito bajo monto",
    id: 7,
  },
];
