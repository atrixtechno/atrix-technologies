export const DEFAULT_INVOICE_TERMS = `TÉRMINOS Y CONDICIONES DE SERVICIO — ATRIX Technologies

1. Partes y alcance
ATRIX Technologies (“Proveedor”), con operaciones en Nuevo Laredo, Tamaulipas, México y Laredo, Texas, EE. UU., prestará los servicios de tecnología, desarrollo de software, diseño, infraestructura y/o soporte descritos en este comprobante (“Servicios”) al cliente indicado (“Cliente”). El alcance se limita a lo expresamente acordado; cualquier trabajo adicional requerirá acuerdo por escrito y podrá generar cargos extra.

2. Pagos y forma de pago
El Cliente se obliga a pagar según la forma de pago indicada (efectivo, transferencia u otra). Salvo pacto distinto, los pagos no son reembolsables una vez iniciados los Servicios. Retrasos de pago superiores a 15 días naturales podrán suspender el trabajo y/o el acceso a entregables hasta regularizar el saldo.

3. Plazos
Las fechas de comienzo y finalización son estimaciones de calendario. ATRIX no garantiza fechas exactas cuando existan dependencias del Cliente (contenidos, accesos, aprobaciones, terceros o infraestructura). Retrasos atribuibles al Cliente no generan penalización al Proveedor.

4. Propiedad intelectual
Salvo cesión escrita, el código, diseños, documentación y materiales creados por ATRIX permanecen propiedad de ATRIX hasta el pago íntegro. Tras el pago total acordado, el Cliente recibe licencia de uso de los entregables del proyecto, sin ceder marcas, herramientas internas, librerías reutilizables ni know-how de ATRIX, salvo acuerdo específico.

5. Confidencialidad
Ambas partes tratarán como confidencial la información técnica, comercial y de acceso (credenciales, datos de clientes finales, estrategias) recibida con motivo del proyecto, y no la divulgarán a terceros sin autorización, excepto cuando la ley lo exija.

6. Garantías limitadas
Los Servicios se prestan con diligencia profesional razonable (“mejor esfuerzo”). ATRIX no garantiza resultados de negocio, posicionamiento SEO, disponibilidad continua de terceros (hosting, dominios, APIs) ni ausencia total de errores. Soporte correctivo por defectos atribuibles a ATRIX podrá acordarse por un periodo limitado tras la entrega; fallas por cambios del Cliente, terceros o mal uso quedan fuera de garantía.

7. Cancelaciones
Si el Cliente cancela después de iniciado el trabajo, deberá cubrir el trabajo ya realizado y los costos comprometidos. ATRIX podrá cancelar o pausar el proyecto ante incumplimiento de pago, falta de colaboración material o uso ilícito de los Servicios.

8. Limitación de responsabilidad
En la medida permitida por la ley aplicable, la responsabilidad total de ATRIX frente al Cliente por este proyecto no excederá el monto efectivamente pagado por el Cliente a ATRIX por los Servicios objeto de este comprobante. No se responden daños indirectos, lucro cesante ni pérdida de datos de terceros.

9. Ley aplicable
Las partes procurarán resolver controversias de buena fe. Salvo norma imperativa en contrario, se estará a la legislación aplicable en el lugar de prestación principal de los Servicios (Nuevo Laredo / frontera Laredo TX según corresponda).

Al aceptar este comprobante, el Cliente confirma haber leído y aceptado estos términos.`;

export type InvoiceDraft = {
  id?: string;
  clientName: string;
  projectName: string;
  startDate: string;
  endDate: string;
  engineers: string[];
  paymentMethod: string;
  terms: string;
  notes?: string;
};

export const PAYMENT_METHODS = [
  "Efectivo",
  "Transferencia bancaria",
  "Depósito",
  "Tarjeta",
  "PayPal / Stripe",
  "Otro",
] as const;
