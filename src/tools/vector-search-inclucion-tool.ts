import { createRetrieverTool } from 'langchain/tools/retriever';
import { VectorDatabaseService } from 'src/services/vector-database/vector-database.service';

export class VectorSearchInclucionTool {
  constructor(private store: VectorDatabaseService) {}

  public getTool() {
    return createRetrieverTool(this.store.getInstance().asRetriever(), {
      name: 'informacion_secretaria_inclusion_social',
      description:
        'Accede a la información más reciente sobre las políticas, programas y actividades de la Secretaría de Inclusión Social de Medellín. Encuentra datos sobre iniciativas en curso para la población vulnerable, estadísticas de impacto, y detalles de contacto para obtener mayor información o asistencia.',
    });
  }
}
