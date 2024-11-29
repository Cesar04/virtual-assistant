import { SystemMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { AzureChatOpenAI } from '@langchain/openai';
import { Inject } from '@nestjs/common';
import { z } from 'zod';
import mapaDependenciasArchivo from 'src/data/dependencias-pqr.json';

export class DependenciaPqrGestionHumanaTool {
  constructor(
    @Inject('AGENT_INSTANCE')
    private readonly agentModel: AzureChatOpenAI,
  ) {}

  private generarDescripcionDependencias() {
    let dependenciasDescripcion =
      'Segun el cuerpo de la pqr retorna la dependencia correspondiente:\n';
    for (const [dependencia, temas] of Object.entries(
      mapaDependenciasArchivo,
    )) {
      dependenciasDescripcion += `${dependencia}: ${temas.join(', ')}.\n`;
    }
    return dependenciasDescripcion;
  }

  private async evaluarDependencia(contenido: string) {
    const mapaDependencias = this.generarDescripcionDependencias();

    const response = await this.agentModel.invoke([
      new SystemMessage(mapaDependencias),
      contenido,
    ]);

    return response.content;
  }

  public getTool() {
    const dependenciaPqrGestionHumana = z.object({
      cuerpo: z.string().describe('Razon por la cual se realiza la pqr'),
    });

    return tool(
      async (input: { cuerpo: string }) => {
        const dependencia = await this.evaluarDependencia(input.cuerpo);

        return {
          success: true,
          data: dependencia,
          metadata: {
            timestamp: new Date().toISOString(),
            description: 'Resultado de la dependencia de la pqr',
            confidence: 1.0,
          },
        };
      },
      {
        name: 'identificar_dependencia_pqr_secretaria_gestion_humana',
        description:
          'Herramienta que determina la dependencia adecuada para una PQR analizando el contenido del cuerpo de la solicitud.',
        schema: dependenciaPqrGestionHumana,
      },
    );
  }
}
