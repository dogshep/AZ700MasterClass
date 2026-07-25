# Virtual WAN

## Learning objectives

- Explain the role of Virtual WAN in Azure networking.
- Translate the service into a familiar enterprise networking concept.
- Recognize the relevant exam objective and common deployment patterns.

## Microsoft exam objectives

- Virtual WAN design and implementation
- Hybrid connectivity and routing decisions
- Security, availability, and operational visibility

## Real-world explanation

In enterprise networking, SD-WAN hub is a core design pattern that improves scale, resilience, and control. In Azure, the equivalent service is represented as a managed platform component with APIs, policy, and integration points that make the service programmable rather than purely manual.

## Azure explanation

Azure delivers Virtual WAN as a cloud-native building block. The design focus shifts from physical device management to policy, routing, service integration, and lifecycle automation.

## Networking engineer translation

Think of Virtual WAN as the Azure equivalent of SD-WAN Hub. The difference is that the controls live in the cloud control plane and are applied through Azure-native constructs rather than standalone appliances.

## Architecture diagram

```mermaid
flowchart LR
  A[Enterprise Edge] --> B[Virtual WAN]
  B --> C[Azure Resources]
  C --> D[Shared Services]
```

## Packet flow

1. A client request enters the Azure network boundary.
2. The platform evaluates route and policy decisions.
3. Traffic is forwarded to the destination resource or service.
4. Return traffic follows the same policy-driven path.

## Portal walkthrough

1. Open the Azure portal.
2. Create or review the relevant resource group and network object.
3. Configure the service by selecting the appropriate SKU, region, and policy settings.
4. Validate the deployment and inspect the metrics or logs.

## Azure CLI examples

```bash
az group create --name rg-study --location eastus
az network 09-virtualwan show --resource-group rg-study --name example-09-virtualwan
```

## PowerShell examples

```powershell
New-AzResourceGroup -Name rg-study -Location eastus
Get-AzVirtual WAN
```

## Bicep examples

```bicep
resource example '09-virtualwan' = {
  name: 'example-09-virtualwan'
  location: resourceGroup().location
  properties: {
    sku: 'Standard'
  }
}
```

## Terraform examples

```hcl
resource "azurerm_resource_group" "example" {
  name     = "rg-study"
  location = "eastus"
}
```

## Common mistakes

- Treating Azure features as physical appliances
- Ignoring the default routing and policy flow
- Forgetting that east-west and north-south traffic patterns differ significantly

## Exam tips

- Memorize the default behavior and the exception path
- Compare the service to a familiar enterprise device or feature
- Be ready to justify the choice in terms of scale, resilience, and security

## Memory trick

Remember: Azure makes the network policy explicit and programmable. The platform handles the mechanics; the engineer decides the policy.

## Comparison table

| Enterprise concept | Azure equivalent | Why it matters |
| --- | --- | --- |
| Routing policy | Azure route tables and service routing | Control the forwarding path |
| Policy enforcement | Azure-native control plane | Centralize operational intent |
| Shared services | Managed endpoints | Reduce network sprawl |

## Flashcards

- What is the Azure translation for this service?
- When would you choose this service over a traditional appliance?
- What is the most common exam trap?

## Knowledge check

1. Which control plane concept is critical for this service?
2. What is the most likely comparison to an enterprise network component?
3. What is the primary operational advantage of the Azure implementation?

## Practice questions

- Which design pattern best fits this service?
- When would you choose this option over a simpler network component?
- What is the main security trade-off?

## Hands-on lab

Create a resource group, deploy the resource, inspect the routing or policy output, and document the behavior in your own notebook.

## Summary

Virtual WAN is best understood as a managed Azure-native capability that replaces or augments traditional enterprise networking constructs.

## Further reading

- [Azure documentation](https://learn.microsoft.com/azure/)
- [AZ-700 study guide](https://learn.microsoft.com/certifications/azure-network-engineer/)
