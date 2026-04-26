import axios from 'axios';

/**
 * Wathq Saudi Registry Client (Sovereign Edition)
 * authoritative source for Saudi commercial data integration.
 */
export class WathqClient {
  private static BASE_URL = 'https://api.wathq.sa';

  /**
   * Fetches full commercial registration info from Wathq.sa API
   * @param crNumber The Commercial Registration number to query
   * @param apiKey The Wathq API key
   */
  static async fetchCommercialRegistry(crNumber: string, apiKey: string) {
    if (!apiKey) {
      throw new Error('WATHQ_API_KEY is missing from configuration.');
    }

    try {
      const response = await axios.get(`${this.BASE_URL}/v5/commercialregistration/info/${crNumber}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status !== 200) {
        throw new Error(`Wathq API returned status ${response.status}`);
      }

      const data = response.data;
      
      // Map to K-SPIKE forensic profile structure
      return {
        profileType: "commercialRegistry" as const,
        companyName: {
          arabic: data.tradeNameArabic || "",
          english: data.tradeNameEnglish || ""
        },
        commercialRegistryNumber: crNumber,
        unifiedNationalNumbers: {
          main: data.unifiedNationalNumber || "",
          opc: data.opcNumber || ""
        },
        operationalStatus: {
          value: (data.status === "نشط" ? "active" : "inactive") as "active" | "inactive",
          displayArabic: data.status || "نشط",
          displayEnglish: data.statusEn || "Active"
        },
        capital: {
          amount: data.capital || 0,
          currency: "SAR" as const,
          formatted: (data.capital || 0).toLocaleString() + " SAR"
        },
        issueDate: data.issueDate || "",
        entityType: {
          value: ((data.legalForm || "").includes("شخص واحد") ? "onePersonCompany" : "etc") as "onePersonCompany" | "etc",
          displayArabic: data.legalForm || "",
          displayEnglish: data.legalFormEn || ""
        },
        licensedActivities: (data.activities || []).map((act: any) => ({
          categoryArabic: act.categoryAr || "",
          categoryEnglish: act.categoryEn || "",
          description: act.description || ""
        })),
        apiEnrichment: {
          enabled: true,
          lastFetched: new Date().toISOString(),
          apiSource: "wathq-sa",
          endpointUsed: `/v5/commercialregistration/info/${crNumber}`,
          statusCode: response.status,
          ownersAndManagers: [...(data.owners || []), ...(data.managers || [])],
          fullAddress: data.address || {}
        },
        relationalIntelligence: {
          linkedDomains: [],
          nameserverInfrastructure: [],
          crossReferences: []
        },
        lastUpdated: new Date().toISOString(),
        source: {
          registry: "Saudi Commercial Registry via Wathq",
          verificationLevel: "official" as "official"
        }
      };
    } catch (error: any) {
      console.error('[Wathq-Client] CR Query Failed:', error);
      throw error;
    }
  }
}
