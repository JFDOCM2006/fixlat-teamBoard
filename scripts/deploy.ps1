param(
    [string]$StackName = "teamboard",
    [string]$Region = "us-east-1",
    [string]$AmiId
)

Write-Host "========================================="
Write-Host " TeamBoard - Deploy CloudFormation"
Write-Host "========================================="

if (-not $AmiId) {
    Write-Host ""
    Write-Host "Debes proporcionar el AMI de Amazon Linux."
    Write-Host ""
    Write-Host "Ejemplo:"
    Write-Host ".\deploy.ps1 -AmiId ami-xxxxxxxxxxxxxxxxx"
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Stack: $StackName"
Write-Host "Region: $Region"
Write-Host "AMI: $AmiId"
Write-Host ""

aws cloudformation deploy `
    --template-file .\infra\cloudformation.yaml `
    --stack-name $StackName `
    --region $Region `
    --parameter-overrides `
        Environment=test `
        AmiId=$AmiId `
        InstanceType=t3.micro

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Error durante el despliegue de CloudFormation."
    exit 1
}

Write-Host ""
Write-Host "Infraestructura desplegada correctamente."
Write-Host ""

aws cloudformation describe-stacks `
    --stack-name $StackName `
    --region $Region `
    --query "Stacks[0].Outputs"

Write-Host ""
Write-Host "Deploy CloudFormation finalizado."