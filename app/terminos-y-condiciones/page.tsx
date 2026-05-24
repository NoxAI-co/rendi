export default function TermsPage() {
  return (
    <div className="flex flex-col items-center space-y-12 pb-8">

      <header className="w-full max-w-4xl text-center py-6 border-b border-gray-700">
        <h1 className="text-lg md:text-4xl font-bold">Términos y Condiciones</h1>
        <p className="text-gray-400 mt-2">Última actualización: 17/01/2026</p>
      </header>

      <main className="w-full max-w-4xl mt-6 space-y-6 text-gray-300 px-6">
        <section>
          <h2 className="text-2xl font-semibold text-white">1. Introducción</h2>
          <p>
            Bienvenido a Rendi. Al utilizar nuestra
            calculadora de rendimientos, aceptas cumplir con estos términos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            2. Uso de la Plataforma
          </h2>
          <p>
            Nuestra herramienta es solo informativa y no representa asesoría
            financiera. Los cálculos se basan en tasas de fuentes públicas.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            3. Propiedad Intelectual
          </h2>
          <p>
            Todo el contenido de la plataforma nos pertenece o tiene licencia
            adecuada. El uso de nombres de bancos o imagenes es ilustrativo.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            4. Limitación de Responsabilidad
          </h2>
          <p>
            No garantizamos la precisión de los cálculos y no somos responsables
            por decisiones basadas en ellos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white">
            5. Cambios en los Términos
          </h2>
          <p>
            Nos reservamos el derecho de actualizar estos términos en cualquier
            momento. La última versión siempre estará disponible aquí.
          </p>
        </section>
      </main>

    </div>
  );
}
