param(
    [string]$StackName = "teamboard",
    [string]$LambdaStackName = "teamboard-metrics",
    [string]$Region = "us-east-1"
)

Write-Host "========================================="
Write-Host " TeamBoard - Destroy AWS"
Write-Host "========================================="

Write-Host ""
Write-Host "Eliminando infraestructura principal..."
Write-Host ""

aws cloudformation delete-stack `
    --stack-name $StackName `
    --region $Region

aws cloudformation wait stack-delete-complete `
    --stack-name $StackName `
    --region $Region

Write-Host ""
Write-Host "Infraestructura principal eliminada."
Write-Host ""

Write-Host "Eliminando stack de Lambda..."
Write-Host ""

aws cloudformation delete-stack `
    --stack-name $LambdaStackName `
    --region $Region

aws cloudformation wait stack-delete-complete `
    --stack-name $LambdaStackName `
    --region $Region

Write-Host ""
Write-Host "Lambda eliminada."
Write-Host ""
Write-Host "========================================="
Write-Host " TeamBoard - Destroy finalizado"
Write-Host "========================================="