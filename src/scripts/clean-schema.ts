import fs from 'fs';
import path from 'path';

function cleanSchema() {
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  
  // Models to temporarily comment out (missing tables)
  const modelsToComment = [
    'Payment', 'InsuranceClaim', 'Document', 'FormTemplate', 'Form',
    'CommunicationTemplate', 'CommunicationLog', 'WorkflowTemplate', 
    'WorkflowInstance', 'WorkflowStep', 'AnalyticsEvent', 'Report',
    'SocialMediaAccount', 'SocialPost', 'MarketingCampaign', 
    'AutomationRule', 'AutomationExecution'
  ];
  
  let cleanedContent = schemaContent;
  
  modelsToComment.forEach(modelName => {
    const modelRegex = new RegExp(`(model\\s+${modelName}\\s*{[^}]*})`, 'gs');
    cleanedContent = cleanedContent.replace(modelRegex, '// $1');
  });
  
  // Create backup
  fs.writeFileSync(schemaPath + '.backup', schemaContent);
  fs.writeFileSync(schemaPath, cleanedContent);
  
  console.log("✅ Schema cleaned - unused models commented out");
  console.log("📁 Backup saved as schema.prisma.backup");
}

cleanSchema();