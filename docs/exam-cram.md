# Exam cram guide

## Highest-value facts

- NSGs are stateful and evaluate traffic at the subnet or NIC level.
- User-defined routes override the system route table.
- Azure Firewall is a stateful network firewall with built-in threat intelligence.
- Private Endpoint gives private IP access to PaaS services.
- ExpressRoute is a private circuit, not just a VPN.
- Application Gateway is layer 7 and can terminate TLS.
- Front Door is global edge and can route based on HTTP semantics.
- Network Watcher is the operational toolbox for packet capture and flow logs.

## Common traps

- Confusing Private Link with VPN-based access
- Assuming Azure routes are always the same as on-prem routing
- Using a load balancer when you need an application delivery controller

## Decision tree

- Need private access to PaaS? Use Private Endpoint.
- Need global edge routing? Use Front Door.
- Need L7 inspection? Use Application Gateway.
- Need stateful firewalling? Use Azure Firewall.
