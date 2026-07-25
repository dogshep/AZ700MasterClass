# Front Door routing and health checks

## Objectives

- Deploy or review the required Azure networking component.
- Validate the relevant routing, policy, or monitoring behavior.
- Capture the lesson learned for the exam review notes.

## Prerequisites

- Azure subscription with contributor access
- Resource group and region selection
- Basic familiarity with the Azure portal and CLI

## Estimated cost

Low to moderate depending on the SKU and the number of resources.

## Portal walkthrough

1. Open the Azure portal.
2. Create the required resource group.
3. Deploy the resource and verify the overview blade.
4. Inspect the associated diagnostic or route information.

## Azure CLI

```bash
az group create --name rg-lab --location eastus
```

## PowerShell

```powershell
New-AzResourceGroup -Name rg-lab -Location eastus
```

## Bicep

```bicep
resource rg 'Microsoft.Resources/resourceGroups@2023-07-01' = {
  name: 'rg-lab'
  location: 'eastus'
}
```

## Terraform

```hcl
resource "azurerm_resource_group" "rg" {
  name     = "rg-lab"
  location = "eastus"
}
```

## Cleanup steps

Delete the resource group and any test resources after validation.

## Common mistakes

- Overprovisioning resources for a simple scenario
- Forgetting DNS and routing dependencies
- Assuming deployment succeeded without validation

## Verification

Use the portal, CLI, or Azure Monitor to confirm the expected state.

## Challenge exercises

- Compare your result with the expected route path.
- Document the difference between control plane and data plane behavior.
