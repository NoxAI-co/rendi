interface CDTOption {
  rate: number;
  months: number;
}

interface Bank {
  name: string;
  tasaEA: number;
  image: string;
  id: number;
  type?: string;
  act?: boolean;
  cdtOptions?: CDTOption[];
  siteImages?: string[];
  website?: string;
}

export const Banks: Bank[] = [
  {
    name: "Nubank",
    tasaEA: 9.25,
    image: "/nubank.webp",
    id: 1,
    website: "https://nu.com.co/cf/cuenta/",
    siteImages: [
      "/webs/nugif.gif",
      "/webs/nu.png",
      "/webs/nu3.webp",
      "/webs/nu2.jfif",
    ],
    type: "Cajita de ahorros",
    cdtOptions: [
      { rate: 9.50, months: 2 },
      { rate: 9.60, months: 3 },
      { rate: 10.50, months: 6 },
      { rate: 11.00, months: 12 },
      { rate: 12.20, months: 35 },
    ],
  },
  {
    name: "Bold",
    type: "Bolsillos de Ahorro",
    tasaEA: 9,
    siteImages: [
      "/webs/bold/bold.gif",
      "/webs/bold.png",
      "/webs/bold/bold2.jpg",
    ],
    image: "/bold.webp",
    id: 10,
    act: true,
    cdtOptions: [
      { rate: 11, months: 3 },
      { rate: 11.2, months: 6 },
      { rate: 12.0, months: 12 },
    ],
  },
  {
    name: "Bancolombia",
    type: "Cuenta de ahorros",
    tasaEA: 0.05,
    siteImages: ["/webs/bancolombia/bancolombia.jpg"],
    image: "/bancolombia.webp",
    id: 2,
  },
  {
    name: "Lulo Bank",
    tasaEA: 9.25,
    type: "Bolsillos Flex Lulo Pro",
    siteImages: [
      "/webs/lulo/lulo.gif",
      "/webs/lulo/lulo2.jpg",
      "/webs/lulo/lulo3.jpg",
      "/webs/lulo/lulo4.png",
    ],
    image: "/lulo.webp",
    id: 3,
    act: true,
  },
  {
    name: "Banco Finandina",
    tasaEA: 10,
    image: "/finandina.webp",
    siteImages: [
      "/webs/finandina/finandina.gif",
      "/webs/finandina/finandina.jpeg",
    ],
    id: 9,
    type: "Cuenta Flexidigital+",
  },
  {
    name: "RappiPay",
    type: "Bolsillos RappiCuenta",
    siteImages: [
      "/webs/rappipay/rappy.gif",
      "/webs/rappipay/rappy2.avif",
      "/webs/rappipay/rappi3.jpg",
      "/webs/rappipay/rappi4.jfif",
    ],
    tasaEA: 9,
    cdtOptions: [
      { rate: 9.50, months: 3 },
      { rate: 10.10, months: 6 },
      { rate: 10.50, months: 12 },
    ],
    image: "/rappi.jpg",
    id: 4,
  },
  {
    name: "Bancamia",
    tasaEA: 10,
    image: "/bancamia.webp",
    siteImages: [
      "/webs/bancamia/bancamia2.avif",
      "/webs/bancamia/bancamia2.webp",
    ],
    id: 5,
    type: "Cuenta RentaPlus",
  },
  {
    name: "Pibank",
    type: "Cuenta de ahorros",
    siteImages: [
      "/webs/pibank/pibank.gif",
      "/webs/pibank/pibank1.webp",
      "/webs/pibank/pibank2.jpg",
      "/webs/pibank/pibank3.jpg",
    ],
    tasaEA: 11,
    image: "/pibank.webp",
    id: 8,
  },
  {
    name: "Global66",
    type: "Cuenta de ahorros",
    siteImages: [
      "/webs/global66/global.gif",
      "/webs/global66/global 2.png",
      "/webs/global66/global.png",
      "/webs/global66/global3.webp",
    ],
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
    siteImages: [
      "/webs/uala/uala.gif",
      "/webs/uala/uala3.png",
      "/webs/uala/uala2.jpeg",
      "/webs/uala/uala.webp"
    ],
    type: "Deposito bajo monto",
    id: 6,
  },
  {
    name: "Nequi",
    tasaEA: 0.1,
    image: "/nequi.webp",
    siteImages: [
      "/webs/nequi/nequi.gif",
      "/webs/nequi/nequi2.jpg",
      "/webs/nequi/nequi.png",
      "/webs/nequi/nequi3.png"
    ],
    type: "Deposito bajo monto",
    id: 7,
  },
];
