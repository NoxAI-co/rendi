import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex flex-col items-center pb-16 px-4 pt-6">
      <div className="w-full max-w-4xl space-y-6">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-all text-sm text-foreground w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Inicio
        </Link>

        {/* Header */}
        <div className="rounded-3xl border border-white/8 bg-background/40 backdrop-blur-xl p-8 md:p-12">
          <p className="text-xs uppercase tracking-widest text-[#00d992]/70 mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
            Términos y Condiciones
          </h1>
          <p className="text-sm text-muted-foreground">
            Última actualización: 24 de mayo de 2026
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">

          <Section title="1. Naturaleza de la plataforma">
            <p>
              Rendi es una plataforma <strong className="text-foreground">exclusivamente informativa</strong> que
              compila, organiza y presenta tasas de interés, rendimientos y condiciones de productos financieros
              (cuentas de ahorros, CDTs y otros instrumentos) de entidades financieras que operan en Colombia.
            </p>
            <p>
              La información publicada en Rendi proviene de fuentes públicas: sitios web oficiales de las
              entidades, comunicados de prensa y bases de datos de acceso libre. Rendi no tiene ningún tipo de
              relación comercial, alianza, patrocinio ni afiliación con las entidades financieras listadas, salvo
              que se indique expresamente lo contrario.
            </p>
          </Section>

          <Section title="2. No constituye asesoría financiera">
            <p>
              El contenido de esta plataforma tiene un propósito <strong className="text-foreground">educativo e
              informativo</strong>. Nada de lo publicado en Rendi debe interpretarse como asesoría financiera,
              recomendación de inversión, consejo tributario ni ningún otro tipo de orientación profesional
              regulada.
            </p>
            <p>
              Las calculadoras y comparadores disponibles en la plataforma generan estimaciones matemáticas basadas
              en los datos ingresados por el usuario y las tasas publicadas. Estos resultados son aproximados y no
              garantizan rendimientos reales. Antes de tomar cualquier decisión financiera, te recomendamos
              consultar directamente con la entidad financiera de tu elección y, si lo consideras necesario, con
              un asesor financiero certificado.
            </p>
          </Section>

          <Section title="3. Marcas, logos e imágenes de terceros">
            <p>
              Los nombres comerciales, marcas registradas, logotipos, imágenes e identidades visuales de las
              entidades financieras listadas en Rendi son propiedad exclusiva de sus respectivos titulares.
              Su uso en esta plataforma es meramente <strong className="text-foreground">referencial e
              identificativo</strong>, con el único fin de facilitar la comparación y el reconocimiento por parte
              del usuario.
            </p>
            <p>
              Rendi no reclama derechos de propiedad sobre ninguna de dichas marcas, logotipos ni imágenes.
              Cualquier entidad financiera que considere que el uso de su marca en esta plataforma no se ajusta
              a sus políticas puede contactarnos para coordinar los ajustes necesarios.
            </p>
          </Section>

          <Section title="4. Exactitud y vigencia de la información">
            <p>
              Rendi realiza sus mejores esfuerzos para mantener la información actualizada; sin embargo, las tasas
              y condiciones de los productos financieros pueden cambiar en cualquier momento por decisión de cada
              entidad. La información publicada puede no reflejar la tasa vigente en el momento exacto de tu
              consulta.
            </p>
            <p>
              Siempre verifica las condiciones actuales directamente en el sitio oficial de la entidad financiera
              antes de abrir un producto o realizar cualquier operación.
            </p>
          </Section>

          <Section title="5. Limitación de responsabilidad">
            <p>
              Rendi no se hace responsable por pérdidas, perjuicios, lucro cesante ni ningún otro daño —directo
              o indirecto— derivado del uso o la imposibilidad de uso de esta plataforma, ni de decisiones
              financieras tomadas con base en la información aquí publicada.
            </p>
            <p>
              El uso de Rendi es bajo la entera responsabilidad del usuario.
            </p>
          </Section>

          <Section title="6. Propiedad intelectual de Rendi">
            <p>
              El código fuente, diseño, estructura, textos propios, calculadoras y demás elementos originales de
              Rendi son propiedad de sus creadores y están protegidos por las leyes de propiedad intelectual
              aplicables. Queda prohibida su reproducción total o parcial sin autorización escrita previa.
            </p>
          </Section>

          <Section title="7. Modificaciones">
            <p>
              Nos reservamos el derecho de actualizar o modificar estos términos en cualquier momento. Los cambios
              entran en vigor desde el momento de su publicación en esta página. El uso continuado de la
              plataforma tras la publicación de cambios implica la aceptación de los nuevos términos.
            </p>
          </Section>

          <Section title="8. Contacto">
            <p>
              Para cualquier consulta relacionada con estos términos, el uso de marcas de terceros u otras
              cuestiones legales, puedes contactarnos a través de nuestros canales oficiales.
            </p>
          </Section>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-background/40 backdrop-blur-xl p-6 md:p-8 space-y-4">
      <h2 className="text-base font-semibold text-[#00d992] uppercase tracking-wider">
        {title}
      </h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  );
}
