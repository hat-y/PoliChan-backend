import { UserWriteRepository } from '../../../user/domain/interfaces/user-write-repository.inferface';

export interface ProcessedContent {
  mentions: string[];  // Usernames extraídos
  hashtagCount: number;  // Para futuras features
  linkCount: number;     // Para futuras features
  processedText?: string; // Texto limpio (opcional)
}

export class ContentProcessorService {
  constructor(
    private userWriteRepository: UserWriteRepository
  ) {}

  /**
   * Extrae @menciones del contenido
   *
   * Por qué regex /@(\w+)/:
   * - @ seguido por letters, numbers, underscore
   * - \w+ = [a-zA-Z0-9_]+
   * - Captura el username sin el @
   * - Global flag para encontrar todas las ocurrencias
   */
  extractMentions(content: string): string[] {
    // Regex actualizado para manejar usernames más complejos
    const mentionRegex = /@([a-zA-Z0-9_]{1,30})/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }

    // Eliminar duplicados manteniendo orden de aparición
    return [...new Set(mentions)];
  }

  /**
   * Valida que los usuarios mencionados existan
   *
   * Por qué validación aquí y no en el command handler:
   * - La validación es parte del "procesamiento de contenido"
   * - Requiere acceso al repositorio de usuarios
   * - Separa la lógica de business del command handler
   */
  async validateMentions(usernames: string[]): Promise<{
    validUsers: Array<{ username: string; userId: string }>;
    invalidUsernames: string[];
  }> {
    const validUsers: Array<{ username: string; userId: string }> = [];
    const invalidUsernames: string[] = [];

    for (const username of usernames) {
      try {
        const user = await this.userWriteRepository.findByUserName(username);
        if (user) {
          validUsers.push({ username, userId: user.id });
        } else {
          invalidUsernames.push(username);
        }
      } catch (error) {
        console.error(`Error validating username ${username}:`, error);
        invalidUsernames.push(username);
      }
    }

    return { validUsers, invalidUsernames };
  }

  async processContentForMentions(
    content: string,
    authorId: string,
    maxMentions: number = 10
  ): Promise<{
    mentions: Array<{ username: string; userId: string }>;
    invalidMentions: string[];
    mentionCount: number;
    exceedsLimit: boolean;
  }> {
    // 1. Extraer menciones del texto
    const extractedMentions = this.extractMentions(content);

    // 2. Validar límite de menciones (prevenir spam)
    const exceedsLimit = extractedMentions.length > maxMentions;

    // 3. Validar existencia de usuarios
    const { validUsers, invalidUsernames } = await this.validateMentions(extractedMentions);

    // 4. Filtrar auto-menciones (regla de negocio)
    const filteredMentions = validUsers.filter(user => user.userId !== authorId);

    return {
      mentions: filteredMentions,
      invalidMentions: invalidUsernames,
      mentionCount: filteredMentions.length,
      exceedsLimit
    };
  }

  /**
   * Parseo avanzado para futuras features
   *
   * Este método demuestra la extensibilidad del processor
   */
  processAdvancedContent(content: string): ProcessedContent {
    const mentions = this.extractMentions(content);
    const hashtagCount = (content.match(/#[\w]+/g) || []).length;
    const linkCount = (content.match(/https?:\/\/[^\s]+/g) || []).length;

    return {
      mentions,
      hashtagCount,
      linkCount
    };
  }

  /**
   * Utility: limpia el texto para display
   *
   * Convierte @username en un elemento clicable
   */
  formatMentionsForDisplay(content: string): string {
    return content.replace(
      /@([a-zA-Z0-9_]{1,30})/g,
      '<mention data-username="$1">@$1</mention>'
    );
  }
}