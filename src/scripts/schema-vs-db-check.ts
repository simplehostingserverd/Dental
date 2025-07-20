import fs from 'fs';
import path from 'path';

// Read the schema file and extract model names
function getSchemaModels() {
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  
  const modelMatches = schemaContent.match(/model\s+(\w+)\s*{/g);
  if (!modelMatches) return [];
  
  return modelMatches.map(match => {
    const modelName = match.match(/model\s+(\w+)/)?.[1];
    return modelName;
  }).filter(Boolean);
}

async function checkSchemaVsDatabase() {
  console.log("📋 Checking schema models vs database tables...\n");
  
  const schemaModels = getSchemaModels();
  console.log("🔍 Models in schema.prisma:");
  schemaModels.forEach(model => console.log(`  - ${model}`));
  
  console.log("\n💡 Models that might not have tables yet:");
  const potentialMissingTables = [
    'Payment', 'Document', 'Form', 'InsuranceClaim', 
    'CommunicationLog', 'WorkflowInstance', 'AnalyticsEvent',
    'Report', 'SocialPost', 'MarketingCampaign', 'Xray'
  ];
  
  potentialMissingTables.forEach(table => {
    if (schemaModels.includes(table)) {
      console.log(`  ⚠️  ${table} - likely missing table`);
    }
  });
  
  console.log("\n🔧 Recommendation: Update schema to match existing migrations");
}

checkSchemaVsDatabase();