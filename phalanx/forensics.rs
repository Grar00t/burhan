// ══════════════════════════════════════════════════════════════
// ForensicReport — Sovereign Digital Forensics
// Analyzes memory, storage, and network artifacts for threat intelligence.
// Built by أبو خوارزم — Sulaiman Alshammari
// ══════════════════════════════════════════════════════════════

use std::fs::File;
use std::io::{self, Write};
use std::path::Path;

pub struct ForensicReport {
    pub case_id: String,
    pub artifacts: Vec<String>,
    pub findings: Vec<String>,
}

impl ForensicReport {
    pub fn new(case_id: &str) -> Self {
        Self {
            case_id: case_id.to_string(),
            artifacts: Vec::new(),
            findings: Vec::new(),
        }
    }

    pub fn add_artifact(&mut self, artifact: &str) {
        self.artifacts.push(artifact.to_string());
    }

    pub fn add_finding(&mut self, finding: &str) {
        self.findings.push(finding.to_string());
    }

    pub fn save_to_file(&self, path: &Path) -> io::Result<()> {
        let mut file = File::create(path)?;
        writeln!(file, "NIYAH FORENSIC REPORT: {}", self.case_id)?;
        writeln!(file, "========================================")?;
        writeln!(file, "ARTIFACTS ANALYZED:")?;
        for a in &self.artifacts {
            writeln!(file, " - {}", a)?;
        }
        writeln!(file, "\nFINDINGS:")?;
        for f in &self.findings {
            writeln!(file, " - {}", f)?;
        }
        Ok(())
    }
}
