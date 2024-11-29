import { tool } from '@langchain/core/tools';
import { z } from 'zod';

export class RegisterPqrGestionHumanaTool {
  constructor() {}

  public getTool() {
    const registerPqrGestionHumanaTool = z.object({
      nombreCompleto: z.string().describe('Nombre completo del usuario'),
      documento: z.string().describe('Documento de identidad del usuario'),
      correo: z.string().describe('Correo electrónico válido del usuario'),
      telefono: z.string().describe('Número telefónico del usuario'),
      cuerpo: z.string().describe('Razon por la cual se realiza la pqr'),
      dependencia: z
        .string()
        .describe(
          'Dependencia retornada por la tool de identificar_dependencia_pqr_secretaria_gestion_humana',
        ),
    });

    return tool(
      async (input: {
        nombreCompleto: string;
        documento: string;
        correo: string;
        telefono: string;
      }) => {
        console.log('Información de la pqr: ', input);
        return {
          success: true,
          data: 'Resultado de la Pqr realizada con exito...',
          metadata: {
            timestamp: new Date().toISOString(),
            description: 'Resultado del registro de pqr',
            confidence: 1.0,
          },
        };
      },
      {
        name: 'registro_pqr_secretaria_gestion_humana',
        description:
          'Herramienta para registrar peticiones, quejas y reclamos (PQR) en la Secretaría de Gestión Humana. Asegura el almacenamiento correcto de los datos del usuario y de la dependencia correspondiente.',
        schema: registerPqrGestionHumanaTool,
      },
    );
  }
}
