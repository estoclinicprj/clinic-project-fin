/**
 * ApiService - Service centralisé pour les appels API vers le backend PHP
 */
export class ApiService {
  private static baseUrl = "http://localhost/clinique"

  /**
   * Envoie des données en POST vers un endpoint PHP
   * @param endpoint - Le chemin de l'API (ex: "api/post_patient.php")
   * @param data - Les données à envoyer
   * @returns La réponse JSON du serveur
   */
  static async postData<T = unknown>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || `Erreur HTTP ${response.status}`)
    }

    return response.json()
  }

  /**
   * Récupère des données en GET depuis un endpoint PHP
   * @param endpoint - Le chemin de l'API
   * @returns La réponse JSON du serveur
   */
  static async getData<T = unknown>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || `Erreur HTTP ${response.status}`)
    }

    return response.json()
  }
}
