import { CommercialRegistryProfile } from '../types';
import { WathqClient } from '../lib/WathqClient';

/**
 * Forensic Service (K-SPIKE)
 * Handles persistence and retrieval of enriched Commercial Registry / Wathq profiles.
 */
export class ForensicService {
  private static STORAGE_KEY = 'niyah_forensic_profiles';

  /**
   * Saves a forensic profile to the local secure storage
   */
  static async saveProfile(profile: CommercialRegistryProfile) {
    try {
      const savedProfiles = localStorage.getItem(this.STORAGE_KEY);
      const profiles = savedProfiles ? JSON.parse(savedProfiles) : {};
      
      const profileId = profile.commercialRegistryNumber;
      profiles[profileId] = {
        ...profile,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
      return profileId;
    } catch (error) {
      console.error('[Forensic-Service] Save Failed:', error);
      throw error;
    }
  }

  /**
   * Fetches a specific forensic profile by CR number or Domain
   */
  static async getProfile(profileId: string) {
    try {
      const savedProfiles = localStorage.getItem(this.STORAGE_KEY);
      const profiles = savedProfiles ? JSON.parse(savedProfiles) : {};
      return profiles[profileId] || null;
    } catch (error) {
      console.error('[Forensic-Service] Get Failed:', error);
      return null;
    }
  }

  /**
   * Enriches a CR number via Wathq and saves it
   */
  static async enrichAndSave(crNumber: string, apiKey: string) {
    try {
      const liveData = await WathqClient.fetchCommercialRegistry(crNumber, apiKey);
      await this.saveProfile(liveData);
      return liveData;
    } catch (error) {
      console.error('[Forensic-Service] Enrichment Flow Failed:', error);
      throw error;
    }
  }
}
