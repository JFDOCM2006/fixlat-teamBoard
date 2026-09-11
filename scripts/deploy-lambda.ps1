param(
    [string]$StackName = "teamboard-metrics",
    [string]$Region = "us-east-1"
)

Write-Host "========================================="
Write-Host " TeamBoard - Deploy Lambda"
Write-Host "========================================="

Write-Host ""
Write-Host "Construyendo Lambda con SAM..."
Write-Host ""

Push-Location .\lambda

sam build

if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Write-Host ""
    Write-Host "Error durante sam build."
    exit 1
}

Write-Host ""
Write-Host "Desplegando Lambda..."
Write-Host ""

sam deploy `
    --stack-name $StackName `
    --region $Region `
    --resolve-s3 `
    --capabilities CAPABILITY_IAM `
    --no-confirm-changeset `
    --no-fail-on-empty-changeset

if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Write-Host ""
    Write-Host "Error durante el despliegue de Lambda."
    exit 1
}

Pop-Location

Write-Host ""
Write-Host "Lambda desplegada correctamente."
Write-Host ""

aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --query "Stacks[0].Outputs"

Write-Host ""
Write-Host "Deploy Lambda finalizado."