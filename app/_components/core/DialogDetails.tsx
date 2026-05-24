import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table-resulta";
import { columns } from "./columns-table-results";
import { EyeIcon, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DialogDetailsProps } from "./interfaces/DialogDetailsProps";

// Función corregida para calcular la tabla de ganancias diarias
const generateSampleData = (
  deposit: number,
  interest: number,
  retention: number,
  finalAmountMonthlyRaw: number,
  days: number
) => {
  const data = [];
  const dailyInterest = interest / days;
  let currentBalance = deposit;

  for (let i = 1; i <= days; i++) {
    currentBalance += dailyInterest;

    data.push({
      day: i,
      value: currentBalance,
      ganancias: dailyInterest,
      retention: retention / 30,
      finalAmount: finalAmountMonthlyRaw,
    });
  }

  return data;
};

export const DialogDetails = ({
  interestsMonthlyRaw,
  depositRaw,
  monthlyRetention,
  finalAmountMonthlyRaw,
  monthsRaw,
}: DialogDetailsProps) => {
  const sampleData = generateSampleData(
    depositRaw,
    interestsMonthlyRaw,
    monthlyRetention,
    finalAmountMonthlyRaw,
    30
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="w-full inline-flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#00d992]/15 border border-[#00d992]/30 text-[#00d992] text-sm font-bold cursor-pointer hover:bg-[#00d992]/25 transition-all">
          Detalles
          <EyeIcon className="size-4 shrink-0" />
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-sm md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Ganancias diarias en un mes</DialogTitle>
          <DialogDescription>
            Este es un resumen de cómo crece tu inversión en 1 mes natural
          </DialogDescription>
        </DialogHeader>
        <div>
          <DataTable
            columns={columns}
            data={sampleData}
            depositRaw={depositRaw}
          />
        </div>

        {monthsRaw > 1 ? (
          <div className="rounded-lg border border-blue-600 px-4 py-3">
            <div className="flex gap-3 ">
              <TriangleAlert
                className="mt-0.5 shrink-0 opacity-60 text-blue-500"
                size={22}
                strokeWidth={2}
                aria-hidden="true"
              />
              <div className="flex grow justify-between gap-3">
                <p className="text-sm">
                  Tu inversión es a {monthsRaw} meses. Actualmente, mostramos la
                  actividad del primer mes como referencia.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <DialogTrigger asChild>
            <Button type="button">Cerrar</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
