// Debug script to check Stack Auth configuration
console.log("🔍 Debugging Stack Auth configuration...\n");

// Check environment variables
console.log("Environment Variables:");
console.log("NEXT_PUBLIC_STACK_PROJECT_ID:", process.env.NEXT_PUBLIC_STACK_PROJECT_ID ? "✅ Set" : "❌ Missing");
console.log("NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY:", process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY ? "✅ Set" : "❌ Missing");
console.log("STACK_SECRET_SERVER_KEY:", process.env.STACK_SECRET_SERVER_KEY ? "✅ Set" : "❌ Missing");
console.log("NEXT_PUBLIC_STACK_URL:", process.env.NEXT_PUBLIC_STACK_URL || "Not set (using default)");

// Check if Stack Auth packages are installed
try {
  const stackPackage = require("@stackframe/stack/package.json");
  console.log("\n📦 Stack Auth Package:");
  console.log("Version:", stackPackage.version);
} catch (error) {
  console.log("\n❌ Stack Auth package not found");
}

// Test basic Stack Auth imports
try {
  const { StackClientApp } = require("@stackframe/stack");
  console.log("\n✅ StackClientApp import successful");
} catch (error) {
  console.log("\n❌ StackClientApp import failed:", error.message);
}

try {
  const { StackServerApp } = require("@stackframe/stack");
  console.log("✅ StackServerApp import successful");
} catch (error) {
  console.log("❌ StackServerApp import failed:", error.message);
}

console.log("\n🔧 Recommendations:");
console.log("1. Ensure all Stack Auth environment variables are set correctly");
console.log("2. Check that @stackframe/stack package is installed");
console.log("3. Verify Stack Auth project configuration on Stack dashboard");
console.log("4. Consider temporarily disabling Stack Auth to isolate the issue");
