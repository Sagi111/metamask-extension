# Refactoring - Confirmation pages routing

This document details how routing to confirmation pages is currently done and how we can improve it.

## Current flow

The current flow of routing to confirmation pages have issues.

![Confirmation Pages Routing - Current](https://raw.githubusercontent.com/MetaMask/metamask-extension/conf_structure_doc/docs/refactoring/confirmation-pages-routing/current.png)

- There are 2 ways in which confirmation pages can be opened:
  1. User triggers send flow from within Metamask
     - If the user trigger send flow from within Metamask, user selects receipient and amount and on send screens, at this point an un-approved transaction is creates in background and user is re-directed to **/confirm-transaction** route.
  2. DAPP sends request to Metamask
     - If DAPP send request to Metamask an un-approved transaction or signature request is created in background and UI is triggered (if it is not already open).
     - The router by default renders `pages/home` component. The component find un-approved transaction in state and re-route to **/confirm-transaction**.
- Router renders `pages/confirm-transaction` component for **/confirm-transaction** route.
- `pages/confirm-transaction` component renders `pages/confirm-transaction-switch` by default for **/confirm-transaction** route (for token methods it renders `pages/confirm-transaction/confirm-token-transaction-switch` which also open `pages/confirm-transaction-switch` by default).
- `pages/confirm-token-switch` redirect to specific confirmation page route depending on un-approved transaction or signature request in the state.
- `pages/confirm-transaction` is rendred for **/confirm-transaction/${id}/XXXXX** routes
- Depending on confirmation route components `pages/confirm-transaction` and `pages/confirm-transaction/confirm-token-transaction-switch` renders appropriate confirmation page.

## Proposed flow

The proposed routing of confirmation pages looks like.

![Confirmation Pages Routing - Proposed](https://raw.githubusercontent.com/MetaMask/metamask-extension/conf_structure_doc/docs/refactoring/confirmation-pages-routing/proposed.png)

- There are 2 ways in which confirmation pages can be opened:
  1. User triggers send flow from within Metamask
     - If the user trigger send flow from within Metamask, user selects receipient and amount and on send screens, at this point an un-approved transaction is creates in background and user is re-directed to specific route **/confirm-transaction/${id}/XXXX** depending on transaction.
  2. DAPP sends request to Metamask
     - If DAPP send request to Metamask an un-approved transaction or signature request is created in background and UI is triggered to open (if it is not already open).
     - The router find un-approved transaction in state and re-route to **/confirm-transaction**.
- Router renders `pages/confirm-transaction` for **/confirm-transaction** route. `pages/confirm-transaction` redirect to specific confirmation page route depending on un-approved transaction or signature request in the state.
- Depending on confirmation route `pages/confirm-transaction` renders appropriate confirmation page.

## Route component mapping

| Route                                           | Component                            |
| ----------------------------------------------- | ------------------------------------ |
| /confirm-transaction/${id}/deploy-contract      | pages/confirm-deploy-contract        |
| /confirm-transaction/${id}/send-ether           | pages/confirm-send-ether             |
| /confirm-transaction/${id}/send-token           | pages/confirm-send-token             |
| /confirm-transaction/${id}/approve              | pages/confirm-approve                |
| /confirm-transaction/${id}/set-approval-for-all | pages/confirm-approve                |
| /confirm-transaction/${id}/transfer-from        | pages/confirm-token-transaction-base |
| /confirm-transaction/${id}/safe-transfer-from   | pages/confirm-token-transaction-base |
| /confirm-transaction/${id}/token-method         | pages/confirm-contract-interaction   |
| /confirm-transaction/${id}/signature-request    | pages/confirm-signature-request.js   |

The 4 components `pages/confirm-deploy-contract`,
`pages/confirm-send-ether`, `pages/confirm-send-token`, `pages/confirm-contract-interaction` are very similar and can be merged. This will be covered in detail in following document about confirmation pages structure.

## Routing to mostRecentOverviewPage

Across confirmation pages there is code to re-direct to `mostRecentOverviewPage`. `mostRecentOverviewPage` is equal to default route `/` or `/asset` whichever was last opened.

Also a lot of components check for state update and as soon as state has `0` pending un-approved transaction or signature request redirect is done to `mostRecentOverviewPage`. This logic can be handled at `/pages/confirm-transaction` which is always rendered for any confirmation page.

Also when the transaction is completed / rejected redirect is done to `mostRecentOverviewPage` explicitly which we should continue to do.

## Areas of code refactoring

- Confirmation components have lot of props passing which needs to be reduced. Values can be obtained from redux state or other contexts directly using hooks. Component [confirm-token-transaction-switch](https://github.com/MetaMask/metamask-extension/blob/develop/ui/pages/confirm-transaction/confirm-token-transaction-switch.js) has a lot of un-necessary props passing which should be removed and will help to further refactor routing.
- It will be useful to refactor all the confirmation components in `/pages` to functional components to use re-usable hooks.
- Any re-usable routing related code should be moved to [useRouting](https://github.com/MetaMask/metamask-extension/blob/develop/ui/hooks/useRouting.js) hook.
- Logic to initially check state and redirect to `/pages/confirm-transaction` can better be moved from `/pages/home` to `pages/routes`
- All the route mapping code should be moved to `/pages/confirm-transaction`, this will require getting rid of route mappings in `/pages/confirm-transaction/confirm-token-transaction-switch`, `/pages/confirm-transaction-switch`.
- `/pages/confirm-transaction-switch` has the code that check the un-approved trancation / message in state and reditect to a specific route, a utility method can be create to do this mapping and can be included in `/pages/confirm-transaction` component.
- During the send flow initiated within metamask user should be redirected to specific confirmations route **/confirm-transaction/${id}/XXXX**
