<script lang="ts">
    import Button from '$lib/components/common/Button.svelte';
    import { debtInfo, members, rows } from '$lib/stores.js';
    import { LOCAL_STORAGE_KEYS } from '$lib/types/index.js';
    import { roundCurrency } from '$lib/utils/currencyUtils.js';
    import localStorage from '$lib/utils/localStorage.js';

    const { save } = localStorage;

    function saveRowState(): void {
        rows.subscribe(r => save(LOCAL_STORAGE_KEYS.rows, JSON.stringify(r)));
    }

    function saveDebtInfoState(): void {
        debtInfo.subscribe(r => save(LOCAL_STORAGE_KEYS.debtInfo, JSON.stringify(r)));
    }

    function calculateDebt(): void {
        saveRowState();
        debtInfo.set({});
        members.subscribe(m => {
            m.forEach(member => {
                debtInfo.update(d => {
                    d[member] = {
                        totalDebt: 0,
                        owes: {},
                        shouldCollect: {}
                    };
                    return d;
                });
            });
        });

        rows.subscribe(r => {
            r.forEach(row => {
                if(row.Who === undefined || row.Paid === 0 || row.For.length === 0) {
                    return;
                }
                const lender = row.Who?.value || "none";
                const amount = row.Paid;
                const borrowers = row.For;
                const splitAmount = roundCurrency(amount / borrowers.length);
                
                borrowers.forEach(borrower => {
                    if (borrower.value !== lender) {
                        debtInfo.update(d => {
                            d[borrower.value].totalDebt += splitAmount;
                            d[borrower.value].owes[lender] = (d[borrower.value].owes[lender] || 0) + splitAmount;
                            d[lender].shouldCollect[borrower.value] = (d[lender].shouldCollect[borrower.value] || 0) + splitAmount;
                            return d;
                        });
                      }
                    });
                  });
                });

        debtInfo.update(d => {
            Object.keys(d).forEach(member => {
                const owes = d[member].owes;
                const shouldCollect = d[member].shouldCollect;

                Object.keys(owes).forEach(lender => {
                    if (shouldCollect[lender]) {
                        if (owes[lender] > shouldCollect[lender]) {
                            owes[lender] -= shouldCollect[lender];
                            delete shouldCollect[lender];
                        } else if (owes[lender] < shouldCollect[lender]) {
                            shouldCollect[lender] -= owes[lender];
                            delete owes[lender];
                        } else {
                            delete owes[lender];
                            delete shouldCollect[lender];
                        }
                    }
                });

                d[member].owes = owes;
                d[member].shouldCollect = shouldCollect;
            });
            return d;
        });

        saveDebtInfoState();
        console.log(debtInfo);
    }
</script>
  
  <Button label="Calculate Debt" onClick={calculateDebt} />