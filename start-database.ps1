# PowerShell script to start a docker container for a local development database
# Use this script to start a PostgreSQL database container on Windows

# TO RUN ON WINDOWS:
# 1. Install Docker Desktop - https://docs.docker.com/docker-for-windows/install/
# 2. Or install Podman Desktop - https://podman.io/getting-started/installation
# 3. Open PowerShell as Administrator (if needed)
# 4. Run this script - `.\start-database.ps1`

# Set error action preference
$ErrorActionPreference = "Stop"

# Function to read .env file and set environment variables
function Import-EnvFile {
    param([string]$Path = ".env")
    
    if (-not (Test-Path $Path)) {
        Write-Error ".env file not found at $Path"
        exit 1
    }
    
    Get-Content $Path | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            # Remove quotes if present
            $value = $value -replace '^"(.*)"$', '$1'
            $value = $value -replace "^'(.*)'$", '$1'
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

# Import environment variables from .env file
Import-EnvFile

# Parse DATABASE_URL to extract connection details
$DATABASE_URL = $env:DATABASE_URL
if (-not $DATABASE_URL) {
    Write-Error "DATABASE_URL not found in .env file"
    exit 1
}

# Parse DATABASE_URL (format: postgresql://user:password@host:port/database)
if ($DATABASE_URL -match 'postgresql://[^:]+:([^@]+)@[^:]+:(\d+)/(.+)') {
    $DB_PASSWORD = $matches[1]
    $DB_PORT = $matches[2]
    $DB_NAME = $matches[3]
} else {
    Write-Error "Invalid DATABASE_URL format in .env file"
    exit 1
}

$DB_CONTAINER_NAME = "$DB_NAME-postgres"

# Check if Docker or Podman is installed
$DOCKER_CMD = $null
if (Get-Command docker -ErrorAction SilentlyContinue) {
    $DOCKER_CMD = "docker"
} elseif (Get-Command podman -ErrorAction SilentlyContinue) {
    $DOCKER_CMD = "podman"
} else {
    Write-Error "Docker or Podman is not installed. Please install docker or podman and try again.`nDocker install guide: https://docs.docker.com/engine/install/`nPodman install guide: https://podman.io/getting-started/installation"
    exit 1
}

# Check if Docker/Podman daemon is running
try {
    & $DOCKER_CMD info | Out-Null
} catch {
    Write-Error "$DOCKER_CMD daemon is not running. Please start $DOCKER_CMD and try again."
    exit 1
}

# Check if port is already in use
try {
    $connection = New-Object System.Net.Sockets.TcpClient
    $connection.Connect("localhost", $DB_PORT)
    $connection.Close()
    Write-Error "Port $DB_PORT is already in use."
    exit 1
} catch {
    # Port is available, continue
}

# Check if container is already running
$runningContainer = & $DOCKER_CMD ps -q -f "name=$DB_CONTAINER_NAME" 2>$null
if ($runningContainer) {
    Write-Host "Database container '$DB_CONTAINER_NAME' already running"
    exit 0
}

# Check if container exists but is stopped
$existingContainer = & $DOCKER_CMD ps -q -a -f "name=$DB_CONTAINER_NAME" 2>$null
if ($existingContainer) {
    & $DOCKER_CMD start $DB_CONTAINER_NAME
    Write-Host "Existing database container '$DB_CONTAINER_NAME' started"
    exit 0
}

# Check for default password and offer to generate a random one
if ($DB_PASSWORD -eq "password") {
    Write-Host "You are using the default database password"
    $response = Read-Host "Should we generate a random password for you? [y/N]"
    if ($response -match '^[Yy]$') {
        # Generate a random URL-safe password
        $bytes = New-Object byte[] 16
        [System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
        $DB_PASSWORD = [Convert]::ToBase64String($bytes) -replace '\+', '-' -replace '/', '_' -replace '=', ''
        
        # Update .env file
        $envContent = Get-Content ".env"
        $envContent = $envContent -replace ':password@', ":$DB_PASSWORD@"
        $envContent | Set-Content ".env"
        Write-Host "Generated new password and updated .env file"
    } else {
        Write-Error "Please change the default password in the .env file and try again"
        exit 1
    }
}

# Create and start the database container
try {
    & $DOCKER_CMD run -d `
        --name $DB_CONTAINER_NAME `
        -e POSTGRES_USER="postgres" `
        -e POSTGRES_PASSWORD="$DB_PASSWORD" `
        -e POSTGRES_DB="$DB_NAME" `
        -p "${DB_PORT}:5432" `
        docker.io/postgres
    
    Write-Host "Database container '$DB_CONTAINER_NAME' was successfully created"
} catch {
    Write-Error "Failed to create database container: $_"
    exit 1
}
