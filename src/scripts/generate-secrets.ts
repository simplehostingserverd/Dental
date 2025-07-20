import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

interface SecretConfig {
  name: string;
  length: number;
  description: string;
}

const secrets: SecretConfig[] = [
  {
    name: "JWT_SECRET",
    length: 64,
    description: "Custom JWT secret for practice authentication",
  },
  {
    name: "PATIENT_JWT_SECRET", 
    length: 64,
    description: "Custom JWT secret for patient authentication",
  },
  {
    name: "NEXTAUTH_SECRET",
    length: 64,
    description: "NextAuth.js secret for JWT signing",
  },
];

/**
 * Generate a cryptographically secure random string
 */
function generateSecret(length: number): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Read existing .env file
 */
function readEnvFile(envPath: string): Map<string, string> {
  const envMap = new Map<string, string>();
  
  if (!fs.existsSync(envPath)) {
    return envMap;
  }

  const content = fs.readFileSync(envPath, "utf-8");
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        const value = valueParts.join("=").replace(/^["']|["']$/g, "");
        envMap.set(key.trim(), value);
      }
    }
  }

  return envMap;
}

/**
 * Write updated .env file
 */
function writeEnvFile(envPath: string, envMap: Map<string, string>): void {
  const lines: string[] = [];
  
  // Add header comment
  lines.push("# Environment Variables");
  lines.push("# Generated secrets - DO NOT COMMIT TO VERSION CONTROL");
  lines.push("");

  // Add all environment variables
  for (const [key, value] of envMap.entries()) {
    lines.push(`${key}=${value}`);
  }

  fs.writeFileSync(envPath, lines.join("\n") + "\n");
}

/**
 * Generate and update secrets in .env file
 */
export async function generateSecrets(options: {
  envFile?: string;
  force?: boolean;
  dryRun?: boolean;
} = {}) {
  const { envFile = ".env", force = false, dryRun = false } = options;
  const envPath = path.resolve(envFile);

  console.log("🔐 JWT Secrets Generator");
  console.log("=".repeat(50));
  console.log(`📁 Target file: ${envPath}`);
  console.log();

  // Read existing .env file
  const envMap = readEnvFile(envPath);
  const updates: Array<{ key: string; value: string; isNew: boolean }> = [];

  // Generate secrets
  for (const secret of secrets) {
    const existingValue = envMap.get(secret.name);
    const needsGeneration = 
      !existingValue || 
      existingValue === "placeholder" || 
      existingValue === "your-secret-key" ||
      existingValue.includes("your-") ||
      existingValue.length < 32 ||
      force;

    if (needsGeneration) {
      const newSecret = generateSecret(secret.length);
      envMap.set(secret.name, newSecret);
      updates.push({
        key: secret.name,
        value: newSecret,
        isNew: !existingValue,
      });
    }
  }

  // Display results
  if (updates.length === 0) {
    console.log("✅ All secrets are already properly configured!");
    console.log();
    for (const secret of secrets) {
      const value = envMap.get(secret.name);
      console.log(`${secret.name}: ${value?.substring(0, 16)}...`);
    }
    return;
  }

  console.log("🔄 Secret Updates:");
  console.log("-".repeat(50));
  
  for (const update of updates) {
    const status = update.isNew ? "NEW" : "UPDATED";
    const maskedValue = `${update.value.substring(0, 16)}...`;
    console.log(`${status.padEnd(8)} ${update.key.padEnd(20)} ${maskedValue}`);
  }

  console.log();

  if (dryRun) {
    console.log("🔍 DRY RUN - No files were modified");
    console.log();
    console.log("Generated secrets:");
    for (const update of updates) {
      console.log(`${update.key}=${update.value}`);
    }
    return;
  }

  // Write updated .env file
  writeEnvFile(envPath, envMap);

  console.log(`✅ Secrets written to ${envFile}`);
  console.log();
  console.log("🔒 Security Notes:");
  console.log("• Keep these secrets secure and private");
  console.log("• Never commit .env files to version control");
  console.log("• Use different secrets for each environment");
  console.log("• Rotate secrets periodically in production");
  console.log();
  console.log("🚀 Next Steps:");
  console.log("1. Run 'npm run check-env' to verify configuration");
  console.log("2. Test authentication with new secrets");
  console.log("3. Deploy with secure environment variable management");
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const options = {
    envFile: args.find(arg => arg.startsWith("--env="))?.split("=")[1] || ".env",
    force: args.includes("--force"),
    dryRun: args.includes("--dry-run"),
  };

  try {
    await generateSecrets(options);
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to generate secrets:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}