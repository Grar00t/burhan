import msfData from '../data/msf_modules.json';

export interface MSFModule {
  path: string;
  type: string;
  category: string;
  name: string;
  platform: string;
  rank: string;
  description?: string;
}

export class MSFKernel {
  private modules: MSFModule[] = [];
  private currentModule: MSFModule | null = null;
  private currentOptions: Record<string, string> = {
    'RHOSTS': '',
    'RPORT': '',
    'LHOST': '127.0.0.1',
    'LPORT': '4444',
  };

  constructor() {
    this.modules = msfData.modules;
  }

  public handleCommand(command: string): { output: string[]; success: boolean; sessionOpened?: boolean } {
    const parts = command.trim().split(/\s+/);
    const action = parts[0]?.toLowerCase();
    const args = parts.slice(1);

    if (action === 'use') {
      const path = args[0];
      const module = this.getModuleByPath(path);
      if (module) {
        this.currentModule = module;
        return { 
          output: [`[*] Using module: ${module.path}`, `[*] Platform: ${module.platform}`, `[*] Rank: ${module.rank}`], 
          success: true 
        };
      }
      return { output: [`[-] Module NOT_FOUND: ${path}`], success: false };
    }

    if (action === 'set') {
      const key = args[0]?.toUpperCase();
      const value = args[1];
      if (key && value) {
        this.currentOptions[key] = value;
        return { output: [`${key} => ${value}`], success: true };
      }
      return { output: [`[-] Usage: set <KEY> <VALUE>`], success: false };
    }

    if (action === 'run' || action === 'exploit') {
      if (!this.currentModule) {
        return { output: [`[-] No module selected. Use 'use <module_path>' first.`], success: false };
      }
      
      const modulePath = this.currentModule.path;
      const target = this.currentOptions['RHOSTS'];
      
      // Inline execution simulation for the console
      const log: string[] = [
        `[*] Triggering ${modulePath}...`,
        `[*] Options: ${JSON.stringify(this.currentOptions)}`,
      ];

      // Specific Kerberoasting Simulations
      if (modulePath === 'auxiliary/gather/get_user_spns') {
        log.push(`[*] Enumerating Kerberoastable accounts via Impacket...`);
        log.push(`[+] ServicePrincipalName                    Name                MemberOf  PasswordLastSet`);
        log.push(`[+] --------------------------------------  ------------------  --------  ------------------`);
        log.push(`[+] DC3/svc_kerberoastable.ADF3.LOCAL:1337  svc_kerberoastable            2023-01-23 23:52:19`);
        log.push(`[+] $krb5tgs$23$*svc_kerberoastable$ADF3.LOCAL$adf3.local/svc_kerberoastable*$c2e73c1dcdcef4c926cb...`);
        log.push(`[+] Successfully extracted 1 crackable Kerberos TGS hash.`);
        return { success: true, output: log };
      }

      if (modulePath === 'auxiliary/gather/ldap_query') {
        log.push(`[*] Executing ENUM_USER_SPNS_KERBEROAST action...`);
        log.push(`[+] Successfully bound to the LDAP server!`);
        log.push(`[*] ${target || '172.16.199.235'}:389 Getting root DSE`);
        log.push(`Name: BERYL_SAVAGE`);
        log.push(`samaccountname: BERYL_SAVAGE`);
        log.push(`serviceprincipalname: CIFS/OGCWLPT1000000`);
        return { success: true, output: log };
      }

      if (modulePath === 'auxiliary/admin/kerberos/forge_golden_ticket') {
        log.push(`[*] Building PAC utilizing supplied domain SID and KRBTGT hash...`);
        log.push(`[*] Injecting forged ticket for user 'Administrator'...`);
        log.push(`[+] Golden Ticket uniquely generated and injected into local LSASS.`);
        log.push(`[+] Access granted to targeted CIFS/RPC services.`);
        return { success: true, output: log };
      }

      if (modulePath === 'auxiliary/admin/ldap/rbcd') {
        log.push(`[*] Attempting Resource-Based Constrained Delegation exploit sequence...`);
        log.push(`[*] Setting msDS-AllowedToActOnBehalfOfOtherIdentity on Target...`);
        log.push(`[*] Generating ST for victim using S4U2Self/S4U2Proxy...`);
        log.push(`[+] Delegation successful. PTT executed. Admin access to Target guaranteed.`);
        return { success: true, output: log };
      }

      if (modulePath === 'auxiliary/admin/ldap/shadow_credentials') {
        log.push(`[*] Writing attacker KeyCredentialLink attribute to Target object...`);
        log.push(`[*] Triggering PKINIT request utilizing injected X.509 certificate...`);
        log.push(`[+] AS-REP intercepted, TGT and NTLM Hash recovered:`);
        log.push(`    - TGT stored successfully`);
        log.push(`    - Target NTLM: ${Math.random().toString(36).substring(2).toUpperCase()}`);
        return { success: true, output: log };
      }

      if (modulePath === 'auxiliary/gather/windows_dcsync') {
        log.push(`[*] Impersonating Domain Controller...`);
        log.push(`[*] Executing DRSUAPI GetNCChanges request against target DC...`);
        log.push(`[+] DCSync successful. Dumping requested credentials:`);
        log.push(`[+] Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::`);
        log.push(`[+] krbtgt:502:aad3b435b51404eeaad3b435b51404ee:11a4cf13a69772bf2eb2cf13a69772bf:::`);
        return { success: true, output: log };
      }

      log.push(`[*] Sending exploit stage...`);
      const success = Math.random() > 0.3;
      if (success) {
        log.push(`[+] Interaction established with ${target || 'local_subsystem'}`);
        log.push(`[!] METERPRETER SESSION OPENED (127.0.0.1:4444)`);
        return { success: true, output: log, sessionOpened: true };
      } else {
        log.push(`[-] Exploit failed: Connection timed out or target not vulnerable.`);
        return { success: false, output: log };
      }
    }

    if (action === 'modules') {
      const log = [
        `[*] KSpike-CLI: Listing Loaded Modules`,
        `[+] --------------------------------------------------------------------------------`,
        `[+] NAME                          VERSION     STATUS      TYPE        PLATFORM`,
        `[+] --------------------------------------------------------------------------------`,
        `[+] kspike-procfs                 v1.2.4      ACTIVE      TAP         LINUX`,
        `[+] kspike-auth-log               v0.9.1      ACTIVE      TAP         LINUX`,
        `[+] kspike-ebpf-lsm               v0.1-exp    EXPERIMENTAL TAP        LINUX`,
        `[+] niyah-nlp-bridge              v2.0.0      ACTIVE      INTEG       CROSS`,
        `[+] evidence-ledger               v1.1.0      SECURE      STORAGE     CORE`,
        `[+] --------------------------------------------------------------------------------`,
        `[+] Total: 5 active modules synced with Sovereign Node 01.`
      ];
      return { success: true, output: log };
    }

    if (action === 'help') {
        return { 
          output: [
            'Available commands:',
            '  use <path>    - Select a module',
            '  set <k> <v>   - Set an option (RHOSTS, LPORT, etc.)',
            '  run/exploit   - Execute the selected module',
            '  search <q>    - Search for modules',
            '  modules       - List all loaded KSpike modules',
            '  clear         - Clear terminal output'
          ],
          success: true
        };
    }

    return { output: [`[-] Unknown command: ${action}`], success: false };
  }

  public searchModules(query: string): MSFModule[] {
    const q = query.toLowerCase();
    return this.modules.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.path.toLowerCase().includes(q) || 
      m.platform.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  }

  public getModulesByType(type: string): MSFModule[] {
    return this.modules.filter(m => m.type === type);
  }

  public getModulesByPlatform(platform: string): MSFModule[] {
    return this.modules.filter(m => m.platform === platform);
  }

  public getModuleByPath(path: string): MSFModule | undefined {
    return this.modules.find(m => m.path === path);
  }

  /**
   * Simulates the "loading" and "execution" of a module within the NIYAH Sovereign Agent.
   * This is part of the "Agent Integration" requested by the user.
   */
  public async simulateExecution(modulePath: string, target?: string): Promise<{ success: boolean; log: string[] }> {
    const module = this.getModuleByPath(modulePath);
    if (!module) {
      return { success: false, log: [`[MSF_KERNEL_ERROR] Module NOT_FOUND: ${modulePath}`] };
    }

    const log: string[] = [
      `[*] Using module: ${module.path}`,
      `[*] Platform: ${module.platform}`,
      `[*] Rank: ${module.rank}`,
      `[*] Initializing payload handler...`,
    ];

    if (target) {
      log.push(`[*] Setting RHOSTS => ${target}`);
    }

    // Simulate execution steps
    await new Promise(resolve => setTimeout(resolve, 800));
    log.push(`[*] Running auxiliary/exploit logic...`);

    // Specific Kerberoasting Simulations
    if (modulePath === 'auxiliary/gather/get_user_spns') {
      log.push(`[*] Enumerating Kerberoastable accounts via Impacket...`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      log.push(`[+] ServicePrincipalName                    Name                MemberOf  PasswordLastSet`);
      log.push(`[+] --------------------------------------  ------------------  --------  ------------------`);
      log.push(`[+] DC3/svc_kerberoastable.ADF3.LOCAL:1337  svc_kerberoastable            2023-01-23 23:52:19`);
      log.push(`[+] $krb5tgs$23$*svc_kerberoastable$ADF3.LOCAL$adf3.local/svc_kerberoastable*$c2e73c1dcdcef4c926cb...`);
      log.push(`[+] Successfully extracted 1 crackable Kerberos TGS hash.`);
      return { success: true, log };
    }

    if (modulePath === 'auxiliary/gather/ldap_query') {
      log.push(`[*] Executing ENUM_USER_SPNS_KERBEROAST action...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      log.push(`[+] Successfully bound to the LDAP server!`);
      log.push(`[*] 172.16.199.235:389 Getting root DSE`);
      log.push(`Name: BERYL_SAVAGE`);
      log.push(`samaccountname: BERYL_SAVAGE`);
      log.push(`serviceprincipalname: CIFS/OGCWLPT1000000`);
      return { success: true, log };
    }
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    const success = Math.random() > 0.3; // 70% success sim

    if (success) {
      log.push(`[+] Interaction established with ${target || 'local_subsystem'}`);
      log.push(`[+] Command shell session 1 opened`);
    } else {
      log.push(`[-] Exploit failed: Connection timed out or target not vulnerable.`);
    }

    return { success, log };
  }

  /**
   * Returns a list of "Upgrade" suggestions based on Metasploit documentation patterns.
   * This handles the "upgrade it all of it plz" part of the request.
   */
  public getUpgradeIntelligence(): string[] {
    return [
      "Kerberoasting Automation: Integrating Impacket-based SPN enumeration into the K-SPIKE post-exploit chain.",
      "Implementing custom 'Sovereign' payloads for bypassing cloud-native EDR.",
      "Upgrading msfvenom integration to support WASM-based stagers.",
      "Enabling multi-handler listeners via K-SPIKE persistent nodes.",
      "Syncing with Meta-External DB for real-time CVE-to-Module mapping."
    ];
  }

  /**
   * Provides intelligence on specific exploitation targets, such as AD CS ESC vulnerabilities or Kerberoastable SPNs.
   * Reference: https://docs.metasploit.com/docs/pentesting/active-directory/ad-certificates/attacking-ad-cs-esc-vulnerabilities.html
   */
  public getTargetIntelligence(targetType: string): string[] {
    const q = targetType.toLowerCase();
    if (q.includes('ad cs') || q.includes('esc')) {
      return [
        "ESC1: Misconfigured Certificate Templates allowing SAN Specification. Recommendation: Use 'certi' or 'certipy' for initial enumeration.",
        "ESC2: Certificate Templates with Any Purpose EKU. High risk of delegation impersonation.",
        "ESC3: Misconfigured Enrollment Agent Templates. Allows requesting certificates on behalf of other users.",
        "ESC4: Misconfigured Certificate Template Permissions. An attacker can modify the template to enable ESC1/ESC2.",
        "ESC8: HTTP Enrollment Endpoint with NTLM Relay. Deploy 'ntlmrelayx' for web-based cert enrollment proxying.",
        "Metasploit Module available: auxiliary/admin/http/ad_cs_cert_enrollment (Simulated)"
      ];
    }
    if (q.includes('kerberos') || q.includes('kerberoast') || q.includes('spn')) {
      return [
        "Kerberoasting detected as a viable vector. SPNs associated with user accounts found.",
        "Technique: Requesting TGS tickets for SPNs and cracking them offline (Hashcat -m 13100).",
        "Vulnerable User Accounts often have 'PasswordNeverExpires' or weak human-entered passwords.",
        "Metasploit Tool: auxiliary/gather/get_user_spns (Impacket Bridge)",
        "Metasploit Tool: auxiliary/gather/ldap_query (Action: ENUM_USER_SPNS_KERBEROAST)",
        "Post-Exploit: Use 'kiwi_cmd kerberos::ask' and 'kerberos::list /export' to harvest tickets."
      ];
    }
    return ["General reconnaissance required for specified target vector."];
  }

  /**
   * Simulates msfvenom payload generation.
   */
  public generatePayload(platform: string, arch: string, format: string): string {
    const id = Math.random().toString(16).substring(2, 10);
    return `[MSFVENOM] Generated ${platform}/${arch} payload in ${format} format. Signature: ${id}. Encoded with x64/zutto_dekiru.`;
  }
}

export const msfKernel = new MSFKernel();
